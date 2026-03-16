actions = {
    "HELLO_AGENTS": [
        {"message": "Tell me a cyber security joke", "agent": "text_analyst_agent"}
    ],
    "SUMMARIZE_RECENT_CISA_VULNS": [
        {
            "message": """Fetch the latest CISA Known Exploited Vulnerabilities by calling: fetch_cisa_vulnerabilities(count=10)""",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the last 10 CISA KEV entries.",
            "agent": "internet_agent",
        },
        {
            "message": "Summarize the list of vulnerabilities by extracting the product name and a short description of each vulnerability, as well as link to more notes if available. Output as a table.",
            "summary_method": "reflection_with_llm",
            "agent": "text_analyst_agent",
        },
    ],
    "DETECT_AGENT_PRIVILEGES": [
        {
            "message": "Get the current user's privileges on the active Caldera agent using a Powershell command.",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the list of ALL privileges.",
            "agent": "caldera_agent",
        },
        {
            "message": "List all the users privileges in a structured table and add a conclusion on if the agent is running with standard user, administrator or system privileges.",
            "summary_method": "last_msg",
            "agent": "text_analyst_agent",
        },
    ],
    "COLLECT_CALDERA_INFO": [
        {
            "message": "Get the ID of the active Caldera operation.",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the ID of the active Caldera operation.",
            "agent": "caldera_agent",
        },
        {
            "message": "Get the PAW of the active Caldera agent by calling /api/v2/agents.",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the PAW of the active Caldera agent.",
            "agent": "caldera_agent",
        },
    ],
    "IDENTIFY_EDR_BYPASS_TECHNIQUES": [
        {
            "message": """Detect telemetry gaps for the Elastic EDR by calling: detect_telemetry_gaps(url="https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/EDR_telem_windows.json", edr_name="Elastic")""",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the full list of Elastic EDR telemetry gaps (blind spots) returned by the tool.",
            "agent": "internet_agent",
        },
        {
            "message": """Based on the Elastic EDR telemetry gaps provided, create a structured security report that:
1. Lists all techniques with NO detection (blind spots) in a table with columns: Technique Name | Risk Level
2. Lists all techniques with PARTIAL detection in a separate table
3. Adds a brief executive summary (3-5 sentences) on the overall detection coverage
4. Suggests the top 3 highest-risk blind spots a red team should prioritize""",
            "summary_method": "reflection_with_llm",
            "agent": "text_analyst_agent",
        },
    ],
    "DETECT_EDR": [
        {
            "message": "Download https://raw.githubusercontent.com/tsale/EDR-Telemetry/main/README.md",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the list of ALL security products mentioned in the README. Add a title to the list.",
            "agent": "internet_agent",
        },
        {
            "message": "List all Windows services on the active Caldera agent",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the list of ALL Windows service names",
            "agent": "caldera_agent",
        },
        {
            "message": """Identify which security services are likely running on the active Caldera agent based on the provided context.
            Do this by comparing the list of running services with the list of popular security products.
            It's possible that multiple security agents are running.""",
            "summary_method": "reflection_with_llm",
            "agent": "text_analyst_agent",
        },
    ],
    "HELLO_CALDERA": [
        {
            "message": "Use powershell to display a message box on the desktop of the active Caldera agent containing a cyber security joke.",
            "summary_method": "last_msg",
            "agent": "caldera_agent",
        }
    ],
    "TTP_REPORT_TO_TECHNIQUES": [
        {
            "message": """Use the download_web_page tool to download the Microsoft threat intelligence report at: https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/
Call: download_web_page(url="https://www.microsoft.com/en-us/security/blog/2024/04/22/analyzing-forest-blizzards-custom-post-compromise-tool-for-exploiting-cve-2022-38028-to-obtain-credentials/")
Then extract all MITRE ATT&CK technique IDs (format: Txxxx or Txxxx.xxx) mentioned in the report.""",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with all MITRE ATT&CK technique IDs extracted from the Forest Blizzard report.",
            "agent": "internet_agent",
        },
        {
            "message": """Based on the MITRE ATT&CK techniques extracted from the Forest Blizzard report, create a summary table with columns: Technique ID | Technique Name | Description. Also write a brief summary of how Forest Blizzard uses these techniques.""",
            "summary_method": "reflection_with_llm",
            "agent": "text_analyst_agent",
        },
    ],
    "TTP_REPORT_TO_ADVERSARY_PROFILE": [
        {
            "message": """Use the download_web_page tool to download the threat intelligence report at: https://thedfirreport.com/2024/04/29/from-icedid-to-dagon-locker-ransomware-in-29-days/
Call: download_web_page(url="https://thedfirreport.com/2024/04/29/from-icedid-to-dagon-locker-ransomware-in-29-days/")
Then extract all MITRE ATT&CK technique IDs (format: Txxxx or Txxxx.xxx) mentioned in the report.""",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with all the MITRE ATT&CK technique IDs extracted from the downloaded report (e.g., T1059, T1003.001, etc.).",
            "agent": "internet_agent",
        },
        {
            "message": "For each one of the MITRE techniques that was extracted from the report find a matching Caldera ability based on the technique id. Do not truncate the output.",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the matched Caldera abilities",
            "agent": "caldera_agent",
        },
        {
            "message": "Create a new adversary profile with an appropriate name according to the report contents and add one matched Caldera ability per technique",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with the adversary profile information.",
            "agent": "caldera_agent",
        },
    ],
    "TTP_REPORT_TO_TECHNIQUES_ONLY": [
        {
            "message": """Use the download_web_page tool to download the threat intelligence report at: https://thedfirreport.com/2024/04/29/from-icedid-to-dagon-locker-ransomware-in-29-days/
Call: download_web_page(url="https://thedfirreport.com/2024/04/29/from-icedid-to-dagon-locker-ransomware-in-29-days/")
Then extract all MITRE ATT&CK technique IDs (format: Txxxx or Txxxx.xxx) found in the report.""",
            "summary_method": "last_msg",
            "carryover": "Replace this placeholder with all the MITRE ATT&CK technique IDs extracted from the downloaded DFIR report (e.g., T1059.001, T1003, T1078, etc.).",
            "agent": "internet_agent",
        },
        {
            "message": """Based on the MITRE ATT&CK techniques extracted from the IcedID to Dagon Locker ransomware report, produce a structured Threat Intelligence summary:
1. Create a table with columns: Technique ID | Technique Name | Tactic | Description/Context (from the report)
2. Group the techniques by MITRE ATT&CK tactic (Initial Access, Execution, Persistence, etc.)
3. Write a short executive summary (5-7 sentences) profiling the threat actor's behaviour and attack chain
4. Identify the top 3 most critical techniques defenders should prioritize detecting""",
            "summary_method": "reflection_with_llm",
            "agent": "text_analyst_agent",
        },
    ],
}

scenarios = {
    "HELLO_AGENTS": ["HELLO_AGENTS"],
    "SUMMARIZE_RECENT_CISA_VULNS": ["SUMMARIZE_RECENT_CISA_VULNS"],
    "HELLO_CALDERA": ["COLLECT_CALDERA_INFO", "HELLO_CALDERA"],
    "COLLECT_CALDERA_INFO": ["COLLECT_CALDERA_INFO"],
    "DETECT_EDR": ["COLLECT_CALDERA_INFO", "DETECT_EDR"],
    "DETECT_AGENT_PRIVILEGES": ["COLLECT_CALDERA_INFO", "DETECT_AGENT_PRIVILEGES"],
    "IDENTIFY_EDR_BYPASS_TECHNIQUES": ["IDENTIFY_EDR_BYPASS_TECHNIQUES"],
    "TTP_REPORT_TO_TECHNIQUES": ["TTP_REPORT_TO_TECHNIQUES"],
    "TTP_REPORT_TO_ADVERSARY_PROFILE": ["TTP_REPORT_TO_ADVERSARY_PROFILE"],
    "TTP_REPORT_TO_TECHNIQUES_ONLY": ["TTP_REPORT_TO_TECHNIQUES_ONLY"],
}
