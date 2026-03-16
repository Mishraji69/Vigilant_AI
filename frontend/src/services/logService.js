/**
 * Log Service - Real Implementation
 * Connects to Vigilant AI backend logging API
 */

import apiClient from './apiClient';
import { adaptLog, adaptLogStats } from './adapters';

export const logService = {
  /**
   * Get all logs with optional filters
   */
  async getLogs(filters = {}) {
    try {
      const params = {};
      
      if (filters.level) params.level = filters.level;
      if (filters.agent) params.agent = filters.agent;
      if (filters.limit) params.limit = filters.limit;

      const response = await apiClient.get('/api/logs', params);
      const logs = response.logs || [];
      
      return logs.map(adaptLog);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      throw error;
    }
  },

  /**
   * Get recent logs
   */
  async getRecentLogs(count = 50) {
    try {
      const response = await apiClient.get('/api/logs', { limit: count });
      const logs = response.logs || [];
      
      return logs.map(adaptLog);
    } catch (error) {
      console.error('Failed to fetch recent logs:', error);
      throw error;
    }
  },

  /**
   * Get log statistics
   */
  async getLogStats() {
    try {
      const response = await apiClient.get('/api/logs/stats');
      return adaptLogStats(response);
    } catch (error) {
      console.error('Failed to fetch log stats:', error);
      throw error;
    }
  },

  /**
   * Stream logs (polls backend periodically)
   */
  streamLogs(callback, interval = 2000) {
    const pollLogs = async () => {
      try {
        const logs = await this.getLogs({ limit: 100 });
        callback(logs);
      } catch (error) {
        console.error('Log polling error:', error);
      }
    };

    // Initial fetch
    pollLogs();

    // Set up polling interval
    const intervalId = setInterval(pollLogs, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  /**
   * Filter logs by level
   */
  async filterByLevel(level) {
    try {
      return await this.getLogs({ level });
    } catch (error) {
      console.error(`Failed to filter logs by level ${level}:`, error);
      throw error;
    }
  },

  /**
   * Filter logs by agent
   */
  async filterByAgent(agentName) {
    try {
      return await this.getLogs({ agent: agentName });
    } catch (error) {
      console.error(`Failed to filter logs by agent ${agentName}:`, error);
      throw error;
    }
  },

  /**
   * Clear logs
   * Note: Backend doesn't support this, so this is a no-op
   * maintaining API compatibility
   */
  async clearLogs() {
    console.warn('Clear logs not supported by backend');
    return { success: false, message: 'Clear logs not supported' };
  },

  /**
   * Export logs to JSON
   */
  async exportLogs(filters = {}) {
    try {
      const logs = await this.getLogs({ ...filters, limit: 10000 });
      const dataStr = JSON.stringify(logs, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = window.URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `vigilant-ai-logs-${new Date().toISOString()}.json`;
      link.click();
      window.URL.revokeObjectURL(url);
      
      return { success: true, message: 'Logs exported' };
    } catch (error) {
      console.error('Failed to export logs:', error);
      throw error;
    }
  }
};

export default logService;
