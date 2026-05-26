import React, { useEffect, useState } from 'react';
import { Bell, Trash2, Check, AlertCircle, CheckCircle, XCircle, Clock } from 'lucide-react';
import { adminService } from '../../services/adminService';

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [filter, setFilter] = useState('all'); // all, approval, late_payment, rejection

  useEffect(() => {
    loadNotifications();
    // Poll for new notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const response = await adminService.getNotifications();
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
      await adminService.deleteNotification(notificationId);
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
      await adminService.markNotificationAsRead(notificationId);
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
      case 'approval':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'late_payment':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'rejection':
        return <XCircle className="w-5 h-5 text-orange-600" />;
      case 'emi_reminder':
        return <Clock className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'approval':
        return 'bg-green-50 border-green-200';
      case 'late_payment':
        return 'bg-red-50 border-red-200';
      case 'rejection':
        return 'bg-orange-50 border-orange-200';
      case 'emi_reminder':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="content-section" style={{ padding: '1.5rem' }}>
      <div>
        <div>
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-slate-900 shadow-lg">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Notifications</h1>
                <p className="text-xs text-slate-200/80">Track approvals, rejections, late payments, and EMI reminders.</p>
              </div>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center px-2 h-6 text-xs font-semibold text-white bg-red-500 rounded-full ml-2">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition disabled:opacity-50 text-sm font-semibold shadow-lg shadow-blue-500/30"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 mb-6 border-b border-slate-700/70 overflow-x-auto pb-1">
            {[
              { label: 'All', value: 'all' },
              { label: 'Approvals', value: 'approval' },
              { label: 'Late Payments', value: 'late_payment' },
              { label: 'Rejections', value: 'rejection' },
            ].map((tab) => (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`px-4 py-2 text-sm font-semibold border-b-2 rounded-t-md transition ${
                  filter === tab.value
                    ? 'border-blue-400 text-blue-300'
                    : 'border-transparent text-slate-400 hover:text-blue-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Notifications List */}
          <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 border rounded-xl flex items-start justify-between transition ${getNotificationColor(
                    notification.type
                  )} ${!notification.isRead ? 'border-l-4 border-l-blue-400' : ''}`}
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-slate-100">
                          {notification.title || 'Notification'}
                        </h3>
                        <span className="px-2 py-0.5 text-[10px] rounded-full border border-slate-500/70 text-slate-300 uppercase tracking-wide">
                          {notification.type?.replace('_', ' ') || 'general'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-200/90 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-slate-400 mt-2">
                        {new Date(notification.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0 ml-4">
                    {!notification.isRead && (
                      <button
                        onClick={() => handleMarkAsRead(notification._id)}
                        className="p-2 text-emerald-300 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-400/60 rounded-lg transition"
                        title="Mark as read"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteNotification(notification._id)}
                      className="p-2 text-rose-300 hover:bg-rose-500/10 border border-transparent hover:border-rose-400/60 rounded-lg transition"
                      title="Delete notification"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-slate-300">
                <Bell className="w-12 h-12 mx-auto mb-3 text-slate-500" />
                <p className="text-sm">No notifications at the moment</p>
                <p className="text-xs text-slate-500 mt-1">You’ll see updates here as activity happens in the system.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
