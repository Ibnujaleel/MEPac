import React from 'react';

export default function UploadRevisionModal({ onClose, projects = [] }) {
    return (
        <div className="modal" id="upload-revision-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Upload Drawing Revision</h3>
                <button className="icon-btn close-btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Target Project</label>
                    <select>
                        <option value="">Select a project...</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>File (PDF/DWG)</label>
                    <input type="file" />
                </div>
                <div className="form-group">
                    <label>Revision Note</label>
                    <textarea placeholder="What changed in this revision?"></textarea>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Upload</button>
            </div>
        </div>
    );
}
