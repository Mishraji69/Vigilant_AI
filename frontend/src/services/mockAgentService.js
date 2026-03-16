import { mockAgents } from '../mock/mockData';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Random status changes for simulation
const randomStatus = () => {
  const statuses = ['idle', 'running', 'completed', 'error'];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

export const mockAgentService = {
  // Get all agents
  async getAgents() {
    await delay(300);
    return [...mockAgents];
  },

  // Get a single agent by ID
  async getAgent(agentId) {
    await delay(200);
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    return { ...agent };
  },

  // Start an agent (simulated)
  async startAgent(agentId) {
    await delay(500);
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    
    return {
      ...agent,
      status: 'running',
      lastActivity: new Date().toISOString()
    };
  },

  // Stop an agent (simulated)
  async stopAgent(agentId) {
    await delay(400);
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    
    return {
      ...agent,
      status: 'idle',
      lastActivity: new Date().toISOString()
    };
  },

  // Get agent status with random changes for simulation
  async getAgentStatus(agentId) {
    await delay(150);
    const agent = mockAgents.find(a => a.id === agentId);
    if (!agent) throw new Error('Agent not found');
    
    // Sometimes return a different status to simulate activity
    const shouldChange = Math.random() > 0.7;
    return {
      ...agent,
      status: shouldChange ? randomStatus() : agent.status,
      lastActivity: new Date().toISOString()
    };
  },

  // Subscribe to agent updates (simulation with callback)
  subscribeToAgentUpdates(callback, interval = 3000) {
    const intervalId = setInterval(async () => {
      const agents = await this.getAgents();
      // Randomly update some agent statuses
      const updatedAgents = agents.map(agent => ({
        ...agent,
        status: Math.random() > 0.8 ? randomStatus() : agent.status,
        lastActivity: new Date().toISOString()
      }));
      callback(updatedAgents);
    }, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
};
