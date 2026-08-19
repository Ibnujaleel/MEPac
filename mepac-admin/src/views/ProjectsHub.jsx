import React from 'react';
import { MapPin, Users, ShieldCheck, Clock, UserCheck } from 'lucide-react';
import { getProjectColor } from '../utils/colors';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';

export default function ProjectsHub({ openModal, projects, setActiveView, setSelectedProject }) {
    const visitsByProject = useQuery(api.checkIns.getAllProjectsSupervisorVisits) || {};

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
                    <h2>Projects & Supervisor Site Visits</h2>
                    <p className="subtitle">Track active MEP project deployments, assigned teams, and supervisor site inspection logs.</p>
                </div>
                <div className="header-actions" style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn primary" onClick={() => openModal('add-project')}>+ Add Project</button>
                </div>
            </div>

            <h3 style={{ marginTop: '24px', marginBottom: '8px', color: 'var(--text-primary)' }}>Active Projects</h3>
            <div className="project-card-grid">
                {activeProjects.map(project => {
                    const visits = visitsByProject[project._id] || [];
                    const isVisited = visits.length > 0;
                    const lastVisit = isVisited ? visits[0] : null;

                    return (
                        <div className="project-card" key={project._id} onClick={() => handleProjectClick(project)}>
                            <div className="project-card-img" style={{ 
                                backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
                                backgroundColor: project.imageUrl ? 'transparent' : getProjectColor(project._id),
                                position: 'relative'
                            }}>
                                {/* Supervisor Visit Overlay Pill */}
                                <div style={{
                                    position: 'absolute',
                                    top: '12px',
                                    left: '12px',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '11px',
                                    fontWeight: 700,
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    backgroundColor: isVisited ? 'rgba(22, 163, 74, 0.9)' : 'rgba(245, 158, 11, 0.9)',
                                    color: 'white',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
                                    backdropFilter: 'blur(4px)',
                                }}>
                                    <UserCheck size={13} />
                                    {isVisited ? `Visited by ${lastVisit.supervisorName}` : 'No Supervisor Visit Today'}
                                </div>
                            </div>
                            <div className="project-card-content">
                                <h3>{project.name}</h3>
                                <p className="client-text">{project.client}</p>

                                <div className="project-meta">
                                    <span><MapPin size={14} /> {project.location}</span>
                                    <span><Users size={14} /> {project.employeesPresent} / {project.totalAssigned} Active</span>
                                </div>

                                {/* Supervisor Site Visit Status Sub-bar */}
                                <div style={{
                                    marginTop: '12px',
                                    paddingTop: '10px',
                                    borderTop: '1px solid var(--border-subtle)',
                                    fontSize: '12px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    color: isVisited ? '#15803d' : 'var(--text-muted)'
                                }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
                                        <ShieldCheck size={14} color={isVisited ? '#16a34a' : 'var(--text-muted)'} />
                                        {isVisited ? `Inspected at ${lastVisit.checkInTimeStr}` : 'Site Inspection Pending'}
                                    </span>
                                    {isVisited && (
                                        <span style={{ fontSize: '11px', backgroundColor: '#dcfce7', color: '#166534', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>
                                            Checked-In
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
                {activeProjects.length === 0 && <div style={{ color: 'var(--text-muted)' }}>No active projects.</div>}
            </div>

            {pastProjects.length > 0 && (
                <>
                    <h3 style={{ marginTop: '48px', marginBottom: '8px', color: 'var(--text-primary)' }}>Past Projects</h3>
                    <div className="project-card-grid">
                        {pastProjects.map(project => (
                            <div className="project-card completed" key={project._id} onClick={() => handleProjectClick(project)}>
                                <div className="project-card-img" style={{ 
                                    backgroundImage: project.imageUrl ? `url(${project.imageUrl})` : 'none',
                                    backgroundColor: project.imageUrl ? 'transparent' : getProjectColor(project._id)
                                }}></div>
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
