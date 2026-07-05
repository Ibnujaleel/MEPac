import React, { useState } from 'react';
import { 
    Users, UserCheck, Wrench, UserPlus, Phone, Building2, XCircle, MoreVertical, 
    ChevronDown, ChevronUp, Search, Filter, Eye, Edit2, ShieldAlert, X, Shield, Plus
} from 'lucide-react';
import WorkerProfile from './WorkerProfile';

export default function Workforce({ projects }) {
    const [viewingWorker, setViewingWorker] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    
    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [projectFilter, setProjectFilter] = useState('All');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    
    // Sorting state
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Row Action Dropdown state
    const [activeRowMenu, setActiveRowMenu] = useState(null);

    // Modal state inputs
    const [newName, setNewName] = useState('');
    const [newRole, setNewRole] = useState('Technician');
    const [newMobile, setNewMobile] = useState('');
    const [newProjects, setNewProjects] = useState([]);
    const [newPin, setNewPin] = useState('');
    const [newEmergencyName, setNewEmergencyName] = useState('');
    const [newEmergencyPhone, setNewEmergencyPhone] = useState('');

    // Mock Workers Data (Indian names, June 2026 dates)
    const [workers, setWorkers] = useState([
        { id: 1, name: 'Aarav Sharma', role: 'Supervisor', phone: '98765 43210', projects: ['Grand Tower MEP', 'Mall Extension'], status: 'Active', adoption: 'Active' },
        { id: 2, name: 'Priya Nair', role: 'Technician', phone: '91234 56789', projects: ['Mall Extension'], status: 'Active', adoption: 'Proxy Only' },
        { id: 3, name: 'Sanjay Gupta', role: 'Foreman', phone: '98123 45678', projects: ['City Center Mall', 'Sunrise Apartments'], status: 'Active', adoption: 'Mixed' },
        { id: 4, name: 'Rohan Patel', role: 'Technician', phone: '97654 32109', projects: ['Sunrise Apartments'], status: 'Active', adoption: 'Active' },
        { id: 5, name: 'Amit Mishra', role: 'Technician', phone: '95432 10987', projects: ['Grand Tower MEP', 'City Center Mall', 'Mall Extension'], status: 'Active', adoption: 'Active' },
        { id: 6, name: 'Neha Rao', role: 'Foreman', phone: '99887 76655', projects: ['Mall Extension'], status: 'Active', adoption: 'Active' },
        { id: 7, name: 'Vikram Singh', role: 'Technician', phone: '98877 66554', projects: ['Sunrise Apartments'], status: 'Inactive', adoption: 'Proxy Only' },
        { id: 8, name: 'Rajesh Kumar', role: 'Supervisor', phone: '97766 55443', projects: ['City Center Mall'], status: 'Inactive', adoption: 'Mixed' }
    ]);

    if (viewingWorker) {
        return <WorkerProfile onBack={() => setViewingWorker(null)} />;
    }

    // Toggle active status
    const handleToggleStatus = (id) => {
        setWorkers(prev => prev.map(w => 
            w.id === id ? { ...w, status: w.status === 'Active' ? 'Inactive' : 'Active' } : w
        ));
        setActiveRowMenu(null);
    };

    // Form Submission: Add Worker
    const handleAddWorkerSubmit = (e) => {
        e.preventDefault();
        const newWorker = {
            id: Date.now(),
            name: newName,
            role: newRole,
            phone: newMobile,
            projects: newProjects,
            status: 'Active',
            adoption: 'Active'
        };
        setWorkers(prev => [newWorker, ...prev]);
        resetAddModal();
    };

    const resetAddModal = () => {
        setShowAddModal(false);
        setNewName('');
        setNewRole('Technician');
        setNewMobile('');
        setNewProjects([]);
        setNewPin('');
        setNewEmergencyName('');
        setNewEmergencyPhone('');
    };

    const handleProjectTagToggle = (projName) => {
        setNewProjects(prev => 
            prev.includes(projName) 
                ? prev.filter(p => p !== projName)
                : [...prev, projName]
        );
    };

    // Filter Logic
    const filteredWorkers = workers.filter(w => {
        const matchesSearch = w.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              w.role.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesProject = projectFilter === 'All' || w.projects.includes(projectFilter);
        const matchesRole = roleFilter === 'All' || w.role === roleFilter;
        const matchesStatus = statusFilter === 'All' || w.status === statusFilter;
        return matchesSearch && matchesProject && matchesRole && matchesStatus;
    });

    // Sorting Logic
    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedWorkers = [...filteredWorkers].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedWorkers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(sortedWorkers.length / itemsPerPage);

    const changePage = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    // Role Icon helper
    const getRoleIcon = (role) => {
        if (role === 'Supervisor') return <UserCheck size={14} style={{ color: 'var(--accent-blue)' }} />;
        if (role === 'Foreman') return <Shield size={14} style={{ color: 'var(--accent-amber)' }} />;
        return <Wrench size={14} style={{ color: 'var(--text-secondary)' }} />;
    };

    // App Adoption helper
    const getAdoptionBadge = (adoption) => {
        if (adoption === 'Active') return <span className="status-pill solid-green" style={{ fontSize: '11px' }}>🟢 Active</span>;
        if (adoption === 'Mixed') return <span className="status-pill solid-amber" style={{ fontSize: '11px' }}>🟡 Mixed</span>;
        return <span className="status-pill solid-red" style={{ fontSize: '11px' }}>🔴 Proxy Only</span>;
    };

    // Clocked-in groupings (grouped by active project)
    const onSiteWorkers = [
        { name: 'Aarav Sharma', role: 'Supervisor', project: 'Grand Tower MEP', checkIn: '08:02 AM', method: 'Self' },
        { name: 'Neha Rao', role: 'Foreman', project: 'Mall Extension', checkIn: '08:00 AM', method: 'Self' },
        { name: 'Priya Nair', role: 'Technician', project: 'Mall Extension', checkIn: '08:15 AM', method: 'Proxy' },
        { name: 'Rohan Patel', role: 'Technician', project: 'Sunrise Apartments', checkIn: '09:30 AM', method: 'Manual' }
    ];

    // Grouping by project helper
    const groupedOnSite = onSiteWorkers.reduce((acc, curr) => {
        if (!acc[curr.project]) acc[curr.project] = [];
        acc[curr.project].push(curr);
        return acc;
    }, {});

    return (
        <section className="view active">
            
            {/* View Header */}
            <div className="view-header" style={{ marginBottom: '20px' }}>
                <div>
                    <h2>Workforce Directory</h2>
                    <p className="subtitle">Manage project assignments, mobile PIN access, and track live site presence.</p>
                </div>
            </div>

            {/* 1. Live Metrics Strip */}
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '24px' }}>
                <div style={{ flex: 1, minWidth: '180px', padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Total Workers</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {workers.length} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>({workers.filter(w => w.status === 'Active').length} Active)</span>
                    </div>
                </div>
                
                <div style={{ flex: 1, minWidth: '180px', padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--accent-green)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        On Site Now <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></span>
                    </span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {onSiteWorkers.length} <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>clocked in</span>
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '180px', padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--accent-amber)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Pending Absences</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>1</div>
                </div>

                <div style={{ flex: 1, minWidth: '180px', padding: '12px 16px', backgroundColor: 'var(--bg-surface)', borderLeft: '4px solid var(--accent-red)', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '600', textTransform: 'uppercase' }}>Proxy-Only Workers</span>
                    <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', marginTop: '4px' }}>
                        {workers.filter(w => w.adoption === 'Proxy Only').length}
                    </div>
                </div>
            </div>

            {/* 2. "On Site Now" Quick List */}
            <div className="panel" style={{ padding: '16px', marginBottom: '24px' }}>
                <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '8px', marginBottom: '12px' }}>
                    <h3 style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Users size={16} style={{ color: 'var(--accent-green)' }} />
                        On Site Now (Project Groups)
                    </h3>
                </div>
                
                {onSiteWorkers.length > 0 ? (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                        {Object.keys(groupedOnSite).map(projName => (
                            <div key={projName} style={{ minWidth: '220px', flex: '1 1 0%', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '12px', backgroundColor: 'var(--bg-base)' }}>
                                <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                                    <Building2 size={12} /> {projName}
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    {groupedOnSite[projName].map((w, idx) => (
                                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', backgroundColor: 'var(--bg-surface)', padding: '6px 8px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                                            <div>
                                                <strong style={{ color: 'var(--text-primary)' }}>{w.name}</strong>
                                                <span style={{ color: 'var(--text-secondary)', marginLeft: '6px', fontSize: '11px' }}>({w.role})</span>
                                            </div>
                                            <span style={{ fontSize: '10px', padding: '2px 6px', borderRadius: '4px', backgroundColor: w.method === 'Proxy' ? 'var(--status-delayed-bg)' : 'var(--status-on-track-bg)', color: w.method === 'Proxy' ? 'var(--status-delayed-text)' : 'var(--status-on-track-text)', fontWeight: '600' }}>
                                                {w.checkIn} ({w.method})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', padding: '8px 0' }}>No workers on site right now.</div>
                )}
            </div>

            {/* 3. Controls Bar */}
            <div className="panel" style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px' }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, minWidth: '180px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search name or role..."
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

                {/* Project Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '13px' }}>
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

                {/* Role Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '13px' }}>
                    <Users size={14} style={{ color: 'var(--text-secondary)' }} />
                    <select 
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                        style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                    >
                        <option value="All">All Roles</option>
                        <option value="Supervisor">Supervisor</option>
                        <option value="Foreman">Foreman</option>
                        <option value="Technician">Technician</option>
                    </select>
                </div>

                {/* Status Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '13px' }}>
                    <Circle size={10} style={{ color: 'var(--text-secondary)', fill: 'currentColor' }} />
                    <select 
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                        style={{ border: 'none', background: 'none', fontSize: '13px', outline: 'none', cursor: 'pointer', fontWeight: '500' }}
                    >
                        <option value="All">All Statuses</option>
                        <option value="Active">Active Only</option>
                        <option value="Inactive">Inactive Only</option>
                    </select>
                </div>

                {/* Add Worker Trigger */}
                <button onClick={() => setShowAddModal(true)} className="btn primary" style={{ padding: '8px 16px' }}>
                    <UserPlus size={16} /> Add Worker
                </button>
            </div>

            {/* 4. Workers Table */}
            <div className="panel" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer' }}>
                                    WORKER NAME {sortConfig.key === 'name' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />) : null}
                                </th>
                                <th onClick={() => handleSort('role')} style={{ cursor: 'pointer' }}>
                                    ROLE {sortConfig.key === 'role' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />) : null}
                                </th>
                                <th>PHONE</th>
                                <th>ASSIGNED PROJECTS</th>
                                <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                                    STATUS {sortConfig.key === 'status' ? (sortConfig.direction === 'asc' ? <ChevronUp size={12} style={{ display: 'inline' }} /> : <ChevronDown size={12} style={{ display: 'inline' }} />) : null}
                                </th>
                                <th>APP ADOPTION</th>
                                <th style={{ textAlign: 'right' }}>ACTIONS</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(worker => (
                                <tr 
                                    key={worker.id}
                                    style={{
                                        opacity: worker.status === 'Inactive' ? 0.5 : 1,
                                        transition: 'opacity 0.25s ease'
                                    }}
                                >
                                    <td>
                                        <button 
                                            onClick={() => setViewingWorker(worker)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--accent-blue)', fontWeight: '600', padding: 0, textDecoration: 'underline'
                                            }}
                                        >
                                            {worker.name}
                                        </button>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
                                            {getRoleIcon(worker.role)}
                                            {worker.role}
                                        </div>
                                    </td>
                                    <td style={{ fontFamily: 'monospace', fontSize: '13px' }}>{worker.phone}</td>
                                    <td style={{ fontSize: '13px' }}>
                                        {worker.projects.slice(0, 2).join(', ')}
                                        {worker.projects.length > 2 && (
                                            <span style={{ color: 'var(--accent-blue)', fontWeight: '600', marginLeft: '4px' }}>
                                                +{worker.projects.length - 2} more
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <span className={`status-pill ${worker.status === 'Active' ? 'solid-green' : 'solid-grey'}`} style={{ fontSize: '11px' }}>
                                            {worker.status}
                                        </span>
                                    </td>
                                    <td>{getAdoptionBadge(worker.adoption)}</td>
                                    <td style={{ textAlign: 'right', position: 'relative' }}>
                                        <button 
                                            onClick={() => setActiveRowMenu(activeRowMenu === worker.id ? null : worker.id)}
                                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {/* Actions Dropdown Card */}
                                        {activeRowMenu === worker.id && (
                                            <div style={{
                                                position: 'absolute', right: '12px', top: '36px',
                                                backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)', zIndex: 100,
                                                display: 'flex', flexDirection: 'column', width: '150px'
                                            }}>
                                                <button 
                                                    onClick={() => setViewingWorker(worker)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', fontSize: '13px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)' }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <Eye size={12} /> View Profile
                                                </button>
                                                <button 
                                                    onClick={() => handleToggleStatus(worker.id)}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', textAlign: 'left', fontSize: '13px', cursor: 'pointer', color: worker.status === 'Active' ? 'var(--accent-red)' : 'var(--accent-green)' }}
                                                    onMouseOver={e => e.currentTarget.style.backgroundColor = 'var(--bg-surface-hover)'}
                                                    onMouseOut={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                                >
                                                    <XCircle size={12} /> {worker.status === 'Active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div style={{ padding: '12px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, sortedWorkers.length)} of {sortedWorkers.length} workers
                    </span>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                            onClick={() => changePage(currentPage - 1)} 
                            disabled={currentPage === 1}
                            className="btn secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px', opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => changePage(currentPage + 1)} 
                            disabled={currentPage === totalPages}
                            className="btn secondary" 
                            style={{ padding: '6px 12px', fontSize: '12px', opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* 5. Add Worker Modal */}
            {showAddModal && (
                <div className="modal-overlay active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
                    <div className="panel" style={{ width: '100%', maxWidth: '480px', padding: '0', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        
                        {/* Modal Header */}
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Add New Worker</h3>
                            <button onClick={resetAddModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={18} /></button>
                        </div>

                        {/* Modal Body / Form */}
                        <form onSubmit={handleAddWorkerSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>FULL NAME *</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Aarav Sharma"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    required
                                    style={inputStyle}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>ROLE *</label>
                                    <select 
                                        value={newRole}
                                        onChange={e => setNewRole(e.target.value)}
                                        style={inputStyle}
                                    >
                                        <option value="Supervisor">Supervisor</option>
                                        <option value="Foreman">Foreman</option>
                                        <option value="Technician">Technician</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>MOBILE NUMBER *</label>
                                    <input 
                                        type="tel" 
                                        placeholder="e.g. 98765 43210"
                                        value={newMobile}
                                        onChange={e => setNewMobile(e.target.value)}
                                        required
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            {/* Assigned Projects Selector */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>ASSIGN TO PROJECTS (SELECT MULTIPLE)</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', padding: '10px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)' }}>
                                    {projects.map(p => {
                                        const isSelected = newProjects.includes(p.name);
                                        return (
                                            <button
                                                key={p.id}
                                                type="button"
                                                onClick={() => handleProjectTagToggle(p.name)}
                                                style={{
                                                    padding: '4px 10px', borderRadius: 'var(--radius-pill)', fontSize: '11px', fontWeight: '600', cursor: 'pointer',
                                                    border: isSelected ? '1px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                                                    backgroundColor: isSelected ? 'var(--accent-blue-bg)' : 'var(--bg-surface)',
                                                    color: isSelected ? 'var(--accent-blue)' : 'var(--text-secondary)'
                                                }}
                                            >
                                                {p.name}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '16px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>MOBILE PIN (4-DIGIT) *</label>
                                    <input 
                                        type="password" 
                                        maxLength={4}
                                        placeholder="****"
                                        value={newPin}
                                        onChange={e => setNewPin(e.target.value)}
                                        required
                                        style={{ ...inputStyle, textAlign: 'center', letterSpacing: '4px' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMERGENCY CONTACT NAME</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Sarah Sharma"
                                        value={newEmergencyName}
                                        onChange={e => setNewEmergencyName(e.target.value)}
                                        style={inputStyle}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMERGENCY PHONE</label>
                                <input 
                                    type="tel" 
                                    placeholder="e.g. 98123 45678"
                                    value={newEmergencyPhone}
                                    onChange={e => setNewEmergencyPhone(e.target.value)}
                                    style={inputStyle}
                                />
                            </div>

                            {/* Footer buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
                                <button type="button" onClick={resetAddModal} className="btn" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={!newName || !newMobile || !newPin} className="btn primary" style={{ opacity: (!newName || !newMobile || !newPin) ? 0.6 : 1, cursor: (!newName || !newMobile || !newPin) ? 'not-allowed' : 'pointer' }}>
                                    Save Worker
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}

// Inline input styles helper
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
