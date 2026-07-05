import React, { useState, useEffect } from 'react';
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
import Alerts from './views/Alerts';

// Modals and Overlays
import NotificationsPanel from './components/notifications/NotificationsPanel';
import AddProjectModal from './components/modals/AddProjectModal';
import AddWorkerModal from './components/modals/AddWorkerModal';
import NewRfiModal from './components/modals/NewRfiModal';
import UploadRevisionModal from './components/modals/UploadRevisionModal';
import AddBlueprintModal from './components/modals/AddBlueprintModal';

const demoProjects = [
  {
    id: 'p1',
    name: 'Grand Tower MEP',
    client: 'Aaryan Patel',
    location: 'Mumbai, MH',
    status: 'Active',
    progress: '14/18 (77%)',
    percent: 77,
    employeesPresent: 14,
    employees: [
      { initials: 'MA', name: 'Michael Adams', role: 'Electrician' },
      { initials: 'SJ', name: 'Sarah Jenkins', role: 'Plumber' },
      { initials: 'RJ', name: 'Robert Jones', role: 'Foreman' }
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
    status: 'Active',
    progress: '9/12 (75%)',
    percent: 75,
    employeesPresent: 28,
    employees: [
      { initials: 'DR', name: 'David Rodriguez', role: 'HVAC Tech' },
      { initials: 'AL', name: 'Alex Lee', role: 'Welder' },
      { initials: 'MG', name: 'Maria Garcia', role: 'Electrician' }
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
    status: 'Delayed',
    progress: '5/10 (50%)',
    percent: 50,
    employeesPresent: 5,
    employees: [
      { initials: 'JB', name: 'James Brown', role: 'Plumber' },
      { initials: 'LT', name: 'Lisa Taylor', role: 'Foreman' },
      { initials: 'KW', name: 'Kevin White', role: 'Electrician' }
    ],
    blueprints: []
  },
  {
    id: 'p4',
    name: 'Sunrise Apartments',
    client: 'Sunrise Devs',
    location: 'Pune, MH',
    status: 'On Track',
    progress: '19/22 (86%)',
    percent: 86,
    employeesPresent: 19,
    employees: [
      { initials: 'CP', name: 'Chris Parker', role: 'HVAC Tech' },
      { initials: 'EM', name: 'Emily Moore', role: 'Welder' },
      { initials: 'RN', name: 'Richard Nelson', role: 'Electrician' }
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

const demoAlerts = [
  {
    id: 'a1',
    project: 'Grand Tower MEP',
    projectId: 'p1',
    worker: { name: 'Arun Agarwal', role: 'Electrician', avatar: 'AA' },
    title: 'Early sign‑off (2h 15m early)',
    type: 'Early Sign‑off',
    context: 'Scheduled: 8 AM–5 PM, Clocked out: 2:45 PM',
    status: 'Open',
    date: '2026-07-05'
  },
  {
    id: 'a2',
    project: 'Grand Tower MEP',
    projectId: 'p1',
    worker: { name: 'Vikram Patel', role: 'Plumber', avatar: 'VP' },
    title: 'Proxy without reason',
    type: 'Proxy',
    context: 'Reported by Rajat Sharma, 09:45 AM',
    status: 'Open',
    date: '2026-07-05'
  },
  {
    id: 'a3',
    project: 'Mall Extension',
    projectId: 'p2',
    worker: { name: 'David Rodriguez', role: 'HVAC Tech', avatar: 'DR' },
    title: 'Unexcused Absence',
    type: 'Absence',
    context: 'Scheduled: 8 AM–5 PM, No check-in recorded',
    status: 'Open',
    date: '2026-07-04'
  },
  {
    id: 'a4',
    project: 'Mall Extension',
    projectId: 'p2',
    worker: { name: 'Alex Lee', role: 'Welder', avatar: 'AL' },
    title: 'Supervisor Flag – Not on site',
    type: 'Supervisor Flag',
    context: 'Flagged by Vikram Singh, 11:30 AM',
    status: 'Acknowledged',
    date: '2026-07-04'
  },
  {
    id: 'a5',
    project: 'City Center Mall',
    projectId: 'p3',
    worker: { name: 'James Brown', role: 'Plumber', avatar: 'JB' },
    title: 'Late Pattern (3rd time this week)',
    type: 'Late Pattern',
    context: 'Scheduled: 8 AM, Checked in: 8:45 AM',
    status: 'Resolved',
    date: '2026-07-03'
  },
  {
    id: 'a6',
    project: 'Sunrise Apartments',
    projectId: 'p4',
    worker: { name: 'Chris Parker', role: 'HVAC Tech', avatar: 'CP' },
    title: 'Short Shift (worked 4h 30m)',
    type: 'Short Shift',
    context: 'Scheduled: 8h shift, Clocked out early',
    status: 'Acknowledged',
    date: '2026-07-02'
  },
  {
    id: 'a7',
    project: 'Sunrise Apartments',
    projectId: 'p4',
    worker: { name: 'Emily Moore', role: 'Welder', avatar: 'EM' },
    title: 'Unexcused Absence',
    type: 'Absence',
    context: 'No check-in recorded',
    status: 'Resolved',
    date: '2026-07-02'
  }
];

const demoDrawings = [
  { id: 'd1', project_id: 'p1', file_name: 'Electrical Layout - Floor 1.pdf', file_url: '#', version_label: 'Rev 1', uploaded_at: '2026-06-12', notes: 'Initial floor 1 layout approval.', is_published: true },
  { id: 'd2', project_id: 'p1', file_name: 'Main Switchboard Schematic.pdf', file_url: '#', version_label: 'Rev 3', uploaded_at: '2026-06-18', notes: 'Updated breakers configuration.', is_published: true },
  { id: 'd3', project_id: 'p2', file_name: 'HVAC Main Grid Ducting.pdf', file_url: '#', version_label: 'Rev 2', uploaded_at: '2026-06-20', notes: 'Pending site survey confirmation.', is_published: false },
  { id: 'd4', project_id: 'p4', file_name: 'Lighting Layout Type A.pdf', file_url: '#', version_label: 'Rev 1', uploaded_at: '2026-06-25', notes: 'Standard apartment lighting schematic.', is_published: true },
  { id: 'd5', project_id: 'p1', file_name: 'Emergency Lighting Floor 1.pdf', file_url: '#', version_label: 'Rev 2 Draft', uploaded_at: '2026-07-01', notes: 'Draft under review by supervisor.', is_published: false }
];

export default function App() {
  const [activeView, setActiveView] = useState('view-dashboard');
  const [projects, setProjects] = useState(demoProjects);
  const [notifications, setNotifications] = useState(demoNotifications);
  const [alerts, setAlerts] = useState(demoAlerts);
  const [drawings, setDrawings] = useState(demoDrawings);
  const [activeModal, setActiveModal] = useState(null); // 'add-project', 'add-worker', etc.
  const [activePanel, setActivePanel] = useState(null); // 'notifications', 'profile', or null
  const [selectedProject, setSelectedProject] = useState(null);

  const navigateToProject = (project) => {
    setSelectedProject(project);
    setActiveView('view-projects');
  };

  // Clear selectedProject when navigating away from projects
  const handleSetActiveView = (view) => {
    if (view !== 'view-projects') {
      setSelectedProject(null);
    }
    setActiveView(view);
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
      <Sidebar activeView={activeView} setActiveView={handleSetActiveView} />
      
      <main className="main-content">
        <Topbar activePanel={activePanel} togglePanel={togglePanel} notifications={notifications} />
        
        <div className="views-container">
          {activeView === 'view-dashboard' && <Dashboard setActiveView={handleSetActiveView} projects={projects} navigateToProject={navigateToProject} alerts={alerts} setAlerts={setAlerts} />}
          {activeView === 'view-projects' && <ProjectsHub openModal={openModal} projects={projects} initialSelectedProject={selectedProject} onClearSelection={() => setSelectedProject(null)} alerts={alerts} setAlerts={setAlerts} />}
          {activeView === 'view-workforce' && <Workforce openModal={openModal} projects={projects} />}
          {activeView === 'view-attendance' && <AttendanceLog projects={projects} navigateToProject={navigateToProject} setActiveView={handleSetActiveView} />}
          {activeView === 'view-alerts' && <Alerts alerts={alerts} setAlerts={setAlerts} />}
          {activeView === 'view-rfis' && <RFIs openModal={openModal} />}
          {activeView === 'view-drawings' && <Drawings projects={projects} drawings={drawings} setDrawings={setDrawings} />}
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
        <div className="modal-overlay active" onMouseDown={(e) => {
          if (e.target === e.currentTarget) closeModal();
        }}>
          {activeModal === 'add-project' && <AddProjectModal onClose={closeModal} />}
          {activeModal === 'add-worker' && <AddWorkerModal onClose={closeModal} projects={projects} />}
          {activeModal === 'new-rfi' && <NewRfiModal onClose={closeModal} projects={projects} />}
          {activeModal === 'upload-revision' && <UploadRevisionModal onClose={closeModal} projects={projects} />}
          {activeModal === 'add-blueprint' && <AddBlueprintModal onClose={closeModal} projects={projects} />}
        </div>
      )}
    </div>
  );
}
