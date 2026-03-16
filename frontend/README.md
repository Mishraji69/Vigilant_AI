# Vigilant AI - Multi-Agent Cybersecurity Simulation Platform

A modern React + Vite frontend dashboard that simulates a cybersecurity multi-agent workflow UI with a complete mock backend layer for independent testing.

## 🚀 Features

### Core Functionality
- **Multi-Agent Management**: Monitor and control AI agents performing security tasks
- **Real-time Log Streaming**: View simulated live logs with filtering capabilities
- **Artifact Explorer**: Browse and preview collected files and data
- **Report Generation**: View and export comprehensive security reports
- **Pipeline Visualization**: Track workflow progress through multiple stages
- **System Monitoring**: Dashboard with coordinator status and metrics

### UI Pages
1. **Dashboard**: Coordinator status, active agents, pipeline visualization, system health
2. **Agents**: Agent management with start/stop controls and real-time status updates
3. **Logs**: Streaming log viewer with level and agent filtering
4. **Artifacts**: File browser with preview pane for collected data
5. **Reports**: Markdown-rendered security reports with export functionality
6. **Settings**: Configuration panel for platform preferences

## 🛠️ Tech Stack

- **Framework**: React 18 (JavaScript only, no TypeScript)
- **Build Tool**: Vite
- **Styling**: TailwindCSS with custom cybersecurity theme
- **Routing**: React Router DOM
- **Architecture**: Functional components with React Hooks
- **Mock Backend**: Complete service layer for independent operation

## 📁 Project Structure

```
src/
├── layout/              # Layout components
│   ├── MainLayout.jsx   # Main app layout wrapper
│   └── Sidebar.jsx      # Navigation sidebar
├── pages/               # Page components
│   ├── Dashboard.jsx    # Main dashboard
│   ├── Agents.jsx       # Agent management
│   ├── Logs.jsx         # Log viewer
│   ├── Artifacts.jsx    # File explorer
│   ├── Reports.jsx      # Report viewer
│   └── Settings.jsx     # Settings panel
├── components/          # Reusable UI components
│   ├── StatusBadge.jsx  # Status indicator
│   ├── AgentCard.jsx    # Agent display card
│   ├── LogViewer.jsx    # Terminal-style log display
│   ├── PipelineStepper.jsx  # Workflow visualization
│   ├── FileExplorer.jsx # File tree browser
│   └── ReportViewer.jsx # Markdown report renderer
├── hooks/               # Custom React hooks
│   ├── useAgents.js     # Agent data management
│   ├── useLogs.js       # Log streaming
│   └── useCoordinator.js # Coordinator status
├── services/            # Mock backend services
│   ├── mockAgentService.js
│   ├── mockLogService.js
│   ├── mockArtifactService.js
│   ├── mockReportService.js
│   └── mockCoordinatorService.js
└── mock/                # Mock data
    └── mockData.js      # Static mock data
```

## 🎨 Design Features

- **Dark Cybersecurity Theme**: Custom color palette with cyber blue, green, purple, and red accents
- **Responsive Grid Layout**: Adapts to different screen sizes
- **Terminal-Style UI**: Monospace fonts and command-line aesthetics
- **Smooth Animations**: Subtle transitions and status indicators
- **Custom Scrollbars**: Themed scrollbar styling
- **Status Badges**: Color-coded indicators for different states

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Development Server
```bash
npm run dev
```
The application will be available at `http://localhost:5173` (or next available port)

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 🔌 Mock Backend Architecture

### Service Layer
All backend interactions are simulated through mock services that can be easily replaced with real API calls:

```javascript
// Mock service example
import { mockAgentService } from './services/mockAgentService';

// Usage in components
const agents = await mockAgentService.getAgents();
```

### Key Mock Services

1. **mockAgentService**: Agent CRUD operations and status updates
2. **mockLogService**: Log streaming with filters
3. **mockArtifactService**: File tree navigation and content retrieval
4. **mockReportService**: Report management and exports
5. **mockCoordinatorService**: System status and pipeline management

### Data Simulation Features
- Async delays to simulate network requests
- Random status changes for realistic behavior
- Streaming data with setInterval
- Memory-safe log rotation
- Subscription-based updates

## 🎯 Simulated Workflows

### Pipeline Stages
1. **Reconnaissance**: Network scanning and service enumeration
2. **Collection**: Data gathering and file extraction
3. **Analysis**: Vulnerability assessment and threat analysis
4. **Reporting**: Report generation and documentation

### Mock Agents
- **Recon Agent**: Network reconnaissance
- **Collection Agent**: Data collection
- **Analysis Agent**: Vulnerability analysis
- **Reporting Agent**: Report generation

## 🔐 Security Context

**IMPORTANT**: This is a UI simulation only. No real security operations are performed:
- No actual network scanning
- No real exploitation
- No external connections (except dev server)
- All data is mock/simulated

## 🎨 Color Scheme

```javascript
cyber: {
  dark: '#0a0e27',      // Background
  darker: '#050816',    // Deeper background
  blue: '#00d9ff',      // Primary accent
  purple: '#b829ff',    // Secondary accent
  green: '#00ff88',     // Success/Active
  red: '#ff0055',       // Error/Critical
}
```

## 🔄 Real Backend Integration

To replace mock services with real APIs:

1. Update service files in `src/services/`
2. Replace mock implementations with actual HTTP calls
3. Keep the same function signatures
4. No changes needed in UI components

Example:
```javascript
// Before (mock)
async getAgents() {
  await delay(300);
  return [...mockAgents];
}

// After (real API)
async getAgents() {
  const response = await fetch('/api/agents');
  return await response.json();
}
```

## 📝 Component Usage Examples

### StatusBadge
```jsx
<StatusBadge status="running" />
```

### AgentCard
```jsx
<AgentCard 
  agent={agentData} 
  onStart={handleStart}
  onStop={handleStop}
/>
```

### LogViewer
```jsx
<LogViewer logs={logArray} autoScroll={true} />
```

### PipelineStepper
```jsx
<PipelineStepper stages={pipelineStages} />
```

## 🐛 Troubleshooting

### Port Already in Use
Vite will automatically try the next available port (5174, 5175, etc.)

### Styles Not Loading
Ensure Tailwind is properly configured in `tailwind.config.js` and `postcss.config.js`

### Build Errors
Clear cache and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📦 Dependencies

- react: ^18.3.1
- react-dom: ^18.3.1
- react-router-dom: ^7.1.3
- tailwindcss: ^3.4.17
- vite: ^7.3.1

## 🚀 Future Enhancements

- Real backend API integration
- WebSocket support for true real-time updates
- User authentication and authorization
- Report export to PDF/Excel
- Advanced data visualization with charts
- Multi-language support
- Theme customization
- Agent configuration UI

## 📄 License

This is a simulation platform for educational and demonstration purposes.

---

**Built with React + Vite | Styled with TailwindCSS | Powered by Mock Services**
