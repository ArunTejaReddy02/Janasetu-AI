import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getAdminUnitCentroid } from '../services/geocoding';

const DEFAULT_CENTER = [17.705, 83.22];
const DEFAULT_ZOOM = 12;

function densityColor(density) {
  if (density > 0.8) return '#ba1a1a';
  if (density > 0.5) return '#c62828';
  if (density > 0.3) return '#46636a';
  return '#819fa7';
}

export default function HotspotMap({ features = [], selectedWard = null }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const layerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (layerRef.current) {
      map.removeLayer(layerRef.current);
      layerRef.current = null;
    }

    const group = L.layerGroup();

    features.forEach((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const { density, submission_count, label } = f.properties;
      const radius = 8 + density * 24;

      L.circleMarker([lat, lng], {
        radius,
        fillColor: densityColor(density),
        color: '#fff',
        weight: 2,
        opacity: 0.9,
        fillOpacity: 0.35 + density * 0.45,
      })
        .bindPopup(
          `<strong>${label || 'Hotspot'}</strong><br/>Density: ${density.toFixed(2)}<br/>Submissions: ${submission_count}`
        )
        .addTo(group);
    });

    group.addTo(map);
    layerRef.current = group;

    if (features.length > 0) {
      const bounds = L.latLngBounds(features.map((f) => [f.geometry.coordinates[1], f.geometry.coordinates[0]]));
      map.fitBounds(bounds.pad(0.15));
    }
  }, [features]);

  useEffect(() => {
    if (!selectedWard || !mapRef.current) return;
    const centroid = getAdminUnitCentroid(selectedWard);
    if (centroid) {
      mapRef.current.setView([centroid.lat, centroid.lng], 14);
    }
  }, [selectedWard]);

  return <div ref={containerRef} className="w-full h-full min-h-[400px] rounded-b-2xl z-0" />;
}
