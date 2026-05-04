import React, { useState, useEffect } from 'react';
import WorkoutForm from '../components/WorkoutForm';
import PersonalRecords from '../components/PersonalRecords';
import WorkoutHistory from '../components/WorkoutHistory';
import StatsCards from '../components/StatsCards';
import ProgressChart from '../components/ProgressChart';
import UnitConverter from '../components/UnitConverter';

const API_URL = 'http://localhost:5000/api';

function Dashboard() {
  const [stats, setStats] = useState({
    total_workouts: 0,
    total_volume_display: '0.00 kg (0.00 lbs)',
    exercises_tracked: 0
  });
  const [refresh, setRefresh] = useState(0);
  const [showConverter, setShowConverter] = useState(false);

  // Fetch stats on load and when refresh changes
  useEffect(() => {
    fetchStats();
  }, [refresh]);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleWorkoutLogged = () => {
    // Trigger refresh when new workout is logged
    setRefresh(prev => prev + 1);
  };

  return (
    <div className="container">
      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Main Grid */}
      <div className="grid grid-2" style={{ marginTop: '30px' }}>
        {/* Workout Form */}
        <div className="glass-card fade-in">
          <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
            📝 Log Workout
          </h2>
          <WorkoutForm onWorkoutLogged={handleWorkoutLogged} />
          
          <button 
            className="btn btn-secondary" 
            style={{ width: '100%', marginTop: '15px' }}
            onClick={() => setShowConverter(!showConverter)}
          >
            🔄 Unit Converter
          </button>

          {showConverter && (
            <div style={{ marginTop: '20px' }}>
              <UnitConverter />
            </div>
          )}
        </div>

        {/* Personal Records */}
        <div className="glass-card fade-in" style={{ animationDelay: '0.1s' }}>
          <PersonalRecords refresh={refresh} />
        </div>
      </div>

      {/* Progress Chart */}
      <div className="glass-card fade-in" style={{ marginTop: '30px', animationDelay: '0.2s' }}>
        <ProgressChart refresh={refresh} />
      </div>

      {/* Workout History */}
      <div className="glass-card fade-in" style={{ marginTop: '30px', animationDelay: '0.3s' }}>
        <WorkoutHistory refresh={refresh} />
      </div>
    </div>
  );
}

export default Dashboard;