/**
 * Artifact Service - Real Implementation
 * Connects to Vigilant AI backend artifact API
 */

import apiClient from './apiClient';
import { adaptArtifact, buildArtifactTree } from './adapters';

export const artifactService = {
  /**
   * Get the root artifact tree
   */
  async getArtifactTree() {
    try {
      const artifacts = await this.listAllFiles();
      return buildArtifactTree(artifacts);
    } catch (error) {
      console.error('Failed to fetch artifact tree:', error);
      throw error;
    }
  },

  /**
   * Get contents of a specific directory
   */
  async getDirectoryContents(path = '') {
    try {
      const artifacts = await this.listAllFiles();
      
      // Filter artifacts by path prefix
      const filteredArtifacts = path 
        ? artifacts.filter(a => a.path.startsWith(path))
        : artifacts;
      
      return buildArtifactTree(filteredArtifacts);
    } catch (error) {
      console.error('Failed to fetch directory contents:', error);
      throw error;
    }
  },

  /**
   * Get file contents
   */
  async getFileContents(filePath) {
    try {
      const blob = await apiClient.download(`/api/artifacts/${filePath}`);
      const content = await blob.text();
      
      // Determine mime type from file extension
      let mimeType = 'text/plain';
      if (filePath.endsWith('.json')) mimeType = 'application/json';
      else if (filePath.endsWith('.md')) mimeType = 'text/markdown';
      else if (filePath.endsWith('.html')) mimeType = 'text/html';
      else if (filePath.endsWith('.xml')) mimeType = 'application/xml';
      else if (filePath.endsWith('.csv')) mimeType = 'text/csv';
      
      return {
        fileName: filePath.split('/').pop(),
        content: content,
        size: blob.size,
        mimeType: mimeType
      };
    } catch (error) {
      console.error(`Failed to fetch file contents for ${filePath}:`, error);
      throw error;
    }
  },

  /**
   * List all files recursively
   */
  async listAllFiles() {
    try {
      const response = await apiClient.get('/api/artifacts');
      return response.map(adaptArtifact);
    } catch (error) {
      console.error('Failed to list all files:', error);
      throw error;
    }
  },

  /**
   * Search for files
   */
  async searchFiles(query) {
    try {
      const allFiles = await this.listAllFiles();
      
      const lowerQuery = query.toLowerCase();
      return allFiles.filter(file => 
        file.name.toLowerCase().includes(lowerQuery) ||
        file.path.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Failed to search files:', error);
      throw error;
    }
  },

  /**
   * Get files by type (subfolder)
   */
  async getFilesByType(type) {
    try {
      const allFiles = await this.listAllFiles();
      return allFiles.filter(file => file.type === type);
    } catch (error) {
      console.error(`Failed to get files by type ${type}:`, error);
      throw error;
    }
  },

  /**
   * Download file
   */
  async downloadFile(filePath) {
    try {
      const blob = await apiClient.download(`/api/artifacts/${filePath}`);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filePath.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      return { success: true };
    } catch (error) {
      console.error(`Failed to download file ${filePath}:`, error);
      throw error;
    }
  },

  /**
   * Get artifact statistics
   */
  async getArtifactStats() {
    try {
      const artifacts = await this.listAllFiles();
      
      const stats = {
        totalFiles: artifacts.length,
        totalSize: artifacts.reduce((sum, a) => sum + a.size, 0),
        byType: {}
      };

      artifacts.forEach(artifact => {
        if (!stats.byType[artifact.type]) {
          stats.byType[artifact.type] = {
            count: 0,
            size: 0
          };
        }
        stats.byType[artifact.type].count++;
        stats.byType[artifact.type].size += artifact.size;
      });

      return stats;
    } catch (error) {
      console.error('Failed to get artifact stats:', error);
      throw error;
    }
  }
};

export default artifactService;
