import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { MOCK_NOTIFICATIONS } from '../../data/mockData';
import Badge from '../common/Badge';
import type { UserRole } from '../../types';

interface TopNavProps {
  onMenuClick: () => void;
}

const roleLabels: Record<UserRole, string> = {
  business: 'Business User',
  approver: 'Approver',
  finance: 'Finance',
  admin: 'Admin',
};

const roleBadgeVariants: Record<UserRole, 'blue' | 'green' | 'purple' | 'orange'> = {
  business: 'blue',
  approver: 'green',
  finance: 'purple',
  admin: 'orange',
};

const TopNav: React.FC<TopNavProps> = ({ onMenuClick }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const unreadCount = MOCK_NOTIFICATIONS.filter(
    n => !n.isRead && (!n.role || n.role.includes(currentUser.role))
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 gap-4 sticky top-0 z-20 shadow-sm">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1" />

      {/* Notification Bell */}
      <button
        onClick={() => navigate('/notifications')}
        className="relative p-2 rounded-lg hover:bg-gray-100 text-gray-600 cursor-pointer"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {unreadCount}
          </span>
        )}
      </button>

      {/* User Info */}
      <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-semibold text-gray-800">{currentUser.name}</p>
          <div className="flex justify-end">
            <Badge variant={roleBadgeVariants[currentUser.role]}>
              {roleLabels[currentUser.role]}
              {currentUser.approverLevel && ` - ${currentUser.approverLevel.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`}
            </Badge>
          </div>
        </div>
        <div className="w-9 h-9 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {currentUser.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
        title="Logout"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </header>
  );
};

export default TopNav;
