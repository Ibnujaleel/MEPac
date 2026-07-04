import React from 'react';
import { 
    LayoutDashboard, 
    Briefcase, 
    Users, 
    Calendar, 
    FileText, 
    Compass, 
    Settings 
} from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
    const navItems = [
        { id: 'view-dashboard', Icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'view-projects', Icon: Briefcase, label: 'Projects' },
        { id: 'view-workforce', Icon: Users, label: 'Workforce' },
        { id: 'view-attendance', Icon: Calendar, label: 'Attendance' },
        { id: 'view-rfis', Icon: FileText, label: 'RFIs' },
        { id: 'view-drawings', Icon: Compass, label: 'Drawings' }
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
                        <span className="icon"><item.Icon size={18} /></span>
                        <span>{item.label}</span>
                    </button>
                ))}
                
                <div className="spacer"></div>
                
                <button 
                    className={`nav-item ${activeView === 'view-settings' ? 'active' : ''}`}
                    onClick={() => setActiveView('view-settings')}
                    style={{width: '100%', textAlign: 'left'}}
                >
                    <span className="icon"><Settings size={18} /></span>
                    <span>Settings</span>
                </button>
            </nav>
        </aside>
    );
}
