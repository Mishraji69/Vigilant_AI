import { useEffect, useRef } from 'react';

const LogViewer = ({ logs, autoScroll = true }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, autoScroll]);

  const getLevelColor = (level) => {
    const colors = {
      INFO: 'text-cyber-blue',
      WARN: 'text-yellow-400',
      ERROR: 'text-cyber-red',
      DEBUG: 'text-gray-400'
    };
    return colors[level] || 'text-white';
  };

  const getLevelBg = (level) => {
    const colors = {
      INFO: 'bg-cyber-blue/10 border-cyber-blue/30',
      WARN: 'bg-yellow-500/10 border-yellow-500/30',
      ERROR: 'bg-cyber-red/10 border-cyber-red/30',
      DEBUG: 'bg-gray-500/10 border-gray-500/30'
    };
    return colors[level] || 'bg-gray-500/10 border-gray-500/30';
  };

  const formatTimestamp = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="bg-cyber-darker rounded-lg border border-cyber-blue/20 h-full flex flex-col">
      <div className="p-3 border-b border-cyber-blue/20 bg-cyber-dark">
        <h3 className="text-cyber-blue font-bold">Terminal Logs</h3>
        <p className="text-xs text-gray-400 mt-1">{logs.length} entries</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-thin font-mono text-sm">
        {logs.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No logs available
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-3 items-start">
              <span className="text-gray-500 text-xs whitespace-nowrap">
                {formatTimestamp(log.timestamp)}
              </span>
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getLevelBg(log.level)} ${getLevelColor(log.level)} whitespace-nowrap`}>
                {log.level}
              </span>
              <span className="text-gray-400 text-xs whitespace-nowrap">
                [{log.agent}]
              </span>
              <span className="text-white flex-1">
                {log.message}
              </span>
            </div>
          ))
        )}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default LogViewer;
