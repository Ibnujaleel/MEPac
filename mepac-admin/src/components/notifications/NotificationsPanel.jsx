import React from 'react';
import { X } from 'lucide-react';

export default function NotificationsPanel({ isOpen, onClose, notifications = [], deleteNotification }) {
    return (
        <div className={`side-panel ${isOpen ? 'active' : ''}`} id="notifications-panel" onClick={e => e.stopPropagation()}>
            <div className="side-panel-header">
                <h3>Notifications</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="side-panel-body">
                {notifications.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>No new notifications</div>
                ) : (
                    notifications.map(notif => (
                        <div className="notification-item" key={notif.id} style={{ position: 'relative' }}>
                            <div className="notif-title" style={{ fontWeight: notif.isRead ? 'normal' : 'bold' }}>
                                {notif.title}
                                {!notif.isRead && <span style={{ color: 'var(--accent-amber)', marginLeft: '8px' }}>●</span>}
                            </div>
                            <div className="notif-time">{notif.time}</div>
                            <div className="notif-desc">{notif.desc}</div>
                            <button 
                                onClick={() => deleteNotification(notif.id)} 
                                style={{
                                    position: 'absolute', top: '12px', right: '12px', background: 'none', border: 'none', 
                                    cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', alignItems: 'center'
                                }}
                                title="Delete"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
