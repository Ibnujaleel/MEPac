import React, { useState } from 'react';

export default function AttendanceLog() {
    const [isDisputePanelOpen, setIsDisputePanelOpen] = useState(false);

    return (
        <section className="view active">
            <div className="view-header">
                <div>
                    <h2>Global Attendance Log</h2>
                    <p className="subtitle">Unified Reconciliation Dashboard</p>
                </div>
                <div className="header-actions">
                    <div className="toggle-container">
                        <span className="toggle-label">Exceptions Only</span>
                        <label className="switch">
                            <input type="checkbox" defaultChecked />
                            <span className="slider round"></span>
                        </label>
                    </div>
                    <div className="v-divider"></div>
                    <button className="btn primary">Export 📥</button>
                </div>
            </div>

            <div className="metrics-row attendance-metrics">
                <div className="metric-card">
                    <div className="metric-header">TOTAL CHECK-INS</div>
                    <div className="metric-value">42</div>
                    <div className="metric-desc highlight-green">+12% vs yesterday</div>
                </div>
                <div className="metric-card alert-amber highlight-card active" onClick={() => setIsDisputePanelOpen(!isDisputePanelOpen)}>
                    <div className="metric-header">PENDING DISPUTES</div>
                    <div className="metric-value">3</div>
                    <div className="metric-desc highlight-amber">Requires admin review</div>
                </div>
                <div className="metric-card alert-amber">
                    <div className="metric-header">PROXY REQUESTS</div>
                    <div className="metric-value">5</div>
                    <div className="metric-desc highlight-amber">Awaiting confirmation</div>
                </div>
                <div className="metric-card alert-red">
                    <div className="metric-header">SILENT SITES</div>
                    <div className="metric-value">1</div>
                    <div className="metric-desc highlight-red">No check-ins logged today</div>
                </div>
            </div>

            <div className="attendance-grid">
                <div className="attendance-main panel">
                    <div className="panel-header">
                        <h3>Worker Attendance</h3>
                        <div className="header-actions">
                            <button className="icon-btn">🔍</button>
                            <button className="icon-btn">⚙️</button>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Worker ID</th>
                                <th>Name</th>
                                <th>Project Site</th>
                                <th>Time In</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="dimmed">
                                <td>W-1042</td>
                                <td>James Wilson</td>
                                <td>Downtown Tower A</td>
                                <td>06:55 AM</td>
                                <td><span className="status-pill solid-grey">Standard</span></td>
                            </tr>
                            <tr className={`row-amber ${isDisputePanelOpen ? 'selected' : ''}`} onClick={() => setIsDisputePanelOpen(true)}>
                                <td>W-2198</td>
                                <td>Marcus Vance</td>
                                <td>Site 4B - Electrical</td>
                                <td>09:15 AM <span className="text-sm">(Adjusted)</span></td>
                                <td><span className="status-pill solid-disputed">Disputed ⚠️</span></td>
                            </tr>
                            <tr className="row-amber">
                                <td>W-1883</td>
                                <td>Sarah Chen</td>
                                <td>Hospital Wing C</td>
                                <td>07:05 AM</td>
                                <td><span className="status-pill outline-amber">Proxy Req</span></td>
                            </tr>
                            <tr className="dimmed">
                                <td>W-0921</td>
                                <td>David Ross</td>
                                <td>Downtown Tower A</td>
                                <td>06:58 AM</td>
                                <td><span className="status-pill solid-grey">Standard</span></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                {/* Dispute Panel */}
                {isDisputePanelOpen && (
                    <div className="dispute-panel panel">
                        <div className="panel-header alert-amber-header">
                            <div>
                                <div className="badge-text">ACTION REQUIRED</div>
                                <h3>Attendance Dispute</h3>
                            </div>
                            <button className="icon-btn close-btn" onClick={() => setIsDisputePanelOpen(false)}>✖</button>
                        </div>
                        <div className="worker-profile">
                            <div className="avatar-large amber">M</div>
                            <div>
                                <div className="worker-name">Marcus Vance</div>
                                <div className="worker-role">W-2198 • Electrician Level 2</div>
                            </div>
                        </div>
                        
                        <div className="audit-trail">
                            <div className="timeline-line"></div>
                            
                            <div className="audit-item">
                                <div className="audit-dot blue"></div>
                                <div className="audit-time">06:45 AM</div>
                                <div className="audit-title">SYSTEM AUTO-LOG</div>
                                <div className="audit-content blue-box">
                                    Turnstile entry recorded at Site 4B Main Gate. Status: On Time.
                                </div>
                            </div>

                            <div className="audit-item">
                                <div className="audit-dot grey"></div>
                                <div className="audit-time">09:10 AM</div>
                                <div className="audit-title">SUPERVISOR OVERRIDE</div>
                                <div className="audit-content">
                                    <div className="text-bold">Time adjusted to 09:15 AM.</div>
                                    <div className="quote">
                                        "Worker was present at gate but did not report to specific sub-site zone until 9:15am due to off-site material run." - R. Gomez (Sup)
                                    </div>
                                </div>
                            </div>

                            <div className="audit-item">
                                <div className="audit-dot amber"></div>
                                <div className="audit-time">10:30 AM</div>
                                <div className="audit-title">WORKER DISPUTE FILED</div>
                                <div className="audit-content amber-box">
                                    <div className="text-bold">Worker contested supervisor override.</div>
                                    <div className="quote">
                                        "I was instructed by procurement to pick up conduit before heading to zone. I have the delivery manifest stamped at 7:15am."
                                    </div>
                                    <div className="attachment-pill">📄 manifest_scan.pdf</div>
                                </div>
                            </div>
                        </div>

                        <div className="resolution-actions">
                            <h4>RESOLUTION NOTES (INTERNAL AUDIT)</h4>
                            <textarea placeholder="Enter justification for final ruling..."></textarea>
                            <div className="action-buttons">
                                <button className="btn secondary reject-btn">✖ Reject Claim</button>
                                <button className="btn primary approve-btn">✓ Approve Claim</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}
