import { useState, useEffect } from 'react';
import { useCoordinator } from '../hooks/useCoordinator';
import StatusBadge from '../components/StatusBadge';
import PipelineStepper from '../components/PipelineStepper';
import { coordinatorService } from '../services/coordinatorService';

// Available scenarios from backend
const SCENARIOS = [
  { id: 'HELLO_AGENTS', name: '🧪 Test: Cybersecurity Joke', category: 'Test', requiresCaldera: false, reliable: true },
  { id: 'SUMMARIZE_RECENT_CISA_VULNS', name: '📰 CISA Vulnerabilities', category: 'Threat Intel', requiresCaldera: false, reliable: true },
  { id: 'IDENTIFY_EDR_BYPASS_TECHNIQUES', name: '🕵️ EDR Bypass Techniques', category: 'Research', requiresCaldera: false, reliable: false },
  { id: 'TTP_REPORT_TO_TECHNIQUES', name: '📊 Extract MITRE Techniques', category: 'Threat Intel', requiresCaldera: false, reliable: false },
  { id: 'DETECT_EDR', name: '🔍 Detect EDR Products', category: 'Reconnaissance', requiresCaldera: true, reliable: false },
  { id: 'DETECT_AGENT_PRIVILEGES', name: '🔐 Check Privileges', category: 'Reconnaissance', requiresCaldera: true, reliable: false },
  { id: 'COLLECT_CALDERA_INFO', name: '📋 Caldera Info', category: 'Reconnaissance', requiresCaldera: true, reliable: false },
  { id: 'HELLO_CALDERA', name: '💬 Caldera Message Box', category: 'Test', requiresCaldera: true, reliable: false },
  { id: 'TTP_REPORT_TO_ADVERSARY_PROFILE', name: '🎭 Create Adversary Profile', category: 'Advanced', requiresCaldera: true, reliable: false },
];

// Helper function to extract key information from scenario output
const extractScenarioOutput = (output, scenarioId) => {
  if (!output) return 'No output available';
  
  // Extract text after "Response:" or before "TERMINATE"
  const responseMatch = output.match(/Response:\n([\s\S]*?)(?:TERMINATE|={10,})/);
  if (responseMatch && responseMatch[1].trim()) {
    return responseMatch[1].trim();
  }
  
  // If no match, return the full output
  return output;
};

