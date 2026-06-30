import React from 'react';

export default function AddWorkerModal({ onClose, projects = [] }) {
    return (
        <div className="modal" id="add-worker-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Add Worker</h3>
                <button className="icon-btn close-btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" placeholder="e.g. Michael Adams" />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select>
                        <option>Electrician</option>
                        <option>Plumber</option>
                        <option>HVAC Tech</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Assign to Project</label>
                    <select>
                        <option value="">Select a project...</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Add Worker</button>
            </div>
        </div>
    );
}
