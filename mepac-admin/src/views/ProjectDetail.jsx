import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, MapPin, Users, Plus, Search, X, UserPlus, Trash2, FileText, Download, MoreVertical, Pencil, Upload, XCircle, RefreshCcw } from 'lucide-react';
import { getProjectColor } from '../utils/colors';
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function ProjectDetail({ projectId, project, setActiveView, openModal, workforce, onAssignWorker, onRemoveWorker }) {
    const [activeRoleTab, setActiveRoleTab] = useState('All');
    const [showAssignUI, setShowAssignUI] = useState(false);
    const [assignRole, setAssignRole] = useState('');
    const [assignSearch, setAssignSearch] = useState('');
    const [workerToRemove, setWorkerToRemove] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const employees = useQuery(api.assignments.getByProject, projectId ? { projectId } : "skip") || [];
    const checkIns = useQuery(api.checkIns.getByProject, projectId ? { projectId } : "skip") || [];
    const blueprints = useQuery(api.blueprints.getByProject, projectId ? { projectId } : "skip") || [];

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setShowMenu(false);
            }
        };
        if (showMenu) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showMenu]);

    if (!project) return null;

    const roleOrder = ['Supervisor', 'Foreman', 'Technician'];
    const baseRoles = [...new Set(employees.map(emp => emp.role))].sort((a, b) => {
        const indexA = roleOrder.indexOf(a);
        const indexB = roleOrder.indexOf(b);
        return (indexA === -1 ? 999 : indexA) - (indexB === -1 ? 999 : indexB);
    });
    const roles = ['All', ...baseRoles];
    const filteredEmployees = activeRoleTab === 'All'
        ? employees
        : employees.filter(emp => emp.role === activeRoleTab);

    // Workers available to assign: match chosen role, not already in project
    const assignedIds = new Set(employees.map(e => e._id));
    const availableWorkers = (workforce || []).filter(w => {
        if (!assignRole) return false;
        if (w.role !== assignRole) return false;
        if (assignedIds.has(w._id)) return false;
        if (assignSearch.length > 0 && !w.name.toLowerCase().includes(assignSearch.toLowerCase())) return false;
        return true;
    });

    const handleAssign = (worker) => {
        onAssignWorker(project._id, worker);
        setAssignSearch('');
    };

    // Build Google Maps URL using coordinates if available, otherwise fallback to location text
    const getMapsUrl = () => {
        if (project.latitude != null && project.longitude != null) {
            return `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`;
        }
        return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location)}`;
    };

    const handleMenuAction = (action) => {
        setShowMenu(false);
        openModal(action);
    };

    return (
        <section className="view active">
            <div className="view-header" style={{ paddingBottom: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <button className="icon-btn" onClick={() => setActiveView('view-projects')} style={{ background: 'var(--bg-surface)' }}>
                            <ArrowLeft size={20} />
                        </button>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <div>
                                <h2 style={{ margin: 0 }}>{project.name}</h2>
                                <p className="subtitle" style={{ margin: 0, marginTop: '4px' }}>Client: {project.client}</p>
                            </div>
                            
                            <a 
                                href={getMapsUrl()}
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    fontSize: '0.8rem',
                                    fontWeight: '500',
                                    padding: '8px 12px',
                                    height: '100%',
                                    backgroundColor: 'var(--bg-surface)',
                                    border: '1px solid var(--border-subtle)',
                                    borderRadius: '12px',
                                    color: 'var(--text-secondary)',
                                    textDecoration: 'none',
                                    transition: 'all 0.2s ease',
                                    marginLeft: '4px',
                                    maxWidth: '220px',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.color = 'var(--accent-blue)';
                                    e.currentTarget.style.borderColor = 'var(--accent-blue)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.color = 'var(--text-secondary)';
                                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                                }}
                                title={project.location}
                            >
                                <MapPin size={16} style={{ color: 'var(--accent-blue)', flexShrink: 0 }} /> 
                                {project.location}
                            </a>
                        </div>
                    </div>

                    {/* Three-dot menu */}
                    <div ref={menuRef} style={{ position: 'relative' }}>
                        <button
                            className="icon-btn"
                            onClick={() => setShowMenu(prev => !prev)}
                            style={{
                                background: showMenu ? 'var(--bg-surface)' : 'transparent',
                                border: showMenu ? '1px solid var(--border-subtle)' : '1px solid transparent',
                                width: '40px',
                                height: '40px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                            }}
                        >
                            <MoreVertical size={20} />
                        </button>

                        {showMenu && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '6px',
                                background: 'white',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 24px -4px rgba(0,0,0,0.12), 0 4px 8px -2px rgba(0,0,0,0.08)',
                                minWidth: '200px',
                                zIndex: 100,
                                overflow: 'hidden',
                                animation: 'menuSlideIn 0.12s ease',
                            }}>
                                <button
                                    onClick={() => handleMenuAction('edit-project')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        width: '100%', padding: '12px 16px',
                                        background: 'transparent', border: 'none',
                                        fontSize: '0.875rem', fontWeight: 500,
                                        color: 'var(--text-primary)', cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Pencil size={16} style={{ color: 'var(--text-secondary)' }} />
                                    Edit Project
                                </button>
                                <button
                                    onClick={() => handleMenuAction('add-blueprint')}
                                    style={{
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        width: '100%', padding: '12px 16px',
                                        background: 'transparent', border: 'none',
                                        fontSize: '0.875rem', fontWeight: 500,
                                        color: 'var(--text-primary)', cursor: 'pointer',
                                        transition: 'background 0.1s ease',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-surface)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    <Upload size={16} style={{ color: 'var(--text-secondary)' }} />
                                    Upload Blueprint
                                </button>

                                <div style={{ height: '1px', background: 'var(--border-subtle)', margin: '4px 0' }} />

                                {project.isCompleted ? (
                                    <button
                                        onClick={() => handleMenuAction('reopen-project')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '12px 16px',
                                            background: 'transparent', border: 'none',
                                            fontSize: '0.875rem', fontWeight: 600,
                                            color: 'var(--accent-blue)', cursor: 'pointer',
                                            transition: 'background 0.1s ease',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(59, 130, 246, 0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <RefreshCcw size={16} style={{ color: 'var(--accent-blue)' }} />
                                        Reopen Project
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleMenuAction('end-project')}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '10px',
                                            width: '100%', padding: '12px 16px',
                                            background: 'transparent', border: 'none',
                                            fontSize: '0.875rem', fontWeight: 600,
                                            color: '#dc2626', cursor: 'pointer',
                                            transition: 'background 0.1s ease',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(220, 38, 38, 0.05)'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        <XCircle size={16} style={{ color: '#dc2626' }} />
                                        End Project
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="project-detail-layout">
                <div className="project-detail-main">
                    <div className="project-detail-hero" style={{ 
                        backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
                        backgroundColor: project.imageUrl ? 'transparent' : getProjectColor(project._id)
                    }}>
                        <div className="hero-overlay"></div>
                        <div className="hero-content" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                            {project.isCompleted ? (
                                <span className="status-badge" style={{ background: 'var(--text-muted)' }}>Completed</span>
                            ) : (
                                <span className="status-badge">Active Site</span>
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
                            <div className="metric-value">{project.totalAssigned || (project.employeesPresent + employees.length)}</div>
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
                                {(checkIns || []).length > 0 ? checkIns.map((log, i) => (
                                    <tr key={i} className={log.type === 'Proxy' ? 'row-amber' : ''}>
                                        <td>
                                            <div className="worker-cell">
                                                <div className="avatar-small blue">{log.initials}</div>
                                                {log.name}
                                            </div>
                                        </td>
                                        <td>{new Date(log.checkInTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</td>
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
                            <h3>Project Blueprints</h3>
                        </div>
                        <div style={{ padding: '0 16px 16px 16px' }}>
                            {(blueprints || []).length > 0 ? blueprints.map(bp => (
                                <div key={bp._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ padding: '8px', backgroundColor: 'var(--bg-surface)', borderRadius: 'var(--radius-sm)' }}>
                                            <FileText size={18} color="var(--accent-blue)" />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{bp.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{bp.latestRevision ? `v${bp.currentVersion}` : ''}</div>
                                        </div>
                                    </div>
                                    <button className="icon-btn" title="Download" style={{ color: 'var(--text-muted)' }} onClick={() => bp.fileUrl && window.open(bp.fileUrl)}>
                                        <Download size={16} />
                                    </button>
                                </div>
                            )) : (
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                                    No blueprints uploaded.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="panel">
                        <div className="panel-header">
                            <h3>Assigned Workforce</h3>
                            {!showAssignUI && (
                                <button
                                    className="btn primary"
                                    style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                    onClick={() => setShowAssignUI(true)}
                                >
                                    <UserPlus size={14} /> Assign
                                </button>
                            )}
                        </div>

                        {/* Assign Worker UI */}
                        {showAssignUI && (
                            <div style={{
                                background: 'var(--bg-base)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: 'var(--radius-md)',
                                padding: '14px',
                                marginBottom: '16px',
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Assign Worker</span>
                                    <button
                                        className="icon-btn"
                                        style={{ width: '28px', height: '28px', border: 'none' }}
                                        onClick={() => { setShowAssignUI(false); setAssignRole(''); setAssignSearch(''); }}
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                                <div style={{ marginBottom: '10px' }}>
                                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Select Role</label>
                                    <select
                                        value={assignRole}
                                        onChange={e => { setAssignRole(e.target.value); setAssignSearch(''); }}
                                        style={{
                                            width: '100%',
                                            padding: '8px 10px',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-subtle)',
                                            fontSize: '0.85rem',
                                            color: 'var(--text-primary)',
                                            backgroundColor: 'var(--bg-surface)',
                                        }}
                                    >
                                        <option value="">Choose a role...</option>
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Foreman">Foreman</option>
                                        <option value="Technician">Technician</option>
                                    </select>
                                </div>

                                {assignRole && (
                                    <>
                                        <div style={{ marginBottom: '8px' }}>
                                            <div style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                                padding: '7px 10px',
                                                borderRadius: 'var(--radius-md)',
                                                border: '1px solid var(--border-subtle)',
                                                backgroundColor: 'var(--bg-surface)',
                                            }}>
                                                <Search size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
                                                <input
                                                    type="text"
                                                    value={assignSearch}
                                                    onChange={e => setAssignSearch(e.target.value)}
                                                    placeholder={`Search ${assignRole}s...`}
                                                    style={{
                                                        border: 'none',
                                                        outline: 'none',
                                                        background: 'transparent',
                                                        fontSize: '0.85rem',
                                                        width: '100%',
                                                        color: 'var(--text-primary)',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
                                            {availableWorkers.length > 0 ? availableWorkers.map(w => (
                                                <div
                                                    key={w._id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'space-between',
                                                        padding: '8px 4px',
                                                        borderBottom: '1px solid var(--border-subtle)',
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <div className="avatar-small blue">{w.initials}</div>
                                                        <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{w.name}</span>
                                                    </div>
                                                    <button
                                                        className="btn primary"
                                                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                                                        onClick={() => handleAssign(w)}
                                                    >
                                                        <Plus size={12} /> Add
                                                    </button>
                                                </div>
                                            )) : (
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '16px 0' }}>
                                                    {assignSearch ? 'No matching workers found.' : `No unassigned ${assignRole}s available.`}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

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
                                <div key={emp._id || i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div className="avatar-small blue">{emp.initials}</div>
                                        <div>
                                            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{emp.name}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{emp.role}</div>
                                        </div>
                                    </div>
                                    {workerToRemove === emp._id ? (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Remove?</span>
                                            <button
                                                onClick={() => {
                                                    onRemoveWorker(project._id, emp._id);
                                                    setWorkerToRemove(null);
                                                }}
                                                style={{
                                                    background: 'var(--accent-red)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '4px 8px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                    fontWeight: '600'
                                                }}
                                            >
                                                Yes
                                            </button>
                                            <button
                                                onClick={() => setWorkerToRemove(null)}
                                                style={{
                                                    background: 'transparent',
                                                    color: 'var(--text-secondary)',
                                                    border: '1px solid var(--border-subtle)',
                                                    borderRadius: 'var(--radius-sm)',
                                                    padding: '3px 7px',
                                                    fontSize: '0.75rem',
                                                    cursor: 'pointer',
                                                }}
                                            >
                                                No
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            onClick={() => setWorkerToRemove(emp._id)}
                                            title="Remove from project"
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: 'var(--text-muted)',
                                                padding: '4px',
                                                borderRadius: 'var(--radius-sm)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                transition: 'color 0.15s ease',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent-red)'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    )}
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
