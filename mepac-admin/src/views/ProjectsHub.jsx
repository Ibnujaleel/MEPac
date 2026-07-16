import React from 'react';
import { MapPin, Users } from 'lucide-react';

export default function ProjectsHub({ openModal, projects, setActiveView, setSelectedProject }) {
    const activeProjects = projects.filter(p => !p.isCompleted);
    const pastProjects = projects.filter(p => p.isCompleted);

    const handleProjectClick = (project) => {
        setSelectedProject(project);
        setActiveView('view-project-details');
    };

    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Projects</h2>
                    <p className="subtitle">Managing active MEP contracts and site deployment.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn primary" onClick={() => openModal('add-project')}>+ Add Project</button>
                </div>
            </div>

            <h3 style={{ marginTop: '24px', marginBottom: '8px', color: 'var(--text-primary)' }}>Active Projects</h3>
            <div className="project-card-grid">
                {activeProjects.map(project => (
                    <div className="project-card" key={project.id} onClick={() => handleProjectClick(project)}>
                        <div className="project-card-img" style={{ backgroundImage: `url(${project.imageUrl})` }}></div>
                        <div className="project-card-content">
                            <h3>{project.name}</h3>
                            <p className="client-text">{project.client}</p>

                            <div className="project-meta">
                                <span><MapPin size={14} /> {project.location}</span>
                                <span><Users size={14} /> {project.employeesPresent} / {project.totalAssigned} Active</span>
                            </div>

                            <div className="progress-container">
                                <div className="progress-labels">
                                    <span>Headcount Progress</span>
                                    <span>{project.progress}</span>
                                </div>
                                <div className="progress-bar">
                                    <div className="fill green" style={{ width: `${project.percent}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {activeProjects.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No active projects.</div>}
            </div>

            {pastProjects.length > 0 && (
                <>
                    <h3 style={{ marginTop: '48px', marginBottom: '8px', color: 'var(--text-primary)' }}>Past Projects</h3>
                    <div className="project-card-grid">
                        {pastProjects.map(project => (
                            <div className="project-card completed" key={project.id} onClick={() => handleProjectClick(project)}>
                                <div className="project-card-img" style={{ backgroundImage: `url(${project.imageUrl})` }}></div>
                                <div className="project-card-content">
                                    <h3>{project.name}</h3>
                                    <p className="client-text">{project.client}</p>
                                    
                                    <div className="project-meta">
                                        <span><MapPin size={14} /> {project.location}</span>
                                        <span><Users size={14} /> {project.totalAssigned} Total Workers</span>
                                    </div>
                                    <div className="progress-container">
                                        <span className="status-badge" style={{ background: 'var(--bg-base)', color: 'var(--text-muted)', border: '1px solid var(--border-subtle)', boxShadow: 'none' }}>Completed</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    );
}
