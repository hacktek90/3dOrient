import React, { useState } from 'react';
import './App.css';
import MapComponent from './components/MapComponent';
import ControlPanel from './components/ControlPanel';

function App() {
  const [mapMode, setMapMode] = useState('view');
  const [baseLayer, setBaseLayer] = useState('street');
  const [showMarkers, setShowMarkers] = useState(true);
  const [showDrawings, setShowDrawings] = useState(true);

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg z-10">
        <div className="px-6 py-4">
          <h1 className="text-3xl font-bold">Interactive Map Site</h1>
          <p className="text-blue-100 text-sm mt-1">Explore, Draw, Measure & Navigate</p>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Control Panel */}
        <ControlPanel
          mapMode={mapMode}
          setMapMode={setMapMode}
          baseLayer={baseLayer}
          setBaseLayer={setBaseLayer}
          showMarkers={showMarkers}
          setShowMarkers={setShowMarkers}
          showDrawings={showDrawings}
          setShowDrawings={setShowDrawings}
        />

        {/* Map */}
        <div className="flex-1 relative">
          <MapComponent
            mapMode={mapMode}
            baseLayer={baseLayer}
            showMarkers={showMarkers}
            showDrawings={showDrawings}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
