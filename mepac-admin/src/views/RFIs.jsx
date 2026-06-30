import React from 'react';

export default function RFIs({ openModal }) {
    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Requests for Information (RFIs)</h2>
                    <p className="subtitle">Track and resolve project inquiries.</p>
                </div>
                <button className="btn primary" onClick={() => openModal('new-rfi')}>+ New RFI</button>
            </div>
            <div className="panel">
                <div className="panel-header">
                    <h3>Active RFIs</h3>
                </div>
                <p className="subtitle" style={{padding: '24px'}}>This view is under construction.</p>
            </div>
        </section>
    );
}
