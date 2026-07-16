import React from 'react';
import { FileText, Eye } from 'lucide-react';

export default function Drawings({ openModal, projects }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Drawings</h2>
                    <p className="subtitle">Latest MEP schematics and revisions.</p>
                </div>
                <button className="btn primary" onClick={() => openModal('upload-revision')}>Upload Revision</button>
            </div>
            
            <div className="drawings-grid" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {projects.map(project => (
                    <div className="panel" key={project.id}>
                        <div className="panel-header">
                            <h3>{project.name}</h3>
                        </div>
                        <div style={{ padding: '0 24px 24px' }}>
                            {project.blueprints && project.blueprints.length > 0 ? (
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {project.blueprints.map(bp => (
                                        <li key={bp.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center' }}><FileText size={24} /></div>
                                                <div>
                                                    <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{bp.name}</div>
                                                    <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{bp.file}</div>
                                                </div>
                                            </div>
                                            <button className="btn text-btn" style={{ padding: '8px' }} aria-label="View Blueprint">
                                                <Eye size={18} />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="subtitle" style={{ margin: 0 }}>No blueprints uploaded yet.</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
