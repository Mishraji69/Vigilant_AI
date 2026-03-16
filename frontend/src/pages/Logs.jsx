import { useState } from 'react';
import { useLogs } from '../hooks/useLogs';
import LogViewer from '../components/LogViewer';

const Logs = () => {
  const [levelFilter, setLevelFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  
  const { logs, loading, error, clearLogs } = useLogs({
    level: levelFilter,
    agent: agentFilter
  });

  const uniqueAgents = [...new Set(logs.map(log => log.agent))];
  const logLevels = ['INFO', 'WARN', 'ERROR'];

  const levelCounts = {
    INFO: logs.filter(l => l.level === 'INFO').length,
    WARN: logs.filter(l => l.level === 'WARN').length,
    ERROR: logs.filter(l => l.level === 'ERROR').length
  };

  return (
    <div className="p-6 space-y-6 h-full flex flex-col">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyber-blue">Logs</h1>
        <p className="text-gray-400 mt-1">Real-time system and agent logs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Logs</p>
              <p className="text-3xl font-bold text-white">{logs.length}</p>
            </div>
            <span className="text-4xl">📋</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Info</p>
              <p className="text-3xl font-bold text-cyber-blue">{levelCounts.INFO}</p>
            </div>
            <span className="text-4xl">ℹ️</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Warnings</p>
              <p className="text-3xl font-bold text-yellow-400">{levelCounts.WARN}</p>
            </div>
            <span className="text-4xl">⚠️</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Errors</p>
              <p className="text-3xl font-bold text-cyber-red">{levelCounts.ERROR}</p>
            </div>
            <span className="text-4xl">❌</span>
          </div>
        </div>
      </div>

      {/* Filters and Controls */}
      <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[200px]">
            <label className="text-gray-400 text-sm mb-2 block">Filter by Level</label>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
            >
              <option value="">All Levels</option>
              {logLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="text-gray-400 text-sm mb-2 block">Filter by Agent</label>
            <select
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
              className="w-full bg-cyber-darker border border-cyber-blue/20 rounded px-3 py-2 text-white focus:outline-none focus:border-cyber-blue"
            >
              <option value="">All Agents</option>
              {uniqueAgents.map(agent => (
                <option key={agent} value={agent}>{agent}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearLogs}
              className="px-4 py-2 bg-cyber-red/20 text-cyber-red border border-cyber-red/40 rounded font-medium hover:bg-cyber-red/30 transition-all"
            >
              Clear Logs
            </button>
            <button
              onClick={() => {
                setLevelFilter('');
                setAgentFilter('');
              }}
              className="px-4 py-2 bg-gray-700/20 text-gray-300 border border-gray-600/40 rounded font-medium hover:bg-gray-700/30 transition-all"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Log Viewer */}
      <div className="flex-1 min-h-0">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-cyber-blue text-xl">Loading logs...</div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-cyber-red text-xl">Error: {error}</div>
          </div>
        ) : (
          <LogViewer logs={logs} autoScroll={true} />
        )}
      </div>
    </div>
  );
};

export default Logs;
