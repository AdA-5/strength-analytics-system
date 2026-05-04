"""
Flask Backend for Strength Analytics Web App
Handles all API requests and data operations
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
from datetime import datetime
from calculations import calculate_one_rep_max, calculate_volume
from conversions import (
    pounds_to_kilograms, 
    kilograms_to_pounds,
    display_weight_in_both_units
)

app = Flask(__name__)
CORS(app)  # Allow requests from React frontend

# Data file path
DATA_FILE = os.path.join(os.path.dirname(__file__), 'data', 'strength_logs.csv')

# Initialize CSV if doesn't exist
def init_database():
    """Create CSV file with headers if it doesn't exist"""
    os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
    
    if not os.path.exists(DATA_FILE):
        df = pd.DataFrame(columns=[
            'timestamp', 'exercise', 'weight_standard', 'weight_display',
            'unit_used', 'reps', 'estimated_1rm', 'volume'
        ])
        df.to_csv(DATA_FILE, index=False)
        print(f"✓ Created database at {DATA_FILE}")

init_database()


@app.route('/api/health', methods=['GET'])
def health_check():
    """Check if API is running"""
    return jsonify({
        'status': 'healthy',
        'message': 'Strength Analytics API is running!'
    })


@app.route('/api/workouts', methods=['POST'])
def log_workout():
    """Log a new workout"""
    try:
        data = request.json
        
        # Extract data
        exercise = data.get('exercise', '').strip()
        weight = float(data.get('weight'))
        unit = data.get('unit', 'kg')
        reps = int(data.get('reps'))
        
        # Validate
        if not exercise:
            return jsonify({'error': 'Exercise name required'}), 400
        if weight <= 0:
            return jsonify({'error': 'Weight must be positive'}), 400
        if reps < 1 or reps > 100:
            return jsonify({'error': 'Reps must be between 1 and 100'}), 400
        
        # Convert to standard unit (kg)
        if unit == 'lbs':
            weight_standard = pounds_to_kilograms(weight)
            weight_display = weight
        else:
            weight_standard = weight
            weight_display = weight
        
        # Calculate metrics
        estimated_1rm = calculate_one_rep_max(weight_standard, reps)
        volume = calculate_volume(weight_standard, reps)
        
        # Create workout record
        workout = {
            'timestamp': datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            'exercise': exercise,
            'weight_standard': round(weight_standard, 2),
            'weight_display': round(weight_display, 2),
            'unit_used': unit,
            'reps': reps,
            'estimated_1rm': round(estimated_1rm, 2),
            'volume': round(volume, 2)
        }
        
        # Append to CSV
        df = pd.DataFrame([workout])
        df.to_csv(DATA_FILE, mode='a', header=False, index=False)
        
        # Return response with both units
        return jsonify({
            'success': True,
            'workout': workout,
            'estimated_1rm_display': display_weight_in_both_units(estimated_1rm),
            'volume_display': display_weight_in_both_units(volume)
        })
        
    except ValueError as e:
        return jsonify({'error': 'Invalid number format'}), 400
    except Exception as e:
        print(f"Error logging workout: {e}")
        return jsonify({'error': 'Failed to log workout'}), 500


@app.route('/api/workouts', methods=['GET'])
def get_workouts():
    """Get all workouts"""
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({'workouts': []})
        
        df = pd.read_csv(DATA_FILE)
        
        if df.empty:
            return jsonify({'workouts': []})
        
        # Convert to list of dicts
        workouts = df.to_dict('records')
        
        return jsonify({'workouts': workouts})
        
    except Exception as e:
        print(f"Error getting workouts: {e}")
        return jsonify({'error': 'Failed to get workouts'}), 500


