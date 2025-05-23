import React from 'react';
import JapanMap from './components/JapanMap';

function App() {
  return (
    <div>
      <h2 style={{ textAlign: 'center', padding: '1rem' }}>
        {/* 日本のCO2排出モック地図（簡素版） */}
      </h2>
      <JapanMap />
    </div>
  );
}

export default App;
