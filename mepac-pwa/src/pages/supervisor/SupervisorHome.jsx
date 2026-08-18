import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  Clock,
  CheckCircle2,
  Circle,
  MapPin,
  Map,
  ArrowRight,
  Info,
  Ruler,
  ExternalLink,
  Building2,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getSupervisorProjects, getCurrentJob } from '../../services/jobService';
import { clockIn, clockOut, getTodayStatus } from '../../services/attendanceService';
import Card from '../../components/Card';

/**
 * SupervisorHome — Dashboard for Supervisor role.
 * Displays real-time active project sites, dynamic clock-in widget,
 * and direct Google Maps location lookup for each active site.
 */
export default function SupervisorHome() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();

  const [activeSites, setActiveSites] = useState([]);
  const [loadingSites, setLoadingSites] = useState(true);
  const [currentJob, setCurrentJob] = useState(null);

  const [isClockedIn, setIsClockedIn] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState(null);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const holdTimerRef = useRef(null);

  // Current time & date
  const [currentTime, setCurrentTime] = useState(() => {
    return new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  });

  const [currentDateStr, setCurrentDateStr] = useState(() => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  });

  // Update clock every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(
        new Date().toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
      setCurrentDateStr(
        new Date().toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })
      );
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  // Fetch supervisor's active projects & clock-in status
  const loadDashboardData = useCallback(async () => {
    if (!user?.id) return;
    setLoadingSites(true);
    try {
      const [allProjects, activeJob, status] = await Promise.all([
        getSupervisorProjects(user.id),
        getCurrentJob(user.id),
        getTodayStatus(user.id),
      ]);

      if (allProjects && Array.isArray(allProjects)) {
        // Only keep active (non-completed) sites for the dashboard
        const active = allProjects
          .filter((p) => !p.isCompleted)
          .map((p) => ({
            id: p.id,
            name: p.name,
            client: p.client,
            location: p.location,
            latitude: p.latitude,
            longitude: p.longitude,
            visited: Boolean(p.presentCount > 0),
            presentCount: p.presentCount || 0,
            totalAssigned: p.totalAssigned || 0,
            isAssignedToMe: Boolean(p.isAssignedToMe),
          }));
        setActiveSites(active);
      } else {
        setActiveSites([]);
      }

      setCurrentJob(activeJob);

      if (status) {
        setIsClockedIn(Boolean(status.isClockedIn));
        setTodayCheckIn(status.checkIn || null);
      }
    } catch (err) {
      console.warn('Failed to load supervisor dashboard data:', err);
    } finally {
      setLoadingSites(false);
    }
  }, [user]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Open Google Maps URL for a site
  const handleOpenMap = (e, site) => {
    e.stopPropagation();
    let mapsUrl;
    if (site.latitude != null && site.longitude != null) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${site.latitude},${site.longitude}`;
    } else {
      const query = encodeURIComponent(`${site.name} ${site.location || ''}`.trim());
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // Hold-to-clock logic
  const startHold = () => {
    if (isTransitioning) return;
    setProgressWidth(0);
    requestAnimationFrame(() => setProgressWidth(100));

    holdTimerRef.current = setTimeout(async () => {
      if (isClockedIn) {
        await completeClockOut();
      } else {
        await completeClockIn();
      }
    }, 2000);
  };

  const cancelHold = () => {
    if (isTransitioning) return;
    clearTimeout(holdTimerRef.current);
    setProgressWidth(0);
  };

  const completeClockIn = async () => {
    setIsTransitioning(true);
    try {
      const targetProjectId = activeSites[0]?.id || currentJob?.id || null;
      await clockIn(user.id, targetProjectId);
      setIsClockedIn(true);
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (err) {
      console.error('Clock-in error:', err);
    } finally {
      setProgressWidth(0);
      setTimeout(() => setIsTransitioning(false), 1000);
      loadDashboardData();
    }
  };

  const completeClockOut = async () => {
    setIsTransitioning(true);
    try {
      await clockOut(user.id, todayCheckIn?._id);
      setIsClockedIn(false);
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (err) {
      console.error('Clock-out error:', err);
    } finally {
      setProgressWidth(0);
      setTimeout(() => setIsTransitioning(false), 1000);
      loadDashboardData();
    }
  };

  // Prevent context menu on long press (mobile)
  useEffect(() => {
    const handler = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handler);
    return () => document.removeEventListener('contextmenu', handler);
  }, []);

  // Derive clock button label
  const getClockLabel = () => {
    if (isClockedIn) {
      if (progressWidth > 0 && !isTransitioning) return 'Keep holding to Clock Out';
      if (isTransitioning) return 'Clocked Out ✓';
      return 'Clock Out';
    }
    if (progressWidth > 0 && !isTransitioning) return 'Keep holding…';
    if (isTransitioning) return 'Clocked In ✓';
    return 'Clock In';
  };

  // Determine primary active site name for widget
  const primarySiteName = activeSites[0]?.name || currentJob?.name || 'Site';

  return (
    <div className="flex flex-col min-h-full">
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium font-heading text-text-primary">
            Hi, {user?.name || user?.firstName || 'Supervisor'}
          </h1>
          <p className="text-sm text-text-secondary">Supervisor</p>
        </div>
        <button
          className="p-2 rounded-full hover:bg-surface-card transition-colors focus:outline-none focus:ring-2 focus:ring-primary/40"
          aria-label="Notifications"
        >
          <Bell size={20} className="text-text-primary" />
        </button>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-4 pb-32 max-w-4xl mx-auto w-full">

        {/* ── Section 1: Personal Clock-In Widget ────────────────── */}
        <Card padding="none" className="flex flex-col w-full border border-border bg-surface-card shadow-md relative overflow-hidden">
          <div className="absolute inset-[-1px] rounded-md shadow-md pointer-events-none" />

          <div className="flex flex-col gap-6 p-[17px] relative z-10">
            {/* Time + Status row */}
            <div className="flex items-start justify-between">
              <div className="flex flex-col">
                <span className="text-[28px] font-semibold font-heading text-text-primary tracking-tight leading-tight">
                  {currentTime}
                </span>
                <span className="text-sm text-text-secondary">
                  {currentDateStr}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-[#dce9ff] rounded-full max-w-[200px] truncate">
                <div className="w-[13px] h-[13px] rounded-full border-2 border-primary-dark flex items-center justify-center shrink-0">
                  <div className="w-[5px] h-[5px] rounded-full bg-primary-dark" />
                </div>
                <span className="text-xs font-semibold text-text-primary tracking-wide truncate">
                  At {primarySiteName}
                </span>
              </div>
            </div>

            {/* Hold-to-Clock Button */}
            <button
              className={[
                'relative w-full h-14 rounded-md overflow-hidden text-white text-base',
                'flex justify-center items-center shadow-md select-none touch-none',
                'transition-colors duration-default',
                isClockedIn ? 'bg-error' : 'bg-primary-dark',
              ].join(' ')}
              onTouchStart={(e) => { e.preventDefault(); startHold(); }}
              onTouchEnd={(e) => { e.preventDefault(); cancelHold(); }}
              onMouseDown={startHold}
              onMouseUp={cancelHold}
              onMouseLeave={cancelHold}
            >
              {/* Progress overlay */}
              <div
                className="absolute left-0 top-0 bottom-0 bg-white/20 pointer-events-none"
                style={{
                  width: `${progressWidth}%`,
                  transition: progressWidth === 100 ? 'width 2s linear' : 'none',
                }}
              />
              <div className="relative z-10 flex items-center gap-2 pointer-events-none">
                <Clock size={20} strokeWidth={2} />
                <span className="font-medium font-heading text-lg">
                  {getClockLabel()}
                </span>
              </div>
            </button>

            {/* Helper notes */}
            <div className="flex flex-col gap-2">
              <div className="flex items-start gap-2">
                <Info size={14} className="text-text-muted mt-0.5 shrink-0" />
                <span className="text-sm text-text-secondary">
                  Must be within 100m of {primarySiteName}.
                </span>
              </div>
              <div className="flex items-start gap-2">
                <Ruler size={14} className="text-text-muted mt-0.5 shrink-0" />
                <span className="text-sm text-text-secondary">
                  Late flag applies after 08:30 AM.
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* ── Section 2: Active Sites ────────────────────────── */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold font-heading text-text-primary">
              Active Sites
            </h2>
            <span className="text-xs font-bold text-primary px-2.5 py-1 bg-primary/10 rounded-sm uppercase">
              {activeSites.length} ACTIVE
            </span>
          </div>

          <div className="flex flex-col gap-3">
            {loadingSites ? (
              <div className="flex flex-col items-center justify-center p-8 border border-border rounded-sm bg-surface-card">
                <span className="inline-block w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                <span className="text-xs text-text-muted">Loading active sites...</span>
              </div>
            ) : activeSites.length > 0 ? (
              activeSites.map((site) => (
                <Card
                  key={site.id}
                  padding="none"
                  onClick={() => navigate(`/supervisor/projects/${site.id}`)}
                  className="flex items-center justify-between p-4 border border-border shadow-sm hover:shadow-md transition-all cursor-pointer group hover:border-primary/50"
                >
                  <div className="flex flex-col gap-1.5 min-w-0 pr-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold font-heading text-text-primary group-hover:text-primary transition-colors">
                        {site.name}
                      </h3>
                      {site.isAssignedToMe && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full">
                          Assigned
                        </span>
                      )}
                    </div>

                    {site.location && (
                      <span className="text-xs text-text-secondary truncate">
                        {site.location}
                      </span>
                    )}

                    {site.visited ? (
                      <div className="flex items-center gap-1.5 text-success">
                        <CheckCircle2 size={15} strokeWidth={2.5} />
                        <span className="text-xs font-semibold">
                          {site.presentCount > 0 ? `${site.presentCount} Checked In Today` : 'Visited'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-text-muted">
                        <Circle size={15} strokeWidth={1.5} />
                        <span className="text-xs font-semibold">
                          {site.totalAssigned > 0 ? `${site.totalAssigned} Assigned` : 'Active Site'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Location Icon Button — Opens Google Maps */}
                  <button
                    type="button"
                    onClick={(e) => handleOpenMap(e, site)}
                    title={`View ${site.name} on Google Maps`}
                    className="w-11 h-11 bg-surface-card rounded-md border border-border flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all shrink-0 shadow-xs focus:outline-none focus:ring-2 focus:ring-primary/40 group/btn"
                  >
                    <MapPin size={20} className="transition-transform group-hover/btn:scale-110" />
                  </button>
                </Card>
              ))
            ) : (
              <div className="p-8 text-center border border-border rounded-sm bg-surface-card flex flex-col items-center gap-2">
                <Building2 size={32} className="text-text-muted opacity-60" />
                <p className="text-sm font-semibold text-text-primary">No active project sites</p>
                <p className="text-xs text-text-muted">You do not have any active project sites assigned at the moment.</p>
              </div>
            )}
          </div>

          {/* View All Projects link */}
          <div className="flex justify-center pt-2">
            <button
              onClick={() => navigate('/supervisor/projects')}
              className="text-primary font-bold text-sm flex items-center gap-2 hover:bg-primary/10 px-4 py-2 rounded-full transition-colors"
            >
              <span>View all projects</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

