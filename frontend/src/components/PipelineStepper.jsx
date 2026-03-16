import StatusBadge from './StatusBadge';

const PipelineStepper = ({ stages }) => {
  if (!stages || stages.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No pipeline data available
      </div>
    );
  }

  const getStageIcon = (stageName) => {
    const icons = {
      'Reconnaissance': '🔍',
      'Collection': '📦',
      'Analysis': '🔬',
      'Reporting': '📝'
    };
    return icons[stageName] || '⚙️';
  };

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {stages.map((stage, index) => (
          <div key={stage.id} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              {/* Stage Icon and Info */}
              <div className="relative mb-3">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 ${
                  stage.status === 'completed' 
                    ? 'bg-cyber-green/20 border-cyber-green' 
                    : stage.status === 'active'
                    ? 'bg-cyber-blue/20 border-cyber-blue animate-pulse'
                    : 'bg-gray-700/20 border-gray-600'
                }`}>
                  {getStageIcon(stage.name)}
                </div>
                {stage.status === 'active' && stage.progress > 0 && (
                  <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                    <div className="bg-cyber-dark px-2 py-0.5 rounded text-xs font-bold text-cyber-blue border border-cyber-blue/40">
                      {stage.progress}%
                    </div>
                  </div>
                )}
              </div>

              {/* Stage Name and Status */}
              <h4 className="font-bold text-sm mb-2 text-white">{stage.name}</h4>
              <StatusBadge status={stage.status} />

              {/* Progress Bar for Active Stage */}
              {stage.status === 'active' && (
                <div className="w-full mt-3 bg-gray-700/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-cyber-blue h-full transition-all duration-500 rounded-full"
                    style={{ width: `${stage.progress}%` }}
                  />
                </div>
              )}
            </div>

            {/* Connector Line */}
            {index < stages.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 relative" style={{ top: '-2.5rem' }}>
                <div className={`h-full ${
                  stages[index + 1].status === 'completed' || stages[index + 1].status === 'active'
                    ? 'bg-cyber-blue'
                    : 'bg-gray-600'
                } transition-all duration-500`} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PipelineStepper;
