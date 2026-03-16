import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/agents', label: 'Agents', icon: '🤖' },
    { path: '/logs', label: 'Logs', icon: '📋' },
    { path: '/artifacts', label: 'Artifacts', icon: '📁' },
    { path: '/reports', label: 'Reports', icon: '📄' },
    { path: '/settings', label: 'Settings', icon: '⚙️' }
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-cyber-dark border-r border-cyber-blue/20 flex flex-col">
      <div className="p-6 border-b border-cyber-blue/20">
        <h1 className="text-2xl font-bold text-cyber-blue">
          Vigilant AI
        </h1>
        <p className="text-xs text-gray-400 mt-1">Multi-Agent Platform</p>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  isActive(item.path)
                    ? 'bg-cyber-blue/20 text-cyber-blue border border-cyber-blue/40'
                    : 'text-gray-300 hover:bg-cyber-blue/10 hover:text-cyber-blue'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-cyber-blue/20">
        <div className="bg-cyber-darker rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">System Status</span>
          </div>
          <p className="text-sm text-cyber-green font-bold">OPERATIONAL</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
