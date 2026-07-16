import React from 'react';
import { Download, Search, Settings } from 'lucide-react';

export default function AttendanceLog({ setActiveView, projects = [] }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Global Attendance Log</h2>
                    <p className="subtitle">Unified Reconciliation Dashboard</p>
                </div>
                <div className="header-actions">
                    <div className="toggle-container">
                        <span className="toggle-label">Exceptions Only</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="v-divider"></div>
                    <button className="btn primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>Export <Download size={16} /></button>
                </div>
            </div>

            <div className="metrics-row">
                <div className="metric-card">
                    <div className="metric-header">Total Check-ins</div>
                    <div className="metric-value">42</div>
                    <div className="metric-desc highlight-green">+12% vs yesterday</div>
                </div>
                <div className="metric-card">
                    <div className="metric-header">Late Check-ins</div>
                    <div className="metric-value">3</div>
                    <div className="metric-desc">Beyond 15m buffer</div>
                </div>
                <div className="metric-card alert-amber">
                    <div className="metric-header">Proxy Requests</div>
                    <div className="metric-value">5</div>
                    <div className="metric-desc highlight-amber">Awaiting confirmation</div>
                </div>
                <div className="metric-card alert-red">
                    <div className="metric-header">Silent Sites</div>
                    <div className="metric-value">1</div>
                    <div className="metric-desc highlight-red">No check-ins today</div>
                </div>
            </div>

            {/* Projects Overview */}
            <div className="panel">
                <div className="panel-header">
                    <h3>Projects Overview</h3>
                    <button className="btn text-btn" onClick={() => setActiveView('view-projects')}>View All Projects →</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>PROJECT</th>
                            <th>LOCATION</th>
                            <th>HEADCOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.slice(0, 4).map(project => (
                            <tr key={project.id}>
                                <td style={{ fontWeight: 500 }}>{project.name}</td>
                                <td>{project.location}</td>
                                <td>
                                    <div className="progress-cell">
                                        <span>{project.progress}</span>
                                        <div className="progress-bar"><div className="fill green" style={{width: `${project.percent}%`}}></div></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="attendance-grid">
                <div className="attendance-main panel">
                    <div className="panel-header">
                        <h3>Worker Attendance</h3>
                        <div className="header-actions">
                            <button className="icon-btn"><Search size={18} /></button>
                            <button className="icon-btn"><Settings size={18} /></button>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Worker ID</th>
                                <th>Name</th>
                                <th>Project Site</th>
                                <th>Time In</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="dimmed">
                                <td>W-1042</td>
                                <td>James Wilson</td>
                                <td>Downtown Tower A</td>
                                <td>06:55 AM</td>
                                <td><span className="status-pill solid-grey">Standard</span></td>
                            </tr>
                            <tr>
                                <td>W-2198</td>
                                <td>Marcus Vance</td>
                                <td>Site 4B - Electrical</td>
                                <td>09:15 AM</td>
                                <td><span className="status-pill solid-grey">Standard</span></td>
                            </tr>
                            <tr className="row-amber">
                                <td>W-1883</td>
                                <td>Sarah Chen</td>
                                <td>Hospital Wing C</td>
                                <td>07:05 AM</td>
                                <td><span className="status-pill outline-amber">Proxy Req</span></td>
                            </tr>
                            <tr className="dimmed">
                                <td>W-0921</td>
                                <td>David Ross</td>
                                <td>Downtown Tower A</td>
                                <td>06:58 AM</td>
                                <td><span className="status-pill solid-grey">Standard</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
