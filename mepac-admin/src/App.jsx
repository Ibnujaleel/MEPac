import React, { useState } from 'react';
import './index.css';

// Layout Components
import Sidebar from './components/layout/Sidebar';
import Topbar from './components/layout/Topbar';

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

const demoProjects = [
  {
    id: 'p1',
    name: 'Grand Tower MEP',
    client: 'Aaryan Patel',
    location: 'Mumbai, MH',
    imageUrl: '/images/project_1.png',
    description: 'High-rise commercial tower requiring extensive MEP integration and smart building systems.',
    progress: '14/18 (77%)',
    percent: 77,
    employeesPresent: 14,
    totalAssigned: 18,
    employees: [
      { initials: 'MA', name: 'Michael Adams', role: 'Technician' },
      { initials: 'SJ', name: 'Sarah Jenkins', role: 'Supervisor' },
      { initials: 'RJ', name: 'Robert Jones', role: 'Foreman' }
    ],
    checkIns: [
      { name: 'Michael Adams', initials: 'MA', time: '06:55 AM', type: 'Biometric', status: 'Verified' },
      { name: 'Sarah Jenkins', initials: 'SJ', time: '07:15 AM', type: 'Proxy', status: 'Pending Approval' },
      { name: 'Robert Jones', initials: 'RJ', time: '07:22 AM', type: 'Biometric', status: 'Verified' }
    ],
    blueprints: [
      { id: 'b1', name: 'Electrical Layout - Floor 1', file: 'electrical_f1.pdf' },
      { id: 'b2', name: 'Plumbing - Basement', file: 'plumbing_b1.dwg' }
    ]
  },
  {
    id: 'p2',
    name: 'Mall Extension',
    client: 'Rajesh Sharma',
    location: 'Delhi, NCR',
    imageUrl: '/images/project_2.png',
    description: 'Expansion of existing commercial footprint with high-capacity HVAC and plumbing upgrades.',
    progress: '9/12 (75%)',
    percent: 75,
    employeesPresent: 28,
    totalAssigned: 35,
    employees: [
      { initials: 'DR', name: 'David Rodriguez', role: 'Foreman' },
      { initials: 'AL', name: 'Alex Lee', role: 'Technician' },
      { initials: 'MG', name: 'Maria Garcia', role: 'Supervisor' }
    ],
    checkIns: [
      { name: 'David Rodriguez', initials: 'DR', time: '07:01 AM', type: 'Biometric', status: 'Verified' },
      { name: 'Alex Lee', initials: 'AL', time: '07:12 AM', type: 'Biometric', status: 'Verified' },
      { name: 'Maria Garcia', initials: 'MG', time: '07:45 AM', type: 'Proxy', status: 'Verified' }
    ],
    blueprints: [
      { id: 'b3', name: 'HVAC Main Grid', file: 'hvac_main.pdf' }
    ]
  },
  {
    id: 'p3',
    name: 'City Center Mall',
    client: 'Modern Builders Inc.',
    location: 'Bangalore, KA',
    imageUrl: '/images/project_3.png',
    description: 'Urban shopping center requiring specialized ventilation and electrical distribution.',
    progress: '5/10 (50%)',
    percent: 100,
    employeesPresent: 0,
    totalAssigned: 10,
    isCompleted: true,
    employees: [
      { initials: 'JB', name: 'James Brown', role: 'Technician' },
      { initials: 'LT', name: 'Lisa Taylor', role: 'Foreman' },
      { initials: 'KW', name: 'Kevin White', role: 'Supervisor' }
    ],
    blueprints: []
  },
  {
    id: 'p4',
    name: 'Sunrise Apartments',
    client: 'Sunrise Devs',
    location: 'Pune, MH',
    imageUrl: '/images/project_4.png',
    description: 'Premium residential complex with individualized MEP metering and centralized boiler systems.',
    progress: '19/22 (86%)',
    percent: 86,
    employeesPresent: 19,
    totalAssigned: 22,
    employees: [
      { initials: 'CP', name: 'Chris Parker', role: 'Supervisor' },
      { initials: 'EM', name: 'Emily Moore', role: 'Technician' },
      { initials: 'RN', name: 'Richard Nelson', role: 'Foreman' }
    ],
    blueprints: [
      { id: 'b4', name: 'Floor Plan - Type A', file: 'floorplan_A.pdf' }
    ]
  }
];

const demoNotifications = [
  { id: 1, title: 'New Proxy Request', time: '10 mins ago', desc: 'Sarah Jenkins submitted a proxy attendance request for Grand Tower MEP.', isRead: false },
  { id: 2, title: 'Attendance Dispute Filed', time: '1 hour ago', desc: 'Marcus Vance contested a supervisor override on Site 4B.', isRead: false },
  { id: 3, title: 'Silent Site Alert', time: '2 hours ago', desc: 'No check-ins recorded at Mall Extension this morning.', isRead: true }
];

export default function App() {
  const [activeView, setActiveView] = useState('view-dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(demoProjects);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [activeModal, setActiveModal] = useState(null); // 'add-project', 'add-worker', etc.
  const [activePanel, setActivePanel] = useState(null); // 'notifications', 'profile', or null

  const handleEndProject = (projectId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isCompleted: true } : p));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => ({ ...prev, isCompleted: true }));
    }
  };

  const handleReopenProject = (projectId) => {
    setProjects(prev => prev.map(p => p.id === projectId ? { ...p, isCompleted: false } : p));
    if (selectedProject?.id === projectId) {
      setSelectedProject(prev => ({ ...prev, isCompleted: false }));
    }
  };

  const openModal = (modalId) => setActiveModal(modalId);
  const closeModal = () => setActiveModal(null);

  const togglePanel = (panel, e) => {
    console.log('togglePanel called with:', panel);
    if (e) e.stopPropagation();
    setActivePanel(prev => prev === panel ? null : panel);
  };
  console.log('App render. activePanel is:', activePanel);
  const deleteNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

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
            console.log('Click catcher clicked!');
            setActivePanel(null);
          }}
        />
      )}
      <Sidebar activeView={activeView} setActiveView={setActiveView} />

      <main className="main-content">
        <Topbar activePanel={activePanel} togglePanel={togglePanel} notifications={notifications} />

        <div className="views-container">
          {activeView === 'view-dashboard' && <Dashboard setActiveView={setActiveView} projects={projects} />}
          {activeView === 'view-projects' && <ProjectsHub openModal={openModal} projects={projects} setActiveView={setActiveView} setSelectedProject={setSelectedProject} />}
          {activeView === 'view-project-details' && <ProjectDetail project={selectedProject} setActiveView={setActiveView} openModal={openModal} />}
          {activeView === 'view-workforce' && <Workforce openModal={openModal} />}
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
          {activeModal === 'new-rfi' && <NewRfiModal onClose={closeModal} projects={projects} workers={projects.flatMap(p => p.employees.map(e => ({ ...e, project: p.name })))} />}
          {activeModal === 'upload-revision' && <UploadRevisionModal onClose={closeModal} projects={projects} />}
          {activeModal === 'add-blueprint' && <AddBlueprintModal onClose={closeModal} projects={projects} />}
          {activeModal === 'end-project' && <EndProjectModal onClose={closeModal} onConfirm={handleEndProject} project={selectedProject} />}
          {activeModal === 'reopen-project' && <ReopenProjectModal onClose={closeModal} onConfirm={handleReopenProject} project={selectedProject} />}
        </div>
      )}
    </div>
  );
}
