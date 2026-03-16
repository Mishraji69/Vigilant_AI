import { mockCoordinatorStatus } from '../mock/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const pipelineStages = ['recon', 'collect', 'analyze', 'report'];

export const mockCoordinatorService = {
  // Get coordinator status
  async getStatus() {
    await delay(200);
    return { ...mockCoordinatorStatus };
  },

  // Get pipeline status
  async getPipelineStatus() {
    await delay(150);
    
    const currentStageIndex = pipelineStages.indexOf(mockCoordinatorStatus.pipelineStage);
    
    return {
      stages: [
        {
          id: 'recon',
          name: 'Reconnaissance',
          status: currentStageIndex >= 0 ? 'completed' : 'pending',
          progress: currentStageIndex >= 0 ? 100 : 0
        },
        {
          id: 'collect',
          name: 'Collection',
          status: currentStageIndex >= 1 ? 'completed' : currentStageIndex === 0 ? 'active' : 'pending',
          progress: currentStageIndex === 1 ? 100 : currentStageIndex > 1 ? 100 : 0
        },
        {
          id: 'analyze',
          name: 'Analysis',
          status: currentStageIndex >= 2 ? 'completed' : currentStageIndex === 1 ? 'active' : 'pending',
          progress: currentStageIndex === 2 ? 75 : currentStageIndex > 2 ? 100 : 0
        },
        {
          id: 'report',
          name: 'Reporting',
          status: currentStageIndex >= 3 ? 'completed' : currentStageIndex === 2 ? 'active' : 'pending',
          progress: currentStageIndex === 3 ? 100 : 0
        }
      ],
      currentStage: mockCoordinatorStatus.pipelineStage
    };
  },

  // Start a new workflow
  async startWorkflow(scenario) {
    await delay(500);
    
    mockCoordinatorStatus.currentScenario = scenario;
    mockCoordinatorStatus.pipelineStage = 'recon';
    mockCoordinatorStatus.activeAgents = 1;
    
    return {
      success: true,
      message: 'Workflow started',
      scenario: scenario,
      status: { ...mockCoordinatorStatus }
    };
  },

  // Stop current workflow
  async stopWorkflow() {
    await delay(400);
    
    mockCoordinatorStatus.activeAgents = 0;
    
    return {
      success: true,
      message: 'Workflow stopped'
    };
  },

  // Get system health
  async getSystemHealth() {
    await delay(150);
    
    return {
      overall: 'healthy',
      components: {
        coordinator: 'operational',
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
  },

  // Subscribe to status updates
  subscribeToStatus(callback, interval = 3000) {
    const intervalId = setInterval(async () => {
      // Simulate random changes
      if (Math.random() > 0.7) {
        mockCoordinatorStatus.activeAgents = Math.floor(Math.random() * 3) + 1;
      }
      
      if (Math.random() > 0.8) {
        const currentIndex = pipelineStages.indexOf(mockCoordinatorStatus.pipelineStage);
        if (currentIndex < pipelineStages.length - 1) {
          mockCoordinatorStatus.pipelineStage = pipelineStages[currentIndex + 1];
        }
      }
      
      callback({ ...mockCoordinatorStatus });
    }, interval);

    return () => clearInterval(intervalId);
  }
};
