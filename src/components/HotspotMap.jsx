import { useEffect, useRef } from 'react';
import { getAdminUnitCentroid } from '../services/geocoding';

const DEFAULT_CENTER = { lat: 17.705, lng: 83.22 };
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
  const circlesRef = useRef([]);
  const infoWindowRef = useRef(null);

  // Initialize Map
  useEffect(() => {
    if (!containerRef.current || mapRef.current || !window.google) return;

    const map = new window.google.maps.Map(containerRef.current, {
      center: DEFAULT_CENTER,
      zoom: DEFAULT_ZOOM,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#f0edec' }],
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#cfe3ea' }],
        },
      ],
    });

    mapRef.current = map;
    infoWindowRef.current = new window.google.maps.InfoWindow();

    return () => {
      mapRef.current = null;
    };
  }, []);

  // Update Features (Circles)
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !window.google) return;

    // Clear old circles
    circlesRef.current.forEach((circle) => circle.setMap(null));
    circlesRef.current = [];

    const bounds = new window.google.maps.LatLngBounds();

    features.forEach((f) => {
      const [lng, lat] = f.geometry.coordinates;
      const { density, submission_count, label } = f.properties;
      const center = { lat, lng };

      bounds.extend(center);

      // Create google circle marker
      const circle = new window.google.maps.Circle({
        strokeColor: '#FFFFFF',
        strokeOpacity: 0.9,
        strokeWeight: 1.5,
        fillColor: densityColor(density),
        fillOpacity: 0.35 + density * 0.45,
        map: map,
        center: center,
        radius: 150 + density * 300, // radius in meters
      });

      // Bind click listener for popups
      circle.addListener('click', () => {
        if (infoWindowRef.current) {
          infoWindowRef.current.setContent(
            `<div style="color: #1c1b1b; padding: 4px; font-family: sans-serif;">
              <strong style="font-size: 13px;">${label || 'Hotspot'}</strong><br/>
              <span style="font-size: 11px; color: #41484a;">Density: ${density.toFixed(2)}</span><br/>
              <span style="font-size: 11px; color: #41484a;">Submissions: ${submission_count}</span>
            </div>`
          );
          infoWindowRef.current.setPosition(center);
          infoWindowRef.current.open(map);
        }
      });

      circlesRef.current.push(circle);
    });

    if (features.length > 0) {
      map.fitBounds(bounds);
    }
  }, [features]);

  // Handle Ward centroid changes
  useEffect(() => {
    if (!selectedWard || !mapRef.current || !window.google) return;
    const centroid = getAdminUnitCentroid(selectedWard);
    if (centroid) {
      mapRef.current.setCenter({ lat: centroid.lat, lng: centroid.lng });
      mapRef.current.setZoom(14);
    }
  }, [selectedWard]);

  return <div ref={containerRef} className="w-full h-full min-h-[400px] rounded-b-2xl z-0" />;
}
