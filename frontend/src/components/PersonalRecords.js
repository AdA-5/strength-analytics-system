import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';;

function PersonalRecords({ refresh }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecords();
  }, [refresh]);

  const fetchRecords = async () => {
    try {
      const response = await fetch(`${API_URL}/personal-records`);
      const data = await response.json();
      setRecords(data.records || []);
    } catch (error) {
      console.error('Error fetching PRs:', error);
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
        🏆 Personal Records
      </h2>

      {records.length === 0 ? (
        <p style={{ opacity: 0.7, textAlign: 'center', padding: '20px' }}>
          No personal records yet. Start logging workouts!
        </p>
      ) : (
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          {records.map((record, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                padding: '15px',
                marginBottom: '15px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateX(5px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.transform = 'translateX(0)';
              }}
            >
              <div style={{ 
                fontSize: '1.2rem', 
                fontWeight: 'bold', 
                marginBottom: '8px',
                textTransform: 'uppercase'
              }}>
                {index === 0 && '🥇 '}
                {index === 1 && '🥈 '}
                {index === 2 && '🥉 '}
                {record.exercise}
              </div>
              
              <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                {record.weight_display} {record.unit_used} × {record.reps} reps
              </div>
              
              <div style={{ 
                fontSize: '1rem', 
                fontWeight: 'bold', 
                marginTop: '8px',
                color: '#a8edea'
              }}>
                Est. 1RM: {record.estimated_1rm_display}
              </div>
              
              <div style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '5px' }}>
                {new Date(record.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default PersonalRecords;
