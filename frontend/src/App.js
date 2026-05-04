import React from 'react';
import './App.css';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div className="App">
      <header className="app-header">
        <span className="emoji">💪</span>
        <h1>STRENGTH ANALYTICS</h1>
        <p className="subtitle">Track Your Power, Visualize Your Progress</p>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;