import React, { useState } from 'react';
import { 
    Search, 
    Filter, 
    Check, 
    CheckCircle2, 
    Eye, 
    Calendar,
    ChevronDown,
    X,
    AlertCircle,
    UserCheck,
    AlertTriangle
} from 'lucide-react';
import WorkerProfile from './WorkerProfile';

export default function Alerts({ alerts, setAlerts }) {
    const [viewingWorker, setViewingWorker] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [dateRange, setDateRange] = useState('This Week'); // Default "This Week"

    if (viewingWorker) {
        return <WorkerProfile onBack={() => setViewingWorker(null)} />;
    }

    // Handlers for quick actions
    const handleApprove = (alertId) => {
        setAlerts(prev => prev.map(a => 
            a.id === alertId ? { ...a, status: 'Resolved' } : a
        ));
    };

    const handleResolve = (alertId) => {
        setAlerts(prev => prev.map(a => 
            a.id === alertId ? { ...a, status: 'Resolved' } : a
        ));
    };

    // Filter logic
    const filteredAlerts = alerts.filter(a => {
        const matchesSearch = a.worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              a.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All' || a.type === selectedType;
        
        // Status dropdown maps Open, Acknowledged, Resolved
        const matchesStatus = selectedStatus === 'All' || a.status === selectedStatus;

        return matchesSearch && matchesType && matchesStatus;
    });

    const alertTypes = ['All', 'Absence', 'Early Sign‑off', 'Short Shift', 'Proxy', 'Late Pattern', 'Supervisor Flag'];
    const statusOptions = ['All', 'Open', 'Acknowledged', 'Resolved'];

    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Attendance Alerts</h2>
                    <p className="subtitle">Real-time attendance anomalies across all projects.</p>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="panel" style={{ marginBottom: '20px' }}>
                <div style={{ 
                    display: 'flex', 
                    flexWrap: 'wrap', 
                    gap: '16px', 
                    padding: '16px 24px', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: 'var(--bg-surface-hover)'
                }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center', flex: 1 }}>
                        
                        {/* Worker Search */}
                        <div style={{ position: 'relative', minWidth: '200px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                            <input 
                                type="text"
                                placeholder="Search worker or alert..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
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

                        {/* Date Range Select */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '14px' }}>
                            <Calendar size={14} style={{ color: 'var(--text-secondary)' }} />
                            <select 
                                value={dateRange} 
                                onChange={(e) => setDateRange(e.target.value)}
                                style={{ border: 'none', background: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', paddingRight: '12px' }}
                            >
                                <option value="Today">Today</option>
                                <option value="This Week">This Week</option>
                                <option value="Last 14 Days">Last 14 Days</option>
                                <option value="This Month">This Month</option>
                            </select>
                        </div>

                        {/* Alert Type Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '14px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Type:</span>
                            <select 
                                value={selectedType} 
                                onChange={(e) => setSelectedType(e.target.value)}
                                style={{ border: 'none', background: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', paddingRight: '12px', fontWeight: '500' }}
                            >
                                {alertTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {/* Status Dropdown */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '14px' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Status:</span>
                            <select 
                                value={selectedStatus} 
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                style={{ border: 'none', background: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', paddingRight: '12px', fontWeight: '500' }}
                            >
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {(searchQuery || selectedType !== 'All' || selectedStatus !== 'All') && (
                        <button 
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedType('All');
                                setSelectedStatus('All');
                            }}
                            style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                {/* Alerts List */}
                <div style={{ overflowX: 'auto' }}>
                    {filteredAlerts.length === 0 ? (
                        <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                            <CheckCircle2 size={36} style={{ color: 'var(--accent-green)', margin: '0 auto 12px', display: 'block' }} />
                            <p style={{ fontWeight: '500', margin: 0 }}>No attendance alerts found matching your criteria.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <tr style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)', letterSpacing: '0.05em' }}>
                                    <th style={{ padding: '12px 24px', width: '40px' }}></th>
                                    <th style={{ padding: '12px 24px' }}>Worker</th>
                                    <th style={{ padding: '12px 24px' }}>Project</th>
                                    <th style={{ padding: '12px 24px' }}>Alert Details</th>
                                    <th style={{ padding: '12px 24px' }}>Status</th>
                                    <th style={{ padding: '12px 24px', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAlerts.map(alert => {
                                    const dotColor = alert.status === 'Open' ? 'var(--accent-red)' :
                                                     alert.status === 'Acknowledged' ? 'var(--accent-amber)' :
                                                     'var(--accent-green)';
                                    
                                    return (
                                        <tr key={alert.id} style={{ borderBottom: '1px solid var(--border-subtle)' }} className="hover:bg-surface-container-low transition-colors">
                                            {/* Dot status column */}
                                            <td style={{ padding: '16px 24px', verticalAlign: 'middle', textAlign: 'center' }}>
                                                <span style={{ 
                                                    display: 'inline-block', 
                                                    width: '8px', 
                                                    height: '8px', 
                                                    borderRadius: '50%', 
                                                    backgroundColor: dotColor 
                                                }} />
                                            </td>

                                            {/* Worker */}
                                            <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ 
                                                        width: '32px', 
                                                        height: '32px', 
                                                        borderRadius: '50%', 
                                                        backgroundColor: '#eff6ff', 
                                                        color: 'var(--accent-blue)', 
                                                        display: 'flex', 
                                                        alignItems: 'center', 
                                                        justifyContent: 'center', 
                                                        fontSize: '11px', 
                                                        fontWeight: '700',
                                                        flexShrink: 0
                                                    }}>
                                                        {alert.worker.avatar}
                                                    </div>
                                                    <div>
                                                        <button 
                                                            onClick={() => setViewingWorker(alert.worker)}
                                                            style={{ 
                                                                background: 'none', 
                                                                border: 'none', 
                                                                color: 'var(--accent-blue)', 
                                                                fontWeight: '600', 
                                                                cursor: 'pointer', 
                                                                padding: 0, 
                                                                fontSize: '14px',
                                                                textAlign: 'left'
                                                            }}
                                                            className="hover:underline"
                                                        >
                                                            {alert.worker.name}
                                                        </button>
                                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{alert.worker.role}</p>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Project */}
                                            <td style={{ padding: '16px 24px', verticalAlign: 'middle', fontSize: '13px', fontWeight: '500' }}>
                                                {alert.project}
                                            </td>

                                            {/* Alert details */}
                                            <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                                <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'var(--text-primary)' }}>{alert.title}</p>
                                                <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>{alert.context}</p>
                                            </td>

                                            {/* Status badge */}
                                            <td style={{ padding: '16px 24px', verticalAlign: 'middle' }}>
                                                <span style={{ 
                                                    padding: '2px 8px', 
                                                    borderRadius: '4px', 
                                                    fontSize: '10px', 
                                                    fontWeight: 'bold', 
                                                    textTransform: 'uppercase',
                                                    backgroundColor: alert.status === 'Open' ? '#fee2e2' :
                                                                     alert.status === 'Acknowledged' ? '#fef3c7' :
                                                                     '#dcfce7',
                                                    color: alert.status === 'Open' ? '#991b1b' :
                                                           alert.status === 'Acknowledged' ? '#92400e' :
                                                           '#166534'
                                                }}>
                                                    {alert.status}
                                                </span>
                                            </td>

                                            {/* Actions */}
                                            <td style={{ padding: '16px 24px', textAlign: 'right', verticalAlign: 'middle' }}>
                                                {alert.status === 'Open' ? (
                                                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                                                        <button 
                                                            onClick={() => handleApprove(alert.id)}
                                                            style={{ 
                                                                padding: '4px 12px', 
                                                                borderRadius: '6px', 
                                                                border: '1px solid #16a34a', 
                                                                backgroundColor: 'transparent', 
                                                                color: '#16a34a', 
                                                                fontSize: '12px', 
                                                                fontWeight: '600', 
                                                                cursor: 'pointer' 
                                                            }}
                                                            className="hover:bg-green-50"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button 
                                                            onClick={() => handleResolve(alert.id)}
                                                            style={{ 
                                                                padding: '4px 12px', 
                                                                borderRadius: '6px', 
                                                                border: '1px solid #94a3b8', 
                                                                backgroundColor: 'transparent', 
                                                                color: '#475569', 
                                                                fontSize: '12px', 
                                                                fontWeight: '600', 
                                                                cursor: 'pointer' 
                                                            }}
                                                            className="hover:bg-slate-50"
                                                        >
                                                            Resolve
                                                        </button>
                                                        <button 
                                                            onClick={() => setViewingWorker(alert.worker)}
                                                            style={{ 
                                                                background: 'none', 
                                                                border: 'none', 
                                                                color: 'var(--text-secondary)', 
                                                                cursor: 'pointer', 
                                                                display: 'flex', 
                                                                alignItems: 'center', 
                                                                padding: '4px' 
                                                            }}
                                                            title="Investigate"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Closed</span>
                                                )}
                                            </td>

                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </section>
    );
}
