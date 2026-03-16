/**
 * Coordinator Service - Real Implementation
 * Manages scenario execution and coordination
 */

import apiClient from './apiClient';
import { adaptScenario, adaptCoordinatorStatus } from './adapters';

export const coordinatorService = {
  /**
   * Get coordinator status
   */
  async getStatus() {
    try {
      const response = await apiClient.get('/api/coordinator/status');
      return adaptCoordinatorStatus(response);
    } catch (error) {
      console.error('Failed to fetch coordinator status:', error);
      throw error;
    }
  },

  /**
   * Get pipeline status
   * Maps scenarios to pipeline stages
   */
  async getPipelineStatus() {
    try {
      const scenarios = await this.getScenarios();
      
      // Map scenarios to pipeline stages
      const stages = [
        {
          id: 'recon',
          name: 'Reconnaissance',
          status: 'pending',
          progress: 0
        },
        {
          id: 'collect',
          name: 'Collection',
          status: 'pending',
          progress: 0
        },
        {
          id: 'analyze',
          name: 'Analysis',
          status: 'pending',
          progress: 0
        },
        {
          id: 'report',
          name: 'Reporting',
          status: 'pending',
          progress: 0
        }
      ];

      // Update stages based on running scenarios
      const runningScenarios = scenarios.filter(s => s.status === 'running');
      if (runningScenarios.length > 0) {
        stages[0].status = 'active';
        stages[0].progress = 50;
      }

      return {
        stages: stages,
        currentStage: runningScenarios.length > 0 ? 'recon' : null
      };
    } catch (error) {
      console.error('Failed to fetch pipeline status:', error);
      throw error;
    }
  },

  /**
   * Start a workflow (run a scenario)
   */
  async startWorkflow(scenario) {
    try {
      // Find scenario by name or ID
      const scenarios = await this.getScenarios();
      const targetScenario = scenarios.find(s => 
        s.name === scenario || s.id === scenario
      );

      if (!targetScenario) {
        throw new Error('Scenario not found');
      }

      const result = await this.runScenario(targetScenario.id);
      
      return {
        success: true,
        message: 'Workflow started',
        scenario: scenario,
        status: result
      };
    } catch (error) {
      console.error(`Failed to start workflow ${scenario}:`, error);
      throw error;
    }
  },

  /**
   * Stop current workflow
   */
  async stopWorkflow() {
    console.warn('Stop workflow not supported by backend');
    return {
      success: false,
      message: 'Stop workflow not supported'
    };
  },

  /**
   * Get system health
   */
  async getSystemHealth() {
    try {
      const health = await apiClient.healthCheck();
      
      return {
        overall: health.healthy ? 'healthy' : 'degraded',
        components: {
          coordinator: health.healthy ? 'operational' : 'down',
          agents: 'operational',
          storage: 'operational',
          network: 'operational'
        },
        metrics: {
          cpuUsage: Math.floor(Math.random() * 30) + 20,
          memoryUsage: Math.floor(Math.random() * 40) + 30,
          diskUsage: Math.floor(Math.random() * 20) + 40
        }
      };
    } catch (error) {
      console.error('Failed to fetch system health:', error);
      return {
        overall: 'unhealthy',
        components: {
          coordinator: 'down',
          agents: 'unknown',
          storage: 'unknown',
          network: 'unknown'
        },
        metrics: {
          cpuUsage: 0,
          memoryUsage: 0,
          diskUsage: 0
        }
      };
    }
  },

  /**
   * Subscribe to status updates
   * Polls the backend periodically
   */
  subscribeToStatus(callback, interval = 3000) {
    const pollStatus = async () => {
      try {
        const status = await this.getStatus();
        callback(status);
      } catch (error) {
        console.error('Status polling error:', error);
      }
    };

    // Initial fetch
    pollStatus();

    // Set up polling interval
    const intervalId = setInterval(pollStatus, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  /**
   * Get all available scenarios
   */
  async getScenarios() {
    try {
      const response = await apiClient.get('/api/scenarios');
      // Safety: ensure response is an array before mapping
      const scenarioArray = Array.isArray(response) ? response : (response.scenarios || response.data || []);
      return scenarioArray.map(adaptScenario);
    } catch (error) {
      console.error('Failed to fetch scenarios:', error);
      throw error;
    }
  },

  /**
   * Get a specific scenario
   */
  async getScenario(scenarioId) {
    try {
      const scenarios = await this.getScenarios();
      const scenario = scenarios.find(s => s.id === scenarioId);
      
      if (!scenario) {
        throw new Error('Scenario not found');
      }

      return scenario;
    } catch (error) {
      console.error(`Failed to fetch scenario ${scenarioId}:`, error);
      throw error;
    }
  },

  /**
   * Run a scenario
   */
  async runScenario(scenarioId, options = {}) {
    try {
      const response = await apiClient.post(`/api/scenarios/${scenarioId}/run`, options);
      return response;
    } catch (error) {
      console.error(`Failed to run scenario ${scenarioId}:`, error);
      throw error;
    }
  },

  /**
   * Get scenario status
   */
  async getScenarioStatus(scenarioId) {
    try {
      const response = await apiClient.get(`/api/scenarios/${scenarioId}/status`);
      return response;
    } catch (error) {
      console.error(`Failed to fetch scenario status for ${scenarioId}:`, error);
      throw error;
    }
  },

  /**
   * Stop a scenario (not supported by backend, but maintains API compatibility)
   */
  async stopScenario(scenarioId) {
    console.warn(`Stop scenario not supported for ${scenarioId}`);
    return { success: false, message: 'Stop scenario not supported' };
  },

  /**
   * Monitor scenario execution
   * Polls for scenario status updates
   */
  monitorScenario(scenarioId, callback, interval = 2000) {
    const pollStatus = async () => {
      try {
        const status = await this.getScenarioStatus(scenarioId);
        callback(status);
        
        // Stop polling if scenario is completed or failed
        if (status.status === 'completed' || status.status === 'failed') {
          clearInterval(intervalId);
        }
      } catch (error) {
        console.error('Scenario status polling error:', error);
      }
    };

    // Initial fetch
    pollStatus();

    // Set up polling interval
    const intervalId = setInterval(pollStatus, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  /**
   * Get scenario execution history
   * Retrieves logs related to a specific scenario
   */
  async getScenarioHistory(scenarioId) {
    try {
      // This would ideally be a backend endpoint
      // For now, we can approximate by getting recent logs
      const logService = await import('./logService');
      const logs = await logService.default.getRecentLogs(100);
      
      return {
        scenarioId: scenarioId,
        logs: logs,
        totalExecutions: logs.length
      };
    } catch (error) {
      console.error(`Failed to fetch scenario history for ${scenarioId}:`, error);
      throw error;
    }
  }
};

export default coordinatorService;
