import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function GeofencePreviewMap({ radius, enforceGps }) {
    const mapRef = useRef(null);
    const mapContainerRef = useRef(null);
    const circleRef = useRef(null);
    const markerRef = useRef(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        const defaultLat = 10.850518;
        const defaultLng = 76.271080;

        const map = L.map(mapContainerRef.current, {
            zoomControl: false,
            attributionControl: false
        }).setView([defaultLat, defaultLng], 15);
        mapRef.current = map;

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 20
        }).addTo(map);

        setTimeout(() => map.invalidateSize(), 200);

        markerRef.current = L.marker([defaultLat, defaultLng]).addTo(map);
        circleRef.current = L.circle([defaultLat, defaultLng], {
            color: enforceGps ? '#2563eb' : '#94a3b8',
            fillColor: enforceGps ? '#3b82f6' : '#cbd5e1',
            fillOpacity: 0.25,
            radius: radius || 200
        }).addTo(map);

        return () => {
            map.remove();
        };
    }, []);

    useEffect(() => {
        if (!circleRef.current) return;
        circleRef.current.setRadius(radius || 200);
        circleRef.current.setStyle({
            color: enforceGps ? '#2563eb' : '#94a3b8',
            fillColor: enforceGps ? '#3b82f6' : '#cbd5e1',
        });
    }, [radius, enforceGps]);

    return (
        <div style={{ position: 'relative', width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
            <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
            <div style={{
                position: 'absolute',
                bottom: '8px',
                left: '8px',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '11px',
                fontWeight: 600,
                color: enforceGps ? 'var(--accent-blue)' : 'var(--text-muted)',
                zIndex: 1000
            }}>
                📍 Geofence Radius: {radius || 200} meters {enforceGps ? '(Active)' : '(Enforcement Off)'}
            </div>
        </div>
    );
}
