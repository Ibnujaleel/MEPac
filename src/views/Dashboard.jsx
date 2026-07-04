import React from 'react';

export default function Dashboard({ setActiveView, projects = [], navigateToProject }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Mission Control</h2>
                    <p className="subtitle">Real-time operational overview.</p>
                </div>
                <div className="date-display">Today, Jun 6, 2026</div>
            </div>
            
            <div className="metrics-row">
                <div className="metric-card">
                    <div className="metric-header">ACTIVE WORKFORCE TODAY</div>
                    <div className="metric-value">42</div>
                    <div className="metric-trend positive">↑ 12%</div>
                    <div className="metric-desc">across 3 projects</div>
                </div>
                <div className="metric-card alert-amber">
                    <div className="metric-header">ATTENDANCE DISPUTES</div>
                    <div className="metric-value">3</div>
                    <div className="metric-desc highlight-amber">NEEDS ADMIN REVIEW</div>
                </div>
                <div className="metric-card alert-red">
                    <div className="metric-header">ABSENCE REPORTS</div>
                    <div className="metric-value">2</div>
                    <div className="metric-desc">John Doe, Jane Smith</div>
                </div>
            </div>

            <div className="dashboard-grid">

                <div className="projects-area panel">
                    <div className="panel-header" style={{ gridColumn: '1 / -1', marginBottom: 0 }}>
                        <h3 style={{ margin: 0 }}>Projects Overview</h3>
                        <button className="btn text-btn" onClick={() => setActiveView('view-projects')}>View All Projects →</button>
                    </div>
                    {projects.slice(0, 2).map(project => (
                        <div className="project-detail-card" key={project.id} onClick={() => navigateToProject(project)} style={{ cursor: 'pointer' }}>
                            <div className="project-detail-header">
                                <span className="project-name">{project.name}</span>
                                <span className={`status-pill ${project.status === 'Delayed' ? 'solid-red' : 'solid-green'}`}>{project.status}</span>
                            </div>
                            <div className="project-detail-body">
                                <div className="detail-stat"><strong>{project.employeesPresent}</strong> employees currently present</div>
                                <ul className="employee-list">
                                    {project.employees.map((emp, i) => (
                                        <li key={i}><div className="avatar-small blue">{emp.initials}</div> {emp.name} ({emp.role})</li>
                                    ))}
                                    {project.employeesPresent > project.employees.length && (
                                        <li className="more-text">+{project.employeesPresent - project.employees.length} more</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="live-feed panel">
                <div className="panel-header">
                    <h3>Live Worker Check-in Feed</h3>
                    <div style={{display: 'flex', gap: '8px'}}>
                        <button className="btn secondary">Filter ⚙️</button>
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
