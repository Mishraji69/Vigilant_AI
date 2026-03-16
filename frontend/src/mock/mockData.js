// Mock data for the cybersecurity simulation platform

export const mockAgents = [
  {
    id: 'agent-recon-01',
    name: 'Recon Agent',
    type: 'reconnaissance',
    status: 'idle',
    description: 'Network reconnaissance and enumeration',
    lastActivity: new Date(Date.now() - 300000).toISOString(),
    tasksCompleted: 12,
    capabilities: ['port_scan', 'service_enum', 'dns_recon']
  },
  {
    id: 'agent-collect-01',
    name: 'Collection Agent',
    type: 'collection',
    status: 'running',
    description: 'Data collection and extraction',
    lastActivity: new Date().toISOString(),
    tasksCompleted: 8,
    capabilities: ['data_gather', 'file_extract', 'metadata_collect']
  },
  {
    id: 'agent-analyze-01',
    name: 'Analysis Agent',
    type: 'analysis',
    status: 'idle',
    description: 'Vulnerability analysis and threat assessment',
    lastActivity: new Date(Date.now() - 600000).toISOString(),
    tasksCompleted: 15,
    capabilities: ['vuln_scan', 'exploit_analysis', 'risk_assess']
  },
  {
    id: 'agent-report-01',
    name: 'Reporting Agent',
    type: 'reporting',
    status: 'completed',
    description: 'Report generation and documentation',
    lastActivity: new Date(Date.now() - 120000).toISOString(),
    tasksCompleted: 20,
    capabilities: ['report_gen', 'doc_create', 'export_data']
  }
];

export const mockLogs = [
  { id: 1, timestamp: new Date(Date.now() - 60000).toISOString(), level: 'INFO', agent: 'Coordinator', message: 'System initialized successfully' },
  { id: 2, timestamp: new Date(Date.now() - 55000).toISOString(), level: 'INFO', agent: 'Recon Agent', message: 'Starting network reconnaissance on target 192.168.1.0/24' },
  { id: 3, timestamp: new Date(Date.now() - 50000).toISOString(), level: 'INFO', agent: 'Recon Agent', message: 'Discovered 5 active hosts' },
  { id: 4, timestamp: new Date(Date.now() - 45000).toISOString(), level: 'WARN', agent: 'Collection Agent', message: 'Rate limiting detected, adjusting collection speed' },
  { id: 5, timestamp: new Date(Date.now() - 40000).toISOString(), level: 'INFO', agent: 'Collection Agent', message: 'Collected 250 data points from target systems' },
  { id: 6, timestamp: new Date(Date.now() - 35000).toISOString(), level: 'ERROR', agent: 'Analysis Agent', message: 'Failed to connect to vulnerability database, retrying...' },
  { id: 7, timestamp: new Date(Date.now() - 30000).toISOString(), level: 'INFO', agent: 'Analysis Agent', message: 'Database connection restored' },
  { id: 8, timestamp: new Date(Date.now() - 25000).toISOString(), level: 'INFO', agent: 'Analysis Agent', message: 'Identified 3 high-severity vulnerabilities' },
  { id: 9, timestamp: new Date(Date.now() - 20000).toISOString(), level: 'INFO', agent: 'Reporting Agent', message: 'Generating comprehensive security report' },
  { id: 10, timestamp: new Date(Date.now() - 15000).toISOString(), level: 'INFO', agent: 'Reporting Agent', message: 'Report generation completed successfully' }
];

