import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';;

function WorkoutForm({ onWorkoutLogged }) {
  const [formData, setFormData] = useState({
    exercise: '',
    weight: '',
    unit: 'kg',
    reps: ''
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch(`${API_URL}/workouts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({
          type: 'success',
          text: `✓ Workout Logged! Est. 1RM: ${data.estimated_1rm_display}`
        });
        
        // Clear form
        setFormData({
          exercise: '',
          weight: '',
          unit: 'kg',
          reps: ''
        });

        // Notify parent to refresh
        if (onWorkoutLogged) {
          onWorkoutLogged();
        }
      } else {
        setMessage({
          type: 'error',
          text: data.error || 'Failed to log workout'
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Network error. Make sure backend is running!'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {message && (
        <div className={`message message-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="input-group">
        <label>Exercise</label>
        <input
          type="text"
          name="exercise"
          value={formData.exercise}
          onChange={handleChange}
          placeholder="e.g., Bench Press"
          required
        />
      </div>

      <div className="input-group">
        <label>Weight</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          placeholder="e.g., 100"
          step="0.01"
          min="0"
          required
        />
        
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="unit"
              value="kg"
              checked={formData.unit === 'kg'}
              onChange={handleChange}
            />
            kg
          </label>
          <label>
            <input
              type="radio"
              name="unit"
              value="lbs"
              checked={formData.unit === 'lbs'}
              onChange={handleChange}
            />
            lbs
          </label>
        </div>
      </div>

      <div className="input-group">
        <label>Reps</label>
        <input
          type="number"
          name="reps"
          value={formData.reps}
          onChange={handleChange}
          placeholder="e.g., 5"
          min="1"
          max="100"
          required
        />
      </div>

      <button type="submit" className="btn" style={{ width: '100%' }} disabled={loading}>
        {loading ? 'Logging...' : '💪 Log Workout'}
      </button>
    </form>
  );
}

export default WorkoutForm;
