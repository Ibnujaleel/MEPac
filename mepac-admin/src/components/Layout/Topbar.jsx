import React from 'react';
import { Search, Bell, User, LogOut } from 'lucide-react';

export default function Topbar({ activePanel, togglePanel, notifications = [] }) {
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return (
        <header className="topbar" style={{ position: 'relative', zIndex: 1000 }}>
            <div className="search-container">
                <span className="icon"><Search size={18} /></span>
                <input type="text" placeholder="Search logs, projects, workers..." />
            </div>
            <div className="topbar-actions">
                <button className="icon-btn notif-btn" onClick={(e) => togglePanel('notifications', e)}>
                    <span className="icon" style={{ pointerEvents: 'none' }}><Bell size={18} /></span>
                    {unreadCount > 0 && <span className="badge" style={{ pointerEvents: 'none' }}>{unreadCount}</span>}
                </button>
                <div style={{ position: 'relative' }}>
                    <div 
                        className="avatar" 
                        onClick={(e) => togglePanel('profile', e)}
                        style={{ marginLeft: '12px', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '600', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', cursor: 'pointer' }}
                    >
                        <span style={{ pointerEvents: 'none' }}>C</span>
                    </div>
                    
                    {activePanel === 'profile' && (
                        <div 
                            onClick={(e) => e.stopPropagation()}
                            style={{
                            position: 'absolute',
                            top: '48px',
                            right: '0',
                            width: '200px',
                            backgroundColor: 'var(--bg-surface)',
                            border: '1px solid var(--border-subtle)',
                            borderRadius: 'var(--radius-md)',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            zIndex: 100,
                            overflow: 'hidden'
                        }}>
                            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>CEO Account</div>
                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>admin@mepac.com</div>
                            </div>
                            <div style={{ padding: '8px' }}>
                                <button className="btn text-btn" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', justifyContent: 'flex-start', gap: '8px' }} onClick={() => togglePanel('profile', null)}><User size={16} /> View Profile</button>
                            </div>
                            <div style={{ padding: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                                <button className="btn text-btn" style={{ width: '100%', textAlign: 'left', padding: '8px 12px', color: 'var(--accent-red)', justifyContent: 'flex-start', gap: '8px' }} onClick={() => {
                                    togglePanel('profile', null);
                                    alert('You have successfully logged out of the demo account.');
                                }}><LogOut size={16} /> Log Out</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
