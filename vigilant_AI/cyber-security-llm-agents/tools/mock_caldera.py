"""
Mock Caldera Tools — Realistic fake responses for all Caldera API functions.
Used when MOCK_CALDERA=true so the entire Vigilant AI demo works without a real Caldera C2 server.
"""

import json
import uuid
from typing_extensions import Annotated
from datetime import datetime

# ─────────────────────────────────────────────────────────
# Persistent mock state (survives across calls in one run)
# ─────────────────────────────────────────────────────────
_MOCK_OPERATION_ID = "op-" + str(uuid.uuid4())[:8]
_MOCK_AGENT_PAW = "mock_paw_" + str(uuid.uuid4())[:6]
_MOCK_ADVERSARY_ID = None  # set on create

# Realistic Windows services (mix of normal + 3 EDR products)
_MOCK_SERVICES = """Name                           PathName
----                           --------
CrowdStrike Falcon Sensor      C:\\Program Files\\CrowdStrike\\CSFalconService.exe
Elastic Agent                   C:\\Program Files\\Elastic\\Agent\\elastic-agent.exe
Windows Defender                C:\\ProgramData\\Microsoft\\Windows Defender\\MsMpEng.exe
Spooler                         C:\\Windows\\System32\\spoolsv.exe
W32Time                         C:\\Windows\\System32\\svchost.exe -k LocalService
WinRM                           C:\\Windows\\System32\\svchost.exe -k DcomLaunch
BITS                            C:\\Windows\\System32\\svchost.exe -k netsvcs
Dnscache                        C:\\Windows\\System32\\svchost.exe -k NetworkService
LanmanServer                    C:\\Windows\\System32\\svchost.exe -k netsvcs
TermService                     C:\\Windows\\System32\\svchost.exe -k NetworkService
EventLog                        C:\\Windows\\System32\\svchost.exe -k LocalServiceNetworkRestricted
SecurityHealthService           C:\\Windows\\System32\\SecurityHealthService.exe
WinDefend                       C:\\ProgramData\\Microsoft\\Windows Defender\\MsMpEng.exe
mpssvc                          C:\\Windows\\System32\\svchost.exe -k LocalServiceNoNetwork"""

# Simulated whoami /priv output (admin privileges)
_MOCK_PRIVILEGES = """PRIVILEGES INFORMATION
----------------------

Privilege Name                            Description                                                        State
========================================= ================================================================== ========
SeIncreaseQuotaPrivilege                  Adjust memory quotas for a process                                 Disabled
SeSecurityPrivilege                       Manage auditing and security log                                   Disabled
SeTakeOwnershipPrivilege                  Take ownership of files or other objects                            Disabled
SeLoadDriverPrivilege                     Load and unload device drivers                                     Disabled
SeSystemProfilePrivilege                  Profile system performance                                         Disabled
SeSystemtimePrivilege                     Change the system time                                             Disabled
SeProfileSingleProcessPrivilege           Profile single process                                             Disabled
SeIncreaseBasePriorityPrivilege           Increase scheduling priority                                       Disabled
SeCreatePagefilePrivilege                 Create a pagefile                                                  Disabled
SeBackupPrivilege                         Back up files and directories                                      Disabled
SeRestorePrivilege                        Restore files and directories                                      Disabled
SeShutdownPrivilege                       Shut down the system                                               Disabled
SeDebugPrivilege                          Debug programs                                                     Enabled
SeSystemEnvironmentPrivilege              Modify firmware environment values                                 Disabled
SeChangeNotifyPrivilege                   Bypass traverse checking                                           Enabled
SeRemoteShutdownPrivilege                 Force shutdown from a remote system                                Disabled
SeUndockPrivilege                         Remove computer from docking station                               Disabled
SeManageVolumePrivilege                   Perform volume maintenance tasks                                   Disabled
SeImpersonatePrivilege                    Impersonate a client after authentication                          Enabled
SeCreateGlobalPrivilege                   Create global objects                                              Enabled
SeIncreaseWorkingSetPrivilege             Increase a process working set                                     Disabled
SeTimeZonePrivilege                       Change the time zone                                               Disabled
SeCreateSymbolicLinkPrivilege             Create symbolic links                                              Disabled
SeDelegateSessionUserImpersonatePrivilege Obtain an impersonation token for another user in the same session Disabled"""

