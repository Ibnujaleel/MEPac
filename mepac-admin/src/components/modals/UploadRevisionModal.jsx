import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";

export default function UploadRevisionModal({ onClose, projects = [] }) {
    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [selectedBlueprintId, setSelectedBlueprintId] = useState('');
    const [revisionFile, setRevisionFile] = useState(null);
    const [revisionNote, setRevisionNote] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const uploadRevision = useMutation(api.blueprints.uploadRevision);
    const generateUploadUrl = useMutation(api.blueprints.generateUploadUrl);

    const handleSubmit = async () => {
        if (!revisionFile) return;
        setIsSubmitting(true);

        try {
            // Upload file to Convex storage
            const uploadUrl = await generateUploadUrl();
            const result = await fetch(uploadUrl, {
                method: "POST",
                headers: { "Content-Type": revisionFile.type },
                body: revisionFile,
            });
            const { storageId } = await result.json();

            // If a specific blueprint is selected, upload revision to it
            // Otherwise, just use the first project's blueprint (fallback)
            if (selectedBlueprintId) {
                await uploadRevision({
                    blueprintId: selectedBlueprintId,
                    fileStorageId: storageId,
                });
            }

            onClose();
        } catch (error) {
            console.error("Failed to upload revision:", error);
            alert("Failed to upload revision. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const activeProjects = projects.filter(p => !p.isCompleted);

    return (
        <div className="modal" id="upload-revision-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
                <h3>Upload Drawing Revision</h3>
                <button className="icon-btn close-btn" onClick={onClose}><X size={18} /></button>
            </div>
            <div className="modal-body">
                <div className="form-group">
                    <label>Target Project</label>
                    <select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                        <option value="">Select a project...</option>
                        {activeProjects.map(p => (
                            <option key={p._id} value={p._id}>{p.name}</option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>File (PDF/DWG)</label>
                    <input type="file" accept=".pdf,.dwg" onChange={(e) => setRevisionFile(e.target.files[0] || null)} />
                </div>
                <div className="form-group">
                    <label>Revision Note</label>
                    <textarea
                        placeholder="What changed in this revision?"
                        maxLength={300}
                        value={revisionNote}
                        onChange={(e) => setRevisionNote(e.target.value)}
                    ></textarea>
                </div>
            </div>
            <div className="modal-footer">
                <button className="btn secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
                <button
                    className="btn primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !revisionFile}
                >
                    {isSubmitting ? 'Uploading...' : 'Upload'}
                </button>
            </div>
        </div>
    );
}
