import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Dummy data: Prefectures with center coordinates
const prefectures = [
  { name: '北海道', lat: 43.0642, lng: 141.3469 },
  { name: '東京都', lat: 35.6895, lng: 139.6917 },
  { name: '大阪府', lat: 34.6937, lng: 135.5023 },
];

// Dummy data: Cities
const cities = [
  { name: '札幌市', lat: 43.0618, lng: 141.3545 },
  { name: '新宿区', lat: 35.6938, lng: 139.7034 },
  { name: '大阪市', lat: 34.6937, lng: 135.5023 },
];

// Component to change map view on prefecture click
function ZoomTo({ position }) {
  const map = useMap();
  map.setView(position, 10);
  return null;
}

export default function JapanMap() {
  const [zoomTarget, setZoomTarget] = React.useState(null);

  return (
    <div>
      <MapContainer
        center={[36.2048, 138.2529]} // Japan center
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100vh', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {prefectures.map((pref, index) => (
          <Marker
            key={index}
            position={[pref.lat, pref.lng]}
            eventHandlers={{
              click: () => setZoomTarget([pref.lat, pref.lng]),
            }}
          >
            <Popup>{pref.name}（クリックでズーム）</Popup>
          </Marker>
        ))}

        {cities.map((city, index) => (
          <Marker key={index} position={[city.lat, city.lng]}>
            <Popup>{city.name}（ダミーデータ）</Popup>
          </Marker>
        ))}

        {zoomTarget && <ZoomTo position={zoomTarget} />}
      </MapContainer>
    </div>
  );
}
