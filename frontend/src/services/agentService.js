/**
 * Agent Service - Real Implementation
 * Connects to Vigilant AI backend API
 */

import apiClient from './apiClient';
import { adaptAgent } from './adapters';

export const agentService = {
  /**
   * Get all agents
   */
  async getAgents() {
    try {
      const response = await apiClient.get('/api/agents');
      return response.map(adaptAgent);
    } catch (error) {
      console.error('Failed to fetch agents:', error);
      throw error;
    }
  },

  /**
   * Get a single agent by ID
   */
  async getAgent(agentId) {
    try {
      const response = await apiClient.get(`/api/agents/${agentId}`);
      return adaptAgent(response);
    } catch (error) {
      console.error(`Failed to fetch agent ${agentId}:`, error);
      throw error;
    }
  },

  /**
   * Start an agent (conceptual - triggers a scenario)
   * Since agents are always active in the backend, this is a no-op
   * but maintains API compatibility with mock service
   */
  async startAgent(agentId) {
    console.log(`Agent ${agentId} is always active in backend`);
    const agent = await this.getAgent(agentId);
    return {
      ...agent,
      status: 'active',
      lastActivity: new Date().toISOString()
    };
  },

  /**
   * Stop an agent (conceptual)
   * Maintains API compatibility with mock service
   */
  async stopAgent(agentId) {
    console.log(`Agent ${agentId} stop requested (conceptual)`);
    const agent = await this.getAgent(agentId);
    return {
      ...agent,
      status: 'idle',
      lastActivity: new Date().toISOString()
    };
  },

  /**
   * Get agent status
   */
  async getAgentStatus(agentId) {
    try {
      const agent = await this.getAgent(agentId);
      return agent;
    } catch (error) {
      console.error(`Failed to fetch agent status for ${agentId}:`, error);
      throw error;
    }
  },

  /**
   * Subscribe to agent updates
   * Polls the backend periodically for agent status changes
   */
  subscribeToAgentUpdates(callback, interval = 3000) {
    const pollAgents = async () => {
      try {
        const agents = await this.getAgents();
        callback(agents);
      } catch (error) {
        console.error('Agent polling error:', error);
      }
    };

    // Initial fetch
    pollAgents();

    // Set up polling interval
    const intervalId = setInterval(pollAgents, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  }
};

export default agentService;
