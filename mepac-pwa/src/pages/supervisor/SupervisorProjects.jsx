import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, ChevronRight, ArrowUpDown, Check, CheckCircle2, Circle, MapPin, ExternalLink } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getSupervisorProjects } from '../../services/jobService';
import Card from '../../components/Card';

export default function SupervisorProjects() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  const [currentProjects, setCurrentProjects] = useState([]);
  const [oldProjects, setOldProjects] = useState([]);
  const [sortOption, setSortOption] = useState('alphabetical'); // 'alphabetical' | 'visited'
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef(null);

  const loadProjects = useCallback(async () => {
    try {
      const data = await getSupervisorProjects(user?.id);
      const active = [];
      const completed = [];

      if (data && data.length > 0) {
        data.forEach((p) => {
          const item = {
            id: p.id,
            name: p.name,
            client: p.client,
            phase: p.location || 'Active MEP',
            location: p.location,
            latitude: p.latitude,
            longitude: p.longitude,
            visited: Boolean(p.presentCount > 0),
            isAssignedToMe: Boolean(p.isAssignedToMe),
          };

          if (p.isCompleted) {
            completed.push({ ...item, phase: 'Completed' });
          } else {
            active.push(item);
          }
        });
      }
      setCurrentProjects(active);
      setOldProjects(completed);
    } catch (err) {
      console.warn('Failed to load supervisor projects:', err);
      setCurrentProjects([]);
      setOldProjects([]);
    }
  }, [user]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (sortRef.current && !sortRef.current.contains(e.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSortChange = (option) => {
    setSortOption(option);
    setIsSortOpen(false);

    const sorted = [...currentProjects];
    if (option === 'alphabetical') {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (option === 'visited') {
      sorted.sort((a, b) => (b.visited ? 1 : 0) - (a.visited ? 1 : 0));
    }
    setCurrentProjects(sorted);
  };

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative z-10">
        <h1 className="text-xl font-bold font-heading text-text-primary">
          Projects
        </h1>
        <button className="w-10 h-10 rounded-full border border-border flex items-center justify-center hover:bg-surface transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40">
          <Bell size={20} className="text-text-secondary" />
        </button>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-4 pb-32 max-w-4xl mx-auto w-full">

        {/* ── Section 1: Current Working Projects ─────────────── */}
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center relative">
            <h2 className="text-base font-bold font-heading text-text-secondary">
              Current Working
            </h2>

            {/* Sort Dropdown */}
            <div className="relative" ref={sortRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-card border border-border rounded-sm text-text-secondary hover:bg-surface transition-colors text-xs font-semibold"
              >
                <span>Sort</span>
                <ArrowUpDown size={14} />
              </button>

              {isSortOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-surface-card rounded-sm shadow-md border border-border z-20 flex flex-col overflow-hidden">
                  <button
                    onClick={() => handleSortChange('alphabetical')}
                    className={[
                      'px-4 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors border-b border-border',
                      sortOption === 'alphabetical'
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-text-primary hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Alphabetically</span>
                    {sortOption === 'alphabetical' && <Check size={14} />}
                  </button>

                  <button
                    onClick={() => handleSortChange('visited')}
                    className={[
                      'px-4 py-2.5 text-left text-xs font-medium flex items-center justify-between transition-colors',
                      sortOption === 'visited'
                        ? 'text-primary bg-primary/10 font-semibold'
                        : 'text-text-primary hover:bg-surface',
                    ].join(' ')}
                  >
                    <span>Visited / Not Visited</span>
                    {sortOption === 'visited' && <Check size={14} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Active Projects Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {currentProjects.length > 0 ? (
              currentProjects.map((project) => {
                const mapsUrl = project.latitude != null && project.longitude != null
                  ? `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location || project.name)}`;

                return (
                  <Card
                    key={project.id}
                    padding="none"
                    onClick={() => navigate(`/supervisor/projects/${project.id}`)}
                    className="p-4 border border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer flex items-center justify-between group relative overflow-hidden"
                  >
                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold font-heading text-text-primary">
                          {project.name}
                        </h3>
                        {project.isAssignedToMe && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                            Assigned to Me
                          </span>
                        )}
                      </div>

                      <a
                        href={mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-semibold"
                      >
                        <MapPin size={13} />
                        <span>{project.location}</span>
                        <ExternalLink size={11} />
                      </a>

                      {project.visited ? (
                        <div className="flex items-center gap-1 text-success mt-1">
                          <CheckCircle2 size={14} strokeWidth={2.5} />
                          <span className="text-[11px] font-semibold">Checked In Today</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-text-muted mt-1">
                          <Circle size={14} strokeWidth={1.5} />
                          <span className="text-[11px] font-semibold">Active Site</span>
                        </div>
                      )}
                    </div>

                    <ChevronRight
                      size={20}
                      className="text-text-muted group-hover:text-primary transition-colors shrink-0"
                    />
                  </Card>
                );
              })
            ) : (
              <div className="p-4 text-sm text-text-muted text-center col-span-full border border-border rounded-sm">
                No active projects found.
              </div>
            )}
          </div>
        </div>

        {/* ── Section 2: Old Projects ─────────────────────────── */}
        <div className="flex flex-col gap-3 mt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-heading text-text-secondary">
              Old Projects
            </h2>
            <span className="text-xs font-semibold text-text-muted">
              {oldProjects.length} COMPLETED
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {oldProjects.length > 0 ? (
              oldProjects.map((project) => {
                const mapsUrl = project.latitude != null && project.longitude != null
                  ? `https://www.google.com/maps/search/?api=1&query=${project.latitude},${project.longitude}`
                  : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(project.location || project.name)}`;

                return (
                  <Card
                    key={project.id}
                    padding="none"
                    onClick={() => navigate(`/supervisor/projects/${project.id}`)}
                    className="p-4 border border-border bg-slate-50/70 hover:bg-surface-card flex items-center justify-between cursor-pointer hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col gap-1 min-w-0 pr-2">
                      <h3 className="text-base font-medium font-heading text-text-primary group-hover:text-primary transition-colors">
                        {project.name}
                      </h3>
                      {project.location && (
                        <a
                          href={mapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors font-medium truncate"
                        >
                          <MapPin size={12} />
                          <span className="truncate">{project.location}</span>
                          <ExternalLink size={10} />
                        </a>
                      )}
                    </div>
                    <ChevronRight size={18} className="text-text-muted group-hover:text-primary transition-colors shrink-0" />
                  </Card>
                );
              })
            ) : (
              <div className="p-4 text-sm text-text-muted text-center col-span-full border border-border rounded-sm bg-surface-card">
                No completed projects.
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
