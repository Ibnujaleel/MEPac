import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

// Convex Imports
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

// Layout Components
import Sidebar from './components/Layout/Sidebar';
import Topbar from './components/Layout/Topbar';

// View Components
import Dashboard from './views/Dashboard';
import ProjectsHub from './views/ProjectsHub';
import AttendanceLog from './views/AttendanceLog';
import Workforce from './views/Workforce';
import RFIs from './views/RFIs';
import Drawings from './views/Drawings';
import Settings from './views/Settings';
import ProjectDetail from './views/ProjectDetail';

// Modals and Overlays
import NotificationsPanel from './components/notifications/NotificationsPanel';
import AddProjectModal from './components/modals/AddProjectModal';
import AddWorkerModal from './components/modals/AddWorkerModal';
import NewRfiModal from './components/modals/NewRfiModal';
import UploadRevisionModal from './components/modals/UploadRevisionModal';
import AddBlueprintModal from './components/modals/AddBlueprintModal';
import EndProjectModal from './components/modals/EndProjectModal';
import ReopenProjectModal from './components/modals/ReopenProjectModal';
import EditProjectModal from './components/modals/EditProjectModal';

// Valid view IDs for hash routing
const VALID_VIEWS = [
  'view-dashboard', 'view-projects', 'view-project-details',
  'view-workforce', 'view-attendance', 'view-rfis',
  'view-drawings', 'view-settings'
];

function getInitialState() {
  const hash = window.location.hash.slice(1); // remove #
  if (!hash) return { view: 'view-dashboard', projectId: null };

  const params = new URLSearchParams(hash);
  const view = params.get('view') || 'view-dashboard';
  const projectId = params.get('project') || null;

  if (!VALID_VIEWS.includes(view)) return { view: 'view-dashboard', projectId: null };
  return { view, projectId };
}

export default function App() {
  const initial = getInitialState();
  const [activeView, setActiveViewRaw] = useState(initial.view);
  const [selectedProjectId, setSelectedProjectId] = useState(initial.projectId);
  const [activeModal, setActiveModal] = useState(null);
  const [activePanel, setActivePanel] = useState(null);

  // Sync view to URL hash
  const setActiveView = useCallback((view) => {
    setActiveViewRaw(view);
    // Clear project when navigating away from project details
    if (view !== 'view-project-details') {
      updateHash(view, null);
    }
  }, []);

  const updateHash = (view, projectId) => {
    const params = new URLSearchParams();
    params.set('view', view);
    if (projectId) params.set('project', projectId);
    window.location.hash = params.toString();
  };

  // Update hash when project detail is entered
  useEffect(() => {
    updateHash(activeView, activeView === 'view-project-details' ? selectedProjectId : null);
  }, [activeView, selectedProjectId]);

  // Listen for browser back/forward
  useEffect(() => {
    const handleHashChange = () => {
      const state = getInitialState();
      setActiveViewRaw(state.view);
      if (state.projectId) setSelectedProjectId(state.projectId);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Convex Queries
  const projects = useQuery(api.projects.list) || [];
  const workforce = useQuery(api.workers.list) || [];
  const notifications = useQuery(api.notifications.list) || [];

  // Convex Mutations
  const toggleComplete = useMutation(api.projects.toggleComplete);
  const assignWorker = useMutation(api.assignments.assign);
  const removeWorker = useMutation(api.assignments.remove);
  const removeNotification = useMutation(api.notifications.remove);

  // Find the selected project from the list
  const selectedProject = projects.find(p => p._id === selectedProjectId) || null;

  const handleEndProject = (projectId) => {
    toggleComplete({ projectId });
  };

  const handleReopenProject = (projectId) => {
    toggleComplete({ projectId });
  };

  const openModal = (modalId) => setActiveModal(modalId);
  const closeModal = () => setActiveModal(null);

  const togglePanel = (panel, e) => {
    if (e) e.stopPropagation();
    setActivePanel(prev => prev === panel ? null : panel);
  };

  const deleteNotification = (id) => {
    removeNotification({ notificationId: id });
  };

  const handleAddWorkerToProject = (projectId, worker) => {
    assignWorker({ projectId, workerId: worker._id });
  };

  const handleRemoveWorkerFromProject = (projectId, workerId) => {
    removeWorker({ projectId, workerId });
  };

  return (
    <div className="app-layout">
      {activePanel && (
        <div
          className="transparent-click-catcher"
          style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: activePanel === 'notifications' ? 2000 : 998,
            backgroundColor: activePanel === 'notifications' ? 'rgba(15, 23, 42, 0.5)' : 'transparent',
            backdropFilter: activePanel === 'notifications' ? 'blur(2px)' : 'none'
          }}
          onClick={() => {
            setActivePanel(null);
          }}
        />
      )}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="main-content">
        <Topbar activeView={activeView} selectedProject={selectedProject} activePanel={activePanel} togglePanel={togglePanel} notifications={notifications} />

        <div className="views-container">
          {activeView === 'view-dashboard' && <Dashboard setActiveView={setActiveView} projects={projects} workforce={workforce} />}
          {activeView === 'view-projects' && <ProjectsHub openModal={openModal} projects={projects} setActiveView={setActiveView} setSelectedProject={(project) => setSelectedProjectId(project ? project._id : null)} />}
          {activeView === 'view-project-details' && <ProjectDetail projectId={selectedProjectId} project={selectedProject} workforce={workforce} setActiveView={setActiveView} openModal={openModal} onAssignWorker={handleAddWorkerToProject} onRemoveWorker={handleRemoveWorkerFromProject} />}
          {activeView === 'view-workforce' && <Workforce openModal={openModal} workforce={workforce} />}
          {activeView === 'view-attendance' && <AttendanceLog setActiveView={setActiveView} projects={projects} />}
          {activeView === 'view-rfis' && <RFIs openModal={openModal} />}
          {activeView === 'view-drawings' && <Drawings openModal={openModal} projects={projects} />}
          {activeView === 'view-settings' && <Settings />}
        </div>
      </main>

      {/* Overlays */}
      <NotificationsPanel
        isOpen={activePanel === 'notifications'}
        onClose={() => setActivePanel(null)}
        notifications={notifications}
        deleteNotification={deleteNotification}
      />

      {activeModal && (
        <div className="modal-overlay active">
          {activeModal === 'add-project' && <AddProjectModal onClose={closeModal} />}
          {activeModal === 'add-worker' && <AddWorkerModal onClose={closeModal} projects={projects} />}
          {activeModal === 'new-rfi' && <NewRfiModal onClose={closeModal} projects={projects} workers={workforce} />}
          {activeModal === 'upload-revision' && <UploadRevisionModal onClose={closeModal} projects={projects} />}
          {activeModal === 'add-blueprint' && <AddBlueprintModal onClose={closeModal} projects={projects} projectId={selectedProjectId} />}
          {activeModal === 'edit-project' && <EditProjectModal onClose={closeModal} project={selectedProject} />}
          {activeModal === 'end-project' && <EndProjectModal onClose={closeModal} onConfirm={handleEndProject} project={selectedProject} />}
          {activeModal === 'reopen-project' && <ReopenProjectModal onClose={closeModal} onConfirm={handleReopenProject} project={selectedProject} />}
        </div>
      )}
    </div>
  );
}
