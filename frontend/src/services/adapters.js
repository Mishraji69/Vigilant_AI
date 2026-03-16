/**
 * Data Adapters
 * Transform backend API responses into frontend data structures
 */

/**
 * Adapt backend agent data to frontend format
 */
export const adaptAgent = (backendAgent) => {
  return {
    id: backendAgent.id,
    name: backendAgent.name,
    role: backendAgent.role,
    status: backendAgent.status || 'idle',
    lastUpdated: backendAgent.lastUpdated || backendAgent.last_updated || new Date().toISOString(),
    description: backendAgent.description || '',
    capabilities: backendAgent.capabilities || [],
    lastActivity: backendAgent.lastActivity || backendAgent.last_activity || null
  };
};

/**
 * Adapt backend log entry to frontend format
 */
export const adaptLog = (backendLog) => {
  // Extract agent name from request messages if available
  let agentName = 'System';
  let message = 'Processing...';
  let level = 'INFO';

  try {
    if (backendLog.request && typeof backendLog.request === 'object') {
      const messages = backendLog.request.messages || [];
      if (messages.length > 0) {
        message = messages[0].content || message;
      }
    } else if (typeof backendLog.request === 'string') {
      const parsed = JSON.parse(backendLog.request);
      const messages = parsed.messages || [];
      if (messages.length > 0) {
        message = messages[0].content || message;
      }
    }

    // Determine log level based on response or cost
    if (backendLog.cost > 0.1) {
      level = 'WARN';
    }
    if (backendLog.response) {
      const response = typeof backendLog.response === 'string' 
        ? JSON.parse(backendLog.response) 
        : backendLog.response;
      
      if (response.error) {
        level = 'ERROR';
      }
    }
  } catch (e) {
    // Use defaults if parsing fails
  }

  return {
    id: backendLog.id,
    timestamp: backendLog.start_time || backendLog.end_time || new Date().toISOString(),
    level: level,
    agent: agentName,
    message: message.substring(0, 200) + (message.length > 200 ? '...' : ''),
    fullData: backendLog // Keep original data for detailed view
  };
};

/**
 * Adapt backend artifact to frontend format
 */
export const adaptArtifact = (backendArtifact) => {
  return {
    id: backendArtifact.id || backendArtifact.path,
    name: backendArtifact.name,
    type: backendArtifact.type || 'file',
    path: backendArtifact.path,
    size: backendArtifact.size || 0,
    modified: backendArtifact.modified || backendArtifact.created || new Date().toISOString(),
    created: backendArtifact.created || backendArtifact.modified || new Date().toISOString()
  };
};

/**
 * Build artifact tree structure from flat list
 */
export const buildArtifactTree = (artifacts) => {
  const root = {
    name: 'llm_working_folder',
    type: 'directory',
    children: []
  };

  const folderMap = {
    'llm_working_folder': root
  };

  // Sort artifacts by path depth
  const sorted = [...artifacts].sort((a, b) => {
    const aDepth = a.path.split('/').length;
    const bDepth = b.path.split('/').length;
    return aDepth - bDepth;
  });

  sorted.forEach(artifact => {
    const pathParts = artifact.path.split('/');
    const fileName = pathParts[pathParts.length - 1];
    const parentPath = pathParts.slice(0, -1).join('/') || 'llm_working_folder';

    // Ensure parent folder exists
    let currentPath = '';
    pathParts.slice(0, -1).forEach(part => {
      const parentKey = currentPath || 'llm_working_folder';
      currentPath = currentPath ? `${currentPath}/${part}` : part;

      if (!folderMap[currentPath]) {
        const folderNode = {
          name: part,
          type: 'directory',
          children: []
        };
        folderMap[currentPath] = folderNode;
        folderMap[parentKey].children.push(folderNode);
      }
    });

    // Add file to parent
    const fileNode = {
      name: fileName,
      type: 'file',
      size: artifact.size,
      modified: artifact.modified,
      path: artifact.path
    };

    if (folderMap[parentPath]) {
      folderMap[parentPath].children.push(fileNode);
    }
  });

  return root;
};

/**
 * Adapt backend scenario to frontend format
 */
export const adaptScenario = (backendScenario) => {
  return {
    id: backendScenario.id,
    name: backendScenario.name,
    description: backendScenario.description || 'No description available',
    status: backendScenario.status || 'idle',
    agents: backendScenario.agents || [],
    stepCount: backendScenario.stepCount || backendScenario.step_count || 0,
    progress: backendScenario.progress || 0
  };
};

/**
 * Adapt coordinator status to frontend format
 */
export const adaptCoordinatorStatus = (backendStatus) => {
  return {
    state: backendStatus.status === 'active' ? 'running' : 'idle',
    status: backendStatus.status || 'unknown',
    activeScenarios: backendStatus.activeScenarios || backendStatus.active_scenarios || 0,
    totalScenarios: backendStatus.totalScenarios || backendStatus.total_scenarios || 0,
    activeAgents: backendStatus.activeAgents || backendStatus.activeScenarios || 0,
    completedTasks: backendStatus.completedTasks || 0,
    pendingTasks: backendStatus.pendingTasks || 0,
    currentScenario: backendStatus.currentScenario || null,
    uptime: backendStatus.uptime || 'unknown',
    lastUpdated: new Date().toISOString(),
    serverStatus: backendStatus.serverStatus || {
      http: 'online',
      ftp: 'online', 
      database: 'online'
    }
  };
};

/**
 * Adapt log statistics to frontend format
 */
export const adaptLogStats = (backendStats) => {
  return {
    totalLogs: backendStats.total_logs || 0,
    totalCost: backendStats.total_cost || 0,
    totalSessions: backendStats.total_sessions || backendStats.session_count || 0,
    averageCost: backendStats.total_logs > 0 
      ? (backendStats.total_cost / backendStats.total_logs).toFixed(4)
      : 0
  };
};

/**
 * Format bytes to human readable size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
};

/**
 * Format timestamp to relative time
 */
export const formatRelativeTime = (timestamp) => {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now - then;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
};
