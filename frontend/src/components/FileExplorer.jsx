import { useState } from 'react';

const FileExplorer = ({ tree, onFileSelect }) => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['llm_working_folder']));

  const toggleFolder = (path) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedFolders(newExpanded);
  };

  const getFileIcon = (name) => {
    const ext = name.split('.').pop().toLowerCase();
    const icons = {
      'txt': '📄',
      'json': '📋',
      'csv': '📊',
      'xml': '📰',
      'md': '📝',
      'pdf': '📕',
      'enc': '🔒',
      'log': '📜'
    };
    return icons[ext] || '📄';
  };

  const formatSize = (size) => {
    if (typeof size === 'string') return size;
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const renderNode = (node, path = '', level = 0) => {
    const fullPath = path ? `${path}/${node.name}` : node.name;
    const isExpanded = expandedFolders.has(fullPath);

    if (node.type === 'directory') {
      return (
        <div key={fullPath}>
          <div
            className={`flex items-center gap-2 p-2 hover:bg-cyber-blue/10 cursor-pointer rounded ${
              level === 0 ? 'font-bold text-cyber-blue' : ''
            }`}
            style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
            onClick={() => toggleFolder(fullPath)}
          >
            <span className="text-yellow-400">{isExpanded ? '📂' : '📁'}</span>
            <span>{node.name}</span>
            <span className="text-xs text-gray-500">
              {node.children ? `(${node.children.length})` : ''}
            </span>
          </div>
          {isExpanded && node.children && (
            <div>
              {node.children.map(child => renderNode(child, fullPath, level + 1))}
            </div>
          )}
        </div>
      );
    }

    // File node
    return (
      <div
        key={fullPath}
        className="flex items-center gap-2 p-2 hover:bg-cyber-blue/10 cursor-pointer rounded group"
        style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
        onClick={() => onFileSelect && onFileSelect(fullPath, node)}
      >
        <span>{getFileIcon(node.name)}</span>
        <span className="flex-1 group-hover:text-cyber-blue">{node.name}</span>
        <span className="text-xs text-gray-500">{node.size}</span>
      </div>
    );
  };

  if (!tree) {
    return (
      <div className="text-center text-gray-500 py-8">
        No files available
      </div>
    );
  }

  return (
    <div className="bg-cyber-darker rounded-lg border border-cyber-blue/20">
      <div className="p-3 border-b border-cyber-blue/20 bg-cyber-dark">
        <h3 className="text-cyber-blue font-bold">File Explorer</h3>
        <p className="text-xs text-gray-400 mt-1">Browse artifacts and reports</p>
      </div>
      <div className="p-2 max-h-96 overflow-y-auto scrollbar-thin">
        {renderNode(tree)}
      </div>
    </div>
  );
};

export default FileExplorer;
