import React, { useState } from 'react';
import { X, Map } from 'lucide-react';

export default function AddProjectModal({ onClose }) {
    const [projectName, setProjectName] = useState('');
    const [client, setClient] = useState('');
    const [location, setLocation] = useState('');

    const handleProjectNameChange = (e) => {
        // Alphanumeric, -, _, and spaces
        setProjectName(e.target.value.replace(/[^a-zA-Z0-9-_\s]/g, ''));
    };

    const handleClientChange = (e) => {
        // Alphabetical and spaces only
        setClient(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
    };

    return (
        <div className="modal" id="add-project-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Add New Project</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
                <div className="form-group">
                    <label>Project Name</label>
                    <input type="text" value={projectName} onChange={handleProjectNameChange} maxLength={50} />
                </div>
                <div className="form-group">
                    <label>Client</label>
                    <input type="text" value={client} onChange={handleClientChange} maxLength={50} />
                </div>
                <div className="form-group">
                    <label>Preview Image (JPG/PNG)</label>
                    <input type="file" accept=".jpg,.jpeg,.png" />
                </div>
                <div className="form-group">
                    <label>Location (Coordinates)</label>
                    <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. 19.0760, 72.8777" />
                </div>
                
                <div className="form-group map-preview-placeholder">
                    <label>Map Preview</label>
                    <div style={{
                        width: '100%', height: '150px', backgroundColor: '#e2e8f0', borderRadius: '8px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        color: '#64748b', fontSize: '0.85rem', textAlign: 'center', padding: '10px',
                        border: '1px dashed #cbd5e1'
                    }}>
                        <span style={{ marginBottom: '8px' }}><Map size={24} /></span>
                        To implement an interactive map to pick coordinates, install <b>react-leaflet</b> and <b>leaflet</b>.<br/>
                        No backend or API key is strictly required (OpenStreetMap is free).<br/>
                        <i>You can extract lat/lng from the map's onClick event and autofill the Location field.</i>
                    </div>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Create Project</button>
            </div>
        </div>
    );
}
