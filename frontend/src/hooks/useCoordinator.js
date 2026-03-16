import { useState, useEffect } from 'react';
import coordinatorService from '../services/coordinatorService';

export const useCoordinator = () => {
  const [status, setStatus] = useState(null);
  const [pipelineStatus, setPipelineStatus] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cleanup;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [statusData, pipelineData, healthData] = await Promise.all([
          coordinatorService.getStatus(),
          coordinatorService.getPipelineStatus(),
          coordinatorService.getSystemHealth()
        ]);
        
        setStatus(statusData);
        setPipelineStatus(pipelineData);
        setSystemHealth(healthData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Subscribe to status updates
    cleanup = coordinatorService.subscribeToStatus(async (updatedStatus) => {
      setStatus(updatedStatus);
      const pipelineData = await coordinatorService.getPipelineStatus();
      setPipelineStatus(pipelineData);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const startWorkflow = async (scenario) => {
    try {
      const result = await coordinatorService.startWorkflow(scenario);
      setStatus(result.status);
      const pipelineData = await coordinatorService.getPipelineStatus();
      setPipelineStatus(pipelineData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const stopWorkflow = async () => {
    try {
      const result = await coordinatorService.stopWorkflow();
      const statusData = await coordinatorService.getStatus();
      setStatus(statusData);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    status,
    pipelineStatus,
    systemHealth,
    loading,
    error,
    startWorkflow,
    stopWorkflow
  };
};
