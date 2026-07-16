import React, { useState } from 'react';
import { ArrowLeft, MapPin, Users, Building, Activity } from 'lucide-react';

export default function ProjectDetail({ project, setActiveView, openModal }) {
    const [activeRoleTab, setActiveRoleTab] = useState('All');

    if (!project) return null;

    const roles = ['All', ...new Set(project.employees.map(emp => emp.role))];
    const filteredEmployees = activeRoleTab === 'All'
        ? project.employees
        : project.employees.filter(emp => emp.role === activeRoleTab);

    return (
        <section className="view active">
            <div className="view-header" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="icon-btn" onClick={() => setActiveView('view-projects')} style={{ background: 'var(--bg-surface)' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h2 style={{ margin: 0 }}>{project.name}</h2>
                            <p className="subtitle" style={{ margin: 0, marginTop: '4px' }}>{project.client} • {project.location}</p>
                        </div>
                    </div>
                    <div>
                        <button className="btn secondary" onClick={() => openModal('add-blueprint')}>Upload Blueprint</button>
                    </div>
                </div>
            </div>

            <div className="project-detail-layout">
                <div className="project-detail-main">
                    <div className="project-detail-hero" style={{ backgroundImage: `url(${project.imageUrl})` }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            {project.isCompleted ? (
                                <>
                                    <span className="status-badge" style={{ background: 'var(--text-muted)' }}>Completed</span>
                                    <button 
                                        className="btn secondary"
                                        style={{ backgroundColor: 'white', color: 'var(--text-primary)', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}
                                        onClick={() => openModal('reopen-project')}
                                    >
                                        Reopen Project
                                    </button>
                                </>
                            ) : (
                                <>
                                    <span className="status-badge">Active Site</span>
                                    <button 
                                        className="btn" 
                                        style={{ 
                                            backgroundColor: '#ef4444', 
                                            color: 'white', 
                                            border: '2px solid white',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                                            fontWeight: '600'
                                        }} 
                                        onClick={() => openModal('end-project')}
                                    >
                                        End Project
                                    </button>
                                </>
                            )}
                        </div>
                    </div>


                    <div className="metrics-row">
                        <div className="metric-card">
                            <div className="metric-header">Active On-Site</div>
                            <div className="metric-value">{project.employeesPresent}</div>
                            <div className="metric-desc highlight-green">Checked-in today</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">Total Assigned</div>
                            <div className="metric-value">{project.totalAssigned || (project.employeesPresent + project.employees.length)}</div>
                            <div className="metric-desc">Registered to project</div>
                        </div>
                        <div className="metric-card">
                            <div className="metric-header">Completion</div>
                            <div className="metric-value">{project.percent}%</div>
                            <div className="metric-desc">Headcount fulfilled</div>
                        </div>
                    </div>

                    <div className="panel" style={{ marginTop: '24px' }}>
                        <div className="panel-header">
                            <h3>Today's Check-in Log</h3>
                        </div>
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>EMPLOYEE</th>
                                    <th>TIME IN</th>
                                    <th>METHOD</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(project.checkIns || []).length > 0 ? project.checkIns.map((log, i) => (
                                    <tr key={i} className={log.type === 'Proxy' ? 'row-amber' : ''}>
                                        <td>
                                            <div className="worker-cell">
                                                <div className="avatar-small blue">{log.initials}</div>
                                                {log.name}
                                            </div>
                                        </td>
                                        <td>{log.time}</td>
                                        <td>
                                            {log.type === 'Proxy'
                                                ? <span className="status-pill outline-amber">Proxy (Supervisor)</span>
                                                : <span className="status-pill solid-grey">Standard</span>}
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="3" style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px' }}>
                                            No check-ins recorded today.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                </div>

                <div className="project-detail-sidebar">
                    <div className="panel" style={{ marginBottom: '24px' }}>
                        <div className="panel-header">
                            <h3>Location & Map</h3>
                        </div>
                        <div className="map-preview-widget">
                            <img src="/images/map_placeholder.png" alt="Map Preview" style={{ width: '100%', height: '200px', objectFit: 'cover', borderBottom: '1px solid var(--border-subtle)' }} />
                            <div style={{ padding: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                    <MapPin size={18} style={{ color: 'var(--accent-blue)', flexShrink: 0, marginTop: '2px' }} />
                                    <div>
                                        <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{project.location}</div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>Coordinates available in GIS database.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <h3>Assigned Workforce</h3>
                        </div>

                        <div className="tabs-container" style={{ borderBottom: '1px solid var(--border-subtle)', marginBottom: '12px', overflowX: 'auto', display: 'flex' }}>
                            {roles.map(role => (
                                <button
                                    key={role}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        padding: '10px 16px',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        fontWeight: activeRoleTab === role ? 600 : 400,
                                        color: activeRoleTab === role ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                        borderBottom: activeRoleTab === role ? '2px solid var(--accent-blue)' : '2px solid transparent',
                                        whiteSpace: 'nowrap'
                                    }}
                                    onClick={() => setActiveRoleTab(role)}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>

                        <div style={{ padding: '0 16px 16px 16px', maxHeight: '300px', overflowY: 'auto' }}>
                            {filteredEmployees.map((emp, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                                    <div className="avatar-small blue">{emp.initials}</div>
                                    <div>
                                        <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.role}</div>
                                    </div>
                                </div>
                            ))}
                            {filteredEmployees.length === 0 && (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>No workers found for this role.</div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
