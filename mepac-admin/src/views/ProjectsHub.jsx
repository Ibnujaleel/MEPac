import React from 'react';

export default function ProjectsHub({ openModal, projects }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Projects</h2>
                    <p className="subtitle">Managing active MEP contracts and site deployment.</p>
                </div>
                <div className="header-actions" style={{display: 'flex', gap: '12px'}}>
                    <button className="btn secondary" onClick={() => openModal('add-blueprint')}>Upload Blueprint</button>
                    <button className="btn primary" onClick={() => openModal('add-project')}>+ Add Project</button>
                </div>
            </div>
            
            <div className="panel">
                <div className="panel-header filter-strip">
                    <div className="filter-group">
                        <span>Filter by:</span>
                        <button className="btn dropdown-btn">All Status ▼</button>
                        <button className="btn dropdown-btn">June 2026 - July 2026 ▼</button>
                    </div>
                    <button className="btn text-btn">Clear all filters</button>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>PROJECT NAME</th>
                            <th>CLIENT</th>
                            <th>LOCATION</th>
                            <th>STATUS</th>
                            <th>HEADCOUNT</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map(project => (
                            <tr key={project.id}>
                                <td>{project.name}</td>
                                <td>{project.client}</td>
                                <td>{project.location}</td>
                                <td><span className={`status-pill ${project.status === 'Delayed' ? 'solid-red' : 'solid-green'}`}>{project.status}</span></td>
                                <td>
                                    <div className="progress-cell">
                                        <span>{project.progress}</span>
                                        <div className="progress-bar"><div className={`fill ${project.status === 'Delayed' ? 'red' : 'green'}`} style={{width: `${project.percent}%`}}></div></div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
}
