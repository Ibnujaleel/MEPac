import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function Dashboard({ setActiveView, projects = [], workforce = [] }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Mission Control</h2>
                    <p className="subtitle">Real-time operational overview.</p>
                </div>
                <div className="date-display">
                    {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                </div>
            </div>
            
            <div className="metrics-row">
                <div className="metric-card">
                    <div className="metric-header">Total Workforce</div>
                    <div className="metric-value">{workforce.length}</div>
                    <div className="metric-desc">registered workers</div>
                </div>
                <div className="metric-card alert-amber">
                    <div className="metric-header">Pending Disputes</div>
                    <div className="metric-value">0</div>
                    <div className="metric-desc highlight-amber">Needs review</div>
                </div>
                <div className="metric-card alert-red">
                    <div className="metric-header">Absent Today</div>
                    <div className="metric-value">0</div>
                    <div className="metric-desc">No data yet</div>
                </div>
                <div className="metric-card">
                    <div className="metric-header">Active Projects</div>
                    <div className="metric-value">{projects.length}</div>
                    <div className="metric-desc">across all sites</div>
                </div>
            </div>

            <div className="live-feed panel">
                <div className="panel-header">
                    <h3>Live Worker Check-in Feed</h3>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button className="btn secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>Filter <SlidersHorizontal size={16} /></button>
                        <button className="btn primary" onClick={() => setActiveView('view-attendance')}>View All Attendance →</button>
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>WORKER</th>
                            <th>ROLE</th>
                            <th>PROJECT</th>
                            <th>CHECK-IN TIME</th>
                            <th>METHOD</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                                No recent check-ins today.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
