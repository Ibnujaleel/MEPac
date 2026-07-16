import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function AddWorkerModal({ onClose }) {
    const [pin, setPin] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobile, setMobile] = useState('');

    const handlePinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 6) {
            setPin(value);
        }
    };

    const handleNameChange = (e) => {
        // Remove digits and special characters (letters and spaces only)
        setFullName(e.target.value.replace(/[^a-zA-Z\s]/g, ''));
    };

    const handleMobileChange = (e) => {
        // Remove non-digits
        const val = e.target.value.replace(/\D/g, '');
        if (val.length <= 10) {
            setMobile(val);
        }
    };

    return (
        <div className="modal" id="add-worker-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Add Worker</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Full Name</label>
                    <input type="text" value={fullName} onChange={handleNameChange} maxLength={50} />
                </div>
                <div className="form-group">
                    <label>Role</label>
                    <select>
                        <option value="">Select a role...</option>
                        <option>Supervisor</option>
                        <option>Foreman</option>
                        <option>Technician</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Mobile Number</label>
                    <input type="tel" value={mobile} onChange={handleMobileChange} />
                </div>
                <div className="form-group">
                    <label>Set PIN <span style={{ fontWeight: 400, opacity: 0.6 }}>(6-digit login PIN)</span></label>
                    <input
                        type="password"
                        inputMode="numeric"
                        maxLength={6}
                        value={pin}
                        onChange={handlePinChange}
                        placeholder="XXXXXX"
                        style={{ letterSpacing: pin ? '0.35em' : 'normal' }}
                    />
                    <span style={{ fontSize: '0.75rem', opacity: 0.5, marginTop: '0.25rem', display: 'block' }}>
                        {pin.length}/6 digits
                    </span>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose}>Cancel</button>
                <button className="btn primary">Add Worker</button>
            </div>
        </div>
    );
}
