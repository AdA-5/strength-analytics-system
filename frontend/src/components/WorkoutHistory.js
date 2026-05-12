import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';;

function WorkoutHistory({ refresh }) {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, [refresh]);

  const fetchWorkouts = async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      const data = await response.json();
      
      // Get last 10 workouts
      const last10 = (data.workouts || [])
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 10);
      
      setWorkouts(last10);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
        📜 Recent Workouts (Last 10)
      </h2>

      {workouts.length === 0 ? (
        <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px' }}>
          No workout history yet. Start logging!
        </p>
      ) : (
        <div className="grid grid-2">
          {workouts.map((workout, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}
            >
              <div style={{ 
                fontSize: '0.85rem', 
                opacity: 0.6, 
                marginBottom: '8px' 
              }}>
                {new Date(workout.timestamp).toLocaleString()}
              </div>
              
              <div style={{ 
                fontSize: '1.1rem', 
                fontWeight: 'bold', 
                marginBottom: '8px' 
              }}>
                {workout.exercise}
              </div>
              
              <div style={{ fontSize: '0.95rem' }}>
                {workout.weight_display} {workout.unit_used} × {workout.reps} reps
              </div>
              
              <div style={{ 
                fontSize: '0.9rem', 
                marginTop: '8px',
                opacity: 0.8 
              }}>
                Volume: {workout.volume.toFixed(2)} kg
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default WorkoutHistory;
