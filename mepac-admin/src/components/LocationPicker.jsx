import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './LocationPicker.css';

import iconImg from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: iconImg,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

/* ─── Small inline map (embedded in modal) ─────────────────────── */
function InlineMap({ lat, lng, onCoordinateChange }) {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const defaultLat = lat || 10.850518;
        const defaultLng = lng || 76.271080;
        const defaultZoom = (lat && lng) ? 15 : 7;

        const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], defaultZoom);
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        setTimeout(() => map.invalidateSize(), 100);
        setTimeout(() => map.invalidateSize(), 500);

        if (lat && lng) {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                onCoordinateChange(pos.lat, pos.lng);
            });
        }

        map.on('click', (e) => {
            const { lat: cLat, lng: cLng } = e.latlng;
            placeMarker(cLat, cLng, map);
        });

        return () => { map.remove(); };
    }, []);

    // Sync marker/view when lat/lng props change externally (e.g. from fullscreen overlay)
    useEffect(() => {
        if (!mapRef.current || lat == null || lng == null) return;
        const map = mapRef.current;

        if (!markerRef.current) {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                onCoordinateChange(pos.lat, pos.lng);
            });
        } else {
            markerRef.current.setLatLng([lat, lng]);
        }
        map.setView([lat, lng], Math.max(map.getZoom(), 15));
    }, [lat, lng]);

    const placeMarker = (newLat, newLng, map) => {
        if (!markerRef.current) {
            markerRef.current = L.marker([newLat, newLng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                onCoordinateChange(pos.lat, pos.lng);
            });
        } else {
            markerRef.current.setLatLng([newLat, newLng]);
        }
        map.setView([newLat, newLng], 15);
        onCoordinateChange(newLat, newLng);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 3) searchNominatim(query);
            else { setSuggestions([]); setNoResults(false); setShowDropdown(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const searchNominatim = async (q) => {
        setIsSearching(true); setNoResults(false);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`);
            const data = await res.json();
            setSuggestions(data.length ? data : []);
            setNoResults(data.length === 0);
            setShowDropdown(true);
        } catch { setSuggestions([]); setShowDropdown(false); }
        finally { setIsSearching(false); }
    };

    const handleSuggestionClick = (s) => {
        const sLat = parseFloat(s.lat), sLng = parseFloat(s.lon);
        setQuery(s.display_name);
        setShowDropdown(false);
        if (mapRef.current) placeMarker(sLat, sLng, mapRef.current);
    };

    return (
        <div className="location-picker">
            <div className="location-search-container">
                <input
                    type="text" value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
                    placeholder="Search for a place to pin on map..."
                    className="location-search-input"
                />
                {showDropdown && (
                    <div className="location-suggestions">
                        {isSearching && <div className="suggestion-item text-muted">Searching...</div>}
                        {!isSearching && noResults && <div className="suggestion-item text-muted">No results found</div>}
                        {!isSearching && suggestions.map((s, i) => (
                            <div key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>{s.display_name}</div>
                        ))}
                    </div>
                )}
            </div>
            <div ref={mapContainerRef} className="map-container" />
        </div>
    );
}

/* ─── Fullscreen map overlay (portal) ──────────────────────────── */
function FullscreenMapOverlay({ lat, lng, onConfirm, onClose }) {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const markerRef = useRef(null);
    const [pendingLat, setPendingLat] = useState(lat);
    const [pendingLng, setPendingLng] = useState(lng);

    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [noResults, setNoResults] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const defaultLat = lat || 10.850518;
        const defaultLng = lng || 76.271080;
        const defaultZoom = (lat && lng) ? 15 : 7;

        const map = L.map(mapContainerRef.current).setView([defaultLat, defaultLng], defaultZoom);
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20
        }).addTo(map);

        setTimeout(() => map.invalidateSize(), 100);

        if (lat && lng) {
            markerRef.current = L.marker([lat, lng], { draggable: true }).addTo(map);
            markerRef.current.on('dragend', (e) => {
                const pos = e.target.getLatLng();
                setPendingLat(pos.lat);
                setPendingLng(pos.lng);
            });
        }

        map.on('click', (e) => {
            const { lat: cLat, lng: cLng } = e.latlng;
            if (!markerRef.current) {
                markerRef.current = L.marker([cLat, cLng], { draggable: true }).addTo(map);
                markerRef.current.on('dragend', (ev) => {
                    const pos = ev.target.getLatLng();
                    setPendingLat(pos.lat);
                    setPendingLng(pos.lng);
                });
            } else {
                markerRef.current.setLatLng([cLat, cLng]);
            }
            map.setView([cLat, cLng], Math.max(map.getZoom(), 15));
            setPendingLat(cLat);
            setPendingLng(cLng);
        });

        // Close on Escape
        const handleEsc = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handleEsc);

        return () => { map.remove(); window.removeEventListener('keydown', handleEsc); };
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.length >= 3) searchNominatim(query);
            else { setSuggestions([]); setNoResults(false); setShowDropdown(false); }
        }, 400);
        return () => clearTimeout(timer);
    }, [query]);

    const searchNominatim = async (q) => {
        setIsSearching(true); setNoResults(false);
        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=5&addressdetails=1`);
            const data = await res.json();
            setSuggestions(data.length ? data : []);
            setNoResults(data.length === 0);
            setShowDropdown(true);
        } catch { setSuggestions([]); setShowDropdown(false); }
        finally { setIsSearching(false); }
    };

    const handleSuggestionClick = (s) => {
        const sLat = parseFloat(s.lat), sLng = parseFloat(s.lon);
        setQuery(s.display_name);
        setShowDropdown(false);
        if (mapRef.current) {
            if (!markerRef.current) {
                markerRef.current = L.marker([sLat, sLng], { draggable: true }).addTo(mapRef.current);
                markerRef.current.on('dragend', (e) => {
                    const pos = e.target.getLatLng();
                    setPendingLat(pos.lat);
                    setPendingLng(pos.lng);
                });
            } else {
                markerRef.current.setLatLng([sLat, sLng]);
            }
            mapRef.current.setView([sLat, sLng], 15);
        }
        setPendingLat(sLat);
        setPendingLng(sLng);
    };

    const handleConfirm = () => {
        if (pendingLat != null && pendingLng != null) {
            onConfirm(pendingLat, pendingLng);
        }
        onClose();
    };

    return ReactDOM.createPortal(
        <div className="fullscreen-map-overlay" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
            <div className="fullscreen-map-panel">
                <div className="fullscreen-map-header">
                    <h3 style={{ margin: 0 }}>Pin Project Location</h3>
                    <button className="fullscreen-map-close" onClick={onClose}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                </div>

                <div className="fullscreen-map-search">
                    <input
                        type="text" value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => { if (suggestions.length) setShowDropdown(true); }}
                        placeholder="Search for an address or place..."
                        className="location-search-input"
                        autoFocus
                    />
                    {showDropdown && (
                        <div className="location-suggestions">
                            {isSearching && <div className="suggestion-item text-muted">Searching...</div>}
                            {!isSearching && noResults && <div className="suggestion-item text-muted">No results found</div>}
                            {!isSearching && suggestions.map((s, i) => (
                                <div key={i} className="suggestion-item" onClick={() => handleSuggestionClick(s)}>{s.display_name}</div>
                            ))}
                        </div>
                    )}
                </div>

                <div ref={mapContainerRef} className="fullscreen-map-body" />

                {pendingLat != null && pendingLng != null && (
                    <div className="fullscreen-map-coords">
                        📍 {pendingLat.toFixed(6)}, {pendingLng.toFixed(6)}
                    </div>
                )}

                <div className="fullscreen-map-footer">
                    <button className="btn secondary" onClick={onClose}>Cancel</button>
                    <button
                        className="btn primary"
                        onClick={handleConfirm}
                        disabled={pendingLat == null}
                    >
                        Confirm Location
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}

/* ─── Main LocationPicker export ───────────────────────────────── */
export default function LocationPicker({ lat, lng, onChange }) {
    const [showFullscreen, setShowFullscreen] = useState(false);

    const handleCoordinateChange = useCallback((newLat, newLng) => {
        onChange(newLat, newLng);
    }, [onChange]);

    const handleFullscreenConfirm = useCallback((newLat, newLng) => {
        onChange(newLat, newLng);
    }, [onChange]);

    return (
        <>
            <InlineMap lat={lat} lng={lng} onCoordinateChange={handleCoordinateChange} />

            <button
                type="button"
                className="map-enlarge-btn"
                onClick={() => setShowFullscreen(true)}
            >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <polyline points="9 21 3 21 3 15"></polyline>
                    <line x1="21" y1="3" x2="14" y2="10"></line>
                    <line x1="3" y1="21" x2="10" y2="14"></line>
                </svg>
                Open Large Map
            </button>

            {showFullscreen && (
                <FullscreenMapOverlay
                    lat={lat}
                    lng={lng}
                    onConfirm={handleFullscreenConfirm}
                    onClose={() => setShowFullscreen(false)}
                />
            )}
        </>
    );
}
