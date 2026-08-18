import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Bell,
  MapPin,
  Map,
  Clock,
  Info,
  Ruler,
  AlertTriangle,
  Plus,
  X,
  RefreshCw,
  CheckCircle2,
} from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { getCurrentJob } from '../../services/jobService';
import { clockIn, clockOut, getTodayStatus } from '../../services/attendanceService';
import { calculateDistanceMeters, getCurrentPosition } from '../../utils/geoUtils';
import Card from '../../components/Card';
import Button from '../../components/Button';

/**
 * ForemanHome — main dashboard for the foreman role.
 * Matches Figma frame "Foreman Home - Functional Interactive Clock-In" (node 3:667).
 *
 * Sections:
 *   1. Header — greeting + role + notification bell
 *   2. Project Hero Card — site image, "CURRENT SITE" label, project name, location
 *   3. Clock-In Widget — time, date, "At Location" badge, hold-to-clock-in button, helper notes
 *   4. RFI Widget — "Active RFIs" heading, RFI items, "Raise Issue" button + modal
 */

// ── Mock RFI Data ────────────────────────────────────────────────
const mockRfis = [
  {
    id: 'RFI-04',
    title: 'Conduit clash on Floor 2',
    priority: 'HIGH',
    status: 'Open',
  },
];

export default function ForemanHome() {
  const user = useAuthStore((s) => s.user);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [geoError, setGeoError] = useState('');
  const [locationStatus, setLocationStatus] = useState('idle'); // 'idle' | 'checking' | 'at_location' | 'not_in_location'
  const [locationDetail, setLocationDetail] = useState('');
  const [showRfiModal, setShowRfiModal] = useState(false);
  const [rfiReason, setRfiReason] = useState('');
  const [rfiDescription, setRfiDescription] = useState('');
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

  // Open Google Maps URL for active site
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

  const handleSubmitRfi = () => {
    console.log('Submitting RFI:', { reason: rfiReason, description: rfiDescription });
    setRfiReason('');
    setRfiDescription('');
    setShowRfiModal(false);
  };

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
      {/* ── Header ──────────────────────────────────────────── */}
      <header className="h-16 bg-surface border-b border-border flex items-center justify-between px-4 shrink-0 relative z-10">
        <div className="flex flex-col">
          <h1 className="text-xl font-medium font-heading text-text-primary">
            Hi, {user?.name || 'Foreman'}
          </h1>
          <p className="text-sm text-text-secondary">Foreman</p>
        </div>
        <button className="p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary/40">
          <Bell size={20} className="text-text-primary" />
        </button>
      </header>

      {/* ── Main Content ────────────────────────────────────── */}
      <div className="flex flex-col gap-6 p-4 pb-32">

        {/* ── Section 1: Project Hero Card ───────────────────── */}
        {job ? (
          <>
          <Card
            padding="none"
            className="relative w-full min-h-[192px] overflow-hidden shrink-0 border border-border cursor-pointer active:scale-[0.98] transition-transform"
          >
            <img
              src={job.imageUrl}
              className="absolute inset-0 w-full h-full object-cover"
              alt="Construction site"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
              <div className="flex flex-col gap-0.5">
                <span className="text-[10px] font-semibold uppercase tracking-widest text-blue-300">
                  CURRENT SITE
                </span>
                <h2 className="text-xl font-bold font-heading text-white leading-tight">
                  {job.name}
                </h2>
                <div
                  onClick={handleOpenMap}
                  className="flex items-center gap-1 text-white/80 cursor-pointer hover:underline group"
                  title="View site on Google Maps"
                >
                  <MapPin size={12} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
                  <span className="text-xs">{job.location}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleOpenMap}
                title="View on Google Maps"
                aria-label="View on Google Maps"
                className="w-10 h-10 rounded-sm bg-white/10 hover:bg-white/25 active:scale-95 backdrop-blur-md border border-white/20 flex items-center justify-center text-white cursor-pointer transition-all shadow-md group"
              >
                <Map size={20} strokeWidth={1.5} className="group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </Card>

          {/* ── Section 2: Clock-In Widget ──────────────────────── */}
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

        {/* ── Section 3: Site Issues / RFIs Widget ───────────── */}
        <Card padding="none" className="flex flex-col w-full border border-border bg-surface-card shadow-md relative overflow-hidden">
          <div className="absolute inset-[-1px] rounded-md shadow-md pointer-events-none" />

          <div className="flex flex-col gap-4 p-[17px] relative z-10">
            {/* Heading */}
            <h3 className="text-lg font-semibold font-heading text-text-primary border-b border-border pb-2">
              Active RFIs
            </h3>

            {/* RFI List */}
            <div className="flex flex-col gap-3">
              {mockRfis.map((rfi) => (
                <div
                  key={rfi.id}
                  className="flex items-start gap-3 p-3 rounded-sm border border-border bg-surface hover:bg-surface/80 transition-colors cursor-pointer"
                >
                  {/* Icon */}
                  <div className="shrink-0 w-9 h-9 rounded-full bg-error/10 flex items-center justify-center">
                    <AlertTriangle size={18} className="text-error" />
                  </div>
                  {/* Content */}
                  <div className="flex-1 flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-text-secondary tracking-wider">
                        {rfi.id}
                      </span>
                      <span className="bg-error/10 text-error px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase">
                        {rfi.priority}
                      </span>
                    </div>
                    <span className="text-sm text-text-primary line-clamp-2">
                      {rfi.title}
                    </span>
                  </div>
                </div>
              ))}

              {mockRfis.length === 0 && (
                <p className="text-sm text-text-muted text-center py-4">
                  No active RFIs
                </p>
              )}
            </div>

            {/* Raise Issue Button */}
            <button
              onClick={() => setShowRfiModal(true)}
              className={[
                'w-full py-2.5 rounded-sm border-2 border-border-strong',
                'text-text-secondary text-sm font-semibold',
                'hover:bg-surface hover:text-text-primary hover:border-primary/40',
                'transition-colors duration-fast',
                'flex justify-center items-center gap-2',
              ].join(' ')}
            >
              <Plus size={16} />
              Raise Issue
            </button>
          </div>
        </Card>
      </div>

      {/* ── RFI Modal ───────────────────────────────────────── */}
      {showRfiModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowRfiModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-surface-card rounded-md shadow-lg w-full max-w-[358px] p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold font-heading text-text-primary">
                Raise New Issue
              </h2>
              <button
                onClick={() => setShowRfiModal(false)}
                className="p-1 rounded-full hover:bg-surface transition-colors"
                aria-label="Close modal"
              >
                <X size={18} className="text-text-muted" />
              </button>
            </div>

            {/* Form */}
            <div className="flex flex-col gap-5">
              {/* Field 1: Main Reason */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                  Main Reason
                </label>
                <input
                  type="text"
                  value={rfiReason}
                  onChange={(e) => setRfiReason(e.target.value)}
                  placeholder="e.g., Material shortage, Drawing clash"
                  className={[
                    'w-full px-4 py-3 text-sm rounded-sm border border-border bg-surface-card',
                    'text-text-primary placeholder:text-text-muted font-sans',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    'transition-colors duration-fast',
                  ].join(' ')}
                />
              </div>

              {/* Field 2: Explanation */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                    Explanation
                  </label>
                  <span className="text-xs text-text-muted">
                    {rfiDescription.length}/500
                  </span>
                </div>
                <textarea
                  value={rfiDescription}
                  onChange={(e) => setRfiDescription(e.target.value)}
                  maxLength={500}
                  rows={4}
                  placeholder="Describe the issue in detail for the engineering team..."
                  className={[
                    'w-full px-4 py-3 text-sm rounded-sm border border-border bg-surface-card',
                    'text-text-primary placeholder:text-text-muted font-sans resize-none',
                    'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary',
                    'transition-colors duration-fast',
                  ].join(' ')}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="secondary"
                  size="md"
                  className="flex-1"
                  onClick={() => setShowRfiModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-[2]"
                  onClick={handleSubmitRfi}
                  disabled={!rfiReason.trim()}
                >
                  Submit Issue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