const Dashboard = () => {
  const { status, pipelineStatus, systemHealth, loading, startWorkflow, stopWorkflow } = useCoordinator();
  const [selectedScenario, setSelectedScenario] = useState('HELLO_AGENTS');
  const [scenarioResults, setScenarioResults] = useState({});
  const [pollingScenario, setPollingScenario] = useState(null);

  // Poll for scenario results
  useEffect(() => {
    if (!pollingScenario) return;

    let pollCount = 0;
    const maxPolls = 60; // Maximum 2 minutes (60 * 2 seconds)

    const pollInterval = setInterval(async () => {
      pollCount++;
      
      try {
        const response = await coordinatorService.getScenarioStatus(pollingScenario);
        
        console.log('Polling status:', response.status, 'Poll count:', pollCount);
        
        // Update status even while running
        if (response.status === 'running') {
          setScenarioResults(prev => ({
            ...prev,
            [pollingScenario]: {
              status: 'running',
              output: null,
              error: null
            }
          }));
        }
        
        // Stop polling when completed, failed, or timeout
        if (response.status === 'completed' || response.status === 'failed' || pollCount >= maxPolls) {
          setScenarioResults(prev => ({
            ...prev,
            [pollingScenario]: {
              status: pollCount >= maxPolls ? 'timeout' : response.status,
              output: response.output || 'No output received',
              error: response.error || (pollCount >= maxPolls ? 'Scenario timeout after 2 minutes' : null),
              completed_at: response.completed_at
            }
          }));
          setPollingScenario(null); // Stop polling
        }
      } catch (error) {
        console.error('Error polling scenario status:', error);
        setScenarioResults(prev => ({
          ...prev,
          [pollingScenario]: {
            status: 'failed',
            output: null,
            error: `Failed to fetch status: ${error.message}`
          }
        }));
        setPollingScenario(null); // Stop polling on error
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [pollingScenario]);

  const handleRunScenario = async () => {
    if (!selectedScenario) {
      alert('Please select a scenario first');
      return;
    }
    const scenario = SCENARIOS.find(s => s.id === selectedScenario);
    if (scenario?.requiresCaldera) {
      if (!window.confirm(`⚠️ This scenario requires an active Caldera agent connection.\n\nScenario: ${scenario.name}\nCategory: ${scenario.category}\n\nContinue?`)) {
        return;
      }
    }
    
    try {
      await startWorkflow(selectedScenario);
      setPollingScenario(selectedScenario); // Start polling for results
      setScenarioResults(prev => ({
        ...prev,
        [selectedScenario]: { status: 'running' }
      }));
    } catch (err) {
      alert(`Failed to start workflow: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-blue text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-cyber-blue">Dashboard</h1>
          <p className="text-gray-400 mt-1">Multi-Agent Coordination Control Center</p>
        </div>
        <div className="flex gap-3 items-center">
          <select
            value={selectedScenario}
            onChange={(e) => setSelectedScenario(e.target.value)}
            className="px-4 py-2 bg-cyber-dark border border-cyber-blue/40 rounded-lg text-white font-medium hover:border-cyber-blue/60 transition-all focus:outline-none focus:border-cyber-blue"
          >
            <option value="" disabled>Select Scenario...</option>
            {SCENARIOS.map(scenario => (
              <option key={scenario.id} value={scenario.id}>
                {scenario.name} {scenario.requiresCaldera ? '🔗' : ''}
              </option>
            ))}
          </select>
          <button
            onClick={handleRunScenario}
            disabled={!selectedScenario}
            className="px-6 py-2 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded-lg font-medium hover:bg-cyber-blue/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ▶ Run Scenario
          </button>
          <button
            onClick={stopWorkflow}
            className="px-6 py-2 bg-cyber-red/20 text-cyber-red border border-cyber-red/40 rounded-lg font-medium hover:bg-cyber-red/30 transition-all"
          >
            ⏹ Stop All
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Coordinator Status</span>
            <span className="text-2xl">🎯</span>
          </div>
          <div className="mb-2">
            <StatusBadge status={status?.state || 'idle'} />
          </div>
          <p className="text-xs text-gray-500">Uptime: {status?.uptime || 'N/A'}</p>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Active Agents</span>
            <span className="text-2xl">🤖</span>
          </div>
          <div className="text-3xl font-bold text-cyber-blue mb-2">
            {status?.activeAgents || 0}
          </div>
          <p className="text-xs text-gray-500">Currently running</p>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Tasks Completed</span>
            <span className="text-2xl">✅</span>
          </div>
          <div className="text-3xl font-bold text-cyber-green mb-2">
            {status?.completedTasks || 0}
          </div>
          <p className="text-xs text-gray-500">
            {status?.pendingTasks || 0} pending
          </p>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">System Health</span>
            <span className="text-2xl">💚</span>
          </div>
          <div className="mb-2">
            <StatusBadge status={systemHealth?.overall || 'unknown'} />
          </div>
          <p className="text-xs text-gray-500">All systems operational</p>
        </div>
      </div>

      {/* Current Scenario */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-4">Current Scenario</h2>
        <div className="flex items-center gap-4">
          <div className="text-4xl">🎭</div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-1">
              {status?.currentScenario || 'No Active Scenario'}
            </h3>
            <p className="text-gray-400">
              {status?.currentScenario 
                ? SCENARIOS.find(s => s.id === status.currentScenario)?.name || 'Running scenario...'
                : 'Select and run a scenario from the dropdown above'}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Scenario Info */}
      {selectedScenario && (
        <div className="bg-gradient-to-r from-cyber-blue/10 to-cyber-purple/10 border border-cyber-blue/30 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl mt-1">
              {SCENARIOS.find(s => s.id === selectedScenario)?.name.split(' ')[0]}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="text-xl font-bold text-white">
                  {SCENARIOS.find(s => s.id === selectedScenario)?.name}
                </h3>
                <span className="px-3 py-1 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded-full text-xs font-medium">
                  {SCENARIOS.find(s => s.id === selectedScenario)?.category}
                </span>
                {!SCENARIOS.find(s => s.id === selectedScenario)?.reliable && (
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 rounded-full text-xs font-medium">
                    ⚠️ Experimental
                  </span>
                )}
                {SCENARIOS.find(s => s.id === selectedScenario)?.reliable && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/40 rounded-full text-xs font-medium">
                    ✓ Verified Working
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm">
                {selectedScenario === 'HELLO_AGENTS' && 'Simple test scenario - LLM generates a cybersecurity joke using the Text Analyst agent. (✓ Fully functional)'}
                {selectedScenario === 'DETECT_EDR' && 'Downloads EDR product list, queries running services on target system via Caldera, and identifies security products.'}
                {selectedScenario === 'SUMMARIZE_RECENT_CISA_VULNS' && 'Downloads latest CISA KEV feed, extracts last 10 vulnerabilities, and generates formatted summary table. (✓ Fully functional)'}
                {selectedScenario === 'DETECT_AGENT_PRIVILEGES' && 'Checks privilege level (User/Admin/System) on compromised system using PowerShell commands.'}
                {selectedScenario === 'IDENTIFY_EDR_BYPASS_TECHNIQUES' && 'Queries EDR-Telemetry GitHub project to identify detection blind spots for specific EDR products. (⚠️ LLM tool-calling unreliable)'}
                {selectedScenario === 'COLLECT_CALDERA_INFO' && 'Gathers Caldera operation metadata including operation ID and agent PAW identifier.'}
                {selectedScenario === 'TTP_REPORT_TO_TECHNIQUES' && 'Extracts MITRE ATT&CK technique IDs from threat intelligence reports. (⚠️ LLM tool-calling unreliable)'}
                {selectedScenario === 'HELLO_CALDERA' && 'Displays a message box on the target system using PowerShell via Caldera.'}
                {selectedScenario === 'TTP_REPORT_TO_ADVERSARY_PROFILE' && 'Creates Caldera adversary profile from threat reports with matched abilities.'}
              </p>

              {/* Info box for working scenarios */}
              <div className="mt-4 p-3 bg-cyber-blue/10 border border-cyber-blue/30 rounded-lg">
                <p className="text-xs text-cyan-400">
                  <strong>ℹ️ Status Note:</strong> Only scenarios marked "✓ Verified Working" produce reliable results. 
                  Experimental scenarios may have LLM tool-calling issues or require Caldera C2 infrastructure setup.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scenario Results Viewer */}
      {scenarioResults[selectedScenario] && (
        <div className="bg-cyber-dark border border-cyber-green/30 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-cyber-green">
              📊 Scenario Results: {SCENARIOS.find(s => s.id === selectedScenario)?.name}
            </h2>
            <div className="flex items-center gap-2">
              <StatusBadge status={scenarioResults[selectedScenario].status} />
              {scenarioResults[selectedScenario].completed_at && (
                <span className="text-xs text-gray-500">
                  {new Date(scenarioResults[selectedScenario].completed_at).toLocaleTimeString()}
                </span>
              )}
            </div>
          </div>
          
          {scenarioResults[selectedScenario].status === 'running' && (
            <div className="flex items-center gap-3 text-cyber-blue">
              <div className="animate-spin h-5 w-5 border-2 border-cyber-blue border-t-transparent rounded-full"></div>
              <span>Executing scenario... Please wait.</span>
            </div>
          )}

          {scenarioResults[selectedScenario].status === 'completed' && (
            <div className="space-y-3">
              {/* Key Output Extracted */}
              <div className="bg-gradient-to-br from-cyber-green/10 to-cyber-blue/10 rounded-lg p-4 border border-cyber-green/30">
                <h3 className="text-cyber-green font-semibold mb-2 flex items-center gap-2">
                  <span>✨</span> Result:
                </h3>
                <div className="text-white text-base leading-relaxed whitespace-pre-wrap">
                  {extractScenarioOutput(scenarioResults[selectedScenario].output, selectedScenario)}
                </div>
              </div>
              
              {/* Full Raw Output - Collapsible */}
              <details className="bg-black/40 rounded-lg border border-cyber-green/20">
                <summary className="cursor-pointer p-3 text-sm text-gray-400 hover:text-gray-300">
                  📋 Show Full Output
                </summary>
                <pre className="text-xs text-gray-400 whitespace-pre-wrap font-mono p-4 overflow-x-auto max-h-64 overflow-y-auto border-t border-cyber-green/10">
                  {scenarioResults[selectedScenario].output || 'No output available'}
                </pre>
              </details>
            </div>
          )}

          {(scenarioResults[selectedScenario].status === 'failed' || scenarioResults[selectedScenario].status === 'timeout') && (
            <div className="bg-cyber-red/10 border border-cyber-red/30 rounded-lg p-4">
              <p className="text-cyber-red font-semibold mb-2">❌ Scenario Failed</p>
              {scenarioResults[selectedScenario].error && (
                <pre className="text-sm text-gray-400 whitespace-pre-wrap">
                  {scenarioResults[selectedScenario].error}
                </pre>
              )}
            </div>
          )}

          <button
            onClick={() => setScenarioResults(prev => {
              const newResults = { ...prev };
              delete newResults[selectedScenario];
              return newResults;
            })}
            className="mt-4 px-4 py-2 bg-gray-700/50 text-gray-400 rounded-lg text-sm hover:bg-gray-700 transition-all"
          >
            Clear Results
          </button>
        </div>
      )}

      {/* Pipeline Visualization */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
        <h2 className="text-xl font-bold text-cyber-blue mb-6">Pipeline Status</h2>
        {pipelineStatus && <PipelineStepper stages={pipelineStatus.stages} />}
      </div>

      {/* Server Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">HTTP Server</span>
            <StatusBadge status={status?.serverStatus?.http === 'online' ? 'operational' : 'error'} />
          </div>
          <p className="text-xs text-gray-500">Port: 8000</p>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">FTP Server</span>
            <StatusBadge status={status?.serverStatus?.ftp === 'online' ? 'operational' : 'error'} />
          </div>
          <p className="text-xs text-gray-500">Port: 2121</p>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-gray-400">Database</span>
            <StatusBadge status={status?.serverStatus?.database === 'online' ? 'operational' : 'error'} />
          </div>
          <p className="text-xs text-gray-500">MongoDB</p>
        </div>
      </div>

      {/* System Metrics */}
      {systemHealth?.metrics && (
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-cyber-blue mb-4">System Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">CPU Usage</span>
                <span className="text-cyber-blue font-bold">{systemHealth.metrics.cpuUsage}%</span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2">
                <div 
                  className="bg-cyber-blue h-full rounded-full transition-all"
                  style={{ width: `${systemHealth.metrics.cpuUsage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Memory Usage</span>
                <span className="text-cyber-green font-bold">{systemHealth.metrics.memoryUsage}%</span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2">
                <div 
                  className="bg-cyber-green h-full rounded-full transition-all"
                  style={{ width: `${systemHealth.metrics.memoryUsage}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Disk Usage</span>
                <span className="text-cyber-purple font-bold">{systemHealth.metrics.diskUsage}%</span>
              </div>
              <div className="w-full bg-gray-700/20 rounded-full h-2">
                <div 
                  className="bg-cyber-purple h-full rounded-full transition-all"
                  style={{ width: `${systemHealth.metrics.diskUsage}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
