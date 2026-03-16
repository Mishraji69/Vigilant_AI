const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    const configs = {
      idle: {
        bg: 'bg-gray-500/20',
        text: 'text-gray-400',
        border: 'border-gray-500/40',
        icon: '⚫'
      },
      running: {
        bg: 'bg-cyber-blue/20',
        text: 'text-cyber-blue',
        border: 'border-cyber-blue/40',
        icon: '🔵'
      },
      completed: {
        bg: 'bg-cyber-green/20',
        text: 'text-cyber-green',
        border: 'border-cyber-green/40',
        icon: '✅'
      },
      error: {
        bg: 'bg-cyber-red/20',
        text: 'text-cyber-red',
        border: 'border-cyber-red/40',
        icon: '❌'
      },
      operational: {
        bg: 'bg-cyber-green/20',
        text: 'text-cyber-green',
        border: 'border-cyber-green/40',
        icon: '✓'
      },
      pending: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        icon: '⏳'
      },
      active: {
        bg: 'bg-cyber-purple/20',
        text: 'text-cyber-purple',
        border: 'border-cyber-purple/40',
        icon: '⚡'
      },
      failed: {
        bg: 'bg-cyber-red/20',
        text: 'text-cyber-red',
        border: 'border-cyber-red/40',
        icon: '❌'
      },
      timeout: {
        bg: 'bg-yellow-500/20',
        text: 'text-yellow-400',
        border: 'border-yellow-500/40',
        icon: '⏱️'
      }
    };

    return configs[status] || configs.idle;
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold uppercase ${config.bg} ${config.text} ${config.border}`}>
      <span>{config.icon}</span>
      {status}
    </span>
  );
};

export default StatusBadge;
