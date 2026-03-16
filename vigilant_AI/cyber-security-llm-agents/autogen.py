# Compatibility layer for autogen
# This file provides backward compatibility for the old autogen API

import sys
import warnings
import sqlite3
import json
import uuid
import os
from datetime import datetime

# Force UTF-8 output on Windows to handle emoji / special chars from tools
if sys.stdout and hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
        sys.stderr.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass

# ─────────────────────────────────────────────
# Utility: token truncation
# ─────────────────────────────────────────────
def truncate_str_to_tokens(text, max_tokens=4000):
    """Simple token truncation function"""
    max_chars = max_tokens * 4
    if len(text) <= max_chars:
        return text
    return text[:max_chars] + "..."


# ─────────────────────────────────────────────
# Database helpers
# ─────────────────────────────────────────────
def _get_db_path():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    return os.path.join(script_dir, "logs.db")


def _ensure_logs_table():
    db_path = _get_db_path()
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS chat_completions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            session_id TEXT,
            request TEXT,
            response TEXT,
            cost REAL DEFAULT 0.0,
            start_time TEXT,
            end_time TEXT
        )
    """)
    conn.commit()
    conn.close()


def _write_log(session_id, agent_name, message, response_text):
    """Write a single LLM interaction to logs.db"""
    try:
        _ensure_logs_table()
        db_path = _get_db_path()
        conn = sqlite3.connect(db_path)
        now = datetime.utcnow().isoformat()
        request_payload = json.dumps({
            "messages": [
                {"role": "system", "content": f"Agent: {agent_name}"},
                {"role": "user",   "content": message}
            ],
            "model": "llama-3.3-70b-versatile"
        })
        response_payload = json.dumps({
            "response": response_text,
            "agent": agent_name,
            "usage": {"total_tokens": len(response_text.split())}
        })
        conn.execute(
            "INSERT INTO chat_completions (session_id, request, response, cost, start_time, end_time) "
            "VALUES (?, ?, ?, ?, ?, ?)",
            (session_id, request_payload, response_payload, 0.0, now, now)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        print(f"[Logging warning] Could not write to logs.db: {e}")

# ─────────────────────────────────────────────
# Compatibility classes
# ─────────────────────────────────────────────
try:
    class ConversableAgent:
        def __init__(self, name, llm_config, human_input_mode="NEVER",
                     code_execution_config=False, max_consecutive_auto_reply=5,
                     is_termination_msg=None, description="", system_message=""):
            self.name = name
            self.llm_config = llm_config
            self.human_input_mode = human_input_mode
            self.code_execution_config = code_execution_config
            self.max_consecutive_auto_reply = max_consecutive_auto_reply
            self.is_termination_msg = is_termination_msg
            self.description = description
            self.system_message = system_message
            self.tools = []   # registered tool functions
            self._registered_tools = {}  # name → callable

        def register_for_llm(self, name=None, description=None, **kwargs):
            def decorator(func):
                self.tools.append(func)
                key = name or func.__name__
                self._registered_tools[key] = func
                return func
            return decorator

        def register_for_execution(self, name=None, **kwargs):
            def decorator(func):
                key = name or func.__name__
                self._registered_tools[key] = func
                return func
            return decorator

        def _call_tool_if_mentioned(self, message):
            """
            Detect explicit tool-call syntax in the message and execute it.
            Supports: tool_name(kwarg="val", ...)
            Returns the tool result string, or None if no tool call found.
            """
            import re
            # Find patterns like:  tool_name(key="val", key2="val2")
            pattern = r'(\w+)\(([^)]+)\)'
            matches = re.findall(pattern, message)
            for func_name, args_str in matches:
                if func_name in self._registered_tools:
                    try:
                        # Parse simple key="value" pairs
                        kwargs = {}
                        kv_pattern = r'(\w+)\s*=\s*"([^"]*)"|([\w]+)\s*=\s*(\S+)'
                        for m in re.finditer(kv_pattern, args_str):
                            if m.group(1):
                                kwargs[m.group(1)] = m.group(2)
                            elif m.group(3):
                                kwargs[m.group(3)] = m.group(4)
                        print(f"[Tool call] {func_name}({kwargs})")
                        result = self._registered_tools[func_name](**kwargs)
                        return str(result)
                    except Exception as e:
                        return f"Tool error ({func_name}): {e}"
            return None

        def _make_llm_call(self, message, session_id=None):
            """Make actual LLM API call, execute tool if requested, then log result."""
            import openai

            # ── Step 1: check if the message itself contains a direct tool invocation ──
            tool_result = self._call_tool_if_mentioned(message)
            if tool_result:
                result_msg = tool_result + "\nTERMINATE"
                if session_id:
                    _write_log(session_id, self.name, message, result_msg)
                return result_msg

            # ── Step 2: call the LLM ──
            try:
                if 'base_url' in self.llm_config:
                    client = openai.OpenAI(
                        api_key=self.llm_config['api_key'],
                        base_url=self.llm_config['base_url']
                    )
                else:
                    client = openai.OpenAI(api_key=self.llm_config['api_key'])

                # Build tool descriptions for the system prompt
                tool_info = ""
                if self._registered_tools:
                    tool_info = "\n\nAvailable tools (call them exactly as shown):\n"
                    for tname, tfunc in self._registered_tools.items():
                        doc = (tfunc.__doc__ or "").strip().split("\n")[0]
                        tool_info += f"  {tname}(...)  — {doc}\n"

                response = client.chat.completions.create(
                    model=self.llm_config['model'],
                    messages=[
                        {"role": "system",
                         "content": (self.system_message or f"You are {self.name}, a helpful AI assistant.") + tool_info},
                        {"role": "user", "content": message}
                    ],
                    max_tokens=2000
                )
                llm_response = response.choices[0].message.content

                # ── Step 3: check if the LLM responded with a tool call and execute it ──
                tool_result2 = self._call_tool_if_mentioned(llm_response)
                if tool_result2:
                    final_response = f"{llm_response}\n\n[Tool result]:\n{tool_result2}\nTERMINATE"
                    if session_id:
                        _write_log(session_id, self.name, message, final_response)
                    return final_response

                if session_id:
                    _write_log(session_id, self.name, message, llm_response)
                return llm_response

            except Exception as e:
                err = f"[Error: Could not process message - {str(e)}]"
                print(f"Error making LLM call: {e}")
                if session_id:
                    _write_log(session_id, self.name, message, err)
                return err

        def initiate_chats(self, tasks):
            """Run all tasks in sequence, carrying over results between steps."""
            print(f"Agent {self.name}: Initiating chats...")
            # Retrieve session_id set by runtime_logging.start()
            session_id = getattr(runtime_logging, '_current_session_id', str(uuid.uuid4()))
            carryover_data = ""   # accumulates previous step results

            for i, task in enumerate(tasks):
                if not isinstance(task, dict):
                    continue

                message   = task.get('message', '')
                recipient = task.get('recipient')
                carryover = task.get('carryover', '')

                # Inject previous step's output into the message prompt
                if i > 0 and carryover_data:
                    message = f"{message}\n\nContext from previous step:\n{carryover_data}"

                if recipient:
                    print(f"\n=== Sending to {recipient.name}: {message[:120]}... ===")
                    response = recipient._make_llm_call(message, session_id=session_id)
                    print(f"\n{recipient.name} Response:")
                    print(response)
                    print("=" * 50)
                else:
                    print(f"\n=== Processing: {message[:120]}... ===")
                    response = self._make_llm_call(message, session_id=session_id)
                    print(f"\n{self.name} Response:")
                    print(response)
                    print("=" * 50)

                # Always carry over the full response for the next step
                carryover_data = response


    class runtime_logging:
        _current_session_id = None

        @staticmethod
        def start(config=None):
            session_id = str(uuid.uuid4())
            runtime_logging._current_session_id = session_id
            _ensure_logs_table()
            print(f"Runtime logging started (session: {session_id})")
            return session_id

        @staticmethod
        def stop():
            print("Runtime logging stopped")
            
except ImportError as e:
    warnings.warn(f"Could not import new autogen structure: {e}")
    
# Create nested module structure
class AgentChatModule:
    class ContribModule:
        class CapabilitiesModule:
            class ContextHandlingModule:
                truncate_str_to_tokens = staticmethod(truncate_str_to_tokens)
            context_handling = ContextHandlingModule()
        capabilities = CapabilitiesModule()
    contrib = ContribModule()

agentchat = AgentChatModule()

# Add this module to sys.modules so it can be imported as 'autogen'
sys.modules['autogen'] = sys.modules[__name__]
sys.modules['autogen.runtime_logging'] = runtime_logging
sys.modules['autogen.agentchat'] = agentchat
sys.modules['autogen.agentchat.contrib'] = agentchat.contrib
sys.modules['autogen.agentchat.contrib.capabilities'] = agentchat.contrib.capabilities
sys.modules['autogen.agentchat.contrib.capabilities.context_handling'] = agentchat.contrib.capabilities.context_handling