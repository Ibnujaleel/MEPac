import React from 'react';

export default function Workforce({ openModal }) {
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
                <p className="subtitle" style={{padding: '24px'}}>This view is under construction.</p>
            </div>
        </section>
    );
}
