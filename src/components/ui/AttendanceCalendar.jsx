import React, { useState } from 'react';
import {
    ChevronLeft,
    ChevronRight,
    Users,
    UserX,
    UserCheck,
    Clock,
    ShieldCheck,
    MapPin,
    Camera,
    AlertTriangle,
    X,
    Eye
} from 'lucide-react';

// ── Mock attendance data for June 2026 ──
const attendanceData = {
    '2026-06-01': { present: 28, absent: 0, late: 1, proxy: 2, total: 28, supervisor: null, notes: null,
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '07:58 AM', method: 'Self', status: 'Present' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '08:05 AM', method: 'Self', status: 'Present' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '08:12 AM', method: 'Proxy', status: 'Present' },
            { name: 'Mohammed Nasir', role: 'HVAC Tech', avatar: 'MN', checkin: '07:45 AM', method: 'Self', status: 'Present' },
        ]},
    '2026-06-02': { present: 28, absent: 0, late: 0, proxy: 1, total: 28, supervisor: null, notes: null,
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '07:50 AM', method: 'Self', status: 'Present' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '08:00 AM', method: 'Self', status: 'Present' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '08:01 AM', method: 'Self', status: 'Present' },
        ]},
    '2026-06-03': { present: 26, absent: 2, late: 3, proxy: 5, total: 28,
        supervisor: { name: 'Tariq Al-Fayed', time: '08:00 AM', gpsVerified: true },
        notes: 'Heavy rain caused 2 absences. Drainage work suspended.',
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '08:30 AM', method: 'Proxy', status: 'Late' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '—', method: '—', status: 'Absent' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '08:45 AM', method: 'Self', status: 'Late' },
            { name: 'Mohammed Nasir', role: 'HVAC Tech', avatar: 'MN', checkin: '07:50 AM', method: 'Self', status: 'Present' },
            { name: 'Priya Menon', role: 'Welder', avatar: 'PM', checkin: '—', method: '—', status: 'Absent' },
        ]},
    '2026-06-04': { present: 27, absent: 1, late: 2, proxy: 3, total: 28, supervisor: null, notes: null,
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '07:55 AM', method: 'Self', status: 'Present' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '—', method: '—', status: 'Absent' },
        ]},
    '2026-06-05': { present: 28, absent: 0, late: 0, proxy: 0, total: 28,
        supervisor: { name: 'Tariq Al-Fayed', time: '07:55 AM', gpsVerified: true },
        notes: 'Full attendance. Drawing Rev 4 work started in East wing.',
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '07:48 AM', method: 'Self', status: 'Present' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '07:52 AM', method: 'Self', status: 'Present' },
        ]},
    '2026-06-08': { present: 28, absent: 0, late: 1, proxy: 1, total: 28, supervisor: null, notes: null,
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '07:58 AM', method: 'Self', status: 'Present' },
        ]},
    '2026-06-09': { present: 23, absent: 5, late: 4, proxy: 3, total: 28,
        supervisor: { name: 'Tariq Al-Fayed', time: '08:15 AM', gpsVerified: false },
        notes: 'Transport strike caused mass absences. Dispute filed for 2 workers.',
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '09:00 AM', method: 'Proxy', status: 'Late' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '—', method: '—', status: 'Absent' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '—', method: '—', status: 'Absent' },
            { name: 'Mohammed Nasir', role: 'HVAC Tech', avatar: 'MN', checkin: '08:50 AM', method: 'Self', status: 'Late' },
            { name: 'Priya Menon', role: 'Welder', avatar: 'PM', checkin: '—', method: '—', status: 'Absent' },
            { name: 'Suresh Kumar', role: 'Painter', avatar: 'SK', checkin: '—', method: '—', status: 'Absent' },
            { name: 'Ali Hassan', role: 'Helper', avatar: 'AH', checkin: '—', method: '—', status: 'Absent' },
        ]},
    '2026-06-10': { present: 27, absent: 1, late: 1, proxy: 2, total: 28,
        supervisor: { name: 'Tariq Al-Fayed', time: '08:00 AM', gpsVerified: true, photo: true },
        notes: 'Site inspection completed. Work verified against drawing Rev 4.',
        workers: [
            { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA', checkin: '08:02 AM', method: 'Self', status: 'Present' },
            { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP', checkin: '08:10 AM', method: 'Self', status: 'Present' },
            { name: 'Rajat Sharma', role: 'Foreman', avatar: 'RS', checkin: '—', method: '—', status: 'Absent' },
        ]},
    '2026-06-11': { present: 27, absent: 1, late: 0, proxy: 1, total: 28, supervisor: null, notes: null,
        workers: [] },
    '2026-06-12': { present: 28, absent: 0, late: 2, proxy: 0, total: 28,
        supervisor: { name: 'Tariq Al-Fayed', time: '07:50 AM', gpsVerified: true },
        notes: null, workers: [] },
};

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
    const day = new Date(year, month, 1).getDay();
    return day === 0 ? 6 : day - 1; // Monday = 0
}

