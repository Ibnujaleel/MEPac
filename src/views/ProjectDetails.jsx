import React, { useState } from 'react';
import { 
    Edit, 
    UserCheck, 
    UserX, 
    Image as ImageIcon, 
    Camera, 
    Radio, 
    CheckCircle, 
    MapPin, 
    Search, 
    Filter, 
    UserPlus, 
    FileText, 
    Download, 
    UploadCloud, 
    ChevronLeft, 
    ChevronRight, 
    Plus, 
    Trash2,
    X,
    Send,
    MessageSquare,
    Clock,
    User,
    AlertTriangle,
    Paperclip,
    ExternalLink
} from 'lucide-react';
import AttendanceCalendar from '../components/ui/AttendanceCalendar';

export default function ProjectDetails({ project, onBack }) {
    const [activeTab, setActiveTab] = useState('overview');

    // Sub-states for interactive demo behaviors
    const [disputes, setDisputes] = useState([
        { id: 1, date: 'June 09, 2026', worker: 'Vikram Patel', avatar: 'VP', status: 'Pending Approval', note: '"Worker claims check-in failed due to app error. Verified presence on site."' },
        { id: 2, date: 'June 03, 2026', worker: 'Arun Agarwal', avatar: 'AA', status: 'Pending Approval', note: '"Proxy check-in detected. Needs manual verification of hours."' }
    ]);

    const [drawings, setDrawings] = useState([
        { id: 'HVAC-FP-001', title: 'HVAC Main Floor Plan', revision: 'Current Rev 4', uploader: 'Sarah Jenkins', date: 'June 10, 2026', notes: 'Updated duct routes in East wing based on RFI-42.' }
    ]);

    const [workers, setWorkers] = useState([
        { id: 1, name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', status: 'Present', checkin: '08:15 AM' },
        { id: 2, name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', status: 'Present', checkin: '08:30 AM (Proxy)' },
        { id: 3, name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', status: 'Absent', checkin: '-' },
        { id: 4, name: 'Mohammed Nasir', role: 'HVAC Tech', avatar: 'MN', status: 'Present', checkin: '07:45 AM' }
    ]);

    const [newRevisionNotes, setNewRevisionNotes] = useState('');
    const [rfis, setRfis] = useState([
        {
            id: 'RFI-42',
            title: 'Duct route conflict in East Wing',
            priority: 'High',
            status: 'Resolved',
            date: 'June 08, 2026',
            raisedBy: { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS' },
            assignedTo: { name: 'Sarah Jenkins', role: 'HVAC Lead', avatar: 'SJ' },
            description: 'The HVAC duct route on Floor 3, East Wing, conflicts with the main electrical conduit run shown in Drawing ELEC-FP-003 Rev 2. The duct needs to be rerouted below the beam line or the conduit needs to shift 400mm west. Requesting design team clarification before proceeding.',
            attachments: ['HVAC-FP-001_Rev3.pdf', 'site_photo_conflict.jpg'],
            messages: [
                { id: 1, sender: 'Rajat Sharma', avatar: 'RS', role: 'Foreman', time: 'June 08, 10:15 AM', text: 'Found a clash between HVAC duct route and electrical conduit on Floor 3 East Wing. Cannot proceed with installation until this is resolved. See attached site photo.' },
                { id: 2, sender: 'Sarah Jenkins', avatar: 'SJ', role: 'HVAC Lead', time: 'June 08, 11:30 AM', text: 'Reviewed the clash. I recommend rerouting the duct 300mm below beam line BM-E12. This avoids the electrical run completely. Will update the drawing if approved.' },
                { id: 3, sender: 'Marcus Chen', avatar: 'MC', role: 'Ops Director', time: 'June 09, 09:00 AM', text: 'Approved. Sarah, please update Drawing HVAC-FP-001 to Rev 4 with the new duct route. Rajat, hold installation until the updated drawing is issued.' },
                { id: 4, sender: 'Sarah Jenkins', avatar: 'SJ', role: 'HVAC Lead', time: 'June 10, 02:45 PM', text: 'Drawing HVAC-FP-001 Rev 4 has been uploaded. New duct route below BM-E12 is shown. Marking this RFI as resolved.' },
            ]
        },
        {
            id: 'RFI-45',
            title: 'Lighting fixture specification change',
            priority: 'Medium',
            status: 'Open',
            date: 'June 12, 2026',
            raisedBy: { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA' },
            assignedTo: { name: 'Marcus Chen', role: 'Ops Director', avatar: 'MC' },
            description: 'Client has requested changing all LED panel lights in the lobby area (Floors G, 1, 2) from 4000K to 3000K warm white. This affects 48 fixtures across 3 floors. Need procurement approval and updated specification sheet before ordering.',
            attachments: ['client_email_spec_change.pdf'],
            messages: [
                { id: 1, sender: 'Arun Agarwal', avatar: 'AA', role: 'Electrician', time: 'June 12, 09:30 AM', text: 'Client emailed requesting all lobby LED panels changed from 4000K to 3000K. This affects 48 units on 3 floors. Attached the client email. Need approval to update the procurement order.' },
                { id: 2, sender: 'Marcus Chen', avatar: 'MC', role: 'Ops Director', time: 'June 12, 11:00 AM', text: 'Checking with the supplier on lead time and cost difference for the 3000K variant. Will update by EOD.' },
            ]
        }
    ]);
    const [selectedRfi, setSelectedRfi] = useState(null);
    const [rfiMessage, setRfiMessage] = useState('');

    const [workWeek, setWorkWeek] = useState({
        M: true, T: true, W: true, T1: true, F: true, S1: true, S2: false
    });

    const handleApproveDispute = (id) => {
        setDisputes(prev => prev.filter(d => d.id !== id));
        alert('Dispute approved and hours added to attendance log!');
    };

    const handleRejectDispute = (id) => {
        setDisputes(prev => prev.filter(d => d.id !== id));
        alert('Dispute rejected.');
    };

    const handleUploadRevision = (e) => {
        e.preventDefault();
        const nextRev = drawings.length + 4; // Simulated Rev increment
        setDrawings(prev => [
            {
                id: 'HVAC-FP-001',
                title: 'HVAC Main Floor Plan',
                revision: `Current Rev ${nextRev}`,
                uploader: 'CEO Account (You)',
                date: 'Today',
                notes: newRevisionNotes || 'Manual blueprint revision upload.'
            },
            ...prev
        ]);
        setNewRevisionNotes('');
        alert('New drawing revision successfully uploaded.');
    };

    const toggleWeekday = (day) => {
        setWorkWeek(prev => ({ ...prev, [day]: !prev[day] }));
    };

    return (
        <section className="view active">
            {/* Breadcrumb & Header */}
            <nav className="mb-4">
                <ol className="breadcrumb">
                    <li><a href="#" onClick={(e) => { e.preventDefault(); onBack(); }}>Projects</a></li>
                    <li className="breadcrumb-separator">/</li>
                    <li className="text-primary font-semibold">{project.name}</li>
                </ol>
            </nav>

            <div className="flex justify-between items-end mb-8">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <h2 style={{ fontSize: '32px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>{project.name}</h2>
                        <span className="px-3 py-1 rounded-full bg-status-on-track-bg text-status-on-track-text font-label-caps text-[10px] flex items-center gap-1 uppercase" style={{ backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', fontWeight: 'bold' }}>
                            <span className="w-1.5 h-1.5 rounded-full bg-status-on-track-text" style={{ backgroundColor: 'var(--accent-green)' }}></span>
                            {project.status === 'Delayed' ? 'Delayed' : 'On Track'}
                        </span>
                    </div>
                    <p className="font-body-base text-body-base text-text-secondary">{project.location} | {project.client}</p>
                </div>
                <button className="px-6 py-2.5 bg-primary text-white rounded-lg font-body-base font-semibold hover:bg-primary-container transition-all flex items-center gap-2" style={{ cursor: 'pointer', padding: '10px 24px', borderRadius: 'var(--radius-md)' }} onClick={() => alert('Editing project configuration...')}>
                    <Edit size={18} /> Edit Project
                </button>
            </div>

            {/* Tab Navigation */}
            <div className="details-tabs" id="tab-nav">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'workforce', label: 'Workforce' },
                    { id: 'drawings', label: 'Drawings' },
                    { id: 'attendance', label: 'Attendance' },
                    { id: 'rfis', label: 'RFIs' },
                    { id: 'disputes', label: 'Disputes' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        className={`details-tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(tab.id)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content: Overview */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    {/* Site Details & Pulse */}
                    <div className="lg:col-span-2 space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                            <h3 className="font-headline-md text-headline-md text-text-primary mb-4" style={{ margin: '0 0 16px 0', fontSize: '20px' }}>Project Overview</h3>
                            <div className="grid grid-cols-2 gap-6" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                                <div>
                                    <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Location</p>
                                    <p className="font-body-base text-text-primary" style={{ margin: 0, fontWeight: '500' }}>Downtown District, {project.location}</p>
                                </div>
                                <div>
                                    <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Client</p>
                                    <p className="font-body-base text-text-primary" style={{ margin: 0, fontWeight: '500' }}>{project.client}</p>
                                </div>
                                <div>
                                    <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Start Date</p>
                                    <p className="font-body-base text-text-primary" style={{ margin: 0, fontWeight: '500' }}>Jan 15, 2026</p>
                                </div>
                                <div>
                                    <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Target Completion</p>
                                    <p className="font-body-base text-text-primary" style={{ margin: 0, fontWeight: '500' }}>Nov 30, 2026</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                            <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 className="font-headline-md text-headline-md text-text-primary" style={{ margin: 0, fontSize: '20px' }}>Site Pulse Today</h3>
                                <span className="text-body-sm text-text-secondary" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Updated: 09:15 AM</span>
                            </div>
                            <div className="flex items-end gap-4" style={{ display: 'flex', gap: '16px' }}>
                                <div className="pulse-card">
                                    <div>
                                        <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Total Check-ins</p>
                                        <div className="flex items-baseline gap-2" style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                                            <span className="font-kpi-metric text-text-primary" style={{ fontSize: '32px', fontWeight: '700' }}>27</span>
                                            <span className="text-body-sm text-text-secondary" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>/ 28 Assigned</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-status-on-track-bg flex items-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-green-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserCheck className="text-status-on-track-text" size={24} style={{ color: 'var(--accent-green)' }} />
                                    </div>
                                </div>
                                <div className="pulse-card">
                                    <div>
                                        <p className="font-label-caps text-on-surface-variant uppercase mb-1" style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>Absences</p>
                                        <div className="flex items-baseline gap-2">
                                            <span className="font-kpi-metric text-danger" style={{ fontSize: '32px', fontWeight: '700', color: 'var(--accent-red)' }}>1</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 rounded-full bg-status-at-risk-bg flex items-center justify-center" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--accent-red-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <UserX className="text-status-at-risk-text" size={24} style={{ color: 'var(--accent-red)' }} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Visual Proof Gallery */}
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
                        <div className="flex justify-between items-center mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 className="font-headline-md text-headline-md text-text-primary" style={{ margin: 0, fontSize: '20px' }}>Recent Site Photos</h3>
                            <button className="text-primary hover:underline text-body-sm font-medium" style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '500' }} onClick={() => alert('Opening photo viewer...')}>View All</button>
                        </div>
                        <div className="photo-gallery flex-1" style={{ flex: 1 }}>
                            <div className="photo-gallery-item">
                                <img alt="Site Photo 1" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTeMEFvqaUw86dVI27jS8W7wy7wHoQ3VbzUVI7qxt_oJU84Im9tTgJjF4oWUa59VJftPnYE8XY3CmIk__V330SdZTb1fzAp0HOKkLWGviHhWL2gNXZauygo_q77GjPgVhOzjbA34KrDqun6wpO0mLHpoKd_IMZlB8ZgTdOVHEKxQb430qYNzIFBxd1Fz7-oQifLHFuDs5llH_VqlEveNSY2oR_-t0xgyTqD9Xtw2wX96TEiybJO6Sx1PzNputOk1G8MVPxYQ-KHYg" />
                                <div className="photo-gallery-overlay">
                                    <p className="text-white m-0">Today, 08:00 AM</p>
                                </div>
                            </div>
                            <div className="photo-gallery-item">
                                <ImageIcon className="text-outline" size={24} style={{ opacity: 0.5 }} />
                            </div>
                            <div className="photo-gallery-item">
                                <ImageIcon className="text-outline" size={24} style={{ opacity: 0.5 }} />
                            </div>
                            <div className="photo-gallery-item">
                                <ImageIcon className="text-outline" size={24} style={{ opacity: 0.5 }} />
                            </div>
                        </div>
                        <button className="w-full mt-4 py-2 border border-outline-variant rounded-lg font-body-sm text-on-surface-variant hover:bg-surface-container flex items-center justify-center gap-2 transition-all" style={{ width: '100%', marginTop: '16px', padding: '8px', border: '1px solid var(--border-subtle)', background: 'transparent', borderRadius: 'var(--radius-md)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} onClick={() => alert('Prompting device camera roll...')}>
                            <Camera size={18} /> Upload Photo
                        </button>
                    </div>
                </div>
            )}

            {/* Tab Content: Workforce */}
            {activeTab === 'workforce' && (
                <div>
                    {/* Top Metrics Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                            <div className="flex justify-between items-start mb-2" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                <p className="font-label-caps text-label-caps text-on-surface-variant uppercase" style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>Site Pulse</p>
                                <Radio className="text-primary" size={18} style={{ opacity: 0.6, color: 'var(--accent-blue)' }} />
                            </div>
                            <p className="text-[14px] font-medium text-text-primary mb-1" style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: '500' }}>Active App Check-ins</p>
                            <div className="flex items-baseline gap-2 mb-2" style={{ marginBottom: '8px' }}>
                                <span className="font-kpi-metric text-text-primary font-mono" style={{ fontSize: '32px', fontWeight: '700' }}>27</span>
                            </div>
                            <div className="flex items-center gap-3 text-body-sm text-text-secondary" style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                <span className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="w-2 h-2 rounded-full bg-green-500" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span> 22 Self</span>
                                <span className="flex items-center gap-1.5" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span className="w-2 h-2 rounded-full bg-amber-500" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#f59e0b' }}></span> 5 Proxy</span>
                            </div>
                        </div>

                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3" style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Absences</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-kpi-metric text-text-primary" style={{ fontSize: '32px', fontWeight: '700' }}>1</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-danger flex items-center gap-1" style={{ margin: 0, color: 'var(--accent-red)', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px' }}>
                                <UserX size={14} /> Rajat Sharma (No reason)
                            </p>
                        </div>

                        <div className="bg-surface-container-lowest border border-outline-variant border-l-4 border-l-secondary-container rounded-xl p-5 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderLeftWidth: '4px', borderLeftColor: 'var(--accent-amber)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3" style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Disputes</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-kpi-metric text-text-primary" style={{ fontSize: '32px', fontWeight: '700' }}>{disputes.length}</span>
                            </div>
                            <p className="font-body-sm text-body-sm" style={{ margin: 0, color: 'var(--accent-amber)', fontSize: '13px' }}>Requires administrative review</p>
                        </div>

                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-5 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '20px' }}>
                            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-3" style={{ margin: '0 0 12px 0', fontSize: '11px', color: 'var(--text-secondary)' }}>Total Assigned</p>
                            <div className="flex items-baseline gap-2 mb-2">
                                <span className="font-kpi-metric text-text-primary" style={{ fontSize: '32px', fontWeight: '700' }}>28</span>
                            </div>
                            <p className="font-body-sm text-body-sm text-text-secondary" style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>Project Capacity: 35</p>
                        </div>
                    </div>

                    {/* Supervisor Verification Banner */}
                    <div className="bg-status-on-track-bg/30 border border-status-on-track-text/20 rounded-xl p-4 mb-8 flex items-center gap-6" style={{ backgroundColor: 'var(--accent-green-bg)', borderColor: 'rgba(16, 185, 129, 0.2)', borderStyle: 'solid', borderWidth: '1px', borderRadius: 'var(--radius-lg)', padding: '16px', display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px' }}>
                        <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant flex-shrink-0" style={{ width: '64px', height: '64px', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                            <img alt="Site Photo" className="w-full h-full object-cover" style={{ width: '100%', height: '100%', objectFit: 'cover' }} src="https://lh3.googleusercontent.com/aida-public/AB6AXuDTeMEFvqaUw86dVI27jS8W7wy7wHoQ3VbzUVI7qxt_oJU84Im9tTgJjF4oWUa59VJftPnYE8XY3CmIk__V330SdZTb1fzAp0HOKkLWGviHhWL2gNXZauygo_q77GjPgVhOzjbA34KrDqun6wpO0mLHpoKd_IMZlB8ZgTdOVHEKxQb430qYNzIFBxd1Fz7-oQifLHFuDs5llH_VqlEveNSY2oR_-t0xgyTqD9Xtw2wX96TEiybJO6Sx1PzNputOk1G8MVPxYQ-KHYg" />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <CheckCircle className="text-status-on-track-text" size={18} style={{ color: 'var(--accent-green)' }} />
                                <p className="font-body-base font-semibold text-status-on-track-text" style={{ margin: 0, fontWeight: '600', color: 'var(--accent-green)' }}>Supervisor Tariq Al-Fayed verified site at 08:00 AM</p>
                            </div>
                            <div className="flex items-center gap-4 text-body-sm text-on-tertiary-fixed-variant" style={{ display: 'flex', gap: '16px', marginTop: '4px', fontSize: '13px' }}>
                                <span className="flex items-center gap-1 font-medium" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500' }}><MapPin size={14} /> GPS Verified</span>
                                <span className="px-2 py-0.5 bg-status-on-track-text text-white rounded text-[10px] font-bold uppercase tracking-wider" style={{ backgroundColor: 'var(--accent-green)', padding: '2px 6px', borderRadius: '4px', color: 'white', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Work matches drawing Rev 4</span>
                            </div>
                        </div>
                    </div>

                    {/* Assigned Workers Cards Section */}
                    <div className="mb-6 flex justify-between items-center border-b border-outline-variant pb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '16px', marginBottom: '24px' }}>
                        <h3 className="font-headline-md text-headline-md text-text-primary text-[18px]" style={{ margin: 0, fontSize: '18px' }}>Assigned Workers</h3>
                        <div style={{ display: 'flex', gap: '12px' }}>
                            <div className="flex items-center bg-surface-container-low rounded-lg px-3 py-1.5 border border-outline-variant" style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)', padding: '6px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)' }}>
                                <Search className="text-outline" size={16} style={{ marginRight: '8px', color: 'var(--text-muted)' }} />
                                <input className="bg-transparent border-none text-body-sm w-48" style={{ border: 'none', background: 'transparent', outline: 'none', fontSize: '13px' }} placeholder="Search workers..." type="text" />
                            </div>
                            <button className="flex items-center gap-2 px-4 py-1.5 border border-outline-variant rounded-lg font-body-sm text-on-surface-variant hover:bg-surface-container transition-all" style={{ border: '1px solid var(--border-subtle)', background: 'none', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '6px 16px', fontSize: '13px' }} onClick={() => alert('Filtering workers...')}>
                                <Filter size={16} /> Filter
                            </button>
                            <button className="px-4 py-1.5 bg-primary text-white rounded-lg font-body-sm font-semibold hover:bg-primary-container transition-all flex items-center gap-2" style={{ cursor: 'pointer', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '13px' }} onClick={() => alert('Assigning worker trigger...')}>
                                <UserPlus size={16} /> Assign Worker
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '24px' }}>
                        {workers.map(w => (
                            <div key={w.id} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-4 shadow-sm flex flex-col relative group" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px', position: 'relative' }}>
                                <div className="flex items-center gap-4 mb-4" style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                                    <div className="w-12 h-12 rounded-full bg-primary-fixed text-primary flex items-center justify-center font-bold text-lg" style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                        {w.avatar}
                                    </div>
                                    <div>
                                        <p className="font-table-data font-semibold text-text-primary" style={{ margin: 0, fontWeight: '600' }}>{w.name}</p>
                                        <p className="text-body-sm text-text-secondary" style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{w.role}</p>
                                    </div>
                                </div>
                                <div className="mt-auto space-y-2" style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div className="flex justify-between items-center text-body-sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-on-surface-variant" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[12px] font-bold ${w.status === 'Present' ? 'bg-status-on-track-bg text-status-on-track-text' : 'bg-status-at-risk-bg text-status-at-risk-text'}`} style={{ padding: '2px 8px', borderRadius: '999px', fontSize: '11px', fontWeight: 'bold', backgroundColor: w.status === 'Present' ? 'var(--accent-green-bg)' : 'var(--accent-red-bg)', color: w.status === 'Present' ? 'var(--accent-green)' : 'var(--accent-red)' }}>
                                            {w.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-body-sm" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="text-on-surface-variant" style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Check-in</span>
                                        <span className="font-mono text-[13px] text-text-secondary" style={{ fontFamily: 'monospace', fontSize: '13px', color: 'var(--text-secondary)' }}>{w.checkin}</span>
                                    </div>
                                    <button className="w-full mt-2 py-1.5 border border-outline-variant rounded-lg font-body-sm text-primary hover:bg-surface-container-low transition-all" style={{ width: '100%', background: 'none', border: '1px solid var(--border-subtle)', padding: '6px', borderRadius: 'var(--radius-md)', color: 'var(--accent-blue)', cursor: 'pointer', marginTop: '8px' }} onClick={() => alert(`Showing profile detail for ${w.name}...`)}>
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tab Content: Drawings */}
            {activeTab === 'drawings' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                    <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {drawings.map(d => (
                            <div key={d.revision} className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                                <div className="p-6 border-b border-outline-variant flex justify-between items-start" style={{ padding: '24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <div className="flex items-center gap-3 mb-2" style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                            <h3 className="font-headline-md text-text-primary" style={{ margin: 0, fontSize: '20px' }}>{d.title}</h3>
                                            <span className="px-2 py-1 bg-status-on-track-bg text-status-on-track-text font-label-caps text-[10px] rounded uppercase" style={{ fontSize: '10px', fontWeight: 'bold', backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '2px 8px', borderRadius: '4px' }}>{d.revision}</span>
                                        </div>
                                        <p className="text-body-sm text-text-secondary" style={{ margin: '4px 0 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>Drawing No: {d.id}</p>
                                    </div>
                                    <button className="px-4 py-2 bg-surface-container-low border border-outline-variant rounded-lg font-body-sm text-text-primary hover:bg-surface-container transition-all flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '8px 16px', background: 'none', cursor: 'pointer' }} onClick={() => alert('Downloading drawing bundle...')}>
                                        <Download size={16} /> Download
                                    </button>
                                </div>
                                <div className="p-0 bg-surface-container flex items-center justify-center h-96 relative group cursor-pointer" style={{ height: '320px', backgroundColor: 'var(--bg-base)', display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => alert('Opening full screen blueprint viewer...')}>
                                    <div className="text-center text-on-surface-variant opacity-70" style={{ textAlign: 'center' }}>
                                        <FileText size={48} style={{ margin: '0 auto 8px auto', display: 'block', opacity: 0.6 }} />
                                        <p className="font-medium">Click to view full screen blueprint PDF</p>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                            <h4 className="font-headline-md text-text-primary mb-4 text-[18px]" style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Revision History</h4>
                            <div className="space-y-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                {drawings.map((d, index) => (
                                    <div key={index} className="flex justify-between items-center p-3 bg-surface-container-low rounded-lg border border-outline-variant" style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-surface-hover)' }}>
                                        <div>
                                            <p className="font-medium text-text-primary flex items-center gap-2" style={{ margin: 0, fontWeight: '600' }}>
                                                {d.revision.replace('Current ', '')} 
                                                {index === 0 && <span className="px-1.5 py-0.5 bg-status-on-track-bg text-status-on-track-text text-[10px] rounded uppercase" style={{ fontSize: '9px', marginLeft: '6px', backgroundColor: 'var(--accent-green-bg)', color: 'var(--accent-green)', padding: '2px 6px', borderRadius: '4px' }}>Current</span>}
                                            </p>
                                            <p className="text-body-sm text-text-secondary mt-1" style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>Uploaded by {d.uploader} • {d.date}</p>
                                            <p className="text-body-sm text-text-secondary mt-0.5 italic" style={{ margin: '4px 0 0 0', fontSize: '12px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{d.notes}"</p>
                                        </div>
                                        <button className="text-primary hover:underline text-body-sm" style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer' }} onClick={() => alert('Loading historic blueprint revision...')}>View</button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '24px' }}>
                            <h4 className="font-headline-md text-text-primary mb-4 text-[18px]" style={{ margin: '0 0 16px 0', fontSize: '18px' }}>Upload New Revision</h4>
                            <div className="border-2 border-dashed border-outline-variant rounded-lg p-8 flex flex-col items-center justify-center text-center bg-surface-container-low hover:bg-surface-container cursor-pointer transition-colors mb-4" style={{ border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '32px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', marginBottom: '16px' }} onClick={() => alert('Select blueprint PDF file upload...')}>
                                <UploadCloud className="text-outline" size={40} style={{ opacity: 0.6 }} />
                                <p className="font-medium text-text-primary mb-1" style={{ margin: 0 }}>Drag and drop file here</p>
                                <p className="text-body-sm text-text-secondary" style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>or click to browse</p>
                            </div>
                            <form onSubmit={handleUploadRevision} className="space-y-3" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <div>
                                    <label className="block text-body-sm font-medium text-text-primary mb-1" style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '4px' }}>Revision Notes</label>
                                    <textarea 
                                        className="w-full rounded-md border-outline-variant bg-surface-container-lowest text-body-sm focus:ring-primary focus:border-primary" 
                                        placeholder="Briefly describe what changed in this version..." 
                                        rows="3" 
                                        style={{ width: '100%', padding: '8px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', outline: 'none', fontFamily: 'inherit' }}
                                        value={newRevisionNotes}
                                        onChange={(e) => setNewRevisionNotes(e.target.value)}
                                        required
                                    />
                                </div>
                                <button type="submit" className="w-full py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-container transition-all" style={{ width: '100%', padding: '10px', borderRadius: 'var(--radius-md)', cursor: 'pointer', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', fontWeight: '600' }}>
                                    Submit Revision
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Tab Content: Attendance */}
            {activeTab === 'attendance' && (
                <AttendanceCalendar />
            )}

            {/* Tab Content: RFIs */}
            {activeTab === 'rfis' && (
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>Project RFIs</h3>
                        <button style={{ cursor: 'pointer', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: 'var(--radius-md)', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600', fontSize: '14px' }} onClick={() => {
                            const title = prompt('Enter RFI Title:');
                            if (title) {
                                setRfis(prev => [
                                    ...prev,
                                    {
                                        id: `RFI-${Math.floor(Math.random() * 100) + 50}`,
                                        title,
                                        priority: 'Medium',
                                        status: 'Open',
                                        date: 'Today',
                                        raisedBy: { name: 'Marcus Chen', role: 'Ops Director', avatar: 'MC' },
                                        assignedTo: { name: 'Unassigned', role: '', avatar: '??' },
                                        description: title,
                                        attachments: [],
                                        messages: [
                                            { id: 1, sender: 'Marcus Chen', avatar: 'MC', role: 'Ops Director', time: 'Just now', text: `New RFI created: ${title}` }
                                        ]
                                    }
                                ]);
                            }
                        }}>
                            <Plus size={16} /> New RFI
                        </button>
                    </div>

                    <div style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', backgroundColor: 'var(--bg-base)' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                            <thead style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                                <tr style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>ID</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Title</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Raised By</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Priority</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Status</th>
                                    <th style={{ padding: '12px 24px', fontWeight: '600' }}>Date</th>
                                    <th style={{ padding: '12px 24px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rfis.map(r => (
                                    <tr key={r.id} style={{ borderBottom: '1px solid var(--border-subtle)', cursor: 'pointer' }} onClick={() => setSelectedRfi(r)}>
                                        <td style={{ padding: '16px 24px', fontFamily: 'monospace', fontSize: '13px' }}>{r.id}</td>
                                        <td style={{ padding: '16px 24px', fontWeight: '500' }}>{r.title}</td>
                                        <td style={{ padding: '16px 24px' }}>
                                            {r.raisedBy && (
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '700', flexShrink: 0 }}>{r.raisedBy.avatar}</div>
                                                    <span style={{ fontSize: '13px' }}>{r.raisedBy.name}</span>
                                                </div>
                                            )}
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: r.priority === 'High' ? '#fee2e2' : '#fef3c7', color: r.priority === 'High' ? '#991b1b' : '#92400e' }}>
                                                {r.priority}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px' }}>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: r.status === 'Resolved' ? '#dcfce7' : '#f1f5f9', color: r.status === 'Resolved' ? '#166534' : '#475569' }}>
                                                {r.status}
                                            </span>
                                        </td>
                                        <td style={{ padding: '16px 24px', fontSize: '13px', color: 'var(--text-secondary)' }}>{r.date}</td>
                                        <td style={{ padding: '16px 24px', textAlign: 'right' }}>
                                            <button style={{ background: 'none', border: 'none', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '500', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px', marginLeft: 'auto' }} onClick={(e) => { e.stopPropagation(); setSelectedRfi(r); }}>
                                                <MessageSquare size={14} /> View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── RFI Detail Popup / Modal ── */}
                    {selectedRfi && (
                        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '24px' }} onClick={() => { setSelectedRfi(null); setRfiMessage(''); }}>
                            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', width: '100%', maxWidth: '720px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>

                                {/* Modal Header */}
                                <div style={{ padding: '20px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexShrink: 0 }}>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                                            <span style={{ fontFamily: 'monospace', fontSize: '14px', color: 'var(--accent-blue)', fontWeight: '700', backgroundColor: '#eff6ff', padding: '2px 8px', borderRadius: '6px' }}>{selectedRfi.id}</span>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: selectedRfi.priority === 'High' ? '#fee2e2' : '#fef3c7', color: selectedRfi.priority === 'High' ? '#991b1b' : '#92400e' }}>{selectedRfi.priority}</span>
                                            <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', backgroundColor: selectedRfi.status === 'Resolved' ? '#dcfce7' : '#f1f5f9', color: selectedRfi.status === 'Resolved' ? '#166534' : '#475569' }}>{selectedRfi.status}</span>
                                        </div>
                                        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--text-primary)' }}>{selectedRfi.title}</h3>
                                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {selectedRfi.date}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => { setSelectedRfi(null); setRfiMessage(''); }} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', display: 'flex', flexShrink: 0 }}>
                                        <X size={20} style={{ color: 'var(--text-secondary)' }} />
                                    </button>
                                </div>

                                {/* Modal Body - Scrollable */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '0' }}>

                                    {/* People Section */}
                                    <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '32px' }}>
                                        {selectedRfi.raisedBy && (
                                            <div>
                                                <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Raised By</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#991b1b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>{selectedRfi.raisedBy.avatar}</div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{selectedRfi.raisedBy.name}</p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedRfi.raisedBy.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {selectedRfi.assignedTo && (
                                            <div>
                                                <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned To</p>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#dbeafe', color: '#1e40af', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>{selectedRfi.assignedTo.avatar}</div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '14px', fontWeight: '600' }}>{selectedRfi.assignedTo.name}</p>
                                                        <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{selectedRfi.assignedTo.role}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Description Section */}
                                    {selectedRfi.description && (
                                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)' }}>
                                            <p style={{ margin: '0 0 6px 0', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Description</p>
                                            <p style={{ margin: 0, fontSize: '14px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{selectedRfi.description}</p>
                                        </div>
                                    )}

                                    {/* Attachments */}
                                    {selectedRfi.attachments && selectedRfi.attachments.length > 0 && (
                                        <div style={{ padding: '12px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {selectedRfi.attachments.map((file, i) => (
                                                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', padding: '6px 12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', color: 'var(--accent-blue)', cursor: 'pointer', fontWeight: '500' }}>
                                                    <Paperclip size={12} /> {file} <ExternalLink size={10} />
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {/* Conversation Thread */}
                                    <div style={{ padding: '16px 24px' }}>
                                        <p style={{ margin: '0 0 12px 0', fontSize: '11px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <MessageSquare size={13} /> Conversation ({selectedRfi.messages?.length || 0})
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            {(selectedRfi.messages || []).map(msg => (
                                                <div key={msg.id} style={{ display: 'flex', gap: '12px', padding: '14px', backgroundColor: msg.sender === 'Marcus Chen' ? '#eff6ff' : '#f8fafc', borderRadius: '12px', border: `1px solid ${msg.sender === 'Marcus Chen' ? '#bfdbfe' : 'var(--border-subtle)'}` }}>
                                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: msg.sender === 'Marcus Chen' ? '#1e40af' : '#e2e8f0', color: msg.sender === 'Marcus Chen' ? '#ffffff' : '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: '700', flexShrink: 0 }}>{msg.avatar}</div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                                <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{msg.sender}</span>
                                                                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', backgroundColor: '#f1f5f9', color: '#64748b', fontWeight: '500' }}>{msg.role}</span>
                                                            </div>
                                                            <span style={{ fontSize: '11px', color: '#94a3b8' }}>{msg.time}</span>
                                                        </div>
                                                        <p style={{ margin: 0, fontSize: '13px', lineHeight: '1.6', color: 'var(--text-primary)' }}>{msg.text}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Message Input Footer */}
                                <div style={{ padding: '16px 24px', borderTop: '1px solid var(--border-subtle)', backgroundColor: '#fafbfc', flexShrink: 0 }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                                        <div style={{ flex: 1, position: 'relative' }}>
                                            <textarea
                                                placeholder="Type your response..."
                                                value={rfiMessage}
                                                onChange={(e) => setRfiMessage(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter' && !e.shiftKey && rfiMessage.trim()) {
                                                        e.preventDefault();
                                                        const newMsg = {
                                                            id: (selectedRfi.messages?.length || 0) + 1,
                                                            sender: 'Marcus Chen',
                                                            avatar: 'MC',
                                                            role: 'Ops Director',
                                                            time: 'Just now',
                                                            text: rfiMessage.trim()
                                                        };
                                                        const updatedRfi = { ...selectedRfi, messages: [...(selectedRfi.messages || []), newMsg] };
                                                        setSelectedRfi(updatedRfi);
                                                        setRfis(prev => prev.map(r => r.id === selectedRfi.id ? updatedRfi : r));
                                                        setRfiMessage('');
                                                    }
                                                }}
                                                rows={2}
                                                style={{ width: '100%', padding: '12px 16px', border: '1px solid var(--border-subtle)', borderRadius: '12px', resize: 'none', fontFamily: 'inherit', fontSize: '14px', outline: 'none', backgroundColor: '#ffffff' }}
                                            />
                                        </div>
                                        <button
                                            onClick={() => {
                                                if (rfiMessage.trim()) {
                                                    const newMsg = {
                                                        id: (selectedRfi.messages?.length || 0) + 1,
                                                        sender: 'Marcus Chen',
                                                        avatar: 'MC',
                                                        role: 'Ops Director',
                                                        time: 'Just now',
                                                        text: rfiMessage.trim()
                                                    };
                                                    const updatedRfi = { ...selectedRfi, messages: [...(selectedRfi.messages || []), newMsg] };
                                                    setSelectedRfi(updatedRfi);
                                                    setRfis(prev => prev.map(r => r.id === selectedRfi.id ? updatedRfi : r));
                                                    setRfiMessage('');
                                                }
                                            }}
                                            style={{ padding: '12px', borderRadius: '12px', backgroundColor: rfiMessage.trim() ? 'var(--accent-blue)' : '#e2e8f0', color: rfiMessage.trim() ? 'white' : '#94a3b8', border: 'none', cursor: rfiMessage.trim() ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.15s ease' }}
                                        >
                                            <Send size={18} />
                                        </button>
                                    </div>
                                    <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#94a3b8' }}>Press Enter to send • Shift+Enter for new line</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Tab Content: Disputes */}
            {activeTab === 'disputes' && (
                <div>
                    <div className="mb-6" style={{ marginBottom: '24px' }}>
                        <h3 className="font-headline-md text-headline-md text-text-primary" style={{ margin: 0 }}>Attendance Disputes</h3>
                        <p className="text-body-sm text-text-secondary" style={{ margin: '4px 0 0 0', color: 'var(--text-secondary)' }}>Review and resolve attendance discrepancies raised by site supervisors.</p>
                    </div>

                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden" style={{ border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        {disputes.length === 0 ? (
                            <div style={{ padding: '48px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <CheckCircle size={32} style={{ color: 'var(--accent-green)', margin: '0 auto 8px auto', display: 'block' }} />
                                No pending attendance disputes to review. All on track!
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead className="bg-surface-container-low border-b border-outline-variant" style={{ backgroundColor: 'var(--bg-surface-hover)', borderBottom: '1px solid var(--border-subtle)' }}>
                                    <tr className="font-label-caps text-on-surface-variant text-[11px] uppercase" style={{ fontSize: '11px', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                        <th className="px-6 py-3" style={{ padding: '12px 24px', fontWeight: '600' }}>Date</th>
                                        <th className="px-6 py-3" style={{ padding: '12px 24px', fontWeight: '600' }}>Worker</th>
                                        <th className="px-6 py-3" style={{ padding: '12px 24px', fontWeight: '600' }}>Disputed Status</th>
                                        <th className="px-6 py-3" style={{ padding: '12px 24px', fontWeight: '600' }}>Supervisor Note</th>
                                        <th className="px-6 py-3 text-right" style={{ padding: '12px 24px', textAlign: 'right', fontWeight: '600' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="text-body-sm text-text-primary divide-y divide-outline-variant">
                                    {disputes.map(d => (
                                        <tr key={d.id} className="bg-amber-50/30" style={{ backgroundColor: 'rgba(254, 243, 199, 0.15)', borderBottom: '1px solid var(--border-subtle)' }}>
                                            <td className="px-6 py-4" style={{ padding: '16px 24px' }}>{d.date}</td>
                                            <td className="px-6 py-4" style={{ padding: '16px 24px' }}>
                                                <div className="flex items-center gap-2" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                                    <div className="w-8 h-8 rounded-full bg-secondary-fixed text-secondary flex items-center justify-center font-bold text-[10px]" style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--bg-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                        {d.avatar}
                                                    </div>
                                                    <span style={{ fontWeight: '500' }}>{d.worker}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4" style={{ padding: '16px 24px' }}>
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold uppercase" style={{ backgroundColor: 'var(--accent-amber-bg)', color: 'var(--accent-amber)', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold' }}>
                                                    {d.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 italic text-on-surface-variant" style={{ padding: '16px 24px', fontStyle: 'italic', color: 'var(--text-secondary)' }}>{d.note}</td>
                                            <td className="px-6 py-4 text-right" style={{ padding: '16px 24px' }}>
                                                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                    <button className="px-3 py-1 bg-primary text-white rounded text-[12px] font-semibold hover:bg-primary-container" style={{ cursor: 'pointer', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none', borderRadius: '4px', padding: '6px 12px', fontWeight: '600' }} onClick={() => handleApproveDispute(d.id)}>Approve</button>
                                                    <button className="px-3 py-1 border border-danger text-danger rounded text-[12px] font-semibold hover:bg-red-50" style={{ background: 'none', border: '1px solid var(--accent-red)', color: 'var(--accent-red)', borderRadius: '4px', padding: '5px 11px', cursor: 'pointer', fontWeight: '600' }} onClick={() => handleRejectDispute(d.id)}>Reject</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
}
