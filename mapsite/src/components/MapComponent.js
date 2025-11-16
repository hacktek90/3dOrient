import React, { useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polygon, Polyline, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Base layer configurations
const baseLayers = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors'
  }
};

// Component to handle map clicks and interactions
function MapInteraction({ mapMode, onAddMarker, onAddDrawing }) {
  const [points, setPoints] = useState([]);

  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      
      if (mapMode === 'marker') {
        onAddMarker({ lat, lng, id: Date.now() });
      } else if (mapMode === 'circle') {
        onAddDrawing({
          type: 'circle',
          center: [lat, lng],
          radius: 50000,
          id: Date.now()
        });
      } else if (mapMode === 'polygon') {
        const newPoints = [...points, [lat, lng]];
        setPoints(newPoints);
        if (newPoints.length >= 3) {
          onAddDrawing({
            type: 'polygon',
            positions: newPoints,
            id: Date.now()
          });
          setPoints([]);
        }
      } else if (mapMode === 'polyline') {
        const newPoints = [...points, [lat, lng]];
        setPoints(newPoints);
        if (newPoints.length >= 2) {
          onAddDrawing({
            type: 'polyline',
            positions: newPoints,
            id: Date.now()
          });
          setPoints([]);
        }
      }
    }
  });

  return null;
}

// Component to handle geolocation
function GeolocationButton() {
  const map = useMap();
  const [userLocation, setUserLocation] = useState(null);

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation([latitude, longitude]);
          map.flyTo([latitude, longitude], 13);
        },
        (error) => {
          alert('Unable to retrieve your location: ' + error.message);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <>
      <div className="leaflet-top leaflet-right" style={{ marginTop: '80px' }}>
        <div className="leaflet-control leaflet-bar">
          <button
            onClick={handleGeolocation}
            className="bg-white hover:bg-gray-100 p-2 rounded shadow-md border-2 border-gray-300"
            style={{ width: '34px', height: '34px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            title="Find my location"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <circle cx="12" cy="12" r="3"></circle>
            </svg>
          </button>
        </div>
      </div>
      {userLocation && (
        <Circle
          center={userLocation}
          radius={500}
          pathOptions={{ color: '#3b82f6', fillColor: '#3b82f6', fillOpacity: 0.3 }}
        />
      )}
    </>
  );
}

// Search component
function SearchControl() {
  const map = useMap();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        const { lat, lon, display_name } = data[0];
        map.flyTo([parseFloat(lat), parseFloat(lon)], 13);
        
        L.popup()
          .setLatLng([parseFloat(lat), parseFloat(lon)])
          .setContent(`<strong>${display_name}</strong>`)
          .openOn(map);
      } else {
        alert('Location not found');
      }
    } catch (error) {
      alert('Search failed: ' + error.message);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="leaflet-top leaflet-left" style={{ marginTop: '10px', marginLeft: '50px' }}>
      <div className="leaflet-control">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search location..."
            className="px-3 py-2 rounded shadow-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
            style={{ width: '250px' }}
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow-md disabled:opacity-50"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </form>
      </div>
    </div>
  );
}

function MapComponent({ mapMode, baseLayer, showMarkers, showDrawings }) {
  const [markers, setMarkers] = useState([]);
  const [drawings, setDrawings] = useState([]);
  const mapRef = useRef();

  const handleAddMarker = (marker) => {
    setMarkers([...markers, marker]);
  };

  const handleAddDrawing = (drawing) => {
    setDrawings([...drawings, drawing]);
  };

  const handleRemoveMarker = (id) => {
    setMarkers(markers.filter(m => m.id !== id));
  };

  const handleRemoveDrawing = (id) => {
    setDrawings(drawings.filter(d => d.id !== id));
  };

  return (
    <MapContainer
      center={[40.7128, -74.0060]}
      zoom={10}
      style={{ height: '100%', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url={baseLayers[baseLayer].url}
        attribution={baseLayers[baseLayer].attribution}
      />

      <MapInteraction
        mapMode={mapMode}
        onAddMarker={handleAddMarker}
        onAddDrawing={handleAddDrawing}
      />

      <GeolocationButton />
      <SearchControl />

      {showMarkers && markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>
            <div>
              <p className="font-semibold">Marker</p>
              <p className="text-sm">Lat: {marker.lat.toFixed(4)}</p>
              <p className="text-sm">Lng: {marker.lng.toFixed(4)}</p>
              <button
                onClick={() => handleRemoveMarker(marker.id)}
                className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
              >
                Remove
              </button>
            </div>
          </Popup>
        </Marker>
      ))}

      {showDrawings && drawings.map((drawing) => {
        if (drawing.type === 'circle') {
          return (
            <Circle
              key={drawing.id}
              center={drawing.center}
              radius={drawing.radius}
              pathOptions={{ color: '#8b5cf6', fillColor: '#8b5cf6', fillOpacity: 0.3 }}
            >
              <Popup>
                <div>
                  <p className="font-semibold">Circle</p>
                  <p className="text-sm">Radius: {(drawing.radius / 1000).toFixed(2)} km</p>
                  <button
                    onClick={() => handleRemoveDrawing(drawing.id)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Circle>
          );
        } else if (drawing.type === 'polygon') {
          return (
            <Polygon
              key={drawing.id}
              positions={drawing.positions}
              pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.3 }}
            >
              <Popup>
                <div>
                  <p className="font-semibold">Polygon</p>
                  <p className="text-sm">Points: {drawing.positions.length}</p>
                  <button
                    onClick={() => handleRemoveDrawing(drawing.id)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Polygon>
          );
        } else if (drawing.type === 'polyline') {
          return (
            <Polyline
              key={drawing.id}
              positions={drawing.positions}
              pathOptions={{ color: '#f59e0b', weight: 4 }}
            >
              <Popup>
                <div>
                  <p className="font-semibold">Polyline</p>
                  <p className="text-sm">Points: {drawing.positions.length}</p>
                  <button
                    onClick={() => handleRemoveDrawing(drawing.id)}
                    className="mt-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                  >
                    Remove
                  </button>
                </div>
              </Popup>
            </Polyline>
          );
        }
        return null;
      })}
    </MapContainer>
  );
}

export default MapComponent;
