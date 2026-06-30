import React from 'react';

export default function Sidebar({ activeView, setActiveView }) {
    const navItems = [
        { id: 'view-dashboard', icon: '📊', label: 'Dashboard' },
        { id: 'view-projects', icon: '🏢', label: 'Projects' },
        { id: 'view-workforce', icon: '👥', label: 'Workforce' },
        { id: 'view-attendance', icon: '📅', label: 'Attendance' },
        { id: 'view-rfis', icon: '📝', label: 'RFIs' },
        { id: 'view-drawings', icon: '📐', label: 'Drawings' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-icon"></div>
                <div className="logo-text">
                    <h1>MEPac</h1>
                    <span>Admin Console</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button 
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => setActiveView(item.id)}
                        style={{width: '100%', textAlign: 'left'}}
                    >
                        <span className="icon">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
                
                <div className="spacer"></div>
                
                <button 
                    className={`nav-item ${activeView === 'view-settings' ? 'active' : ''}`}
                    onClick={() => setActiveView('view-settings')}
                    style={{width: '100%', textAlign: 'left'}}
                >
                    <span className="icon">⚙️</span>
                    <span>Settings</span>
                </button>
            </nav>
        </aside>
    );
}
