import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Users, GitBranch, RefreshCw, Settings } from 'lucide-react';

const adminTabs = [
  { path: '/admin/users', label: 'User Management', icon: <Users className="w-4 h-4" /> },
  { path: '/admin/approval-matrix', label: 'Approval Matrix', icon: <GitBranch className="w-4 h-4" /> },
  { path: '/admin/integration', label: 'Integration Monitor', icon: <RefreshCw className="w-4 h-4" /> },
  { path: '/admin/settings', label: 'System Settings', icon: <Settings className="w-4 h-4" /> },
];

const AdminPanel: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-sm text-gray-500 mt-1">System administration and configuration</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
        {adminTabs.map(tab => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              `flex items-center gap-2 flex-1 justify-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`
            }
          >
            {tab.icon}
            <span className="hidden md:inline">{tab.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Content */}
      <Outlet />
    </div>
  );
};

export default AdminPanel;
