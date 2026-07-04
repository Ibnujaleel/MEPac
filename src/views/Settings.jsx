import React, { useState } from 'react';
import { 
    Building2, 
    Users, 
    Sliders, 
    ShieldAlert, 
    UploadCloud, 
    Trash2, 
    ArrowRight, 
    Clock, 
    CalendarDays, 
    MapPin, 
    Map, 
    AlertTriangle, 
    CheckSquare 
} from 'lucide-react';

const initialCompanyProfile = {
    name: 'MEPac Solutions Pvt Ltd',
    email: 'admin@mepac.com',
    phone: '+1 (555) 123-4567',
    address: '101 Industrial Park Way, Sector 4\nMetropolis, NY 10001',
    logo: 'cloud_upload' // Logo upload text placeholder
};

const initialWorkingHours = {
    shiftStart: '08:00',
    shiftEnd: '17:00',
    lateBuffer: '15 minutes',
    autoAbsent: '4 hours'
};

const initialWorkWeek = {
    M: true,
    T: true,
    W: true,
    T1: true, // Thursday (labeled T in template)
    F: true,
    S1: true, // Saturday (labeled S)
    S2: false // Sunday (labeled S)
};

const initialHolidays = [
    { id: 1, name: 'Republic Day', date: '26 Jan 2026' },
    { id: 2, name: 'Independence Day', date: '15 Aug 2026' }
];

const initialGeofence = {
    enforceGps: false,
    radius: 200
};

const initialAlerts = {
    silentAlert: '24 hours',
    proxyReminder: '3 days',
    disputeResolution: '5 days'
};

const initialAttendanceRules = {
    requirePhoto: false,
    allowSelfClockIn: true,
    requireReason: true
};
// 1. We create the custom component
function SettingsBanner() {
    return (
        <div style={{
            backgroundColor: 'var(--accent-blue-bg)',
            padding: '12px',
            borderRadius: '8px',
            color: 'var(--accent-blue)',
            fontWeight: '600',
            marginBottom: '16px',
            fontSize: '13px'
        }}>
            ℹ️ Pro-tip: You can toggle days in the Standard Work Week to update active shifts.
        </div>
    );
}


