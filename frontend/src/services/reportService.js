/**
 * Report Service - Real Implementation
 * Generates reports from backend logs and artifacts
 */

import apiClient from './apiClient';
import logService from './logService';
import artifactService from './artifactService';

export const reportService = {
  /**
   * Get all available reports
   */
  async getReports() {
    try {
      // Generate reports from logs and artifacts
      const [logStats, artifacts] = await Promise.all([
        logService.getLogStats(),
        artifactService.listAllFiles()
      ]);

      const reports = [
        {
          id: 'log-summary',
          title: 'Log Summary Report',
          type: 'summary',
          date: new Date().toISOString(),
          status: 'completed',
          data: logStats
        },
        {
          id: 'artifact-summary',
          title: 'Artifact Summary Report',
          type: 'summary',
          date: new Date().toISOString(),
          status: 'completed',
          data: {
            totalArtifacts: artifacts.length,
            totalSize: artifacts.reduce((sum, a) => sum + a.size, 0)
          }
        }
      ];

      // Add reports for PDF artifacts
      const pdfArtifacts = artifacts.filter(a => a.type === 'pdf');
      pdfArtifacts.forEach(pdf => {
        reports.push({
          id: `pdf-${pdf.id}`,
          title: pdf.name,
          type: 'pdf',
          date: pdf.modified,
          status: 'completed',
          path: pdf.path
        });
      });

      return reports;
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      throw error;
    }
  },

  /**
   * Get a specific report by ID
   */
  async getReport(reportId) {
    try {
      const reports = await this.getReports();
      const report = reports.find(r => r.id === reportId);
      
      if (!report) {
        throw new Error('Report not found');
      }

      // If it's a PDF report, fetch the content
      if (report.type === 'pdf' && report.path) {
        const fileContents = await artifactService.getFileContents(report.path);
        report.content = fileContents.content;
      }

      return report;
    } catch (error) {
      console.error(`Failed to fetch report ${reportId}:`, error);
      throw error;
    }
  },

  /**
   * Generate a report
   */
  async generateReport(reportType, options = {}) {
    try {
      let reportData = {};

      switch (reportType) {
        case 'log-analysis':
          reportData = await logService.getLogStats();
          break;
        
        case 'artifact-analysis':
          reportData = await artifactService.getArtifactStats();
          break;
        
        case 'full-summary':
          const [logs, artifacts] = await Promise.all([
            logService.getLogStats(),
            artifactService.getArtifactStats()
          ]);
          reportData = { logs, artifacts };
          break;
        
        default:
          throw new Error('Unknown report type');
      }

      return {
        id: `${reportType}-${Date.now()}`,
        title: `${reportType.replace('-', ' ').toUpperCase()} Report`,
        type: reportType,
        date: new Date().toISOString(),
        status: 'completed',
        data: reportData
      };
    } catch (error) {
      console.error(`Failed to generate report ${reportType}:`, error);
      throw error;
    }
  },

  /**
   * Export report
   */
  async exportReport(reportId, format = 'json') {
    try {
      const report = await this.getReport(reportId);
      
      let content, mimeType, extension;
      
      if (format === 'json') {
        content = JSON.stringify(report, null, 2);
        mimeType = 'application/json';
        extension = 'json';
      } else if (format === 'csv') {
        // Convert to CSV if data is tabular
        content = this._convertToCSV(report.data);
        mimeType = 'text/csv';
        extension = 'csv';
      } else {
        throw new Error('Unsupported format');
      }

      const blob = new Blob([content], { type: mimeType });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${reportId}.${extension}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return { success: true };
    } catch (error) {
      console.error(`Failed to export report ${reportId}:`, error);
      throw error;
    }
  },

  /**
   * Helper: Convert data to CSV
   */
  _convertToCSV(data) {
    if (!data || typeof data !== 'object') {
      return '';
    }

    const rows = [];
    
    // Add headers
    rows.push(Object.keys(data).join(','));
    
    // Add values
    rows.push(Object.values(data).join(','));

    return rows.join('\n');
  }
};

export default reportService;
