import React, { useState } from 'react';

const API_URL = 'http://localhost:5000/api';

function UnitConverter() {
  const [weight, setWeight] = useState('');
  const [fromUnit, setFromUnit] = useState('kg');
  const [result, setResult] = useState(null);

  const handleConvert = async () => {
    if (!weight) return;

    try {
      const response = await fetch(`${API_URL}/convert`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          weight: parseFloat(weight),
          from_unit: fromUnit
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error converting:', error);
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      padding: '20px',
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      <h3 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
        🔄 Unit Converter
      </h3>

      <div className="input-group">
        <input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="Enter weight"
          step="0.01"
        />
      </div>

      <div className="radio-group" style={{ marginBottom: '15px' }}>
        <label>
          <input
            type="radio"
            value="kg"
            checked={fromUnit === 'kg'}
            onChange={(e) => setFromUnit(e.target.value)}
          />
          kg → lbs
        </label>
        <label>
          <input
            type="radio"
            value="lbs"
            checked={fromUnit === 'lbs'}
            onChange={(e) => setFromUnit(e.target.value)}
          />
          lbs → kg
        </label>
      </div>

      <button 
        className="btn" 
        style={{ width: '100%', marginBottom: '15px' }}
        onClick={handleConvert}
      >
        Convert
      </button>

      {result && (
        <div style={{
          background: 'rgba(168, 237, 234, 0.1)',
          borderRadius: '8px',
          padding: '15px',
          textAlign: 'center',
          fontSize: '1.1rem',
          fontWeight: 'bold',
          color: '#a8edea'
        }}>
          {result.display}
        </div>
      )}
    </div>
  );
}

export default UnitConverter;