function formatDateKey(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function getStatusColor(data) {
    if (!data) return 'none';
    const ratio = data.present / data.total;
    if (ratio >= 1) return 'perfect';
    if (ratio >= 0.9) return 'good';
    if (ratio >= 0.8) return 'warning';
    return 'critical';
}

export default function AttendanceCalendar() {
    const [year, setYear] = useState(2026);
    const [month, setMonth] = useState(5); // June = 5
    const [selectedDay, setSelectedDay] = useState(null);

    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });

    const prevMonth = () => {
        if (month === 0) { setMonth(11); setYear(y => y - 1); }
        else setMonth(m => m - 1);
        setSelectedDay(null);
    };

    const nextMonth = () => {
        if (month === 11) { setMonth(0); setYear(y => y + 1); }
        else setMonth(m => m + 1);
        setSelectedDay(null);
    };

    const selectedDateKey = selectedDay ? formatDateKey(year, month, selectedDay) : null;
    const selectedData = selectedDateKey ? attendanceData[selectedDateKey] : null;

    // Build calendar grid cells
    const cells = [];
    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
        cells.push({ type: 'empty', key: `empty-${i}` });
    }
    // Day cells
    for (let d = 1; d <= daysInMonth; d++) {
        const dateKey = formatDateKey(year, month, d);
        const dayOfWeek = (firstDay + d - 1) % 7; // 0=Mon ... 6=Sun
        const isWeekend = dayOfWeek >= 5;
        const data = attendanceData[dateKey] || null;
        const isToday = d === 10 && month === 5 && year === 2026; // Demo "today"
        cells.push({ type: 'day', day: d, dateKey, isWeekend, data, isToday, key: `day-${d}` });
    }

    return (
        <div>
            {/* Header with month navigation */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: 'var(--text-primary)' }}>Attendance Summary</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '4px 8px', backgroundColor: 'var(--bg-base)' }}>
                    <button onClick={prevMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '6px' }}>
                        <ChevronLeft size={16} />
                    </button>
                    <span style={{ fontWeight: '600', fontSize: '15px', minWidth: '130px', textAlign: 'center' }}>{monthName} {year}</span>
                    <button onClick={nextMonth} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: '6px', borderRadius: '6px' }}>
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Monthly Stats Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Check-ins</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '700', color: 'var(--text-primary)' }}>412</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg. Attendance</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '700', color: 'var(--accent-green)' }}>94%</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Late Arrivals</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '700', color: 'var(--accent-amber)' }}>14</p>
                </div>
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', padding: '16px' }}>
                    <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Absences</p>
                    <p style={{ margin: '6px 0 0 0', fontSize: '28px', fontWeight: '700', color: 'var(--accent-red)' }}>8</p>
                </div>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#dcfce7', border: '1px solid #86efac' }}></span> Full Attendance</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#d1fae5', border: '1px solid #6ee7b7' }}></span> 90%+ Present</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#fef3c7', border: '1px solid #fcd34d' }}></span> 80–89%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '10px', height: '10px', borderRadius: '3px', backgroundColor: '#fee2e2', border: '1px solid #fca5a5' }}></span> &lt;80%</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={12} style={{ color: 'var(--accent-blue)' }} /> Supervisor Visit</span>
            </div>

            {/* Calendar + Detail Drawer layout */}
            <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? '1fr 380px' : '1fr', gap: '24px', transition: 'all 0.2s ease' }}>

                {/* Calendar Grid */}
                <div style={{ backgroundColor: 'var(--bg-base)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                    {/* Weekday Headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border-subtle)' }}>
                        {DAYS.map(d => (
                            <div key={d} style={{ padding: '10px 8px', textAlign: 'center', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', backgroundColor: 'var(--bg-surface-hover)' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Day Cells Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
                        {cells.map(cell => {
                            if (cell.type === 'empty') {
                                return <div key={cell.key} style={{ minHeight: '100px', borderBottom: '1px solid var(--border-subtle)', borderRight: '1px solid var(--border-subtle)', backgroundColor: '#fafafa' }}></div>;
                            }

                            const { day, isWeekend, data, isToday } = cell;
                            const status = getStatusColor(data);
                            const isSelected = selectedDay === day;

                            const bgColors = {
                                perfect: '#f0fdf4',
                                good: '#f0fdf4',
                                warning: '#fffbeb',
                                critical: '#fef2f2',
                                none: isWeekend ? '#f8fafc' : '#ffffff'
                            };

                            const borderColors = {
                                perfect: '#86efac',
                                good: '#6ee7b7',
                                warning: '#fcd34d',
                                critical: '#fca5a5',
                                none: 'var(--border-subtle)'
                            };

                            return (
                                <div
                                    key={cell.key}
                                    onClick={() => !isWeekend && data && setSelectedDay(isSelected ? null : day)}
                                    style={{
                                        minHeight: '100px',
                                        padding: '8px',
                                        borderBottom: '1px solid var(--border-subtle)',
                                        borderRight: '1px solid var(--border-subtle)',
                                        backgroundColor: isSelected ? '#eff6ff' : bgColors[status],
                                        cursor: (!isWeekend && data) ? 'pointer' : 'default',
                                        transition: 'all 0.15s ease',
                                        position: 'relative',
                                        outline: isSelected ? '2px solid var(--accent-blue)' : 'none',
                                        outlineOffset: '-2px',
                                        borderRadius: isSelected ? '4px' : '0',
                                    }}
                                >
                                    {/* Day Number */}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                                        <span style={{
                                            fontSize: '14px',
                                            fontWeight: isToday ? '800' : '500',
                                            color: isToday ? 'var(--accent-blue)' : isWeekend ? 'var(--text-muted)' : 'var(--text-primary)',
                                            backgroundColor: isToday ? '#dbeafe' : 'transparent',
                                            width: isToday ? '28px' : 'auto',
                                            height: isToday ? '28px' : 'auto',
                                            borderRadius: '50%',
                                            display: isToday ? 'flex' : 'inline',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            lineHeight: isToday ? '28px' : 'normal'
                                        }}>
                                            {day}
                                        </span>
                                        {data?.supervisor && (
                                            <ShieldCheck size={14} style={{ color: data.supervisor.gpsVerified ? 'var(--accent-blue)' : 'var(--accent-amber)' }} />
                                        )}
                                    </div>

                                    {/* Content */}
                                    {isWeekend && !data && (
                                        <div style={{ fontSize: '10px', color: 'var(--text-muted)', textAlign: 'center', marginTop: '12px' }}>Off</div>
                                    )}

                                    {data && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                                            {/* Present / Absent pills */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                <UserCheck size={11} style={{ color: '#16a34a' }} />
                                                <span style={{ fontSize: '11px', fontWeight: '600', color: '#16a34a' }}>{data.present}</span>
                                                {data.absent > 0 && (
                                                    <>
                                                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>/</span>
                                                        <UserX size={11} style={{ color: '#dc2626' }} />
                                                        <span style={{ fontSize: '11px', fontWeight: '600', color: '#dc2626' }}>{data.absent}</span>
                                                    </>
                                                )}
                                            </div>

                                            {/* Late + Proxy row */}
                                            {(data.late > 0 || data.proxy > 0) && (
                                                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                    {data.late > 0 && (
                                                        <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600' }}>
                                                            {data.late} late
                                                        </span>
                                                    )}
                                                    {data.proxy > 0 && (
                                                        <span style={{ fontSize: '9px', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#e0e7ff', color: '#3730a3', fontWeight: '600' }}>
                                                            {data.proxy} proxy
                                                        </span>
                                                    )}
                                                </div>
                                            )}

                                            {/* Notes indicator */}
                                            {data.notes && (
                                                <div style={{ fontSize: '9px', color: 'var(--text-muted)', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    📝 Note
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Detail Drawer - Day Log */}
                {selectedDay && (
                    <div style={{
                        backgroundColor: 'var(--bg-base)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: 'var(--radius-lg)',
                        overflow: 'hidden',
                        position: 'sticky',
                        top: '80px',
                        maxHeight: 'calc(100vh - 120px)',
                        overflowY: 'auto',
                    }}>
                        {/* Drawer Header */}
                        <div style={{
                            padding: '16px 20px',
                            borderBottom: '1px solid var(--border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: 'var(--bg-surface-hover)',
                            position: 'sticky',
                            top: 0,
                            zIndex: 1
                        }}>
                            <div>
                                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '700' }}>
                                    {new Date(year, month, selectedDay).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                                </h4>
                                {selectedData && (
                                    <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        {selectedData.present} of {selectedData.total} workers present
                                    </p>
                                )}
                            </div>
                            <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', borderRadius: '6px', display: 'flex' }}>
                                <X size={18} style={{ color: 'var(--text-secondary)' }} />
                            </button>
                        </div>

                        {selectedData ? (
                            <div style={{ padding: '16px 20px' }}>

                                {/* Quick Stats Row */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
                                    <div style={{ padding: '12px', backgroundColor: '#f0fdf4', borderRadius: '10px', textAlign: 'center' }}>
                                        <UserCheck size={18} style={{ color: '#16a34a', margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '22px', fontWeight: '700', color: '#16a34a' }}>{selectedData.present}</div>
                                        <div style={{ fontSize: '10px', color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Present</div>
                                    </div>
                                    <div style={{ padding: '12px', backgroundColor: selectedData.absent > 0 ? '#fef2f2' : '#f8fafc', borderRadius: '10px', textAlign: 'center' }}>
                                        <UserX size={18} style={{ color: selectedData.absent > 0 ? '#dc2626' : '#94a3b8', margin: '0 auto 4px' }} />
                                        <div style={{ fontSize: '22px', fontWeight: '700', color: selectedData.absent > 0 ? '#dc2626' : '#94a3b8' }}>{selectedData.absent}</div>
                                        <div style={{ fontSize: '10px', color: selectedData.absent > 0 ? '#991b1b' : '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Absent</div>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                                    {selectedData.late > 0 && (
                                        <div style={{ flex: 1, padding: '10px', backgroundColor: '#fffbeb', borderRadius: '8px', textAlign: 'center' }}>
                                            <Clock size={14} style={{ color: '#d97706', margin: '0 auto 2px' }} />
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#d97706' }}>{selectedData.late}</div>
                                            <div style={{ fontSize: '9px', color: '#92400e', textTransform: 'uppercase' }}>Late</div>
                                        </div>
                                    )}
                                    {selectedData.proxy > 0 && (
                                        <div style={{ flex: 1, padding: '10px', backgroundColor: '#eef2ff', borderRadius: '8px', textAlign: 'center' }}>
                                            <Users size={14} style={{ color: '#4f46e5', margin: '0 auto 2px' }} />
                                            <div style={{ fontSize: '16px', fontWeight: '700', color: '#4f46e5' }}>{selectedData.proxy}</div>
                                            <div style={{ fontSize: '9px', color: '#3730a3', textTransform: 'uppercase' }}>Proxy</div>
                                        </div>
                                    )}
                                </div>

                                {/* Supervisor Section */}
                                {selectedData.supervisor && (
                                    <div style={{
                                        padding: '14px',
                                        backgroundColor: selectedData.supervisor.gpsVerified ? '#f0fdf4' : '#fffbeb',
                                        border: `1px solid ${selectedData.supervisor.gpsVerified ? '#bbf7d0' : '#fde68a'}`,
                                        borderRadius: '10px',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                            <ShieldCheck size={16} style={{ color: selectedData.supervisor.gpsVerified ? '#16a34a' : '#d97706' }} />
                                            <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>Supervisor Visit</span>
                                        </div>
                                        <p style={{ margin: 0, fontSize: '13px' }}>
                                            <strong>{selectedData.supervisor.name}</strong> verified site at {selectedData.supervisor.time}
                                        </p>
                                        <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
                                            {selectedData.supervisor.gpsVerified && (
                                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#dcfce7', color: '#166534', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <MapPin size={10} /> GPS Verified
                                                </span>
                                            )}
                                            {!selectedData.supervisor.gpsVerified && (
                                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#fef3c7', color: '#92400e', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <AlertTriangle size={10} /> GPS Not Verified
                                                </span>
                                            )}
                                            {selectedData.supervisor.photo && (
                                                <span style={{ fontSize: '10px', padding: '2px 8px', borderRadius: '4px', backgroundColor: '#dbeafe', color: '#1e40af', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                                    <Camera size={10} /> Site Photo
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* Notes */}
                                {selectedData.notes && (
                                    <div style={{ padding: '12px', backgroundColor: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', marginBottom: '20px' }}>
                                        <p style={{ margin: 0, fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '4px' }}>Day Notes</p>
                                        <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-primary)', lineHeight: '1.5' }}>{selectedData.notes}</p>
                                    </div>
                                )}

                                {/* Worker Log Table */}
                                {selectedData.workers && selectedData.workers.length > 0 && (
                                    <div>
                                        <p style={{ margin: '0 0 10px 0', fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Worker Log</p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                            {selectedData.workers.map((w, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '10px',
                                                    padding: '10px 12px',
                                                    borderRadius: '8px',
                                                    backgroundColor: w.status === 'Absent' ? '#fef2f2' : w.status === 'Late' ? '#fffbeb' : '#f8fafc',
                                                    border: `1px solid ${w.status === 'Absent' ? '#fecaca' : w.status === 'Late' ? '#fde68a' : 'var(--border-subtle)'}`,
                                                }}>
                                                    <div style={{
                                                        width: '34px', height: '34px', borderRadius: '50%',
                                                        backgroundColor: w.status === 'Absent' ? '#fee2e2' : w.status === 'Late' ? '#fef3c7' : '#dbeafe',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '11px', fontWeight: '700', flexShrink: 0,
                                                        color: w.status === 'Absent' ? '#991b1b' : w.status === 'Late' ? '#92400e' : '#1e40af'
                                                    }}>
                                                        {w.avatar}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>{w.name}</div>
                                                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{w.role}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                                        <div style={{ fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-primary)' }}>{w.checkin}</div>
                                                        <span style={{
                                                            fontSize: '9px', fontWeight: '700', textTransform: 'uppercase',
                                                            padding: '1px 6px', borderRadius: '4px',
                                                            backgroundColor: w.status === 'Present' ? '#dcfce7' : w.status === 'Absent' ? '#fee2e2' : '#fef3c7',
                                                            color: w.status === 'Present' ? '#166534' : w.status === 'Absent' ? '#991b1b' : '#92400e',
                                                        }}>
                                                            {w.status}
                                                        </span>
                                                        {w.method !== '—' && w.method !== 'Self' && (
                                                            <span style={{ fontSize: '9px', fontWeight: '600', padding: '1px 5px', borderRadius: '4px', backgroundColor: '#e0e7ff', color: '#3730a3', marginLeft: '4px' }}>
                                                                {w.method}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {selectedData.workers.length < selectedData.present && (
                                            <button style={{
                                                width: '100%', marginTop: '10px', padding: '8px',
                                                border: '1px solid var(--border-subtle)', borderRadius: '8px',
                                                background: 'none', cursor: 'pointer', fontSize: '12px',
                                                color: 'var(--accent-blue)', fontWeight: '500',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                            }}>
                                                <Eye size={14} /> View all {selectedData.present} check-ins
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                <p>No attendance data recorded for this day.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
