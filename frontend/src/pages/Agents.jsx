import { useAgents } from '../hooks/useAgents';
import AgentCard from '../components/AgentCard';

const Agents = () => {
  const { agents, loading, error, startAgent, stopAgent } = useAgents();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-blue text-xl">Loading agents...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-red text-xl">Error: {error}</div>
      </div>
    );
  }

  const activeAgents = agents.filter(a => a.status === 'running').length;
  const idleAgents = agents.filter(a => a.status === 'idle').length;
  const completedAgents = agents.filter(a => a.status === 'completed').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyber-blue">Agents</h1>
        <p className="text-gray-400 mt-1">Manage and monitor AI agents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Agents</p>
              <p className="text-3xl font-bold text-white">{agents.length}</p>
            </div>
            <span className="text-4xl">🤖</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Active</p>
              <p className="text-3xl font-bold text-cyber-blue">{activeAgents}</p>
            </div>
            <span className="text-4xl">⚡</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Idle</p>
              <p className="text-3xl font-bold text-gray-400">{idleAgents}</p>
            </div>
            <span className="text-4xl">💤</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Completed</p>
              <p className="text-3xl font-bold text-cyber-green">{completedAgents}</p>
            </div>
            <span className="text-4xl">✅</span>
          </div>
        </div>
      </div>

      {/* Agent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map(agent => (
          <AgentCard
            key={agent.id}
            agent={agent}
            onStart={startAgent}
            onStop={stopAgent}
          />
        ))}
      </div>

      {/* No agents message */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">No agents available</p>
        </div>
      )}
    </div>
  );
};

export default Agents;
