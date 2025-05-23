import React, { useState } from 'react';
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

// Hierarchical data: Prefectures, Cities, Wards, etc.
const data = {
  Japan: [
    {
      name: '北海道',
      lat: 43.0642,
      lng: 141.3469,
      cities: [
        { name: '札幌市', lat: 43.0618, lng: 141.3545 },
        // Add more cities here
      ],
    },
    {
      name: '東京都',
      lat: 35.6895,
      lng: 139.6917,
      cities: [
        { name: '新宿区', lat: 35.6938, lng: 139.7034 },
        // Add more cities here
      ],
    },
    {
      name: '大阪府',
      lat: 34.6937,
      lng: 135.5023,
      cities: [
        { name: '大阪市', lat: 34.6937, lng: 135.5023 },
        // Add more cities here
      ],
    },
  ],
};

// Component to change map view on click
function ZoomTo({ position, zoomLevel }) {
  const map = useMap();
  map.setView(position, zoomLevel);
  return null;
}

export default function JapanMap() {
  const [currentLevel, setCurrentLevel] = useState('Japan');
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [zoomTarget, setZoomTarget] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(5);

  const handleMarkerClick = (region, level, zoom) => {
    setSelectedRegion(region);
    setCurrentLevel(level);
    setZoomTarget([region.lat, region.lng]);
    setZoomLevel(zoom);
  };

  const renderMarkers = () => {
    if (currentLevel === 'Japan') {
      return data.Japan.map((pref, index) => (
        <Marker
          key={index}
          position={[pref.lat, pref.lng]}
          eventHandlers={{
            click: () => handleMarkerClick(pref, 'Prefecture', 8),
          }}
        >
          <Popup>{pref.name}（クリックでズーム）</Popup>
        </Marker>
      ));
    } else if (currentLevel === 'Prefecture' && selectedRegion) {
      return selectedRegion.cities.map((city, index) => (
        <Marker
          key={index}
          position={[city.lat, city.lng]}
          eventHandlers={{
            click: () => handleMarkerClick(city, 'City', 12),
          }}
        >
          <Popup>{city.name}（クリックでズーム）</Popup>
        </Marker>
      ));
    }
    return null;
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ flex: 1 }}>
        <MapContainer
          center={[36.2048, 138.2529]} // Japan center
          zoom={zoomLevel}
          scrollWheelZoom={true}
          style={{ height: '100vh', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {renderMarkers()}

          {zoomTarget && <ZoomTo position={zoomTarget} zoomLevel={zoomLevel} />}
        </MapContainer>
      </div>
      <div style={{ flex: 1, padding: '10px', borderLeft: '1px solid #ccc' }}>
        {selectedRegion ? (
          <div>
            <h2>{selectedRegion.name}のデータ</h2>
            <p>ここにグラフを表示します。</p>
          </div>
        ) : (
          <p>地域を選択してください。</p>
        )}
      </div>
    </div>
  );
}
