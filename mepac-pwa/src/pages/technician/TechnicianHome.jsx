import { useEffect, useState, useRef, useCallback } from 'react';
import { Bell, Map, Clock, MapPin, Info, Ruler, AlertTriangle, RefreshCw, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getCurrentJob } from '../../services/jobService';
import { clockIn, clockOut, getTodayStatus } from '../../services/attendanceService';
import { calculateDistanceMeters, getCurrentPosition } from '../../utils/geoUtils';
import Card from '../../components/Card';

export default function TechnicianHome() {
  const user = useAuthStore((s) => s.user);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'checking' | 'at_location' | 'not_in_location'
  const [locationDetail, setLocationDetail] = useState('');
  const holdTimerRef = useRef(null);

  const checkLocationStatus = useCallback(async (currentJob = job) => {
    const targetJob = currentJob || job;
    setLocationStatus('checking');
    try {
      const pos = await getCurrentPosition();
      const radiusLimit = targetJob?.geofenceRadius || 100;
      const isEnforced = targetJob?.enforceGps ?? true;

      if (targetJob?.latitude != null && targetJob?.longitude != null) {
        const dist = calculateDistanceMeters(
          pos.latitude,
          pos.longitude,
          targetJob.latitude,
          targetJob.longitude
        );
        if (dist <= radiusLimit) {
          setLocationStatus('at_location');
          setLocationDetail(`At ${targetJob.name} (${dist}m)`);
        } else {
          setLocationStatus(isEnforced ? 'not_in_location' : 'at_location');
          setLocationDetail(isEnforced ? `Not in Location (${dist}m away / Limit ${radiusLimit}m)` : `Advisory: ${dist}m away`);
        }
      } else {
        setLocationStatus('at_location');
        setLocationDetail(`GPS Active (At ${targetJob?.name || 'Site'})`);
      }
    } catch (err) {
      console.warn('Geo check notice:', err.message);
      setLocationStatus('not_in_location');
      setLocationDetail(err.message);
    }
  }, [job]);

  useEffect(() => {
    if (user?.id) {
      setLoading(true);
      getCurrentJob(user.id)
        .then((activeJob) => {
          setJob(activeJob);
          if (activeJob?.isClockedIn !== undefined) {
            setIsClockedIn(activeJob.isClockedIn);
          }
          if (activeJob) {
            checkLocationStatus(activeJob);
          }
        })
        .catch(() => setJob(null))
        .finally(() => setLoading(false));

      getTodayStatus(user.id).then((status) => {
        if (status?.isClockedIn !== undefined) {
          setIsClockedIn(status.isClockedIn);
        }
      });
    } else {
      setLoading(false);
    }
  }, [user, checkLocationStatus]);

  // Open Google Maps URL for the active site
  const handleOpenMap = (e) => {
    if (e) e.stopPropagation();
    if (!job) return;
    let mapsUrl;
    if (job.latitude != null && job.longitude != null) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${job.latitude},${job.longitude}`;
    } else {
      const query = encodeURIComponent(`${job.name} ${job.location || ''}`.trim());
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
    }
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  // ── Hold-to-Clock logic ─────────────────────────────────────────
  const startHold = () => {
    if (isTransitioning || (job?.allowSelfClockIn === false && !isClockedIn)) return;
    setGeoError('');
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
    if (job?.allowSelfClockIn === false) {
      setGeoError('Self clock-in is disabled by administrator settings. Please contact your supervisor.');
      return;
    }
    setIsTransitioning(true);
    setGeoError('');
    try {
      const radiusLimit = job?.geofenceRadius || 100;
      const isEnforced = job?.enforceGps ?? true;

      if (job?.latitude != null && job?.longitude != null) {
        try {
          const pos = await getCurrentPosition();
          const dist = calculateDistanceMeters(
            pos.latitude,
            pos.longitude,
            job.latitude,
            job.longitude
          );
          if (isEnforced && dist > radiusLimit) {
            setLocationStatus('not_in_location');
            setLocationDetail(`Not in Location (${dist}m away)`);
            setGeoError(`Location Alert: You are ${dist}m away from ${job.name}. Admin policy requires you to be within ${radiusLimit}m to clock in.`);
            setIsTransitioning(false);
            setProgressWidth(0);
            return;
          } else {
            setLocationStatus('at_location');
            setLocationDetail(`At ${job.name}`);
          }
        } catch (geoErr) {
          console.warn('Geolocation notice:', geoErr.message);
        }
      }

      if (user?.id) {
        await clockIn(user.id, job?.id);
      }
      setIsClockedIn(true);
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (err) {
      console.error('Clock-in failed:', err);
      setGeoError(err.message || 'Clock-in failed');
    } finally {
      setProgressWidth(0);
      setTimeout(() => setIsTransitioning(false), 1000);
    }
  };

  const completeClockOut = async () => {
    setIsTransitioning(true);
    setGeoError('');
    try {
      const radiusLimit = job?.geofenceRadius || 100;
      const isEnforced = job?.enforceGps ?? true;

      if (job?.latitude != null && job?.longitude != null) {
        try {
          const pos = await getCurrentPosition();
          const dist = calculateDistanceMeters(
            pos.latitude,
            pos.longitude,
            job.latitude,
            job.longitude
          );
          if (isEnforced && dist > radiusLimit) {
            setLocationStatus('not_in_location');
            setLocationDetail(`Not in Location (${dist}m away)`);
            setGeoError(`Location Alert: You are ${dist}m away from ${job.name}. Admin policy requires you to be within ${radiusLimit}m to clock out.`);
            setIsTransitioning(false);
            setProgressWidth(0);
            return;
          }
        } catch (geoErr) {
          console.warn('Geolocation notice:', geoErr.message);
        }
      }

      if (user?.id) {
        await clockOut(user.id);
      }
      setIsClockedIn(false);
      if (navigator.vibrate) navigator.vibrate(200);
    } catch (err) {
      console.error('Clock-out failed:', err);
      setGeoError(err.message || 'Clock-out failed');
    } finally {
      setProgressWidth(0);
      setTimeout(() => setIsTransitioning(false), 1000);
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

  return (
    <div className="flex flex-col min-h-full">
      {/* Header */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium font-heading text-text-primary">
            Hi, {user?.name || user?.firstName || 'Technician'}
          </h1>
          <p className="text-sm text-text-secondary">{user?.workerCode ? `${user.workerCode} • ` : ''}Technician</p>
        </div>
        <button className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40">
          <Bell size={20} className="text-text-primary" />
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col gap-6 p-6 pb-32">
        {job ? (
          <>
            {/* Project Widget */}
            <Card padding="none" className="relative w-full h-[200px] overflow-hidden shrink-0 border border-border">
              <img src={job.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Site" />
              <div className="absolute inset-0 bg-black/50" />
              
              <div className="absolute inset-0 flex items-end justify-between p-6">
                <div className="flex flex-col gap-1">
                  <h2 className="text-2xl font-semibold font-heading text-white tracking-tight">
                    {job.name}
                  </h2>
                  <div
                    onClick={handleOpenMap}
                    className="flex items-center gap-1.5 cursor-pointer hover:underline text-white/90 group"
                    title="View site on Google Maps"
                  >
                    <div className="flex items-center justify-center text-white/90 group-hover:scale-110 transition-transform">
                      <MapPin size={14} strokeWidth={2.5} />
                    </div>
                    <span className="text-sm text-white/90">{job.location}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenMap}
                  title="View on Google Maps"
                  aria-label="View on Google Maps"
                  className="w-20 h-20 rounded-md border-2 border-white/30 bg-black/30 hover:bg-black/50 active:scale-95 flex flex-col items-center justify-center gap-1 overflow-hidden shrink-0 shadow-lg backdrop-blur-md cursor-pointer transition-all text-white group"
                >
                  <Map size={28} className="text-white/80 group-hover:text-white group-hover:scale-110 transition-all" strokeWidth={1.5} />
                  <span className="text-[10px] font-bold text-white/90 uppercase tracking-wider">Map</span>
                </button>
              </div>
            </Card>

            {/* Clock-In Widget */}
            <Card padding="none" className="flex flex-col w-full border border-border bg-surface-card shadow-md relative overflow-hidden">
              <div className="absolute inset-[-1px] rounded-md shadow-md pointer-events-none" />

              <div className="flex flex-col gap-6 p-[17px] relative z-10">
                {/* Time + Status row */}
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm text-text-secondary">{job.dateStr}</span>
                    <span className="text-2xl font-semibold font-heading text-text-primary tracking-tight">
                      {job.timeStr}
                    </span>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full ${isClockedIn ? 'bg-emerald-100' : 'bg-[#dce9ff]'}`}>
                      <div className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-600 animate-pulse' : 'bg-primary-dark'}`} />
                      <span className={`text-xs font-semibold tracking-wide ${isClockedIn ? 'text-emerald-800' : 'text-text-primary'}`}>
                        {isClockedIn ? 'Clocked In' : job.status}
                      </span>
                    </div>
                    <span className="text-sm text-text-secondary">
                      {isClockedIn ? 'Shift Active' : 'Ready to Clock In'}
                    </span>
                  </div>
                </div>

                {/* Location Status Pre-Check Badge */}
                <div className="flex items-center justify-between p-3 rounded-sm border bg-slate-50 border-border text-xs font-semibold">
                  <div className="flex items-center gap-2">
                    {locationStatus === 'at_location' ? (
                      <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 size={14} className="text-emerald-600" />
                        <span>At {job.name}</span>
                      </div>
                    ) : locationStatus === 'not_in_location' ? (
                      <div className="flex items-center gap-1.5 text-red-700 bg-red-100 px-2.5 py-1 rounded-full">
                        <AlertTriangle size={14} className="text-red-600" />
                        <span>Not in Location</span>
                      </div>
                    ) : locationStatus === 'checking' ? (
                      <div className="flex items-center gap-1.5 text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">
                        <RefreshCw size={12} className="animate-spin text-blue-600" />
                        <span>Verifying Location...</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <MapPin size={14} className="text-text-muted" />
                        <span>Location Unverified</span>
                      </div>
                    )}
                    {locationDetail && locationStatus === 'not_in_location' && (
                      <span className="text-[11px] text-text-muted">{locationDetail}</span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => checkLocationStatus()}
                    disabled={locationStatus === 'checking'}
                    className="flex items-center gap-1 text-[11px] font-bold text-primary hover:underline"
                  >
                    <RefreshCw size={12} className={locationStatus === 'checking' ? 'animate-spin' : ''} />
                    <span>Verify</span>
                  </button>
                </div>

                {geoError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-sm text-xs text-red-700 flex items-start gap-2">
                    <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
                    <span>{geoError}</span>
                  </div>
                )}

                {/* Hold-to-Clock Button */}
                <button
                  className={[
                    'relative w-full h-14 rounded-md overflow-hidden text-white text-base',
                    'flex justify-center items-center shadow-md select-none touch-none',
                    'transition-colors duration-default',
                    isClockedIn ? 'bg-error hover:bg-error/90' : 'bg-primary-dark hover:bg-primary',
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
                      Must be within 100m of {job.name}.
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
          </>
        ) : loading ? (
          <div className="flex justify-center py-10">
            <span className="inline-block w-6 h-6 border-2 border-border-strong border-t-primary rounded-full animate-spin" />
          </div>
        ) : (
          <Card className="flex flex-col items-center justify-center p-8 text-center gap-3 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
              <AlertTriangle size={24} />
            </div>
            <h3 className="text-lg font-bold font-heading text-text-primary">No Project Assigned</h3>
            <p className="text-sm text-text-secondary max-w-xs">
              You are currently not assigned to any active project site. Please ask your administrator to assign you in the Admin Panel.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
