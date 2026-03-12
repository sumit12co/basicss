import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  ListOrdered,
  DollarSign,
  RefreshCw,
  Bell,
  Shield,
  Users,
  GitBranch,
  Settings,
  ChevronDown,
  ChevronRight,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { UserRole } from '../../types';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  adminExpanded: boolean;
  setAdminExpanded: (v: boolean) => void;
}

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" />, roles: ['business', 'approver', 'finance', 'admin'] },
  { label: 'Approvals', path: '/approvals', icon: <CheckSquare className="w-5 h-5" />, roles: ['approver', 'finance'] },
  { label: 'Item Code Prices', path: '/item-code-price-list', icon: <ListOrdered className="w-5 h-5" />, roles: ['business', 'finance'] },
  { label: 'Finance Review', path: '/finance-review', icon: <DollarSign className="w-5 h-5" />, roles: ['finance'] },
  { label: 'ERP Integration', path: '/erp-integration', icon: <RefreshCw className="w-5 h-5" />, roles: ['finance', 'admin'] },
  { label: 'Notifications', path: '/notifications', icon: <Bell className="w-5 h-5" />, roles: ['business', 'approver', 'finance', 'admin'] },
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, adminExpanded, setAdminExpanded }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;
  const role = currentUser.role;

  const isAdmin = role === 'admin';

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={onClose} />
      )}

      <aside className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white z-40 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:z-auto`}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-tight">Price List</p>
              <p className="text-xs text-gray-400 leading-tight">Automation Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems
            .filter(item => item.roles.includes(role))
            .map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}

          {/* Admin Section */}
          {isAdmin && (
            <div>
              <button
                onClick={() => setAdminExpanded(!adminExpanded)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white transition-colors cursor-pointer"
              >
                <Shield className="w-5 h-5" />
                <span className="flex-1 text-left">Admin</span>
                {adminExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
              {adminExpanded && (
                <div className="ml-4 mt-0.5 space-y-0.5 border-l border-gray-700 pl-3">
                  {[
                    { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
                    { label: 'Approval Matrix', path: '/admin/approval-matrix', icon: <GitBranch className="w-4 h-4" /> },
                    { label: 'Integration Monitor', path: '/admin/integration', icon: <RefreshCw className="w-4 h-4" /> },
                    { label: 'Settings', path: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
                  ].map(sub => (
                    <NavLink
                      key={sub.path}
                      to={sub.path}
                      onClick={onClose}
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                          isActive ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                        }`
                      }
                    >
                      {sub.icon}
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
              {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-white truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-400 truncate">{currentUser.department}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
