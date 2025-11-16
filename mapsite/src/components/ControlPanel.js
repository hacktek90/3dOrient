import React from 'react';

function ControlPanel({ 
  mapMode, 
  setMapMode, 
  baseLayer, 
  setBaseLayer, 
  showMarkers, 
  setShowMarkers,
  showDrawings,
  setShowDrawings 
}) {
  const modes = [
    { id: 'view', name: 'View Mode', description: 'Pan and zoom the map' },
    { id: 'marker', name: 'Add Marker', description: 'Click to place markers' },
    { id: 'circle', name: 'Draw Circle', description: 'Click to draw circles' },
    { id: 'polygon', name: 'Draw Polygon', description: 'Click 3+ points to create polygon' },
    { id: 'polyline', name: 'Draw Line', description: 'Click 2+ points to draw line' },
  ];

  const layers = [
    { id: 'street', name: 'Street Map' },
    { id: 'satellite', name: 'Satellite' },
    { id: 'terrain', name: 'Terrain' },
  ];

  return (
    <div className="w-80 bg-gray-800 text-white shadow-2xl overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Map Mode Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-blue-400">Map Tools</h2>
          <div className="space-y-2">
            {modes.map((mode) => (
              <button
                key={mode.id}
                onClick={() => setMapMode(mode.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  mapMode === mode.id
                    ? 'bg-blue-600 shadow-lg transform scale-105'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{mode.name}</div>
                <div className="text-xs text-gray-300 mt-1">{mode.description}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Base Layer Section */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-green-400">Map Layers</h2>
          <div className="space-y-2">
            {layers.map((layer) => (
              <button
                key={layer.id}
                onClick={() => setBaseLayer(layer.id)}
                className={`w-full text-left p-3 rounded-lg transition-all ${
                  baseLayer === layer.id
                    ? 'bg-green-600 shadow-lg transform scale-105'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                <div className="font-semibold">{layer.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Visibility Toggles */}
        <div>
          <h2 className="text-xl font-bold mb-4 text-purple-400">Layer Visibility</h2>
          <div className="space-y-3">
            <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
              <span className="font-semibold">Show Markers</span>
              <input
                type="checkbox"
                checked={showMarkers}
                onChange={(e) => setShowMarkers(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
            <label className="flex items-center justify-between p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600">
              <span className="font-semibold">Show Drawings</span>
              <input
                type="checkbox"
                checked={showDrawings}
                onChange={(e) => setShowDrawings(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
            </label>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-yellow-400">Instructions</h3>
          <ul className="text-sm space-y-2 text-gray-300">
            <li>• Use the search bar to find locations</li>
            <li>• Click the location button to find yourself</li>
            <li>• Select a tool and click on the map</li>
            <li>• Click markers/shapes for more options</li>
            <li>• Toggle layers to show/hide features</li>
          </ul>
        </div>

        {/* Features List */}
        <div className="bg-gradient-to-br from-blue-900 to-purple-900 p-4 rounded-lg">
          <h3 className="font-bold mb-2 text-blue-300">Features</h3>
          <ul className="text-sm space-y-1 text-gray-200">
            <li>✓ Interactive map navigation</li>
            <li>✓ Multiple base layers</li>
            <li>✓ Marker placement</li>
            <li>✓ Drawing tools</li>
            <li>✓ Geolocation support</li>
            <li>✓ Location search</li>
            <li>✓ Layer management</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ControlPanel;
