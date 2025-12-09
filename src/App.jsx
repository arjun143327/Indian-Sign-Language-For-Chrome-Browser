import React from 'react';
import './App.css';
import VideoCall from './VideoCall';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <h1>ISL Translator</h1>
      </header>
      <main>
        <VideoCall />
      </main>
    </div>
  );
}

export default App;
