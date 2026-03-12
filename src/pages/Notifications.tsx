import React, { useState } from 'react';
import { Bell, CheckCheck, AlertCircle, Info, CheckCircle, AlertTriangle, XCircle, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import type { Notification } from '../types';
import { useToast } from '../components/common/Toast';

const Notifications: React.FC = () => {
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(
    MOCK_NOTIFICATIONS.filter(n => !n.role || n.role.includes(currentUser?.role || 'business'))
  );

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleClick = (n: Notification) => {
    markRead(n.id);
    if (n.link) navigate(n.link);
  };

  const typeIcons = {
    action_required: <AlertCircle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
  };

  const typeBg = {
    action_required: 'border-l-4 border-amber-400 bg-amber-50',
    info: 'border-l-4 border-blue-400 bg-blue-50',
    success: 'border-l-4 border-emerald-400 bg-emerald-50',
    warning: 'border-l-4 border-amber-400 bg-amber-50',
    error: 'border-l-4 border-red-400 bg-red-50',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <Button variant="outline" size="sm" icon={<CheckCheck className="w-4 h-4" />} onClick={markAllRead}>
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <Card className="p-12 text-center">
          <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">No notifications</p>
          <p className="text-sm text-gray-400 mt-1">You're all caught up!</p>
        </Card>
      ) : (
        <Card>
          <div className="divide-y divide-gray-100">
            {notifications.map(n => (
              <div
                key={n.id}
                className={`flex items-start gap-4 px-6 py-4 cursor-pointer transition-colors hover:bg-gray-50/80 ${!n.isRead ? typeBg[n.type] : ''}`}
                onClick={() => handleClick(n)}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {typeIcons[n.type]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className={`text-sm font-semibold ${!n.isRead ? 'text-gray-900' : 'text-gray-600'}`}>
                        {n.title}
                        {n.type === 'action_required' && !n.isRead && (
                          <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                            Action Required
                          </span>
                        )}
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">{n.description}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 whitespace-nowrap">{n.timestamp}</span>
                      {n.link && <ExternalLink className="w-3.5 h-3.5 text-gray-400" />}
                    </div>
                  </div>
                </div>
                {!n.isRead && (
                  <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-2" />
                )}
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};

export default Notifications;
