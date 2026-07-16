import React from 'react';
import { X } from 'lucide-react';

export default function NewRfiModal({ onClose, projects = [], workers = [] }) {
    const eligibleWorkers = workers.filter(w => w.role === 'Supervisor' || w.role === 'Foreman');

    return (
        <div className="modal" id="new-rfi-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>New Request for Information</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Related Project</label>
                    <select defaultValue="">
                        <option value="" disabled>Select a project...</option>
                        <option value="none">Not Specific to Project</option>
                        {projects.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Directed To</label>
                    <select defaultValue="">
                        <option value="" disabled>Select a worker...</option>
                        {eligibleWorkers.map((w, i) => (
                            <option key={`${w.initials}-${i}`} value={w.name}>
                                {w.name} — {w.role}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>Subject</label>
                    <input type="text" placeholder="Brief subject of inquiry" maxLength={100} />
                </div>
                <div className="form-group">
                    <label>Details</label>
                    <textarea placeholder="Provide detailed information..." maxLength={300} rows={4}></textarea>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Submit RFI</button>
            </div>
        </div>
    );
}
