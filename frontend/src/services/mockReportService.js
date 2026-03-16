import { mockReport, mockFileContents } from '../mock/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const mockReportService = {
  // Get the main report
  async getReport() {
    await delay(400);
    return {
      id: 'report-001',
      title: 'Cybersecurity Assessment Final Report',
      date: new Date().toISOString(),
      content: mockReport,
      format: 'markdown',
      status: 'completed'
    };
  },

  // Get all available reports
  async getAllReports() {
    await delay(300);
    return [
      {
        id: 'report-001',
        title: 'Cybersecurity Assessment Final Report',
        date: new Date(Date.now() - 120000).toISOString(),
        status: 'completed',
        size: '89.4 KB'
      },
      {
        id: 'report-002',
        title: 'Threat Assessment Report',
        date: new Date(Date.now() - 600000).toISOString(),
        status: 'completed',
        size: '12.9 KB'
      },
      {
        id: 'report-003',
        title: 'Vulnerability Analysis Report',
        date: new Date(Date.now() - 900000).toISOString(),
        status: 'completed',
        size: '67.3 KB'
      }
    ];
  },

  // Get a specific report by ID
  async getReportById(reportId) {
    await delay(300);
    
    const reports = {
      'report-001': {
        id: 'report-001',
        title: 'Cybersecurity Assessment Final Report',
        content: mockReport,
        format: 'markdown'
      },
      'report-002': {
        id: 'report-002',
        title: 'Threat Assessment Report',
        content: mockFileContents['threat_assessment.md'],
        format: 'markdown'
      },
      'report-003': {
        id: 'report-003',
        title: 'Vulnerability Analysis Report',
        content: mockFileContents['vulnerabilities.json'],
        format: 'json'
      }
    };
    
    const report = reports[reportId];
    if (!report) {
      throw new Error('Report not found');
    }
    
    return report;
  },

  // Generate a new report (simulation)
  async generateReport(params = {}) {
    await delay(2000); // Simulate generation time
    
    return {
      id: 'report-' + Date.now(),
      title: params.title || 'Generated Security Report',
      date: new Date().toISOString(),
      content: mockReport,
      format: 'markdown',
      status: 'completed'
    };
  },

  // Export report (simulation)
  async exportReport(reportId, format = 'pdf') {
    await delay(500);
    
    return {
      success: true,
      reportId: reportId,
      format: format,
      fileName: `report_${reportId}.${format}`,
      message: 'Export simulated - in real app would download file'
    };
  },

  // Get report statistics
  async getReportStatistics() {
    await delay(200);
    
    return {
      totalReports: 3,
      completedReports: 3,
      pendingReports: 0,
      lastGenerated: new Date(Date.now() - 120000).toISOString(),
      averageGenerationTime: '2.3s',
      totalFindings: {
        high: 3,
        medium: 2,
        low: 1
      }
    };
  },

  // Delete report (simulation)
  async deleteReport(reportId) {
    await delay(300);
    
    return {
      success: true,
      reportId: reportId,
      message: 'Report deleted successfully'
    };
  }
};
