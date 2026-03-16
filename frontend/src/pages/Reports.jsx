import { useState, useEffect } from 'react';
import ReportViewer from '../components/ReportViewer';
import { mockReportService } from '../services/mockReportService';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportContent, setReportContent] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [reportsData, statsData] = await Promise.all([
          mockReportService.getAllReports(),
          mockReportService.getReportStatistics()
        ]);
        setReports(reportsData);
        setStats(statsData);
        
        // Load the first report by default
        if (reportsData.length > 0) {
          loadReport(reportsData[0].id);
        }
        
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const loadReport = async (reportId) => {
    try {
      const report = await mockReportService.getReportById(reportId);
      setSelectedReport(report);
      setReportContent(report);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExport = async (format) => {
    if (!selectedReport) return;
    
    try {
      const result = await mockReportService.exportReport(selectedReport.id, format);
      alert(`Export simulated: ${result.fileName}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGenerate = async () => {
    try {
      const result = await mockReportService.generateReport({
        title: 'New Assessment Report'
      });
      alert('Report generation simulated successfully!');
      const updatedReports = await mockReportService.getAllReports();
      setReports(updatedReports);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-blue text-xl">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-blue">Reports</h1>
          <p className="text-gray-400 mt-1">View and export generated reports</p>
        </div>
        <button
          onClick={handleGenerate}
          className="px-6 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded-lg font-medium hover:bg-cyber-blue/30 transition-all"
        >
          ⚡ Generate Report
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-white">{stats?.totalReports || 0}</p>
            </div>
            <span className="text-4xl">📄</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">High Severity</p>
              <p className="text-3xl font-bold text-cyber-red">{stats?.totalFindings?.high || 0}</p>
            </div>
            <span className="text-4xl">🔴</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Medium Severity</p>
              <p className="text-3xl font-bold text-yellow-400">{stats?.totalFindings?.medium || 0}</p>
            </div>
            <span className="text-4xl">🟡</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Low Severity</p>
              <p className="text-3xl font-bold text-cyber-green">{stats?.totalFindings?.low || 0}</p>
            </div>
            <span className="text-4xl">🟢</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-cyber-red/20 border border-cyber-red/40 rounded-lg p-4 text-cyber-red">
          Error: {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Reports List */}
        <div className="lg:col-span-1">
          <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg">
            <div className="p-3 border-b border-cyber-blue/20">
              <h3 className="text-cyber-blue font-bold">Available Reports</h3>
            </div>
            <div className="p-2">
              {reports.map(report => (
                <button
                  key={report.id}
                  onClick={() => loadReport(report.id)}
                  className={`w-full text-left p-3 rounded mb-2 transition-all ${
                    selectedReport?.id === report.id
                      ? 'bg-cyber-blue/20 border border-cyber-blue/40 text-cyber-blue'
                      : 'hover:bg-cyber-blue/10 text-gray-300'
                  }`}
                >
                  <div className="font-medium text-sm mb-1 truncate">
                    {report.title}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(report.date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {report.size}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex gap-2">
            <button
              onClick={() => handleExport('pdf')}
              className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded font-medium hover:bg-cyber-blue/30 transition-all"
            >
              📥 Export PDF
            </button>
            <button
              onClick={() => handleExport('markdown')}
              className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded font-medium hover:bg-cyber-blue/30 transition-all"
            >
              📥 Export Markdown
            </button>
            <button
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded font-medium hover:bg-cyber-blue/30 transition-all"
            >
              📥 Export JSON
            </button>
          </div>

          {reportContent ? (
            <ReportViewer
              title={reportContent.title}
              content={reportContent.content}
            />
          ) : (
            <div className="bg-cyber-darker rounded-lg border border-cyber-blue/20 p-12 text-center text-gray-500">
              <p className="text-4xl mb-4">📄</p>
              <p>Select a report to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
