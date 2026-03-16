import { mockLogs } from '../mock/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Generate random log messages
const logTemplates = [
  { level: 'INFO', agent: 'Coordinator', messages: ['System check completed', 'Heartbeat received from all agents', 'Configuration updated'] },
  { level: 'INFO', agent: 'Recon Agent', messages: ['Scanning network segment', 'Host discovery in progress', 'Service enumeration completed'] },
  { level: 'INFO', agent: 'Collection Agent', messages: ['Collecting data points', 'Metadata extraction in progress', 'File indexing completed'] },
  { level: 'INFO', agent: 'Analysis Agent', messages: ['Processing vulnerability data', 'Risk assessment in progress', 'Threat analysis completed'] },
  { level: 'INFO', agent: 'Reporting Agent', messages: ['Compiling report data', 'Generating visualizations', 'Export preparation completed'] },
  { level: 'WARN', agent: 'Recon Agent', messages: ['Target timeout detected', 'Retrying connection', 'Slow response detected'] },
  { level: 'WARN', agent: 'Collection Agent', messages: ['Rate limit approaching', 'Large file detected', 'Memory usage high'] },
  { level: 'ERROR', agent: 'Analysis Agent', messages: ['Database query failed', 'Connection timeout', 'Invalid data format detected'] }
];

let logIdCounter = mockLogs.length + 1;

const generateRandomLog = () => {
  const template = logTemplates[Math.floor(Math.random() * logTemplates.length)];
  const message = template.messages[Math.floor(Math.random() * template.messages.length)];
  
  return {
    id: logIdCounter++,
    timestamp: new Date().toISOString(),
    level: template.level,
    agent: template.agent,
    message: message
  };
};

export const mockLogService = {
  // Get all logs
  async getLogs(filters = {}) {
    await delay(200);
    let logs = [...mockLogs];
    
    // Apply level filter
    if (filters.level) {
      logs = logs.filter(log => log.level === filters.level);
    }
    
    // Apply agent filter
    if (filters.agent) {
      logs = logs.filter(log => log.agent === filters.agent);
    }
    
    // Apply limit
    if (filters.limit) {
      logs = logs.slice(-filters.limit);
    }
    
    return logs;
  },

  // Get recent logs
  async getRecentLogs(count = 50) {
    await delay(150);
    return mockLogs.slice(-count);
  },

  // Stream logs (simulation with callback)
  streamLogs(callback, interval = 2000) {
    // Initial logs
    callback([...mockLogs]);
    
    // Stream new logs periodically
    const intervalId = setInterval(() => {
      const newLog = generateRandomLog();
      mockLogs.push(newLog);
      
      // Keep only last 100 logs in memory
      if (mockLogs.length > 100) {
        mockLogs.shift();
      }
      
      callback([...mockLogs]);
    }, interval);

    // Return cleanup function
    return () => clearInterval(intervalId);
  },

  // Filter logs by level
  async filterByLevel(level) {
    await delay(100);
    return mockLogs.filter(log => log.level === level);
  },

  // Filter logs by agent
  async filterByAgent(agentName) {
    await delay(100);
    return mockLogs.filter(log => log.agent === agentName);
  },

  // Clear logs (simulation)
  async clearLogs() {
    await delay(200);
    mockLogs.length = 0;
    return { success: true, message: 'Logs cleared' };
  }
};