export const mockArtifacts = {
  name: 'llm_working_folder',
  type: 'directory',
  children: [
    {
      name: 'reconnaissance',
      type: 'directory',
      children: [
        { name: 'network_scan.txt', type: 'file', size: '2.4 KB', modified: new Date(Date.now() - 3600000).toISOString() },
        { name: 'port_results.json', type: 'file', size: '15.2 KB', modified: new Date(Date.now() - 3000000).toISOString() },
        { name: 'dns_enum.csv', type: 'file', size: '8.7 KB', modified: new Date(Date.now() - 2400000).toISOString() }
      ]
    },
    {
      name: 'collection',
      type: 'directory',
      children: [
        { name: 'data_dump.json', type: 'file', size: '145.8 KB', modified: new Date(Date.now() - 1800000).toISOString() },
        { name: 'metadata.xml', type: 'file', size: '23.5 KB', modified: new Date(Date.now() - 1200000).toISOString() },
        { name: 'credentials.enc', type: 'file', size: '4.1 KB', modified: new Date(Date.now() - 600000).toISOString() }
      ]
    },
    {
      name: 'analysis',
      type: 'directory',
      children: [
        { name: 'vulnerabilities.json', type: 'file', size: '67.3 KB', modified: new Date(Date.now() - 900000).toISOString() },
        { name: 'threat_assessment.md', type: 'file', size: '12.9 KB', modified: new Date(Date.now() - 600000).toISOString() },
        { name: 'exploit_analysis.txt', type: 'file', size: '34.2 KB', modified: new Date(Date.now() - 300000).toISOString() }
      ]
    },
    {
      name: 'reports',
      type: 'directory',
      children: [
        { name: 'final_report.md', type: 'file', size: '89.4 KB', modified: new Date(Date.now() - 120000).toISOString() },
        { name: 'executive_summary.pdf', type: 'file', size: '1.2 MB', modified: new Date(Date.now() - 60000).toISOString() }
      ]
    }
  ]
};

