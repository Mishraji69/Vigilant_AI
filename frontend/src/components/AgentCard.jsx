import { useState } from 'react';
import StatusBadge from './StatusBadge';

const AgentCard = ({ agent, onStart, onStop }) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = async () => {
    if (agent.status === 'running') {
      await onStop(agent.id);
    } else {
      await onStart(agent.id);
    }
  };

  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString();
  };

  return (
    <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4 hover:border-cyber-blue/40 transition-all">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-bold text-cyber-blue">{agent.name}</h3>
            <StatusBadge status={agent.status} />
          </div>
          <p className="text-sm text-gray-400">{agent.description}</p>
          <p className="text-xs text-gray-500 mt-1">ID: {agent.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-3 text-sm">
        <div className="bg-cyber-darker p-2 rounded">
          <span className="text-gray-400">Type:</span>
          <span className="text-white ml-2 font-medium">{agent.type}</span>
        </div>
        <div className="bg-cyber-darker p-2 rounded">
          <span className="text-gray-400">Tasks:</span>
          <span className="text-cyber-green ml-2 font-bold">{agent.tasksCompleted}</span>
        </div>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Last activity: {formatTime(agent.lastActivity)}
      </div>

      {expanded && (
        <div className="mb-3 p-3 bg-cyber-darker rounded border border-cyber-blue/20">
          <p className="text-xs text-gray-400 mb-2">Capabilities:</p>
          <div className="flex flex-wrap gap-2">
            {agent.capabilities.map((cap, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-cyber-blue/10 text-cyber-blue text-xs rounded border border-cyber-blue/30"
              >
                {cap}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleToggle}
          className={`flex-1 px-4 py-2 rounded font-medium text-sm transition-all ${
            agent.status === 'running'
              ? 'bg-cyber-red/20 text-cyber-red border border-cyber-red/40 hover:bg-cyber-red/30'
              : 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 hover:bg-cyber-blue/30'
          }`}
        >
          {agent.status === 'running' ? '⏸ Stop' : '▶ Start'}
        </button>
        <button
          onClick={() => setExpanded(!expanded)}
          className="px-4 py-2 bg-gray-700/20 text-gray-300 border border-gray-600/40 rounded font-medium text-sm hover:bg-gray-700/30 transition-all"
        >
          {expanded ? '▲' : '▼'}
        </button>
      </div>
    </div>
  );
};

export default AgentCard;
