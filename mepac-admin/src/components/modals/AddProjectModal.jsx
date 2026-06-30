import React from 'react';

export default function AddProjectModal({ onClose }) {
    return (
        <div className="modal" id="add-project-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Add New Project</h3>
                <button className="icon-btn close-btn" onClick={onClose}>✖</button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" placeholder="e.g. Grand Tower MEP" />
                </div>
                <div className="form-group">
                    <label>Client</label>
                    <input type="text" placeholder="e.g. Aaryan Patel" />
                </div>
                <div className="form-group">
                    <label>Location</label>
                    <input type="text" placeholder="e.g. Mumbai, MH" />
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Create Project</button>
            </div>
        </div>
    );
}
