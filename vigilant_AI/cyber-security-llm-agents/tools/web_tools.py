from typing_extensions import Annotated
from pypdf import PdfReader
from bs4 import BeautifulSoup

import utils.constants

import subprocess

PDF_WORKING_FOLDER = utils.constants.LLM_WORKING_FOLDER + "/pdf"


def download_pdf_report(
    url: Annotated[
        str,
        "The URL of the PDF report to download",
    ]
) -> Annotated[str, "The content of the PDF report"]:

    # Download PDF report to a local folder
    subprocess.check_output(
        f"curl -sS {url} -o {PDF_WORKING_FOLDER}/tmp.pdf",
        shell=True,
        stderr=subprocess.STDOUT,
        text=True,
    )

    reader = PdfReader(f"{PDF_WORKING_FOLDER}/tmp.pdf")
    text = ""
    for page in reader.pages:
        text += page.extract_text() + "\n"

    return text


def download_web_page(
    url: Annotated[
        str,
        "The URL of the web page to download",
    ]
) -> Annotated[str, "The content of the web page"]:

    raw_output = subprocess.check_output(
        f"curl -sS {url}",
        shell=True,
        stderr=subprocess.STDOUT,
        text=True,
    )

    soup = BeautifulSoup(raw_output, "html.parser")
    return soup.get_text(strip=True)


def detect_telemetry_gaps(
    url: Annotated[
        str,
        "The URL of the EDR telemetry JSON file to download",
    ],
    edr_name: Annotated[
        str,
        "The name of the EDR",
    ],
) -> Annotated[
    str, "The overview of all EDR telemetry categories not detected by the EDR"
]:
    import json
    
    try:
        # Download the JSON data
        raw_output = subprocess.check_output(
            f'curl -sS {url}',
            shell=True,
            stderr=subprocess.STDOUT,
            text=True,
        )
        
        data = json.loads(raw_output)
        
        # Find telemetry gaps (where EDR has "No" or "Partially")
        gaps = []
        limited = []
        
        for entry in data:
            sub_category = entry.get("Sub-Category", "")
            edr_support = entry.get(edr_name, "")
            
            if edr_support == "No":
                gaps.append(sub_category)
            elif edr_support == "Partially":
                limited.append(sub_category)
        
        result = f"{edr_name} EDR Telemetry Gaps (Detection Blind Spots)\n\n"
        result += "[NO DETECTION]:\n"
        for gap in gaps:
            result += f"  - {gap}\n"
        
        if limited:
            result += "\n[PARTIAL DETECTION]:\n"
            for item in limited:
                result += f"  - {item}\n"
        
        result += f"\nSummary: {len(gaps)} blind spots, {len(limited)} partial coverage gaps"
        
        return result
        
    except Exception as e:
        return f"Error detecting telemetry gaps: {str(e)}"


def fetch_cisa_vulnerabilities(
    count: Annotated[
        int,
        "Number of most recent vulnerabilities to return (default 10)",
    ] = 10,
) -> Annotated[str, "The most recent CISA Known Exploited Vulnerabilities as a formatted list"]:
    """Fetch the latest CISA KEV entries in pure Python — no jq or bash needed."""
    import urllib.request
    import json

    count = int(count)  # Tool parser may pass string

    url = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json"
    try:
        with urllib.request.urlopen(url, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))

        vulns = data.get("vulnerabilities", [])
        recent = vulns[-count:]

        lines = [f"Last {count} CISA Known Exploited Vulnerabilities:\n"]
        for i, v in enumerate(recent, 1):
            lines.append(
                f"{i}. CVE: {v.get('cveID', 'N/A')}\n"
                f"   Product: {v.get('product', 'N/A')} ({v.get('vendorProject', 'N/A')})\n"
                f"   Description: {v.get('shortDescription', 'N/A')}\n"
                f"   Date Added: {v.get('dateAdded', 'N/A')}\n"
                f"   Due Date: {v.get('dueDate', 'N/A')}\n"
            )
        return "\n".join(lines)
    except Exception as e:
        return f"Error fetching CISA vulnerabilities: {str(e)}"


def extract_mitre_techniques(
    url: Annotated[
        str,
        "The URL of the web page to scan for MITRE ATT&CK technique IDs",
    ],
) -> Annotated[str, "Sorted, deduplicated list of MITRE technique IDs found on the page"]:
    """Download a web page and extract all MITRE ATT&CK technique IDs (T####[.###]) using Python regex — no bash needed."""
    import re

    try:
        raw_output = subprocess.check_output(
            f"curl -sS {url}",
            shell=True,
            stderr=subprocess.STDOUT,
            text=True,
            timeout=30,
        )
        techniques = sorted(set(re.findall(r"T\d{4}(?:\.\d{3})?", raw_output)))
        if not techniques:
            return "No MITRE ATT&CK technique IDs found on the page."
        result = f"MITRE ATT&CK Techniques found:\n"
        result += "\n".join(f"  - {t}" for t in techniques)
        result += f"\n\nTotal: {len(techniques)} unique techniques"
        return result
    except Exception as e:
        return f"Error extracting MITRE techniques: {str(e)}"


