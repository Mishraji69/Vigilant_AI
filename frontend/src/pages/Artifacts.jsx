import { useState, useEffect } from 'react';
import FileExplorer from '../components/FileExplorer';
import { mockArtifactService } from '../services/mockArtifactService';

const Artifacts = () => {
  const [tree, setTree] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTree = async () => {
      try {
        setLoading(true);
        const data = await mockArtifactService.getArtifactTree();
        setTree(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTree();
  }, []);

  const handleFileSelect = async (path, file) => {
    try {
      setSelectedFile(file);
      const content = await mockArtifactService.getFileContents(path);
      setFileContent(content);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDownload = async () => {
    if (!selectedFile) return;
    
    try {
      const result = await mockArtifactService.downloadFile(selectedFile.name);
      alert(`Download simulated: ${result.fileName}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const getTotalFiles = (node) => {
    if (node.type === 'file') return 1;
    if (!node.children) return 0;
    return node.children.reduce((sum, child) => sum + getTotalFiles(child), 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-cyber-blue text-xl">Loading artifacts...</div>
      </div>
    );
  }

  const totalFiles = tree ? getTotalFiles(tree) : 0;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-cyber-blue">Artifacts</h1>
        <p className="text-gray-400 mt-1">Browse collected files and data</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Files</p>
              <p className="text-3xl font-bold text-white">{totalFiles}</p>
            </div>
            <span className="text-4xl">📁</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Categories</p>
              <p className="text-3xl font-bold text-cyber-blue">
                {tree?.children?.length || 0}
              </p>
            </div>
            <span className="text-4xl">📂</span>
          </div>
        </div>

        <div className="bg-cyber-dark border border-cyber-blue/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Selected</p>
              <p className="text-3xl font-bold text-cyber-green">
                {selectedFile ? '1' : '0'}
              </p>
            </div>
            <span className="text-4xl">✓</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-cyber-red/20 border border-cyber-red/40 rounded-lg p-4 text-cyber-red">
          Error: {error}
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* File Explorer */}
        <div>
          <FileExplorer tree={tree} onFileSelect={handleFileSelect} />
        </div>

        {/* File Preview */}
        <div className="bg-cyber-darker rounded-lg border border-cyber-blue/20">
          <div className="p-3 border-b border-cyber-blue/20 bg-cyber-dark flex items-center justify-between">
            <div>
              <h3 className="text-cyber-blue font-bold">
                {selectedFile ? selectedFile.name : 'File Preview'}
              </h3>
              {selectedFile && (
                <p className="text-xs text-gray-400 mt-1">
                  {selectedFile.size} · Modified: {new Date(selectedFile.modified).toLocaleDateString()}
                </p>
              )}
            </div>
            {selectedFile && (
              <button
                onClick={handleDownload}
                className="px-3 py-1 bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40 rounded text-sm hover:bg-cyber-blue/30 transition-all"
              >
                ⬇ Download
              </button>
            )}
          </div>

          <div className="p-4 max-h-[600px] overflow-y-auto scrollbar-thin">
            {!fileContent ? (
              <div className="text-center text-gray-500 py-12">
                <p className="text-4xl mb-4">📄</p>
                <p>Select a file to preview</p>
              </div>
            ) : (
              <div>
                <div className="mb-3 flex items-center gap-2">
                  <span className="px-2 py-1 bg-cyber-blue/10 text-cyber-blue text-xs rounded border border-cyber-blue/30">
                    {fileContent.mimeType}
                  </span>
                  <span className="text-gray-400 text-xs">
                    {fileContent.size} bytes
                  </span>
                </div>
                <pre className="bg-cyber-dark p-4 rounded border border-cyber-blue/20 overflow-x-auto text-sm text-gray-300 font-mono whitespace-pre-wrap">
                  {fileContent.content}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artifacts;
