import React, { Suspense } from 'react';
import './App.css';
import VideoCall from './VideoCall';
import Avatar from './Avatar';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>ISL Translator</h1>
      </header>
      <main className="main-content">
        <div className="video-section">
          <VideoCall />
        </div>
        <div className="avatar-section">
          <Suspense fallback={<div className="avatar-loading">Loading 3D Model...</div>}>
            <Avatar />
          </Suspense>
        </div>
      </main>
    </div>
  );
}

export default App;
