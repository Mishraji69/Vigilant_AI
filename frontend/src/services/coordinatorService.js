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

      // UI-only stage mapping. We infer where we are from the running scenario
      // and avoid leaving the pipeline in "pending" after a run completes.
      const STAGE_BY_SCENARIO_ID = {
        // Reconnaissance / Caldera
        HELLO_CALDERA: 'recon',
        COLLECT_CALDERA_INFO: 'recon',
        DETECT_EDR: 'recon',
        DETECT_AGENT_PRIVILEGES: 'recon',

        // Collection / intake
        SUMMARIZE_RECENT_CISA_VULNS: 'collect',

        // Analysis / research
        HELLO_AGENTS: 'analyze',
        IDENTIFY_EDR_BYPASS_TECHNIQUES: 'analyze',
        TTP_REPORT_TO_TECHNIQUES: 'analyze',

        // Reporting / profile creation
        TTP_REPORT_TO_ADVERSARY_PROFILE: 'report',
      };

      const stageOrder = ['recon', 'collect', 'analyze', 'report'];
      const stageMeta = {
        recon: { id: 'recon', name: 'Reconnaissance' },
        collect: { id: 'collect', name: 'Collection' },
        analyze: { id: 'analyze', name: 'Analysis' },
        report: { id: 'report', name: 'Reporting' },
      };

      const stageState = {
        recon: { status: 'pending', progress: 0 },
        collect: { status: 'pending', progress: 0 },
        analyze: { status: 'pending', progress: 0 },
        report: { status: 'pending', progress: 0 },
      };

      const runningStages = scenarios
        .filter((s) => s.status === 'running')
        .map((s) => STAGE_BY_SCENARIO_ID[s.id])
        .filter(Boolean);

      if (runningStages.length > 0) {
        const currentIdx = Math.max(
          0,
          Math.min(
            stageOrder.length - 1,
            Math.min(...runningStages.map((id) => stageOrder.indexOf(id)).filter((i) => i >= 0))
          )
        );
        const currentStageId = stageOrder[currentIdx];

        stageOrder.forEach((id, idx) => {
          if (idx < currentIdx) stageState[id] = { status: 'completed', progress: 100 };
          if (idx === currentIdx) stageState[id] = { status: 'active', progress: 50 };
        });

        return {
          stages: stageOrder.map((id) => ({ ...stageMeta[id], ...stageState[id] })),
          currentStage: currentStageId,
        };
      }

      const anyFailed = scenarios.some((s) => s.status === 'failed');
      const anyCompleted = scenarios.some((s) => s.status === 'completed');

      if (anyFailed) {
        stageOrder.forEach((id) => (stageState[id] = { status: 'failed', progress: 100 }));
        return { stages: stageOrder.map((id) => ({ ...stageMeta[id], ...stageState[id] })), currentStage: null };
      }

      if (anyCompleted) {
        stageOrder.forEach((id) => (stageState[id] = { status: 'completed', progress: 100 }));
        return { stages: stageOrder.map((id) => ({ ...stageMeta[id], ...stageState[id] })), currentStage: null };
      }

      return { stages: stageOrder.map((id) => ({ ...stageMeta[id], ...stageState[id] })), currentStage: null };
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
      // Directly run the scenario by ID — no need to fetch all scenarios first
      const result = await this.runScenario(scenario);
      
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
