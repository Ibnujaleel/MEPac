import { useState } from 'react';
import {
  Bell,
  X,
  CheckCheck,
  Clock,
  UserCheck,
  AlertTriangle,
  FileText,
  Trash2,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../convex.js';
import useAuthStore from '../store/authStore';

function formatRelativeTime(timestamp) {
  if (!timestamp) return '';
  const diffSec = Math.floor((Date.now() - timestamp) / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

export default function NotificationDrawer({ isOpen, onClose }) {
  const user = useAuthStore((s) => s.user);

  // Real-time query for notifications relevant to this worker
  const notifications = useQuery(
    api.notifications.getWorkerNotifications,
    user?.id ? { workerId: user.id } : {}
  ) || [];

  const markRead = useMutation(api.notifications.markRead);
  const markAllRead = useMutation(api.notifications.markAllRead);
  const removeNotification = useMutation(api.notifications.remove);

  const [isMarking, setIsMarking] = useState(false);

  if (!isOpen) return null;

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAllRead = async () => {
    setIsMarking(true);
    try {
      await markAllRead({ workerId: user?.id });
    } catch (err) {
      console.warn('Failed to mark all as read:', err);
    } finally {
      setIsMarking(false);
    }
  };

  const handleItemClick = async (notification) => {
    if (!notification.isRead) {
      try {
        await markRead({ notificationId: notification._id });
      } catch (err) {
        console.warn('Failed to mark read:', err);
      }
    }
  };

  const handleDelete = async (e, notificationId) => {
    e.stopPropagation();
    try {
      await removeNotification({ notificationId });
    } catch (err) {
      console.warn('Failed to remove notification:', err);
    }
  };

  const getIcon = (type, title = '') => {
    const t = (type || title).toLowerCase();
    if (t.includes('proxy') || t.includes('approval')) {
      return <UserCheck size={18} className="text-amber-600 shrink-0" />;
    }
    if (t.includes('shift') || t.includes('clock') || t.includes('attendance')) {
      return <Clock size={18} className="text-blue-600 shrink-0" />;
    }
    if (t.includes('dispute') || t.includes('rfi')) {
      return <FileText size={18} className="text-purple-600 shrink-0" />;
    }
    if (t.includes('warning') || t.includes('alert') || t.includes('restricted')) {
      return <AlertTriangle size={18} className="text-red-600 shrink-0" />;
    }
    return <Bell size={18} className="text-primary shrink-0" />;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in">
      {/* Click-away backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-sm bg-surface-card border-l border-border h-full shadow-2xl flex flex-col z-10 animate-slide-left"
        role="dialog"
        aria-label="Notifications"
      >
        {/* Header */}
        <header className="h-16 px-4 border-b border-border flex items-center justify-between shrink-0 bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Bell size={18} />
            </div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-base font-bold font-heading text-text-primary">
                Notifications
              </h2>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary text-white">
                  {unreadCount} New
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={handleMarkAllRead}
                disabled={isMarking}
                title="Mark all as read"
                className="p-2 rounded-full hover:bg-surface-card text-text-secondary hover:text-primary transition-colors text-xs flex items-center gap-1"
              >
                <CheckCheck size={16} />
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full hover:bg-surface-card text-text-muted hover:text-text-primary transition-colors"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>
        </header>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto divide-y divide-border p-2">
          {notifications.length > 0 ? (
            notifications.map((item) => (
              <div
                key={item._id}
                onClick={() => handleItemClick(item)}
                className={[
                  'p-3 rounded-md transition-all cursor-pointer flex items-start justify-between gap-3 group',
                  item.isRead
                    ? 'opacity-80 hover:bg-surface'
                    : 'bg-primary/5 hover:bg-primary/10 border border-primary/15',
                ].join(' ')}
              >
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <div className="mt-0.5">{getIcon(item.type, item.title)}</div>
                  <div className="flex flex-col gap-0.5 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-text-primary truncate">
                        {item.title}
                      </span>
                      {!item.isRead && (
                        <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                      {item.desc}
                    </p>
                    <span className="text-[10px] text-text-muted mt-1 font-medium">
                      {formatRelativeTime(item.createdAt)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => handleDelete(e, item._id)}
                  title="Dismiss notification"
                  className="p-1 text-text-muted hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          ) : (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center gap-3">
              <div className="w-12 h-12 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted">
                <CheckCircle2 size={24} className="text-emerald-500" />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-bold text-text-primary">All Caught Up!</p>
                <p className="text-xs text-text-muted max-w-[200px]">
                  You have no unread notifications or shift alerts at this time.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
