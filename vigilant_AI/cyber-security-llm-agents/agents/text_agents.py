from autogen import ConversableAgent
from utils.shared_config import llm_config
from tools.web_tools import download_web_page, detect_telemetry_gaps, fetch_cisa_vulnerabilities, extract_mitre_techniques
from agents.coordinator_agents import task_coordinator_agent

text_analyst_agent = ConversableAgent(
    name="text_analyst_agent",
    llm_config=llm_config,
    human_input_mode="NEVER",
    code_execution_config=False,
    max_consecutive_auto_reply=5,
    is_termination_msg=lambda msg: (
        "terminate" in (msg.get("content") or "").lower() if msg else False
    ),
    description="""A helpful assistant that can analyze and summarize text.""",
    system_message="""You are a text analysis agent. When given text or data to analyze, provide direct analysis and conclusions.
Focus on answering the question asked, not explaining how to answer it.
When asked to create tables or summaries, output them directly in a readable format (markdown tables work well).
After completing your analysis, append "TERMINATE".""",
)

internet_agent = ConversableAgent(
    name="internet_agent",
    llm_config=llm_config,
    human_input_mode="NEVER",
    code_execution_config=False,
    max_consecutive_auto_reply=5,
    is_termination_msg=lambda msg: (
        "terminate" in (msg.get("content") or "").lower() if msg else False
    ),
    description="""A helpful assistant that can assist in interacting with content on the internet.""",
    system_message="""You are an internet agent. You have tools available to you. To use a tool, write ONLY the function call.

When asked to download a web page:
download_web_page(url="<the url>")

When asked to detect telemetry gaps for an EDR:
detect_telemetry_gaps(url="<json url>", edr_name="<EDR name>")

When asked to fetch CISA vulnerabilities:
fetch_cisa_vulnerabilities(count=10)

When asked to extract MITRE techniques from a URL:
extract_mitre_techniques(url="<the url>")

DO NOT:
- Explain what you will do
- Write Python code
- Make up results

DO:
- Call the function directly
- Wait for the result
- Present the result exactly as returned
- Append "TERMINATE" after presenting results""",
)


def register_tools():
    # Download a web page

    internet_agent.register_for_llm(
        name="download_web_page",
        description="Download the content of a web page and return it as a string. Only for text content such as markdown pages.",
    )(download_web_page)

    task_coordinator_agent.register_for_execution(name="download_web_page")(
        download_web_page
    )

    # Detect telemetry NOT detected by an EDR

    internet_agent.register_for_llm(
        name="detect_telemetry_gaps",
        description="Detect telemetry NOT detected by an EDR.",
    )(detect_telemetry_gaps)

    task_coordinator_agent.register_for_execution(name="detect_telemetry_gaps")(
        detect_telemetry_gaps
    )

    # Fetch CISA Known Exploited Vulnerabilities

    internet_agent.register_for_llm(
        name="fetch_cisa_vulnerabilities",
        description="Fetch the latest CISA Known Exploited Vulnerabilities (KEV) entries.",
    )(fetch_cisa_vulnerabilities)

    task_coordinator_agent.register_for_execution(name="fetch_cisa_vulnerabilities")(
        fetch_cisa_vulnerabilities
    )

    # Extract MITRE ATT&CK technique IDs from a web page

    internet_agent.register_for_llm(
        name="extract_mitre_techniques",
        description="Download a web page and extract all MITRE ATT&CK technique IDs.",
    )(extract_mitre_techniques)

    task_coordinator_agent.register_for_execution(name="extract_mitre_techniques")(
        extract_mitre_techniques
    )