# Mock Caldera abilities (common MITRE techniques)
_MOCK_ABILITIES = [
    {"ability_id": "a1b2c3d4", "technique_id": "T1059.001", "technique_name": "PowerShell"},
    {"ability_id": "b2c3d4e5", "technique_id": "T1003.001", "technique_name": "LSASS Memory"},
    {"ability_id": "c3d4e5f6", "technique_id": "T1078",     "technique_name": "Valid Accounts"},
    {"ability_id": "d4e5f6a7", "technique_id": "T1547.001", "technique_name": "Registry Run Keys / Startup Folder"},
    {"ability_id": "e5f6a7b8", "technique_id": "T1070.004", "technique_name": "File Deletion"},
    {"ability_id": "f6a7b8c9", "technique_id": "T1082",     "technique_name": "System Information Discovery"},
    {"ability_id": "a7b8c9d0", "technique_id": "T1083",     "technique_name": "File and Directory Discovery"},
    {"ability_id": "b8c9d0e1", "technique_id": "T1105",     "technique_name": "Ingress Tool Transfer"},
    {"ability_id": "c9d0e1f2", "technique_id": "T1027",     "technique_name": "Obfuscated Files or Information"},
    {"ability_id": "d0e1f2a3", "technique_id": "T1053.005", "technique_name": "Scheduled Task"},
    {"ability_id": "e1f2a3b4", "technique_id": "T1068",     "technique_name": "Exploitation for Privilege Escalation"},
    {"ability_id": "f2a3b4c5", "technique_id": "T1543.003", "technique_name": "Windows Service"},
    {"ability_id": "a3b4c5d6", "technique_id": "T1112",     "technique_name": "Modify Registry"},
    {"ability_id": "b4c5d6e7", "technique_id": "T1071.001", "technique_name": "Web Protocols"},
    {"ability_id": "c5d6e7f8", "technique_id": "T1204.002", "technique_name": "Malicious File"},
]


# ─────────────────────────────────────────────────────────
# Mock function implementations
# ─────────────────────────────────────────────────────────

def caldera_api_method_details(
    api_method: Annotated[str, "The Caldera API for which you want the full details"]
) -> Annotated[str, "The details of the API method"]:
    return json.dumps({
        "get": {
            "description": f"Mock details for {api_method}",
            "parameters": [{"name": "id", "in": "path", "required": True, "type": "string"}],
            "responses": {"200": {"description": "Successful response"}}
        }
    }, indent=2)


def caldera_api_get_operation_info() -> Annotated[str, "The ID of the active Caldera Operation"]:
    return _MOCK_OPERATION_ID


def caldera_api_request(
    api_method: Annotated[str, "The Caldera API path to request"]
) -> Annotated[str, "The output of the API request"]:
    if "agents" in api_method:
        return json.dumps([{
            "paw": _MOCK_AGENT_PAW,
            "host": "DESKTOP-TARGET01",
            "platform": "windows",
            "executors": ["psh", "cmd"],
            "privilege": "Elevated",
            "last_seen": datetime.utcnow().isoformat(),
            "pid": 4832,
        }], indent=2)
    elif "operations" in api_method:
        return json.dumps([{
            "id": _MOCK_OPERATION_ID,
            "name": "Mock Operation",
            "state": "running",
            "start": datetime.utcnow().isoformat(),
        }], indent=2)
    elif "abilities" in api_method:
        return json.dumps(_MOCK_ABILITIES, indent=2)
    else:
        return json.dumps({"status": "ok", "message": f"Mock response for {api_method}"})


def caldera_swagger_info() -> Annotated[str, "The list of all available Caldera API methods"]:
    paths = [
        "/api/v2/agents", "/api/v2/operations", "/api/v2/abilities",
        "/api/v2/adversaries", "/api/v2/planners", "/api/v2/obfuscators",
        "/api/v2/plugins", "/api/v2/contacts", "/api/v2/config",
    ]
    result = ""
    for p in paths:
        result += json.dumps({"path": p, "description": f"CRUD operations for {p.split('/')[-1]}"}) + "\n"
    return result


