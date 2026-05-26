import React, { useEffect, useState } from 'react';
import { Bell, Trash2, Check, AlertCircle, Clock } from 'lucide-react';
import { agentService } from '../../services/agentService';

export default function AgentNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, emi_reminder, late_payment

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await agentService.getNotifications();
      if (response?.data) {
        setNotifications(response.data);
        setUnreadCount(response.unreadCount || 0);
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await agentService.deleteNotification(notificationId);
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await agentService.markNotificationAsRead(notificationId);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const filteredNotifications =
    filter === 'all'
      ? notifications
      : notifications.filter((notif) => notif.type === filter);

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'emi_reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      case 'late_payment':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'emi_reminder':
        return 'bg-blue-50 border-blue-200';
      case 'late_payment':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Bell className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-800">Notifications</h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center w-6 h-6 text-sm font-bold text-white bg-red-600 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            {[
              { label: 'All', value: 'all' },
              { label: 'EMI Reminders', value: 'emi_reminder' },
              { label: 'Late Payments', value: 'late_payment' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 font-semibold border-b-2 transition ${
                  filter === tab.value
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border rounded-lg flex items-start justify-between transition ${getNotificationColor(
                    notification.type
                  )} ${!notification.isRead ? 'border-l-4' : ''}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">
                        {notification.title}
                      </h3>
                      <p className="text-sm text-gray-700 mt-1">
                        {notification.message}
                      </p>
                      {notification.loanGroupId && (
                        <p className="text-xs text-gray-600 mt-2">
                          Loan Group: {notification.loanGroupId.groupName} (
                          {notification.loanGroupId.groupId})
                        </p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-600">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No notifications at the moment</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
