import { useState, useEffect } from 'react';
import agentService from '../services/agentService';

export const useAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cleanup;

    const fetchAgents = async () => {
      try {
        setLoading(true);
        const data = await agentService.getAgents();
        setAgents(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();

    // Subscribe to real-time updates
    cleanup = agentService.subscribeToAgentUpdates((updatedAgents) => {
      setAgents(updatedAgents);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, []);

  const startAgent = async (agentId) => {
    try {
      const updatedAgent = await agentService.startAgent(agentId);
      setAgents(prev => prev.map(a => a.id === agentId ? updatedAgent : a));
      return updatedAgent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const stopAgent = async (agentId) => {
    try {
      const updatedAgent = await agentService.stopAgent(agentId);
      setAgents(prev => prev.map(a => a.id === agentId ? updatedAgent : a));
      return updatedAgent;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  return {
    agents,
    loading,
    error,
    startAgent,
    stopAgent
  };
};