export const mockFileContents = {
  'network_scan.txt': `Network Scan Results
===================
Target: 192.168.1.0/24
Scan Date: ${new Date().toLocaleDateString()}

Active Hosts Discovered:
- 192.168.1.1 (Gateway)
- 192.168.1.10 (Web Server)
- 192.168.1.15 (Database Server)
- 192.168.1.20 (File Server)
- 192.168.1.25 (Mail Server)

Open Services:
- HTTP (80/tcp) on 192.168.1.10
- HTTPS (443/tcp) on 192.168.1.10
- SSH (22/tcp) on 192.168.1.15
- MySQL (3306/tcp) on 192.168.1.15
- SMB (445/tcp) on 192.168.1.20
- SMTP (25/tcp) on 192.168.1.25`,

  'vulnerabilities.json': JSON.stringify({
    scan_id: 'vuln-2024-001',
    timestamp: new Date().toISOString(),
    vulnerabilities: [
      {
        id: 'CVE-2024-1234',
        severity: 'HIGH',
        cvss_score: 8.2,
        title: 'Remote Code Execution in Web Server',
        affected_system: '192.168.1.10',
        description: 'Unpatched web server allows remote code execution',
        recommendation: 'Apply security patch immediately'
      },
      {
        id: 'CVE-2024-5678',
        severity: 'MEDIUM',
        cvss_score: 6.5,
        title: 'SQL Injection Vulnerability',
        affected_system: '192.168.1.15',
        description: 'Database server vulnerable to SQL injection attacks',
        recommendation: 'Implement input validation and parameterized queries'
      },
      {
        id: 'CVE-2024-9012',
        severity: 'HIGH',
        cvss_score: 7.8,
        title: 'Unauthorized File Access',
        affected_system: '192.168.1.20',
        description: 'File server misconfiguration allows unauthorized access',
        recommendation: 'Review and update file permissions'
      }
    ]
  }, null, 2),

  'threat_assessment.md': `# Threat Assessment Report

## Executive Summary

A comprehensive security assessment has been conducted on the target network infrastructure. Multiple vulnerabilities and security weaknesses have been identified that require immediate attention.

## Risk Level: **HIGH**

### Critical Findings

1. **Remote Code Execution Vulnerability (CVE-2024-1234)**
   - CVSS Score: 8.2
   - Impact: HIGH
   - Likelihood: HIGH
   
2. **SQL Injection Vulnerability (CVE-2024-5678)**
   - CVSS Score: 6.5
   - Impact: MEDIUM
   - Likelihood: HIGH

3. **Unauthorized File Access (CVE-2024-9012)**
   - CVSS Score: 7.8
   - Impact: HIGH
   - Likelihood: MEDIUM

## Recommendations

- Immediate patching of identified vulnerabilities
- Implementation of network segmentation
- Enhanced monitoring and logging
- Regular security audits

## Timeline

- Critical issues: Address within 24-48 hours
- High severity: Address within 1 week
- Medium severity: Address within 2 weeks`,

  'final_report.md': `# Cybersecurity Assessment Final Report

**Date:** ${new Date().toLocaleDateString()}  
**Assessment ID:** SEC-2024-001  
**Status:** Completed

---

## 1. Executive Summary

This report presents the findings of a comprehensive cybersecurity assessment conducted on the target infrastructure. The assessment utilized a multi-agent approach to perform reconnaissance, data collection, vulnerability analysis, and reporting.

### Key Findings
- **Total Hosts Discovered:** 5
- **Vulnerabilities Identified:** 3 High, 2 Medium, 1 Low
- **Security Posture:** NEEDS IMPROVEMENT
- **Recommended Actions:** 6 Critical, 8 Important

---

## 2. Reconnaissance Phase

### Network Discovery
- Target Range: 192.168.1.0/24
- Active Hosts: 5
- Open Ports: 12
- Services Identified: 8

### Asset Inventory
1. Gateway (192.168.1.1)
2. Web Server (192.168.1.10)
3. Database Server (192.168.1.15)
4. File Server (192.168.1.20)
5. Mail Server (192.168.1.25)

---

## 3. Vulnerability Analysis

### High Severity Issues

#### CVE-2024-1234: Remote Code Execution
- **System:** Web Server (192.168.1.10)
- **CVSS:** 8.2
- **Description:** Unpatched web application framework
- **Impact:** Complete system compromise possible
- **Mitigation:** Apply security patch v2.4.1

#### CVE-2024-9012: Unauthorized File Access
- **System:** File Server (192.168.1.20)
- **CVSS:** 7.8
- **Description:** Misconfigured SMB shares
- **Impact:** Sensitive data exposure
- **Mitigation:** Review and update share permissions

### Medium Severity Issues

#### CVE-2024-5678: SQL Injection
- **System:** Database Server (192.168.1.15)
- **CVSS:** 6.5
- **Description:** Vulnerable to SQL injection attacks
- **Impact:** Data breach potential
- **Mitigation:** Implement prepared statements

---

## 4. Collection Results

### Data Points Collected
- Configuration files: 45
- Log entries: 12,847
- Network traffic samples: 2.4 GB
- Metadata records: 1,234

### Sensitive Information Found
- Plain text credentials: 3 instances
- Unencrypted API keys: 2 instances
- Exposed database connections: 1 instance

---

## 5. Recommendations

### Immediate Actions (24-48 hours)
1. Patch CVE-2024-1234 on web server
2. Disable exposed SMB shares
3. Rotate compromised credentials
4. Enable database query logging

### Short-term Actions (1-2 weeks)
1. Implement input validation
2. Deploy intrusion detection system
3. Configure firewall rules
4. Enable multi-factor authentication

### Long-term Actions (1-3 months)
1. Conduct security awareness training
2. Implement zero-trust architecture
3. Deploy SIEM solution
4. Establish incident response procedures

---

## 6. Conclusion

The assessment reveals several critical vulnerabilities that require immediate attention. The current security posture leaves the infrastructure vulnerable to multiple attack vectors. Implementation of the recommended actions will significantly improve the overall security stance.

### Risk Rating
**CURRENT:** High Risk  
**POST-MITIGATION:** Medium Risk (projected)

---

*Report generated by AI-Driven Multi-Agent Security Platform*`
};

export const mockReport = mockFileContents['final_report.md'];

export const mockCoordinatorStatus = {
  state: 'operational',
  uptime: '12h 34m',
  activeAgents: 2,
  completedTasks: 47,
  pendingTasks: 3,
  serverStatus: {
    http: 'online',
    ftp: 'online',
    database: 'online'
  },
  currentScenario: 'Enterprise Network Assessment',
  pipelineStage: 'analysis'
};
