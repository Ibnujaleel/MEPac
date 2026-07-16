import React from 'react';
import { X } from 'lucide-react';

export default function AddBlueprintModal({ onClose, projects = [] }) {
    return (
        <div className="modal" id="add-blueprint-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Add Blueprint to Project</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="modal-body">

                <div className="form-group">
                    <label>Upload Blueprint (PDF/DWG)</label>
                    <input type="file" accept=".pdf,.dwg" />
                </div>
                <div className="form-group">
                    <label>Blueprint Name / Section</label>
                    <input type="text" placeholder="e.g. Electrical Layout - Floor 2" />
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Upload Blueprint</button>
            </div>
        </div>
    );
}