@app.route('/api/personal-records', methods=['GET'])
def get_personal_records():
    """Get personal records for each exercise"""
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({'records': []})
        
        df = pd.read_csv(DATA_FILE)
        
        if df.empty:
            return jsonify({'records': []})
        
        # Group by exercise and find max 1RM
        records = []
        for exercise in df['exercise'].unique():
            exercise_data = df[df['exercise'] == exercise]
            best = exercise_data.loc[exercise_data['estimated_1rm'].idxmax()]
            
            records.append({
                'exercise': best['exercise'],
                'weight_display': best['weight_display'],
                'unit_used': best['unit_used'],
                'reps': int(best['reps']),
                'estimated_1rm': best['estimated_1rm'],
                'timestamp': best['timestamp'],
                'estimated_1rm_display': display_weight_in_both_units(best['estimated_1rm'])
            })
        
        # Sort by 1RM (highest first)
        records.sort(key=lambda x: x['estimated_1rm'], reverse=True)
        
        return jsonify({'records': records})
        
    except Exception as e:
        print(f"Error getting PRs: {e}")
        return jsonify({'error': 'Failed to get personal records'}), 500


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get overall statistics"""
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({
                'total_workouts': 0,
                'total_volume': 0,
                'total_volume_display': '0.00 kg (0.00 lbs)',
                'exercises_tracked': 0
            })
        
        df = pd.read_csv(DATA_FILE)
        
        if df.empty:
            return jsonify({
                'total_workouts': 0,
                'total_volume': 0,
                'total_volume_display': '0.00 kg (0.00 lbs)',
                'exercises_tracked': 0
            })
        
        total_workouts = len(df)
        total_volume = df['volume'].sum()
        exercises_tracked = df['exercise'].nunique()
        
        return jsonify({
            'total_workouts': total_workouts,
            'total_volume': round(total_volume, 2),
            'total_volume_display': display_weight_in_both_units(total_volume),
            'exercises_tracked': exercises_tracked
        })
        
    except Exception as e:
        print(f"Error getting stats: {e}")
        return jsonify({'error': 'Failed to get statistics'}), 500


@app.route('/api/progress/<exercise>', methods=['GET'])
def get_exercise_progress(exercise):
    """Get progress data for a specific exercise (for charts)"""
    try:
        if not os.path.exists(DATA_FILE):
            return jsonify({'progress': []})
        
        df = pd.read_csv(DATA_FILE)
        
        if df.empty:
            return jsonify({'progress': []})
        
        # Filter by exercise
        exercise_data = df[df['exercise'].str.lower() == exercise.lower()]
        
        if exercise_data.empty:
            return jsonify({'progress': []})
        
        # Sort by timestamp
        exercise_data = exercise_data.sort_values('timestamp')
        
        # Format for chart
        progress = []
        for _, row in exercise_data.iterrows():
            progress.append({
                'date': row['timestamp'][:10],  # Just date part
                'estimated_1rm': round(row['estimated_1rm'], 2),
                'volume': round(row['volume'], 2),
                'reps': int(row['reps'])
            })
        
        return jsonify({'progress': progress})
        
    except Exception as e:
        print(f"Error getting progress: {e}")
        return jsonify({'error': 'Failed to get progress'}), 500


@app.route('/api/convert', methods=['POST'])
def convert_units():
    """Convert between kg and lbs"""
    try:
        data = request.json
        weight = float(data.get('weight'))
        from_unit = data.get('from_unit', 'kg')
        
        if from_unit == 'kg':
            result = kilograms_to_pounds(weight)
            to_unit = 'lbs'
        else:
            result = pounds_to_kilograms(weight)
            to_unit = 'kg'
        
        return jsonify({
            'original': round(weight, 2),
            'original_unit': from_unit,
            'converted': round(result, 2),
            'converted_unit': to_unit,
            'display': f"{round(weight, 2)} {from_unit} = {round(result, 2)} {to_unit}"
        })
        
    except ValueError:
        return jsonify({'error': 'Invalid number format'}), 400
    except Exception as e:
        print(f"Error converting: {e}")
        return jsonify({'error': 'Failed to convert'}), 500


if __name__ == '__main__':
    print("\n" + "="*50)
    print("🚀 STRENGTH ANALYTICS API STARTING...")
    print("="*50)
    print(f"📊 Database: {DATA_FILE}")
    print("🌐 API running at: http://localhost:5000")
    print("📡 CORS enabled for React frontend")
    print("="*50 + "\n")
    
    app.run(debug=True, port=5000)