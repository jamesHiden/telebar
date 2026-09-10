'use client';

import { useEffect, useRef, useState } from 'react';
import 'leaflet/dist/leaflet.css';

const ISFAHAN_CENTER = [32.6546, 51.668];

export default function LocationPicker({ lat, lng, onChange }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [locating, setLocating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return;

      const startLat = lat ?? ISFAHAN_CENTER[0];
      const startLng = lng ?? ISFAHAN_CENTER[1];

      const map = L.map(containerRef.current).setView([startLat, startLng], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      const pinIcon = L.divIcon({
        html: '<div style="font-size:28px;line-height:28px;transform:translateY(-6px);">📍</div>',
        className: '',
        iconSize: [28, 28],
        iconAnchor: [14, 28],
      });

      const marker = L.marker([startLat, startLng], { draggable: true, icon: pinIcon }).addTo(map);
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        onChange(pos.lat, pos.lng);
      });

      map.on('click', (e) => {
        marker.setLatLng(e.latlng);
        onChange(e.latlng.lat, e.latlng.lng);
      });

      mapRef.current = map;
      markerRef.current = marker;

      if (lat == null || lng == null) {
        onChange(startLat, startLng);
      }
    });

    return () => {
      cancelled = true;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function useMyLocation() {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        if (mapRef.current && markerRef.current) {
          mapRef.current.setView([latitude, longitude], 16);
          markerRef.current.setLatLng([latitude, longitude]);
        }
        onChange(latitude, longitude);
        setLocating(false);
      },
      () => setLocating(false),
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-[var(--muted)]">روی نقشه بزنید یا پین رو جابه‌جا کنید تا لوکیشن دقیق مغازه رو مشخص کنید</span>
        <button
          type="button"
          onClick={useMyLocation}
          className="text-xs text-[var(--brand)] border border-[var(--brand)] rounded-full px-3 py-1 hover:bg-[var(--brand-light)] transition shrink-0"
        >
          {locating ? 'در حال یافتن...' : '📍 موقعیت من'}
        </button>
      </div>
      <div ref={containerRef} className="w-full h-64 rounded-lg border border-[var(--border)]" />
    </div>
  );
}
