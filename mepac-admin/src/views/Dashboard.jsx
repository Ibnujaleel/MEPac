import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

export default function Dashboard({ setActiveView, projects = [] }) {
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
                    <div className="metric-header">Active Workforce</div>
                    <div className="metric-value">42</div>
                    <div className="metric-trend positive">↑ 12% vs yesterday</div>
                </div>
                <div className="metric-card alert-amber">
                    <div className="metric-header">Pending Disputes</div>
                    <div className="metric-value">3</div>
                    <div className="metric-desc highlight-amber">Needs review</div>
                </div>
                <div className="metric-card alert-red">
                    <div className="metric-header">Absent Today</div>
                    <div className="metric-value">2</div>
                    <div className="metric-desc">John Doe, Jane Smith</div>
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
                            <td>
                                <div className="worker-cell">
                                    <div className="avatar-small blue">MA</div>
                                    Michael Adams
                                </div>
                            </td>
                            <td>Electrician</td>
                            <td>Grand Tower MEP</td>
                            <td>08:02 AM</td>
                            <td><span className="status-pill outline-blue">Self</span></td>
                        </tr>
                        <tr className="row-amber">
                            <td>
                                <div className="worker-cell">
                                    <div className="avatar-small amber">SJ</div>
                                    Sarah Jenkins
                                </div>
                            </td>
                            <td>Plumber</td>
                            <td>Grand Tower MEP</td>
                            <td>08:05 AM</td>
                            <td><span className="status-pill outline-amber">Proxy</span></td>
                        </tr>
                        <tr>
                            <td>
                                <div className="worker-cell">
                                    <div className="avatar-small blue">DR</div>
                                    David Rodriguez
                                </div>
                            </td>
                            <td>HVAC Tech</td>
                            <td>Mall Extension</td>
                            <td>08:12 AM</td>
                            <td><span className="status-pill outline-blue">Self</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </section>
    );
}
