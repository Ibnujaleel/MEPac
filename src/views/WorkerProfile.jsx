import React, { useState } from 'react';
import { 
    ChevronLeft, Camera, UserX, Plus, Building2, Factory, X, Settings, ShieldCheck, CheckCircle, Zap, AlertTriangle, History, Printer, Save, RotateCcw, Edit2, Download, Search, Filter, Calendar as CalendarIcon, Clock, Check, XCircle
} from 'lucide-react';

export default function WorkerProfile({ onBack }) {
    // 1. Profile Header State
    const [isEditingName, setIsEditingName] = useState(false);
    const [workerName, setWorkerName] = useState('James Peterson');
    const [workerRole, setWorkerRole] = useState('Lead Electrical Technician');
    const [isActive, setIsActive] = useState(true);
    const [mobileNumber, setMobileNumber] = useState('+1 (555) 123-4567');
    const [isEditingMobile, setIsEditingMobile] = useState(false);

    // 2. Personal Details State
    const [isEditingPersonal, setIsEditingPersonal] = useState(false);
    const [useCustomShift, setUseCustomShift] = useState(false);
    const [personalDetails, setPersonalDetails] = useState({
        dob: '1985-05-14',
        email: 'james.peterson@example.com',
        address: '123 Industrial Parkway, Suite 4\nMetro City, MC 90210',
        doj: '2021-03-12',
        emergencyName: 'Sarah Peterson',
        emergencyNumber: '(555) 987-6543',
        shiftStart: '07:00',
        shiftEnd: '16:00',
        lateBuffer: '15',
        flexiSchedule: false
    });

    const handlePersonalDetailChange = (field, value) => {
        setPersonalDetails(prev => ({ ...prev, [field]: value }));
    };

    // 4. Monthly Attendance Calendar State
    const [calendarMonth, setCalendarMonth] = useState(new Date(2026, 5, 1)); // June 2026
    const [activeTooltip, setActiveTooltip] = useState(null);

    // Generate dummy calendar data (simplified for UI)
    const generateCalendarDays = () => {
        const days = [];
        // June 2026 starts on Monday. 30 days.
        for (let i = 1; i <= 30; i++) {
            let status = 'present';
            let details = { in: '06:55 AM', out: '04:05 PM', method: 'Self' };
            
            if (i === 6 || i === 7 || i === 13 || i === 14 || i === 20 || i === 21 || i === 27 || i === 28) {
                status = 'weekend'; // Weekends
                details = null;
            } else if (i === 10) {
                status = 'absent';
                details = { note: 'Unexcused absence' };
            } else if (i === 17 || i === 18) {
                status = 'leave';
                details = { note: 'Approved sick leave' };
            } else if (i === 24) {
                status = 'late';
                details = { in: '07:30 AM', out: '04:15 PM', method: 'Self' };
            } else if (i === 2) {
                details = { in: '07:00 AM', out: '04:00 PM', method: 'Proxy by M. Chen' };
            }

            days.push({ day: i, status, details });
        }
        return days;
    };
    const calendarDays = generateCalendarDays();

    // 5. Attendance History State
    const attendanceHistory = [
        { id: 1, date: '2026-06-24', project: 'Skylight Plaza', in: '07:30 AM', out: '04:15 PM', hours: '8.75', method: 'Self', proxyBy: '-', reason: 'Late due to traffic' },
        { id: 2, date: '2026-06-23', project: 'Skylight Plaza', in: '06:58 AM', out: '04:02 PM', hours: '9.0', method: 'Self', proxyBy: '-', reason: '-' },
        { id: 3, date: '2026-06-22', project: 'Skylight Plaza', in: '07:00 AM', out: '04:00 PM', hours: '9.0', method: 'Proxy', proxyBy: 'M. Chen', reason: 'Forgot phone' },
        { id: 4, date: '2026-06-19', project: 'North Industrial', in: '08:00 AM', out: '05:00 PM', hours: '9.0', method: 'Manual', proxyBy: 'Admin', reason: 'System error' },
    ];

    // 6. Absence History State
    const absenceHistory = [
        { id: 1, date: '2026-06-17 to 2026-06-18', reason: 'Sick Leave', status: 'Approved', adminNote: 'Doctor note provided.' },
        { id: 2, date: '2026-07-05', reason: 'Personal Emergency', status: 'Pending', adminNote: '' },
        { id: 3, date: '2026-05-10', reason: 'Vacation', status: 'Rejected', adminNote: 'Too many on leave.' },
    ];

    // 7. Project Assignment History
    const projectHistory = [
        { id: 1, name: 'Skylight Plaza Towers', role: 'Lead Electrical Tech', from: '2025-01-15', to: 'Present' },
        { id: 2, name: 'North Industrial Park Phase II', role: 'Electrical Tech', from: '2023-08-01', to: 'Present' },
        { id: 3, name: 'Grand Avenue Mall', role: 'Electrical Tech', from: '2021-03-12', to: '2023-07-30' },
    ];

    return (
        <section className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto' }}>
            
            {/* Header Navigation */}
            <div style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)',
                flexShrink: 0
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <button onClick={onBack} className="btn secondary" style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <ChevronLeft size={16} /> Back to Workforce
                    </button>
                    <div>
                        <h2 style={{ fontSize: '24px', margin: '0 0 4px 0', color: 'var(--text-primary)' }}>Worker Profile</h2>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                        <Printer size={16} /> Export Profile
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '40px' }}>
                
                {/* 1. Profile Header Card */}
                <div className="panel" style={{ display: 'flex', gap: '24px', alignItems: 'center', position: 'relative' }}>
                    {/* Avatar */}
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                        <img 
                            alt={workerName} 
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCj-A6RA5IvC758cIMp4VEyRF9HG9Sqpq61B57fT586_2l902lKM2xeUon6wTy2de5cf9Z_nJRSXb20BcErSf45_mHq0nU0nqrZGFp-OpeacVogFHSCWaRydF7wjN824W46R_9k1z365ACuWGk3vKxG1MRJu37fJOHjS84fVeiaFHUfKAkte4x3ttxcUgixcZPx189QRGuXzSS9plS1ER2GIjpHbhBavKFEeJToNZGyi5k6bhUR15MFBHuwBtoFxzEzip_sxCkcvt4" 
                            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                        />
                        <button style={{
                            position: 'absolute', bottom: '0', right: '0', 
                            backgroundColor: 'var(--bg-surface)', borderRadius: '50%', 
                            padding: '4px', border: '1px solid var(--border-subtle)',
                            boxShadow: 'var(--shadow-sm)', cursor: 'pointer'
                        }}>
                            <Camera size={12} style={{ color: 'var(--text-secondary)' }} />
                        </button>
                    </div>

                    {/* Metadata */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            {isEditingName ? (
                                <input 
                                    autoFocus
                                    value={workerName} 
                                    onChange={e => setWorkerName(e.target.value)}
                                    onBlur={() => setIsEditingName(false)}
                                    onKeyDown={e => e.key === 'Enter' && setIsEditingName(false)}
                                    style={{ fontSize: '24px', fontWeight: 'bold', padding: '4px 8px', border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-sm)', outline: 'none', color: 'var(--text-primary)' }}
                                />
                            ) : (
                                <h3 
                                    onClick={() => setIsEditingName(true)}
                                    style={{ fontSize: '24px', fontWeight: 'bold', margin: 0, color: 'var(--text-primary)', cursor: 'pointer', borderBottom: '1px dashed transparent', transition: '0.2s' }}
                                    onMouseOver={e => e.currentTarget.style.borderBottom = '1px dashed var(--text-muted)'}
                                    onMouseOut={e => e.currentTarget.style.borderBottom = '1px dashed transparent'}
                                >
                                    {workerName}
                                </h3>
                            )}
                            
                            <select 
                                value={workerRole}
                                onChange={e => setWorkerRole(e.target.value)}
                                style={{ 
                                    backgroundColor: 'var(--bg-surface-hover)', border: '1px solid var(--border-subtle)', 
                                    borderRadius: 'var(--radius-pill)', padding: '4px 12px', fontSize: '13px', 
                                    fontWeight: '500', outline: 'none', cursor: 'pointer', color: 'var(--text-primary)' 
                                }}
                            >
                                <option>Supervisor</option>
                                <option>Foreman</option>
                                <option value="Lead Electrical Technician">Lead Electrical Technician</option>
                                <option>Electrical Technician</option>
                            </select>

                            <button 
                                onClick={() => setIsActive(!isActive)}
                                className={`status-pill ${isActive ? 'solid-green' : 'solid-grey'}`}
                                style={{ cursor: 'pointer', border: 'none', outline: 'none' }}
                            >
                                {isActive ? 'Active' : 'Inactive'}
                            </button>
                        </div>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '24px', color: 'var(--text-secondary)', fontSize: '14px' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ color: 'var(--text-muted)' }}>ID:</strong> MEP-042
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <strong style={{ color: 'var(--text-muted)' }}>Mobile:</strong> 
                                {isEditingMobile ? (
                                    <input 
                                        autoFocus
                                        value={mobileNumber}
                                        onChange={e => setMobileNumber(e.target.value)}
                                        onBlur={() => setIsEditingMobile(false)}
                                        onKeyDown={e => e.key === 'Enter' && setIsEditingMobile(false)}
                                        style={{ fontSize: '14px', padding: '2px 6px', border: '1px solid var(--border-focus)', borderRadius: 'var(--radius-sm)', outline: 'none', color: 'var(--text-primary)' }}
                                    />
                                ) : (
                                    <span 
                                        onClick={() => setIsEditingMobile(true)}
                                        style={{ cursor: 'pointer', borderBottom: '1px dashed transparent' }}
                                        onMouseOver={e => e.currentTarget.style.borderBottom = '1px dashed var(--text-muted)'}
                                        onMouseOut={e => e.currentTarget.style.borderBottom = '1px dashed transparent'}
                                    >{mobileNumber}</span>
                                )}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                    
                    {/* Left Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* 2. Personal Details */}
                        <div className="panel" style={{ padding: '0' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Personal Details</h3>
                                <button 
                                    onClick={() => setIsEditingPersonal(!isEditingPersonal)}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--accent-blue)', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', fontWeight: '500' }}
                                >
                                    <Edit2 size={14} /> {isEditingPersonal ? 'Cancel Edit' : 'Edit'}
                                </button>
                            </div>
                            
                            <div style={{ padding: '24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                {/* Standard Fields */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>DATE OF BIRTH</label>
                                    <input type="date" value={personalDetails.dob} onChange={e => handlePersonalDetailChange('dob', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMAIL (OPTIONAL)</label>
                                    <input type="email" value={personalDetails.email} onChange={e => handlePersonalDetailChange('email', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', gridColumn: '1 / -1' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>ADDRESS (OPTIONAL)</label>
                                    <textarea value={personalDetails.address} onChange={e => handlePersonalDetailChange('address', e.target.value)} disabled={!isEditingPersonal} rows={2} style={inputStyle(isEditingPersonal)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>DATE OF JOINING</label>
                                    <input type="date" value={personalDetails.doj} onChange={e => handlePersonalDetailChange('doj', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>LOGIN PIN</label>
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                        <input type="password" value="1234" disabled style={{ ...inputStyle(false), width: '80px', textAlign: 'center', letterSpacing: '4px' }} />
                                        <button className="btn secondary" style={{ padding: '6px 12px', fontSize: '12px' }}>Reset PIN</button>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMERGENCY CONTACT NAME</label>
                                    <input type="text" value={personalDetails.emergencyName} onChange={e => handlePersonalDetailChange('emergencyName', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>EMERGENCY CONTACT NUMBER</label>
                                    <input type="text" value={personalDetails.emergencyNumber} onChange={e => handlePersonalDetailChange('emergencyNumber', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                </div>
                            </div>

                            {/* Assigned Projects */}
                            <div style={{ padding: '0 24px 24px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>ASSIGNED PROJECTS</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    <span className="badge blue" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                                        <Building2 size={12} /> Skylight Plaza Towers {isEditingPersonal && <X size={12} style={{ cursor: 'pointer' }} />}
                                    </span>
                                    <span className="badge blue" style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 10px' }}>
                                        <Factory size={12} /> North Industrial Park Phase II {isEditingPersonal && <X size={12} style={{ cursor: 'pointer' }} />}
                                    </span>
                                    {isEditingPersonal && (
                                        <button style={{ background: 'none', border: '1px dashed var(--accent-blue)', color: 'var(--accent-blue)', borderRadius: 'var(--radius-sm)', padding: '6px 10px', fontSize: '12px', fontWeight: '500', cursor: 'pointer' }}>+ Add Project</button>
                                    )}
                                </div>
                            </div>

                            {/* Custom Shift Toggle */}
                            <div style={{ borderTop: '1px solid var(--border-subtle)', padding: '16px 24px', backgroundColor: 'var(--bg-base)' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
                                    <input type="checkbox" checked={useCustomShift} onChange={e => setUseCustomShift(e.target.checked)} disabled={!isEditingPersonal} />
                                    Use custom shift settings
                                </label>

                                {useCustomShift && (
                                    <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', padding: '16px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>SHIFT START</label>
                                            <input type="time" value={personalDetails.shiftStart} onChange={e => handlePersonalDetailChange('shiftStart', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>SHIFT END</label>
                                            <input type="time" value={personalDetails.shiftEnd} onChange={e => handlePersonalDetailChange('shiftEnd', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            <label style={{ fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)' }}>LATE BUFFER (MINUTES)</label>
                                            <input type="number" value={personalDetails.lateBuffer} onChange={e => handlePersonalDetailChange('lateBuffer', e.target.value)} disabled={!isEditingPersonal} style={inputStyle(isEditingPersonal)} />
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'flex-end', paddingBottom: '10px' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', cursor: 'pointer' }}>
                                                <input type="checkbox" checked={personalDetails.flexiSchedule} onChange={e => handlePersonalDetailChange('flexiSchedule', e.target.checked)} disabled={!isEditingPersonal} />
                                                Flexi-Schedule (No late alerts)
                                            </label>
                                        </div>
                                    </div>
                                )}
                            </div>
                            
                            {isEditingPersonal && (
                                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)', display: 'flex', justifyContent: 'flex-end', borderRadius: '0 0 var(--radius-lg) var(--radius-lg)' }}>
                                    <button className="btn primary" onClick={() => setIsEditingPersonal(false)}>Save Changes</button>
                                </div>
                            )}
                        </div>

                        {/* 6. Absence History */}
                        <div className="panel" style={{ padding: '0' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Absence History</h3>
                                <button className="btn secondary" style={{ padding: '4px 10px', fontSize: '12px' }}><Plus size={14} /> Log Absence</button>
                            </div>
                            <div style={{ padding: '0' }}>
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>DATE(S)</th>
                                            <th>REASON</th>
                                            <th>STATUS</th>
                                            <th style={{ textAlign: 'right' }}>ACTION</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {absenceHistory.map(abs => (
                                            <tr key={abs.id}>
                                                <td style={{ fontSize: '13px', whiteSpace: 'nowrap' }}>{abs.date}</td>
                                                <td style={{ fontSize: '13px' }}>
                                                    {abs.reason}
                                                    {abs.adminNote && <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Note: {abs.adminNote}</div>}
                                                </td>
                                                <td>
                                                    <span className={`status-pill ${abs.status === 'Approved' ? 'solid-green' : abs.status === 'Rejected' ? 'solid-red' : 'solid-amber'}`} style={{ fontSize: '11px' }}>
                                                        {abs.status}
                                                    </span>
                                                </td>
                                                <td style={{ textAlign: 'right' }}>
                                                    {abs.status === 'Pending' ? (
                                                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                                                            <button style={{ background: 'var(--status-on-track-bg)', color: 'var(--status-on-track-text)', border: 'none', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Approve</button>
                                                            <button style={{ background: 'var(--status-at-risk-bg)', color: 'var(--status-at-risk-text)', border: 'none', padding: '4px 8px', borderRadius: 'var(--radius-sm)', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}>Reject</button>
                                                        </div>
                                                    ) : (
                                                        <button style={{ color: 'var(--accent-blue)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Add Note</button>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 7. Project Assignment History */}
                        <div className="panel" style={{ padding: '0' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Project Assignment History</h3>
                            </div>
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>PROJECT</th>
                                        <th>ROLE</th>
                                        <th>DURATION</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projectHistory.map(proj => (
                                        <tr key={proj.id}>
                                            <td style={{ fontSize: '13px', fontWeight: '500', color: 'var(--accent-blue)', cursor: 'pointer' }}>{proj.name}</td>
                                            <td style={{ fontSize: '13px' }}>{proj.role}</td>
                                            <td style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                                {proj.from} – {proj.to === 'Present' ? <span style={{ color: 'var(--accent-green)', fontWeight: '600' }}>Present</span> : proj.to}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                    </div>

                    {/* Right Column */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        
                        {/* 3. Attendance Overview Metrics */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                            <div className="metric-card alert-green" style={{ borderLeft: '4px solid var(--accent-green)' }}>
                                <span className="metric-header" style={{ color: 'var(--accent-green)' }}>Present (Self)</span>
                                <span className="metric-value">22</span>
                                <span className="metric-desc">Days this month</span>
                            </div>
                            <div className="metric-card alert-amber">
                                <span className="metric-header">Present (Proxy)</span>
                                <span className="metric-value">2</span>
                                <span className="metric-desc">Days this month</span>
                            </div>
                            <div className="metric-card alert-red">
                                <span className="metric-header">Absent Days</span>
                                <span className="metric-value">1</span>
                                <span className="metric-desc">Unexcused total</span>
                            </div>
                        </div>

                        {/* 4. Monthly Attendance Calendar */}
                        <div className="panel" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Monthly Attendance</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><ChevronLeft size={18} /></button>
                                    <span style={{ fontWeight: '600', fontSize: '14px', width: '80px', textAlign: 'center' }}>June 2026</span>
                                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', transform: 'rotate(180deg)' }}><ChevronLeft size={18} /></button>
                                </div>
                            </div>

                            {/* Legend */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '600', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-green)' }}></div> Present</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-red)' }}></div> Absent</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-blue)' }}></div> Leave</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-amber)' }}></div> Late</div>
                            </div>

                            {/* Calendar Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                                {/* Days of week header */}
                                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <div key={day} style={{ textAlign: 'center', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', paddingBottom: '8px' }}>{day}</div>
                                ))}
                                
                                {/* Calendar Cells */}
                                {calendarDays.map((d, i) => {
                                    let bgColor = 'var(--bg-base)';
                                    let dotColor = null;
                                    
                                    if (d.status === 'present') dotColor = 'var(--accent-green)';
                                    else if (d.status === 'absent') dotColor = 'var(--accent-red)';
                                    else if (d.status === 'leave') dotColor = 'var(--accent-blue)';
                                    else if (d.status === 'late') dotColor = 'var(--accent-amber)';
                                    else if (d.status === 'weekend') bgColor = 'var(--bg-surface-hover)';
                                    
                                    const isToday = d.day === 25; // Dummy today

                                    return (
                                        <div 
                                            key={i} 
                                            onMouseEnter={() => d.details && setActiveTooltip(d.day)}
                                            onMouseLeave={() => setActiveTooltip(null)}
                                            style={{ 
                                                aspectRatio: '1', backgroundColor: bgColor, borderRadius: 'var(--radius-sm)', 
                                                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', 
                                                border: isToday ? '2px solid var(--accent-blue)' : '1px solid var(--border-subtle)',
                                                cursor: d.details ? 'pointer' : 'default', position: 'relative'
                                            }}
                                        >
                                            <span style={{ fontSize: '13px', fontWeight: '500', color: d.status === 'weekend' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{d.day}</span>
                                            {dotColor && <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: dotColor, marginTop: '4px' }}></div>}
                                            
                                            {/* Tooltip */}
                                            {activeTooltip === d.day && d.details && (
                                                <div style={{
                                                    position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
                                                    backgroundColor: '#1E293B', color: 'white', padding: '12px', borderRadius: 'var(--radius-md)',
                                                    boxShadow: 'var(--shadow-lg)', zIndex: 10, width: 'max-content', minWidth: '150px', marginBottom: '8px',
                                                    pointerEvents: 'none'
                                                }}>
                                                    <div style={{ fontWeight: '600', fontSize: '13px', marginBottom: '4px' }}>June {d.day}, 2026</div>
                                                    {d.details.in && (
                                                        <>
                                                            <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>In:</span> {d.details.in}</div>
                                                            <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#94A3B8' }}>Out:</span> {d.details.out}</div>
                                                            <div style={{ fontSize: '11px', marginTop: '4px', borderTop: '1px solid #334155', paddingTop: '4px' }}>Method: {d.details.method}</div>
                                                        </>
                                                    )}
                                                    {d.details.note && <div style={{ fontSize: '11px' }}>{d.details.note}</div>}
                                                    {/* Triangle pointer */}
                                                    <div style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '6px', borderStyle: 'solid', borderColor: '#1E293B transparent transparent transparent' }}></div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                            <div style={{ marginTop: '16px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center' }}>
                                Summary: Present: 24 · Absent: 1 · Late: 1
                            </div>
                        </div>

                        {/* 5. Attendance History */}
                        <div className="panel" style={{ padding: '0' }}>
                            <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                                <h3 style={{ margin: 0, fontSize: '16px' }}>Attendance History</h3>
                                <button className="btn secondary" style={{ padding: '4px 10px', fontSize: '12px' }}><Download size={14} /> Export CSV</button>
                            </div>
                            
                            <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12px', backgroundColor: 'var(--bg-base)' }}>
                                    <CalendarIcon size={14} style={{ color: 'var(--text-secondary)' }} />
                                    <select style={{ border: 'none', background: 'none', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                                        <option>Last 30 Days</option>
                                        <option>This Month</option>
                                        <option>Custom Range...</option>
                                    </select>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', fontSize: '12px', backgroundColor: 'var(--bg-base)' }}>
                                    <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
                                    <select style={{ border: 'none', background: 'none', fontSize: '12px', outline: 'none', cursor: 'pointer' }}>
                                        <option>All Projects</option>
                                        <option>Skylight Plaza</option>
                                    </select>
                                </div>
                            </div>

                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>DATE</th>
                                        <th>PROJECT</th>
                                        <th>IN</th>
                                        <th>OUT</th>
                                        <th>HRS</th>
                                        <th>METHOD</th>
                                        <th>REASON</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceHistory.map(record => (
                                        <tr key={record.id} style={{ borderLeft: record.method === 'Proxy' ? '3px solid var(--accent-amber)' : '3px solid transparent' }}>
                                            <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{record.date}</td>
                                            <td style={{ fontSize: '12px', whiteSpace: 'nowrap' }}>{record.project}</td>
                                            <td style={{ fontSize: '12px', fontWeight: '500' }}>{record.in}</td>
                                            <td style={{ fontSize: '12px', fontWeight: '500' }}>{record.out}</td>
                                            <td style={{ fontSize: '12px', fontWeight: '600' }}>{record.hours}</td>
                                            <td>
                                                <span className={`status-pill ${
                                                    record.method === 'Self' ? 'outline-blue' : 
                                                    record.method === 'Proxy' ? 'outline-amber' : 
                                                    'solid-grey'
                                                }`} style={{ fontSize: '10px', padding: '2px 6px' }}>
                                                    {record.method} {record.proxyBy !== '-' && `(${record.proxyBy})`}
                                                </span>
                                            </td>
                                            <td style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{record.reason}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div style={{ padding: '12px 24px', fontSize: '12px', color: 'var(--text-secondary)', textAlign: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                                Showing 1-4 of 124 records <a href="#" style={{ color: 'var(--accent-blue)', marginLeft: '8px', fontWeight: '500' }}>Next</a>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

// Helper styling function
function inputStyle(editable) {
    return {
        padding: '10px 12px',
        border: editable ? '1px solid var(--border-focus)' : '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-md)',
        backgroundColor: editable ? 'var(--bg-base)' : 'var(--bg-surface-hover)',
        color: editable ? 'var(--text-primary)' : 'var(--text-muted)',
        fontSize: '14px',
        outline: 'none',
        width: '100%',
        transition: 'var(--transition-fast)'
    };
}
