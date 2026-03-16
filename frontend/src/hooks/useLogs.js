import { useState, useEffect } from 'react';
import logService from '../services/logService';

export const useLogs = (filters = {}) => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cleanup;

    const fetchLogs = async () => {
      try {
        setLoading(true);
        const data = await logService.getLogs(filters);
        setLogs(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();

    // Stream logs in real-time
    cleanup = logService.streamLogs((updatedLogs) => {
      // Apply filters to streaming logs
      let filteredLogs = updatedLogs;
      
      if (filters.level) {
        filteredLogs = filteredLogs.filter(log => log.level === filters.level);
      }
      
      if (filters.agent) {
        filteredLogs = filteredLogs.filter(log => log.agent === filters.agent);
      }
      
      setLogs(filteredLogs);
    });

    return () => {
      if (cleanup) cleanup();
    };
  }, [filters.level, filters.agent]);

  const clearLogs = async () => {
    try {
      await logService.clearLogs();
      setLogs([]);
    } catch (err) {
      setError(err.message);
    }
  };

  return {
    logs,
    loading,
    error,
    clearLogs
  };
};
