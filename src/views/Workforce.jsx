import React, { useState } from 'react';
import WorkerProfile from './WorkerProfile';

export default function Workforce({ openModal }) {
    const [viewingProfile, setViewingProfile] = useState(false);

    if (viewingProfile) {
        return <WorkerProfile onBack={() => setViewingProfile(false)} />;
    }

    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Workforce</h2>
                    <p className="subtitle">Manage all active personnel and sub-contractors.</p>
                </div>
                <button className="btn primary" onClick={() => openModal('add-worker')}>+ Add Worker</button>
            </div>
            <div className="panel">
                <div className="panel-header">
                    <h3>Personnel Directory</h3>
                </div>
                <div style={{ padding: '24px' }}>
                    <p className="subtitle mb-4">This directory view is under construction.</p>
                    <button 
                        className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-container transition-colors"
                        onClick={() => setViewingProfile(true)}
                        style={{ cursor: 'pointer', backgroundColor: 'var(--accent-blue)', color: 'white', border: 'none' }}
                    >
                        View Sample Worker Profile (James Peterson)
                    </button>
                </div>
            </div>
        </section>
    );
}