export default function Settings() {
    const [activeTab, setActiveTab] = useState('company');

    // Form States
    const [companyProfile, setCompanyProfile] = useState({ ...initialCompanyProfile });
    const [workingHours, setWorkingHours] = useState({ ...initialWorkingHours });
    const [workWeek, setWorkWeek] = useState({ ...initialWorkWeek });
    const [holidays, setHolidays] = useState([...initialHolidays]);
    const [geofence, setGeofence] = useState({ ...initialGeofence });
    const [alerts, setAlerts] = useState({ ...initialAlerts });
    const [attendanceRules, setAttendanceRules] = useState({ ...initialAttendanceRules });

    // UI Input States for Adding Items
    const [newHolidayName, setNewHolidayName] = useState('');
    const [newHolidayDate, setNewHolidayDate] = useState('');
    const [showAddHolidayForm, setShowAddHolidayForm] = useState(false);
    const [saveMessage, setSaveMessage] = useState(null);

    const handleSave = () => {
        setSaveMessage('Settings saved successfully!');
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const handleDiscard = () => {
        setCompanyProfile({ ...initialCompanyProfile });
        setWorkingHours({ ...initialWorkingHours });
        setWorkWeek({ ...initialWorkWeek });
        setHolidays([...initialHolidays]);
        setGeofence({ ...initialGeofence });
        setAlerts({ ...initialAlerts });
        setAttendanceRules({ ...initialAttendanceRules });
        setSaveMessage('Changes discarded.');
        setTimeout(() => setSaveMessage(null), 3000);
    };

    const toggleWeekday = (dayKey) => {
        setWorkWeek(prev => ({ ...prev, [dayKey]: !prev[dayKey] }));
    };

    const handleAddHoliday = (e) => {
        e.preventDefault();
        if (!newHolidayName.trim() || !newHolidayDate.trim()) return;
        setHolidays(prev => [...prev, {
            id: Date.now(),
            name: newHolidayName.trim(),
            date: newHolidayDate.trim()
        }]);
        setNewHolidayName('');
        setNewHolidayDate('');
        setShowAddHolidayForm(false);
    };

    const handleDeleteHoliday = (id) => {
        setHolidays(prev => prev.filter(h => h.id !== id));
    };

    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Settings</h2>
                    <p className="subtitle">Manage global configuration for the MEPac administrative environment.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {saveMessage && (
                        <span style={{
                            fontSize: '14px',
                            color: saveMessage.includes('saved') ? 'var(--accent-green)' : 'var(--text-muted)',
                            fontWeight: '500'
                        }}>
                            {saveMessage}
                        </span>
                    )}
                    <button className="btn secondary" onClick={handleDiscard}>Discard</button>
                    <button className="btn primary" onClick={handleSave}>Save Changes</button>
                </div>
            </div>

            {/* Top Navigation Tabs */}
            <div className="settings-top-tabs">
                <button
                    className={`settings-top-tab-btn ${activeTab === 'company' ? 'active' : ''}`}
                    onClick={() => setActiveTab('company')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Building2 size={16} /> Company &amp; Access
                </button>
                <button
                    className={`settings-top-tab-btn ${activeTab === 'operational' ? 'active' : ''}`}
                    onClick={() => setActiveTab('operational')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Sliders size={16} /> Operational Rules
                </button>
                <button
                    className={`settings-top-tab-btn ${activeTab === 'alerts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('alerts')}
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <ShieldAlert size={16} /> Alerts &amp; Governance
                </button>
            </div>

            {/* Panels Container */}
            <div className="settings-content">
                <SettingsBanner />

                {/* TAB CONTENT: COMPANY & ACCESS */}
                {activeTab === 'company' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* 1. Company Profile */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Building2 size={24} style={{ color: 'var(--accent-blue)' }} />
                                    <h3 style={{ margin: 0 }}>Company Profile</h3>
                                </div>
                            </div>

                            <div className="form-row">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>Company Name</label>
                                        <input
                                            type="text"
                                            value={companyProfile.name}
                                            onChange={(e) => setCompanyProfile(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Email Address</label>
                                        <input
                                            type="email"
                                            value={companyProfile.email}
                                            onChange={(e) => setCompanyProfile(prev => ({ ...prev, email: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Phone Number</label>
                                        <input
                                            type="text"
                                            value={companyProfile.phone}
                                            onChange={(e) => setCompanyProfile(prev => ({ ...prev, phone: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div className="form-group">
                                        <label>Company Logo</label>
                                        <div className="logo-upload-container" style={{ height: '120px', cursor: 'pointer', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }} onClick={() => {
                                            const name = prompt('Select image URL for Logo:');
                                            if (name) alert('Logo URL uploaded.');
                                        }}>
                                            <UploadCloud size={32} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                                            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Click to upload new logo</span>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label>Registered Address</label>
                                        <textarea
                                            rows="2"
                                            value={companyProfile.address}
                                            onChange={(e) => setCompanyProfile(prev => ({ ...prev, address: e.target.value }))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 7. User Management Section */}
                        <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <div className="avatar-large" style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Users size={24} style={{ color: 'var(--accent-blue)' }} />
                                </div>
                                <div>
                                    <h3 style={{ fontSize: '18px', margin: 0 }}>User Management</h3>
                                    <p className="subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>Manage user accounts, roles, and permissions.</p>
                                </div>
                            </div>
                            <button className="btn primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }} onClick={() => alert('User management panel loaded.')}>
                                Manage Users <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: OPERATIONAL RULES */}
                {activeTab === 'operational' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* 2. Default Working Hours */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Clock size={24} style={{ color: 'var(--accent-blue)' }} />
                                    <h3 style={{ margin: 0 }}>Default Working Hours</h3>
                                </div>
                            </div>

                            <div className="form-row">
                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Shift Start</label>
                                        <input
                                            type="time"
                                            value={workingHours.shiftStart}
                                            onChange={(e) => setWorkingHours(prev => ({ ...prev, shiftStart: e.target.value }))}
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Shift End</label>
                                        <input
                                            type="time"
                                            value={workingHours.shiftEnd}
                                            onChange={(e) => setWorkingHours(prev => ({ ...prev, shiftEnd: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '16px' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Late Buffer</label>
                                        <select
                                            value={workingHours.lateBuffer}
                                            onChange={(e) => setWorkingHours(prev => ({ ...prev, lateBuffer: e.target.value }))}
                                        >
                                            <option value="0 minutes">0 minutes</option>
                                            <option value="5 minutes">5 minutes</option>
                                            <option value="15 minutes">15 minutes</option>
                                            <option value="30 minutes">30 minutes</option>
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Auto-Mark Absent After</label>
                                        <select
                                            value={workingHours.autoAbsent}
                                            onChange={(e) => setWorkingHours(prev => ({ ...prev, autoAbsent: e.target.value }))}
                                        >
                                            <option value="2 hours">2 hours</option>
                                            <option value="4 hours">4 hours</option>
                                            <option value="End of Shift">End of Shift</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 3. Working Days & Holidays */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CalendarDays size={24} style={{ color: 'var(--accent-blue)' }} />
                                    <h3 style={{ margin: 0 }}>Working Days &amp; Holidays</h3>
                                </div>
                            </div>

                            <div style={{ marginBottom: '24px' }}>
                                <label className="form-label" style={{ marginBottom: '12px', display: 'block' }}>Standard Work Week</label>
                                <div className="weekday-container">
                                    <button className={`weekday-btn ${workWeek.M ? 'active' : ''}`} onClick={() => toggleWeekday('M')}>M</button>
                                    <button className={`weekday-btn ${workWeek.T ? 'active' : ''}`} onClick={() => toggleWeekday('T')}>T</button>
                                    <button className={`weekday-btn ${workWeek.W ? 'active' : ''}`} onClick={() => toggleWeekday('W')}>W</button>
                                    <button className={`weekday-btn ${workWeek.T1 ? 'active' : ''}`} onClick={() => toggleWeekday('T1')}>T</button>
                                    <button className={`weekday-btn ${workWeek.F ? 'active' : ''}`} onClick={() => toggleWeekday('F')}>F</button>
                                    <button className={`weekday-btn ${workWeek.S1 ? 'active' : ''}`} onClick={() => toggleWeekday('S1')}>S</button>
                                    <button className={`weekday-btn ${workWeek.S2 ? 'active' : ''}`} onClick={() => toggleWeekday('S2')}>S</button>
                                </div>
                            </div>

                            <div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                    <label className="form-label" style={{ margin: 0 }}>Recognized Holidays</label>
                                    <button className="btn text-btn" style={{ color: 'var(--accent-blue)', fontWeight: '600' }} onClick={() => setShowAddHolidayForm(!showAddHolidayForm)}>
                                        + Add Holiday
                                    </button>
                                </div>

                                {showAddHolidayForm && (
                                    <form onSubmit={handleAddHoliday} style={{ display: 'flex', gap: '12px', padding: '16px', backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', marginBottom: '16px', alignItems: 'flex-end' }}>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px' }}>Holiday Name</label>
                                            <input type="text" placeholder="e.g. Christmas Day" value={newHolidayName} onChange={(e) => setNewHolidayName(e.target.value)} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 1 }}>
                                            <label style={{ fontSize: '12px' }}>Date</label>
                                            <input type="text" placeholder="e.g. 25 Dec 2026" value={newHolidayDate} onChange={(e) => setNewHolidayDate(e.target.value)} required />
                                        </div>
                                        <button type="submit" className="btn primary" style={{ height: '38px' }}>Add</button>
                                    </form>
                                )}

                                <ul className="holiday-list">
                                    {holidays.map(h => (
                                        <li className="holiday-item" key={h.id}>
                                            <span className="holiday-name">{h.date} – {h.name}</span>
                                            <button
                                                className="btn text-btn"
                                                style={{ color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center' }}
                                                onClick={() => handleDeleteHoliday(h.id)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* 6. Geofence Verification */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MapPin size={24} style={{ color: 'var(--accent-blue)' }} />
                                    <h3 style={{ margin: 0 }}>Geofence Verification</h3>
                                </div>
                            </div>

                            <div className="form-row">
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)' }}>
                                        <div>
                                            <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Enforce GPS Verification</h4>
                                            <p className="subtitle" style={{ fontSize: '12px', marginTop: '4px' }}>Require devices to be within project boundaries to clock in.</p>
                                        </div>
                                        <label className="switch">
                                            <input
                                                type="checkbox"
                                                checked={geofence.enforceGps}
                                                onChange={(e) => setGeofence(prev => ({ ...prev, enforceGps: e.target.checked }))}
                                            />
                                            <span className="slider round"></span>
                                        </label>
                                    </div>

                                    <div className="form-group">
                                        <label>Allowed Radius (meters)</label>
                                        <input
                                            type="number"
                                            value={geofence.radius}
                                            disabled={!geofence.enforceGps}
                                            onChange={(e) => setGeofence(prev => ({ ...prev, radius: parseInt(e.target.value) || 0 }))}
                                        />
                                        <p className="subtitle" style={{ fontSize: '11px', marginTop: '4px' }}>
                                            {geofence.enforceGps ? 'Specify radius margin for check-in eligibility.' : 'Enable GPS verification to modify radius.'}
                                        </p>
                                    </div>
                                </div>

                                <div className="map-preview-box">
                                    <div className="map-grid-overlay"></div>
                                    <Map size={48} style={{ color: 'var(--text-muted)', marginBottom: '8px' }} />
                                    <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Map Preview Unavailable</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB CONTENT: ALERTS & GOVERNANCE */}
                {activeTab === 'alerts' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* 4. Alert Thresholds */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <AlertTriangle size={24} style={{ color: 'var(--accent-amber)' }} />
                                    <h3 style={{ margin: 0 }}>Alert Thresholds</h3>
                                </div>
                            </div>
                            <p className="subtitle" style={{ fontSize: '13px', marginBottom: '20px' }}>Configure when the system should escalate issues based on "Management by Exception" rules.</p>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Silent Site Alert</label>
                                    <select
                                        value={alerts.silentAlert}
                                        onChange={(e) => setAlerts(prev => ({ ...prev, silentAlert: e.target.value }))}
                                    >
                                        <option value="12 hours">12 hours</option>
                                        <option value="24 hours">24 hours</option>
                                        <option value="48 hours">48 hours</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Proxy Review Reminder</label>
                                    <select
                                        value={alerts.proxyReminder}
                                        onChange={(e) => setAlerts(prev => ({ ...prev, proxyReminder: e.target.value }))}
                                    >
                                        <option value="1 day">1 day</option>
                                        <option value="3 days">3 days</option>
                                        <option value="7 days">7 days</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Dispute Resolution</label>
                                    <select
                                        value={alerts.disputeResolution}
                                        onChange={(e) => setAlerts(prev => ({ ...prev, disputeResolution: e.target.value }))}
                                    >
                                        <option value="3 days">3 days</option>
                                        <option value="5 days">5 days</option>
                                        <option value="10 days">10 days</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* 5. Attendance Rules */}
                        <div className="panel">
                            <div className="panel-header" style={{ marginBottom: '24px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <CheckSquare size={24} style={{ color: 'var(--accent-blue)' }} />
                                    <h3 style={{ margin: 0 }}>Attendance Rules</h3>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)' }}>
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Require Photo for Proxy Attendance</h4>
                                        <p className="subtitle" style={{ fontSize: '12px', marginTop: '4px' }}>Mandate a live photo capture when a supervisor marks attendance for a worker.</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={attendanceRules.requirePhoto}
                                            onChange={(e) => setAttendanceRules(prev => ({ ...prev, requirePhoto: e.target.checked }))}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)' }}>
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Allow Self Clock-In Outside Shift</h4>
                                        <p className="subtitle" style={{ fontSize: '12px', marginTop: '4px' }}>Workers can check in before the official shift start time.</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={attendanceRules.allowSelfClockIn}
                                            onChange={(e) => setAttendanceRules(prev => ({ ...prev, allowSelfClockIn: e.target.checked }))}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)' }}>
                                    <div>
                                        <h4 style={{ fontSize: '14px', fontWeight: '600' }}>Manual Attendance Requires Admin Reason</h4>
                                        <p className="subtitle" style={{ fontSize: '12px', marginTop: '4px' }}>Force input of a justification text when overriding system attendance.</p>
                                    </div>
                                    <label className="switch">
                                        <input
                                            type="checkbox"
                                            checked={attendanceRules.requireReason}
                                            onChange={(e) => setAttendanceRules(prev => ({ ...prev, requireReason: e.target.checked }))}
                                        />
                                        <span className="slider round"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
