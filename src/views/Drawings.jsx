import React, { useState } from 'react';
import { 
    Search, Filter, Plus, FileText, Trash2, Eye, UploadCloud, Link as LinkIcon, AlertCircle, CheckCircle2, ChevronRight, X, Building2
} from 'lucide-react';

export default function Drawings({ projects, drawings, setDrawings }) {
    const [projectFilter, setProjectFilter] = useState('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [showUploadModal, setShowUploadModal] = useState(false);

    // Modal Form State
    const [uploadTab, setUploadTab] = useState('file'); // 'file' or 'link'
    const [selectedProject, setSelectedProject] = useState('');
    const [versionLabel, setVersionLabel] = useState('');
    const [notes, setNotes] = useState('');
    const [pastedLink, setPastedLink] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    // Action: Toggle Publish
    const handleTogglePublish = (id) => {
        setDrawings(prev => prev.map(d => 
            d.id === id ? { ...d, is_published: !d.is_published } : d
        ));
    };

    // Action: Delete Drawing
    const handleDelete = (id, fileName, isPublished) => {
        const confirmMsg = isPublished 
            ? `Are you sure you want to permanently delete "${fileName}"? This will remove it from the mobile view for field workers.`
            : `Are you sure you want to permanently delete "${fileName}"?`;
        
        if (window.confirm(confirmMsg)) {
            setDrawings(prev => prev.filter(d => d.id !== id));
        }
    };

    // Action: Upload Drawing Submission
    const handleUploadSubmit = (e) => {
        e.preventDefault();
        
        const fileName = uploadTab === 'file' && selectedFile 
            ? selectedFile.name 
            : pastedLink.split('/').pop() || 'Pasted Link Drawing.pdf';

        const fileUrl = uploadTab === 'file' ? '#' : pastedLink;

        const newDrawing = {
            id: 'd_' + Date.now(),
            project_id: selectedProject,
            file_name: fileName,
            file_url: fileUrl,
            version_label: versionLabel || 'Rev 1',
            uploaded_at: new Date().toISOString().split('T')[0],
            notes: notes,
            is_published: false // Default to false
        };

        setDrawings(prev => [newDrawing, ...prev]);
        resetForm();
    };

    const resetForm = () => {
        setShowUploadModal(false);
        setUploadTab('file');
        setSelectedProject('');
        setVersionLabel('');
        setNotes('');
        setPastedLink('');
        setSelectedFile(null);
    };

    // Filtering & Sorting
    const filteredDrawings = drawings.filter(d => {
        const matchesProject = projectFilter === 'All' || d.project_id === projectFilter;
        const matchesSearch = d.file_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              (d.version_label && d.version_label.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesProject && matchesSearch;
    });

    // Helper: Sort drawings (Published first, then Upload Date descending)
    const sortDrawings = (list) => {
        return [...list].sort((a, b) => {
            if (a.is_published && !b.is_published) return -1;
            if (!a.is_published && b.is_published) return 1;
            return new Date(b.uploaded_at) - new Date(a.uploaded_at);
        });
    };

    // Render group helper
    const renderDrawingGrid = (projectDrawings, emptyText = "No drawings yet. Upload your first drawing.") => {
        if (projectDrawings.length === 0) {
            return (
                <div style={{ padding: '32px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px dashed var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                    <AlertCircle size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 12px', display: 'block' }} />
                    <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>{emptyText}</p>
                </div>
            );
        }

        const sorted = sortDrawings(projectDrawings);

        return (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                {sorted.map(drawing => {
                    const project = projects.find(p => p.id === drawing.project_id);
                    return (
                        <div 
                            key={drawing.id} 
                            style={{ 
                                backgroundColor: 'var(--bg-surface)',
                                borderRadius: 'var(--radius-lg)',
                                padding: '16px',
                                boxShadow: 'var(--shadow-md)',
                                borderLeft: drawing.is_published ? '4px solid var(--accent-green)' : '4px solid var(--text-muted)',
                                borderTop: '1px solid var(--border-subtle)',
                                borderRight: '1px solid var(--border-subtle)',
                                borderBottom: '1px solid var(--border-subtle)',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '12px',
                                transition: 'var(--transition-fast)'
                            }}
                        >
                            {/* Card Header: Icon & Version Tag */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div style={{ 
                                    padding: '8px', 
                                    backgroundColor: drawing.is_published ? 'var(--status-on-track-bg)' : 'var(--bg-surface-hover)', 
                                    color: drawing.is_published ? 'var(--status-on-track-text)' : 'var(--text-secondary)',
                                    borderRadius: 'var(--radius-md)'
                                }}>
                                    <FileText size={24} />
                                </div>
                                <span className={`status-pill ${drawing.is_published ? 'solid-green' : 'solid-grey'}`} style={{ fontSize: '11px' }}>
                                    {drawing.is_published ? 'Published' : 'Unpublished'}
                                </span>
                            </div>

                            {/* File Info */}
                            <div>
                                <h4 style={{ margin: '0 0 4px 0', fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={drawing.file_name}>
                                    {drawing.file_name}
                                </h4>
                                {projectFilter === 'All' && project && (
                                    <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                                        Project: {project.name}
                                    </p>
                                )}
                                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                    <span style={{ fontSize: '11px', backgroundColor: 'var(--bg-surface-hover)', padding: '2px 8px', borderRadius: 'var(--radius-pill)', fontWeight: '600' }}>
                                        {drawing.version_label}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                                        Uploaded: {drawing.uploaded_at}
                                    </span>
                                </div>
                                {drawing.notes && (
                                    <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {drawing.notes}
                                    </p>
                                )}
                            </div>

                            {/* Publish Switch and Action Buttons */}
                            <div style={{ marginTop: 'auto', paddingTop: '12px', borderTop: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {/* Switch Toggle */}
                                    <label style={{ position: 'relative', display: 'inline-block', width: '36px', height: '20px' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={drawing.is_published}
                                            onChange={() => handleTogglePublish(drawing.id)}
                                            style={{ opacity: 0, width: 0, height: 0 }} 
                                        />
                                        <span style={{
                                            position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                            backgroundColor: drawing.is_published ? 'var(--accent-green)' : '#cbd5e1',
                                            transition: '.3s', borderRadius: '20px'
                                        }}>
                                            <span style={{
                                                position: 'absolute', content: '""', height: '14px', width: '14px', left: drawing.is_published ? '18px' : '4px', bottom: '3px',
                                                backgroundColor: 'white', transition: '.3s', borderRadius: '50%'
                                            }} />
                                        </span>
                                    </label>
                                    <span style={{ fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' }}>Publish</span>
                                </div>

                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <a href={drawing.file_url} target="_blank" rel="noreferrer" className="btn secondary" style={{ padding: '6px', minWidth: 'auto', border: '1px solid var(--border-subtle)' }} title="View Drawing">
                                        <Eye size={14} style={{ color: 'var(--text-secondary)' }} />
                                    </a>
                                    <button 
                                        onClick={() => handleDelete(drawing.id, drawing.file_name, drawing.is_published)}
                                        className="btn secondary" 
                                        style={{ padding: '6px', minWidth: 'auto', border: '1px solid var(--border-subtle)' }} 
                                        title="Delete Drawing"
                                    >
                                        <Trash2 size={14} style={{ color: 'var(--accent-red)' }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    };

    // Form validation check
    const isUploadDisabled = !selectedProject || (uploadTab === 'file' ? !selectedFile : !pastedLink);

    return (
        <section className="view active" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            
            {/* View Header */}
            <div className="view-header" style={{ marginBottom: '20px', flexShrink: 0 }}>
                <div>
                    <h2>Drawings</h2>
                    <p className="subtitle">Publish and manage electrical layout blueprints for site technicians.</p>
                </div>
                <button className="btn primary" onClick={() => setShowUploadModal(true)}>
                    <Plus size={16} /> Upload Drawing
                </button>
            </div>

            {/* Filter controls */}
            <div className="panel" style={{ padding: '16px 24px', display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '20px', flexShrink: 0 }}>
                {/* Search */}
                <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
                    <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                    <input 
                        type="text" 
                        placeholder="Search drawings by name or version..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px 12px 8px 36px',
                            borderRadius: 'var(--radius-md)',
                            border: '1px solid var(--border-subtle)',
                            backgroundColor: 'var(--bg-base)',
                            fontSize: '14px',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Project Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-base)', fontSize: '14px' }}>
                    <Filter size={14} style={{ color: 'var(--text-secondary)' }} />
                    <select 
                        value={projectFilter} 
                        onChange={e => setProjectFilter(e.target.value)}
                        style={{ border: 'none', background: 'none', fontSize: '14px', outline: 'none', cursor: 'pointer', fontWeight: '500', paddingRight: '12px' }}
                    >
                        <option value="All">All Projects</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Drawing List Area */}
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
                {searchQuery && filteredDrawings.length === 0 ? (
                    <div style={{ padding: '64px', textAlign: 'center', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-lg)' }}>
                        <AlertCircle size={40} style={{ color: 'var(--accent-red)', margin: '0 auto 12px', display: 'block' }} />
                        <h4 style={{ margin: '0 0 4px 0', fontSize: '16px', color: 'var(--text-primary)' }}>No drawings found</h4>
                        <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '14px' }}>No drawings match your search query: "{searchQuery}"</p>
                    </div>
                ) : projectFilter === 'All' ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {projects.map(project => {
                            const projectDrawings = filteredDrawings.filter(d => d.project_id === project.id);
                            return (
                                <div key={project.id} className="panel" style={{ padding: '20px' }}>
                                    <div style={{ borderBottom: '1px solid var(--border-subtle)', paddingBottom: '12px', marginBottom: '16px' }}>
                                        <h3 style={{ margin: 0, fontSize: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Building2 size={18} style={{ color: 'var(--accent-blue)' }} />
                                            {project.name}
                                        </h3>
                                    </div>
                                    {renderDrawingGrid(projectDrawings, "No drawings yet. Upload a drawing to get started.")}
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    renderDrawingGrid(filteredDrawings)
                )}
            </div>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay active" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 3000 }}>
                    <div className="panel" style={{ width: '100%', maxWidth: '500px', padding: '0', display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', overflow: 'hidden' }}>
                        {/* Modal Header */}
                        <div style={{ padding: '16px 24px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface-hover)' }}>
                            <h3 style={{ margin: 0, fontSize: '16px', color: 'var(--text-primary)' }}>Upload New Drawing</h3>
                            <button onClick={resetForm} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}><X size={18} /></button>
                        </div>

                        {/* Modal Tabs */}
                        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
                            <button 
                                type="button"
                                onClick={() => setUploadTab('file')}
                                style={{
                                    flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600',
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    color: uploadTab === 'file' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                    borderBottom: uploadTab === 'file' ? '2px solid var(--accent-blue)' : '2px solid transparent'
                                }}
                            >
                                Upload File
                            </button>
                            <button 
                                type="button"
                                onClick={() => setUploadTab('link')}
                                style={{
                                    flex: 1, padding: '12px', textAlign: 'center', fontSize: '14px', fontWeight: '600',
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    color: uploadTab === 'link' ? 'var(--accent-blue)' : 'var(--text-secondary)',
                                    borderBottom: uploadTab === 'link' ? '2px solid var(--accent-blue)' : '2px solid transparent'
                                }}
                            >
                                Paste Link
                            </button>
                        </div>

                        {/* Modal Body */}
                        <form onSubmit={handleUploadSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {uploadTab === 'file' ? (
                                <div 
                                    style={{
                                        border: '2px dashed var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '32px 16px',
                                        textAlign: 'center', backgroundColor: 'var(--bg-base)', cursor: 'pointer'
                                    }}
                                    onClick={() => document.getElementById('drawing-file-picker').click()}
                                >
                                    <input 
                                        type="file" 
                                        id="drawing-file-picker" 
                                        accept=".pdf"
                                        style={{ display: 'none' }}
                                        onChange={e => setSelectedFile(e.target.files[0] || null)}
                                    />
                                    <UploadCloud size={32} style={{ color: 'var(--text-muted)', margin: '0 auto 8px', display: 'block' }} />
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary)', display: 'block' }}>
                                        {selectedFile ? selectedFile.name : 'Drag & drop a file here or browse'}
                                    </span>
                                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginTop: '4px' }}>
                                        PDF only, max 25 MB
                                    </span>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                    <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>PASTE PDF URL</label>
                                    <div style={{ position: 'relative' }}>
                                        <LinkIcon size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
                                        <input 
                                            type="url" 
                                            placeholder="https://example.com/drawing.pdf"
                                            value={pastedLink}
                                            onChange={e => setPastedLink(e.target.value)}
                                            style={{
                                                width: '100%', padding: '10px 12px 10px 36px', border: '1px solid var(--border-subtle)',
                                                borderRadius: 'var(--radius-md)', backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Project Selector */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>PROJECT *</label>
                                <select 
                                    value={selectedProject} 
                                    onChange={e => setSelectedProject(e.target.value)}
                                    required
                                    style={{
                                        padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                    }}
                                >
                                    <option value="">Select Project</option>
                                    {projects.map(p => (
                                        <option key={p.id} value={p.id}>{p.name}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Version Label */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>VERSION LABEL (OPTIONAL)</label>
                                <input 
                                    type="text" 
                                    placeholder="e.g. Rev 4"
                                    value={versionLabel}
                                    onChange={e => setVersionLabel(e.target.value)}
                                    style={{
                                        padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Notes */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <label style={{ fontSize: '12px', fontWeight: '600', color: 'var(--text-secondary)' }}>NOTES (OPTIONAL)</label>
                                <textarea 
                                    placeholder="Add any remarks or descriptions..."
                                    value={notes}
                                    onChange={e => setNotes(e.target.value)}
                                    rows={3}
                                    style={{
                                        padding: '10px 12px', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)',
                                        backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)', fontSize: '14px', outline: 'none'
                                    }}
                                />
                            </div>

                            {/* Footer Buttons */}
                            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '8px' }}>
                                <button type="button" onClick={resetForm} className="btn" style={{ border: '1px solid var(--border-subtle)', backgroundColor: 'var(--bg-surface)' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={isUploadDisabled} className="btn primary" style={{ opacity: isUploadDisabled ? 0.6 : 1, cursor: isUploadDisabled ? 'not-allowed' : 'pointer' }}>
                                    Upload
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </section>
    );
}
