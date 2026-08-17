import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
const customIcon = L.divIcon({
  html: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#1B3A6B" stroke="#1B3A6B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="white"></circle></svg>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});
L.Marker.prototype.options.icon = customIcon;

export default function LeafletMap({ type = 'pin', center = [51.505, -0.09], zoom = 13, points = [] }) {
  if (type === 'route' && points.length > 0) {
    return (
      <MapContainer center={points[0]} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={points} color="#1B3A6B" weight={3} />
        {points.map((p, i) => (
          <Marker key={i} position={p} />
        ))}
      </MapContainer>
    );
  }

  return (
    <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%', borderRadius: 'inherit' }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} />
    </MapContainer>
  );
}