def caldera_service_list(
    agent_paw: Annotated[str, "The Caldera agent paw"],
    operation_id: Annotated[str, "The ID of the Caldera operation"],
) -> Annotated[str, "The list of all running services on the Caldera agent"]:
    return f"[MOCK] Service list from agent {agent_paw} (operation {operation_id}):\n\n{_MOCK_SERVICES}"


def caldera_upload_file_from_agent(
    agent_paw: Annotated[str, "The Caldera agent paw"],
    operation_id: Annotated[str, "The ID of the Caldera operation"],
    file_path: Annotated[str, "The full path of the file to upload"],
) -> Annotated[str, "The result of the upload operation"]:
    return f"[MOCK] File '{file_path}' successfully uploaded from agent {agent_paw} via FTP."


def caldera_execute_command_on_agent(
    agent_paw: Annotated[str, "The Caldera agent paw"],
    operation_id: Annotated[str, "The ID of the Caldera operation"],
    command: Annotated[str, "The command to execute"],
    name: Annotated[str, "Can be psh or cmd"] = "psh",
) -> Annotated[str, "The output of the command executed on the Caldera agent"]:
    cmd_lower = command.lower()

    # Detect whoami/privilege queries
    if "whoami" in cmd_lower or "priv" in cmd_lower:
        return f"Command output: {_MOCK_PRIVILEGES}"

    # Detect service listing
    if "win32_service" in cmd_lower or "get-service" in cmd_lower:
        return f"Command output: {_MOCK_SERVICES}"

    # Detect message box (HELLO_CALDERA)
    if "messagebox" in cmd_lower or "message box" in cmd_lower or "wscript" in cmd_lower:
        return (
            "Command output: [MOCK] Message box displayed on target DESKTOP-TARGET01:\n"
            "\"Why do hackers prefer dark mode? Because the light attracts too many bugs!\"\n"
            "User clicked OK."
        )

    # Generic command execution
    return f"Command output: [MOCK] Command executed successfully on agent {agent_paw}:\n$ {command}\n[Mock output - command completed with exit code 0]"


def caldera_get_abilities() -> Annotated[str, "The Caldera abilities list"]:
    return "The command was successful with the following output:" + json.dumps(_MOCK_ABILITIES, indent=2)


def caldera_create_adversary_profile(
    name: Annotated[str, "The name of the Adversary profile"],
    description: Annotated[str, "The description of the Adversary profile"],
) -> Annotated[str, "The output of the Caldera API"]:
    global _MOCK_ADVERSARY_ID
    _MOCK_ADVERSARY_ID = str(uuid.uuid4())[:8]
    profile = {
        "adversary_id": _MOCK_ADVERSARY_ID,
        "name": name,
        "description": description,
        "atomic_ordering": [],
        "tags": ["mock", "auto-generated"],
    }
    return "The command was successful with the following output:" + json.dumps(profile, indent=2)


def caldera_add_abilities_to_adversary_profile(
    adversary_id: Annotated[str, "The ID of the Adversary profile"],
    atomic_ordering: Annotated[list, "The list of ability IDs for the profile"],
) -> Annotated[str, "The output of the Caldera API"]:
    result = {
        "adversary_id": adversary_id,
        "atomic_ordering": atomic_ordering if isinstance(atomic_ordering, list) else [atomic_ordering],
        "status": "updated",
        "abilities_count": len(atomic_ordering) if isinstance(atomic_ordering, list) else 1,
    }
    return "The command was successful with the following output:" + json.dumps(result, indent=2)


def match_techniques_to_caldera_abilities(
    report_techniques: Annotated[list, "The MITRE technique IDs extracted from a report"]
) -> Annotated[str, "The matched techniques"]:
    matched = []
    for ability in _MOCK_ABILITIES:
        for tech in report_techniques:
            tech_id = tech if isinstance(tech, str) else tech.get("technique_id", tech.get("id", ""))
            if tech_id == ability["technique_id"]:
                matched.append(ability)
    if not matched:
        # Fallback: return a few abilities to keep the demo flowing
        matched = _MOCK_ABILITIES[:5]
    return str(matched)
