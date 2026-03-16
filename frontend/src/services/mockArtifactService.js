import { mockArtifacts, mockFileContents } from '../mock/mockData';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to find a node in the tree by path
const findNodeByPath = (tree, pathParts) => {
  if (pathParts.length === 0) return tree;
  
  const [current, ...rest] = pathParts;
  if (!tree.children) return null;
  
  const child = tree.children.find(c => c.name === current);
  if (!child) return null;
  
  if (rest.length === 0) return child;
  return findNodeByPath(child, rest);
};

export const mockArtifactService = {
  // Get the root artifact tree
  async getArtifactTree() {
    await delay(300);
    return { ...mockArtifacts };
  },

  // Get contents of a specific directory
  async getDirectoryContents(path = '') {
    await delay(200);
    
    if (!path || path === '/' || path === 'llm_working_folder') {
      return { ...mockArtifacts };
    }
    
    const pathParts = path.split('/').filter(p => p && p !== 'llm_working_folder');
    const node = findNodeByPath(mockArtifacts, pathParts);
    
    if (!node) {
      throw new Error('Directory not found');
    }
    
    if (node.type !== 'directory') {
      throw new Error('Not a directory');
    }
    
    return node;
  },

  // Get file contents
  async getFileContents(filePath) {
    await delay(250);
    
    const fileName = filePath.split('/').pop();
    
    // Check if we have mock content for this file
    if (mockFileContents[fileName]) {
      return {
        fileName: fileName,
        content: mockFileContents[fileName],
        size: mockFileContents[fileName].length,
        mimeType: fileName.endsWith('.json') ? 'application/json' : 
                  fileName.endsWith('.md') ? 'text/markdown' : 'text/plain'
      };
    }
    
    // Return generic content for other files
    return {
      fileName: fileName,
      content: `Mock content for ${fileName}\n\nThis is simulated file content.\nIn a real implementation, this would contain actual file data.`,
      size: 1024,
      mimeType: 'text/plain'
    };
  },

  // List all files recursively
  async listAllFiles() {
    await delay(300);
    
    const files = [];
    const traverse = (node, currentPath = '') => {
      if (node.type === 'file') {
        files.push({
          path: currentPath + '/' + node.name,
          name: node.name,
          size: node.size,
          modified: node.modified
        });
      } else if (node.children) {
        node.children.forEach(child => {
          traverse(child, currentPath + '/' + node.name);
        });
      }
    };
    
    traverse(mockArtifacts);
    return files;
  },

  // Search for files
  async searchFiles(query) {
    await delay(200);
    
    const allFiles = await this.listAllFiles();
    return allFiles.filter(file => 
      file.name.toLowerCase().includes(query.toLowerCase()) ||
      file.path.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Get file metadata
  async getFileMetadata(filePath) {
    await delay(150);
    
    const pathParts = filePath.split('/').filter(p => p && p !== 'llm_working_folder');
    const fileName = pathParts.pop();
    const node = findNodeByPath(mockArtifacts, pathParts);
    
    if (!node || !node.children) {
      throw new Error('File not found');
    }
    
    const file = node.children.find(f => f.name === fileName);
    if (!file || file.type !== 'file') {
      throw new Error('File not found');
    }
    
    return {
      name: file.name,
      size: file.size,
      modified: file.modified,
      path: filePath,
      type: file.name.split('.').pop()
    };
  },

  // Download file (simulation - returns blob URL)
  async downloadFile(filePath) {
    await delay(300);
    const contents = await this.getFileContents(filePath);
    
    // In a real app, this would create a downloadable blob
    return {
      success: true,
      fileName: contents.fileName,
      size: contents.size,
      message: 'File download simulated'
    };
  }
};
