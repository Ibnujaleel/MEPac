import React, { useState } from 'react';
import { 
    ChevronLeft, ChevronRight, Download, Plus, Clock, Search, Filter, AlertCircle, BarChart3, TrendingUp, Users, MapPin, CheckCircle2, Circle, X, Eye
} from 'lucide-react';
import WorkerProfile from './WorkerProfile';

export default function AttendanceLog({ projects, navigateToProject, setActiveView }) {
    const [viewingWorker, setViewingWorker] = useState(null);
    const [currentDate, setCurrentDate] = useState(new Date(2026, 5, 25)); // June 25, 2026
    const [searchQuery, setSearchQuery] = useState('');
    const [projectFilter, setProjectFilter] = useState('All');
    const [methodFilter, setMethodFilter] = useState('All');
    const [showAnalytics, setShowAnalytics] = useState(true);
    const [showManualModal, setShowManualModal] = useState(false);

    // Modal Form State
    const [manualWorker, setManualWorker] = useState('');
    const [manualProject, setManualProject] = useState('');
    const [manualCheckIn, setManualCheckIn] = useState('08:00');
    const [manualCheckOut, setManualCheckOut] = useState('17:00');
    const [manualNotes, setManualNotes] = useState('');

    // If viewing worker profile
    if (viewingWorker) {
        return <WorkerProfile onBack={() => setViewingWorker(null)} />;
    }

    // Mock Attendance Log Data (June 2026, Indian Names)
    const [logEntries, setLogEntries] = useState([
        { id: 1, name: 'Aarav Sharma', role: 'Electrician', project: 'Grand Tower MEP', checkIn: '08:02 AM', checkOut: '05:05 PM', duration: '9h 3m', method: 'Self', proxyBy: '-', notes: 'On-time checkin.' },
        { id: 2, name: 'Priya Nair', role: 'Plumbing Specialist', project: 'Mall Extension', checkIn: '08:15 AM', checkOut: '05:00 PM', duration: '8h 45m', method: 'Proxy', proxyBy: 'R. Gomez', notes: 'Device battery drained, supervisor proxied.' },
        { id: 3, name: 'Sanjay Gupta', role: 'Lead Welder', project: 'City Center Mall', checkIn: '07:55 AM', checkOut: '04:55 PM', duration: '9h 0m', method: 'Self', proxyBy: '-', notes: 'Completed floor 3 cable trays.' },
        { id: 4, name: 'Rohan Patel', role: 'HVAC Technician', project: 'Sunrise Apartments', checkIn: '09:30 AM', checkOut: '05:00 PM', duration: '7h 30m', method: 'Manual', proxyBy: 'Admin', reason: 'Late arrival due to transit delay.', notes: 'Manual entry approved by Marcus.' },
        { id: 5, name: 'Amit Mishra', role: 'Electrician Apprentice', project: 'Grand Tower MEP', checkIn: '08:05 AM', checkOut: '05:10 PM', duration: '9h 5m', method: 'Self', proxyBy: '-', notes: '-' },
        { id: 6, name: 'Neha Rao', role: 'Foreman', project: 'Mall Extension', checkIn: '08:00 AM', checkOut: '05:00 PM', duration: '9h 0m', method: 'Self', proxyBy: '-', notes: 'Site briefings done.' },
        { id: 7, name: 'Vikram Singh', role: 'HVAC Specialist', project: 'Sunrise Apartments', checkIn: '08:10 AM', checkOut: '02:30 PM', duration: '6h 20m', method: 'Proxy', proxyBy: 'M. Chen', notes: 'Left early for safety training workshop.' }
    ]);

    // Format date string helper
    const formatDate = (date) => {
        return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    };

    // Quick Action Date Shifts
    const shiftDate = (amount) => {
        const next = new Date(currentDate);
        next.setDate(currentDate.getDate() + amount);
        setCurrentDate(next);
    };

    const resetToToday = () => {
        setCurrentDate(new Date(2026, 5, 25)); // Static target mock date
    };

    // Filter Logic
    const filteredLogs = logEntries.filter(entry => {
        const matchesSearch = entry.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              entry.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProject = projectFilter === 'All' || entry.project === projectFilter;
        const matchesMethod = methodFilter === 'All' || entry.method === methodFilter;
        return matchesSearch && matchesProject && matchesMethod;
    });

    const handleManualSubmit = (e) => {
        e.preventDefault();
        const newEntry = {
            id: Date.now(),
            name: manualWorker,
            role: 'Technician', // Standard role fallback
            project: manualProject,
            checkIn: formatTime(manualCheckIn),
            checkOut: formatTime(manualCheckOut),
            duration: calculateDuration(manualCheckIn, manualCheckOut),
            method: 'Manual',
            proxyBy: 'Admin',
            notes: manualNotes || 'Manual entry created.'
        };
        setLogEntries([newEntry, ...logEntries]);
        setShowManualModal(false);
        setManualWorker('');
        setManualProject('');
        setManualCheckIn('08:00');
        setManualCheckOut('17:00');
        setManualNotes('');
    };

    // Helpers
    const formatTime = (time24) => {
        const [h, m] = time24.split(':');
        const hr = parseInt(h);
        const ampm = hr >= 12 ? 'PM' : 'AM';
        const formattedH = hr % 12 || 12;
        return `${formattedH}:${m} ${ampm}`;
    };

    const calculateDuration = (inTime, outTime) => {
        const [inH, inM] = inTime.split(':').map(Number);
        const [outH, outM] = outTime.split(':').map(Number);
        let diffMins = (outH * 60 + outM) - (inH * 60 + inM);
        if (diffMins < 0) diffMins += 24 * 60;
        const hours = Math.floor(diffMins / 60);
        const mins = diffMins % 60;
        return `${hours}h ${mins}m`;
    };

    // Project metadata for real-time presence
    const projectPresence = {
        'p1': { headcount: 8, self: 6, proxy: 2, sparkline: 'M 2 20 L 10 18 L 20 22 L 30 12 L 40 14 L 50 6 L 58 8', health: 'var(--accent-green)', location: 'Mumbai, MH' },
        'p2': { headcount: 12, self: 10, proxy: 2, sparkline: 'M 2 15 L 10 14 L 20 18 L 30 16 L 40 10 L 50 8 L 58 4', health: 'var(--accent-green)', location: 'Delhi, NCR' },
        'p3': { headcount: 5, self: 4, proxy: 1, sparkline: 'M 2 22 L 10 20 L 20 15 L 30 18 L 40 22 L 50 14 L 58 16', health: 'var(--accent-amber)', location: 'Bangalore, KA' },
        'p4': { headcount: 18, self: 15, proxy: 3, sparkline: 'M 2 10 L 10 12 L 20 8 L 30 6 L 40 10 L 50 4 L 58 2', health: 'var(--accent-green)', location: 'Pune, MH' }
    };

    return (
        <section className="view active">
            
            {/* View Header */}
            <div className="view-header" style={{ marginBottom: '24px', flexShrink: 0 }}>
                <div>
                    <h2>Attendance Dashboard</h2>
                    <p className="subtitle">Real-time tracking, logs reconciliation, and workforce metrics.</p>
                </div>
            </div>

            {/* 1. Real-Time Site Presence Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', marginBottom: '24px', flexShrink: 0 }}>
                {projects.map(project => {
                    const presence = projectPresence[project.id] || { headcount: 0, self: 0, proxy: 0, sparkline: 'M 2 20 L 58 20', health: 'var(--text-muted)', location: 'Unknown Location' };
                    return (
                        <div 
                            key={project.id} 
                            onClick={() => navigateToProject(project)}
                            className="panel hover-card" 
                            style={{ 
                                padding: '16px', 
                                display: 'flex', 
                                flexDirection: 'column', 
                                gap: '12px', 
                                cursor: 'pointer',
                                transition: 'var(--transition-normal)',
                                borderTop: `4px solid ${presence.health}`
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <h4 style={{ margin: 0, fontSize: '15px', color: 'var(--text-primary)', fontWeight: '700' }}>{project.name}</h4>
                                    <p style={{ margin: '2px 0 0 0', fontSize: '11px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <MapPin size={10} /> {presence.location}
                                    </p>
                                </div>
                                <div style={{ 
                                    width: '8px', height: '8px', borderRadius: '50%', 
                                    backgroundColor: presence.health, boxShadow: `0 0 8px ${presence.health}` 
                                }} />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', fontFamily: 'var(--font-heading)' }}>{presence.headcount}</span>
                                        <div className="pulse-dot" style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)', animation: 'pulse 1.5s infinite' }}></div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>
                                        {presence.self} Self · {presence.proxy} Proxy
                                    </p>
                                </div>

                                {/* Sparkline */}
                                <svg width="60" height="24">
                                    <path 
                                        d={presence.sparkline} 
                                        fill="none" 
                                        stroke={presence.health} 
                                        strokeWidth="2" 
                                        strokeLinecap="round"
                                    />
                                </svg>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* 2. Quick-Action Bar */}
            <div className="panel" style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexShrink: 0 }}>
                {/* Date Selection */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={() => shiftDate(-1)} className="btn secondary" style={{ padding: '6px', minWidth: 'auto' }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontWeight: '700', fontSize: '15px', color: 'var(--text-primary)', width: '220px', textAlign: 'center' }}>
                        {formatDate(currentDate)}
                    </span>
                    <button onClick={() => shiftDate(1)} className="btn secondary" style={{ padding: '6px', minWidth: 'auto' }}>
                        <ChevronRight size={16} />
                    </button>
                    <button onClick={resetToToday} className="btn secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        Today
                    </button>
                </div>

                {/* Operations buttons */}
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button onClick={() => setShowManualModal(true)} className="btn primary">
                        <Clock size={16} /> Manual Attendance
                    </button>
                    <button className="btn secondary">
                        <Download size={16} /> Export CSV
                    </button>
                </div>
            </div>

            {/* 3. Attendance Log Table */}
            <div className="panel" style={{ padding: '0', marginBottom: '24px', overflow: 'hidden' }}>
                <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '16px', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                    {/* Search */}
                    <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                        <input 
                            type="text" 
                            placeholder="Search worker by name or role..."
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '8px 12px 8px 36px',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid var(--border-subtle)',
                                backgroundColor: 'var(--bg-base)',
                                fontSize: '14px',
                                outline: 'none'
                            }}
                        />
                    </div>

                    {/* Filter Project */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '13px' }}>
                        <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
                        <select 
                            value={projectFilter}
                            onChange={e => setProjectFilter(e.target.value)}
                            style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                        >
                            <option value="All">All Projects</option>
                            {projects.map(p => (
                                <option key={p.id} value={p.name}>{p.name}</option>
                            ))}
                        </select>
                    </div>

                    {/* Filter Method */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '13px' }}>
                        <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
                        <select 
                            value={methodFilter}
                            onChange={e => setMethodFilter(e.target.value)}
                            style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                        >
                            <option value="All">All Methods</option>
                            <option value="Self">Self</option>
                            <option value="Proxy">Proxy</option>
                            <option value="Manual">Manual</option>
                        </select>
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>WORKER</th>
                                <th>ROLE</th>
                                <th>PROJECT</th>
                                <th>CHECK-IN</th>
                                <th>CHECK-OUT</th>
                                <th>DURATION</th>
                                <th>METHOD</th>
                                <th>PROXY BY</th>
                                <th>NOTES</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLogs.map(entry => (
                                <tr 
                                    key={entry.id}
                                    style={{
                                        backgroundColor: entry.method === 'Proxy' ? 'var(--accent-amber-bg)' : 'transparent',
                                        borderLeft: entry.method === 'Proxy' ? '4px solid var(--accent-amber)' : '4px solid transparent'
                                    }}
                                >
                                    <td>
                                        <button 
                                            onClick={() => setViewingWorker(entry)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--accent-blue)', fontWeight: '600', padding: 0, textDecoration: 'underline'
                                            }}
                                        >
                                            {entry.name}
                                        </button>
                                    </td>
                                    <td style={{ fontSize: '13px' }}>{entry.role}</td>
                                    <td style={{ fontSize: '13px', fontWeight: '500' }}>{entry.project}</td>
                                    <td style={{ fontSize: '13px', fontWeight: '600' }}>{entry.checkIn}</td>
                                    <td style={{ fontSize: '13px', fontWeight: '600' }}>{entry.checkOut}</td>
                                    <td style={{ fontSize: '13px' }}>{entry.duration}</td>
                                    <td>
                                        <span className={`status-pill ${
                                            entry.method === 'Self' ? 'solid-green' :
                                            entry.method === 'Proxy' ? 'solid-amber' :
                                            'solid-grey'
                                        }`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                                            {entry.method}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{entry.proxyBy}</td>
                                    <td style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }} title={entry.notes}>
                                        {entry.notes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 4. Analytics Panel */}
            <div className="panel" style={{ padding: '0', marginBottom: '24px' }}>
                <div 
                    onClick={() => setShowAnalytics(!showAnalytics)}
                    style={{ 
                        padding: '16px 24px', display: 'flex', justifyContent: 'space-between', 
                        alignItems: 'center', cursor: 'pointer', backgroundColor: 'var(--bg-surface-hover)',
                        borderRadius: showAnalytics ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)'
                    }}
                >
                    <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <BarChart3 size={18} style={{ color: 'var(--accent-blue)' }} />
                        Workforce Analytics
                    </h3>
                    <button style={{ background: 'none', border: 'none', fontWeight: '600', color: 'var(--accent-blue)', fontSize: '13px' }}>
                        {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
                    </button>
                </div>

                {showAnalytics && (
                    <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', borderTop: '1px solid var(--border-subtle)' }}>
                        {/* A. Donut Chart */}
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Attendance Distribution (Today)</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flex: 1, justifyContent: 'center' }}>
                                <svg width="80" height="80" viewBox="0 0 36 36">
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-green)" strokeWidth="4" strokeDasharray="75 25" strokeDashoffset="25" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-amber)" strokeWidth="4" strokeDasharray="15 85" strokeDashoffset="50" />
                                    <circle cx="18" cy="18" r="15.915" fill="none" stroke="var(--accent-red)" strokeWidth="4" strokeDasharray="10 90" strokeDashoffset="65" />
                                </svg>
                                <div style={{ fontSize: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div> Present (75%)</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)' }}></div> Late (15%)</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }}></div> Absent (10%)</div>
                                </div>
                            </div>
                        </div>

                        {/* B. Site-wise Presence */}
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Site-wise Presence</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, justifyContent: 'center' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                                        <span>Grand Tower MEP</span>
                                        <strong>8 Headcount</strong>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: '45%', backgroundColor: 'var(--accent-blue)' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                                        <span>Mall Extension</span>
                                        <strong>12 Headcount</strong>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: '65%', backgroundColor: 'var(--accent-blue)' }} />
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '2px' }}>
                                        <span>Sunrise Apartments</span>
                                        <strong>18 Headcount</strong>
                                    </div>
                                    <div style={{ height: '8px', backgroundColor: 'var(--bg-base)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ height: '100%', width: '90%', backgroundColor: 'var(--accent-blue)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* C. Anomaly Summary */}
                        <div 
                            onClick={() => setActiveView('view-alerts')}
                            style={{ 
                                border: '1px solid var(--accent-red-border)', borderRadius: 'var(--radius-md)', 
                                padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px',
                                backgroundColor: 'var(--accent-red-bg)', cursor: 'pointer', transition: 'var(--transition-fast)'
                            }}
                            onMouseOver={e => e.currentTarget.style.opacity = 0.9}
                            onMouseOut={e => e.currentTarget.style.opacity = 1}
                        >
                            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--accent-red)' }}>Active Alerts / Anomalies</h4>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '4px' }}>
                                <span style={{ fontSize: '32px', fontWeight: '800', color: 'var(--accent-red)' }}>3</span>
                                <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: '1.4' }}>
                                    • 1 Early sign-off (Grand Tower)<br />
                                    • 1 Proxy without reason (Grand Tower)<br />
                                    • 1 Unexcused Absence (Mall Extension)
                                </div>
                            </div>
                            <span style={{ fontSize: '11px', color: 'var(--accent-red)', fontWeight: '600', marginTop: 'auto', textDecoration: 'underline' }}>
                                View Details on Alerts page &rarr;
                            </span>
                        </div>

                        {/* D. Weekly Trend */}
                        <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <h4 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>Weekly Check-ins</h4>
                            <svg viewBox="0 0 100 40" style={{ width: '100%', height: '70px', marginTop: '6px' }}>
                                {/* Horizontal gridlines */}
                                <line x1="0" y1="10" x2="100" y2="10" stroke="#f1f5f9" strokeWidth="0.5" />
                                <line x1="0" y1="20" x2="100" y2="20" stroke="#f1f5f9" strokeWidth="0.5" />
                                <line x1="0" y1="30" x2="100" y2="30" stroke="#f1f5f9" strokeWidth="0.5" />
                                
                                {/* Traced line path */}
                                <path 
                                    d="M 5 35 L 20 28 L 35 22 L 50 12 L 65 15 L 80 5 L 95 8" 
                                    fill="none" 
                                    stroke="var(--accent-blue)" 
                                    strokeWidth="1.5" 
                                    strokeLinecap="round"
                                />
                                
                                {/* Points */}
                                <circle cx="5" cy="35" r="1" fill="var(--accent-blue)" />
                                <circle cx="20" cy="28" r="1" fill="var(--accent-blue)" />
                                <circle cx="35" cy="22" r="1" fill="var(--accent-blue)" />
                                <circle cx="50" cy="12" r="1" fill="var(--accent-blue)" />
                                <circle cx="65" cy="15" r="1" fill="var(--accent-blue)" />
                                <circle cx="80" cy="5" r="1" fill="var(--accent-blue)" />
                                <circle cx="95" cy="8" r="1" fill="var(--accent-blue)" />
                            </svg>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-muted)', padding: '0 2px' }}>
                                <span>19 Jun</span>
                                <span>21 Jun</span>
                                <span>23 Jun</span>
                                <span>25 Jun</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* 5. Manual Attendance Modal */}
            {showManualModal && (
                <div className="modal-overlay active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
                    <div className="panel" style={{ width: '100%', maxWidth: '460px', padding: '0', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        {/* Header */}
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Log Manual Attendance</h3>
                            <button onClick={() => setShowManualModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={18} /></button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleManualSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {/* Worker */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>WORKER NAME *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Aarav Sharma"
                                    value={manualWorker}
                                    onChange={e => setManualWorker(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            {/* Project */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>PROJECT SITE *</label>
                                <select 
                                    value={manualProject}
                                    onChange={e => setManualProject(e.target.value)}
                                    required
                                    style={inputStyle}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.name}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Shifts */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>CHECK-IN TIME</label>
                                    <input 
                                        type="time" 
                                        value={manualCheckIn}
                                        onChange={e => setManualCheckIn(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>CHECK-OUT TIME</label>
                                    <input 
                                        type="time" 
                                        value={manualCheckOut}
                                        onChange={e => setManualCheckOut(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Notes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>NOTES / REASON</label>
                                <textarea 
                                    placeholder="Brief explanation for manual override..."
                                    value={manualNotes}
                                    onChange={e => setManualNotes(e.target.value)}
                                    rows={3}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" onClick={() => setShowManualModal(false)} className="btn" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={!manualWorker || !manualProject} className="btn primary" style={{ opacity: (!manualWorker || !manualProject) ? 0.6 : 1, cursor: (!manualWorker || !manualProject) ? 'not-allowed' : 'pointer' }}>
                                    Log Attendance
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

// Styling input helpers
const inputStyle = {
    padding: '10px 12px',
    border: '1px solid var(--border-subtle)',
    borderRadius: 'var(--radius-md)',
    backgroundColor: 'var(--bg-base)',
    color: 'var(--text-primary)',
    fontSize: '14px',
    outline: 'none',
    width: '100%'
};
