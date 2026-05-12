import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';;

function ProgressChart({ refresh }) {
  const [exercises, setExercises] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [refresh]);

  useEffect(() => {
    if (selectedExercise) {
      fetchProgress(selectedExercise);
    }
  }, [selectedExercise, refresh]);

  const fetchExercises = async () => {
    try {
      const response = await fetch(`${API_URL}/workouts`);
      const data = await response.json();
      
      // Get unique exercises
      const uniqueExercises = [...new Set((data.workouts || []).map(w => w.exercise))];
      setExercises(uniqueExercises);
      
      if (uniqueExercises.length > 0 && !selectedExercise) {
        setSelectedExercise(uniqueExercises[0]);
      }
    } catch (error) {
      console.error('Error fetching exercises:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProgress = async (exercise) => {
    try {
      const response = await fetch(`${API_URL}/progress/${encodeURIComponent(exercise)}`);
      const data = await response.json();
      setChartData(data.progress || []);
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <div>
        <h2 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>
          📈 Progress Chart
        </h2>
        <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px' }}>
          Log some workouts to see your progress!
        </p>
      </div>
    );
  }

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <h2 style={{ fontSize: '1.5rem', margin: 0 }}>
          📈 Progress Chart
        </h2>
        
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          style={{
            padding: '10px 15px',
            borderRadius: '8px',
            border: '2px solid rgba(255, 255, 255, 0.2)',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          {exercises.map((exercise, index) => (
            <option key={index} value={exercise} style={{ background: '#667eea', color: 'white' }}>
              {exercise}
            </option>
          ))}
        </select>
      </div>

      {chartData.length === 0 ? (
        <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px' }}>
          No data for this exercise yet.
        </p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="rgba(255,255,255,0.6)"
              style={{ fontSize: '0.85rem' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.6)"
              style={{ fontSize: '0.85rem' }}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'rgba(102, 126, 234, 0.9)', 
                border: 'none',
                borderRadius: '8px',
                color: 'white'
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'white' }}
            />
            <Line 
              type="monotone" 
              dataKey="estimated_1rm" 
              stroke="#a8edea" 
              strokeWidth={3}
              dot={{ fill: '#a8edea', r: 5 }}
              activeDot={{ r: 8 }}
              name="Est. 1RM (kg)"
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ProgressChart;
