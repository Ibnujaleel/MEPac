import React from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { LayoutDashboard, Building2, Users, CalendarDays, FileText, PencilRuler, Settings } from 'lucide-react';

export default function Sidebar({ activeView, setActiveView }) {
    const settings = useQuery(api.settings.get);

    const navItems = [
        { id: 'view-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { id: 'view-projects', icon: Building2, label: 'Projects' },
        { id: 'view-workforce', icon: Users, label: 'Workforce' },
        { id: 'view-attendance', icon: CalendarDays, label: 'Attendance' },
        { id: 'view-rfis', icon: FileText, label: 'RFIs' },
        { id: 'view-drawings', icon: PencilRuler, label: 'Drawings' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                {settings?.logoUrl ? (
                    <img src={settings.logoUrl} alt="Company Logo" className="logo-icon" style={{ width: '32px', height: '32px', objectFit: 'contain' }} />
                ) : (
                    <img src="/images/logo.png" alt="MEPac Logo" className="logo-icon" />
                )}
                <div className="logo-text">
                    <h1>{settings?.companyName || 'MEPac'}</h1>
                    <span>Admin Console</span>
                </div>
            </div>
            <nav className="sidebar-nav">
                {navItems.map(item => {
                    const IconComponent = item.icon;
                    return (
                        <button 
                            key={item.id}
                            className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                            onClick={() => setActiveView(item.id)}
                            style={{width: '100%', textAlign: 'left'}}
                        >
                            <span className="icon"><IconComponent size={18} /></span>
                            <span>{item.label}</span>
                        </button>
                    );
                })}
                
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
