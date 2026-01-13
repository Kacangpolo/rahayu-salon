from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app) # Enable CORS for all routes

DB_FILE = 'bookings.db'
JSON_DATA_FILE = 'bookings.json'

def get_db_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS bookings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            service TEXT NOT NULL,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    conn.commit()
    conn.close()

def migrate_json_data():
    """Migrate existing data from bookings.json to SQLite if db is empty."""
    if not os.path.exists(JSON_DATA_FILE):
        return

    conn = get_db_connection()
    cursor = conn.cursor()
    
    # Check if table is empty
    cursor.execute('SELECT count(*) FROM bookings')
    count = cursor.fetchone()[0]
    
    if count == 0:
        print("Migrating data from JSON to SQLite...")
        try:
            with open(JSON_DATA_FILE, 'r') as f:
                bookings = json.load(f)
                
            for b in bookings:
                cursor.execute('''
                    INSERT INTO bookings (name, phone, service, date, time, notes)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    b.get('name'), 
                    b.get('phone'), 
                    b.get('service'), 
                    b.get('date'), 
                    b.get('time'), 
                    b.get('notes', '')
                ))
            conn.commit()
            print(f"Successfully migrated {len(bookings)} records.")
        except Exception as e:
            print(f"Error migrating data: {e}")
    
    conn.close()

# Initialize DB and run migration on startup
with app.app_context():
    init_db()
    migrate_json_data()

@app.route('/api/bookings', methods=['POST'])
def create_booking():
    try:
        data = request.json
        
        # Simple Validation
        required_fields = ['name', 'phone', 'service', 'date', 'time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Field {field} is required'}), 400
        
        notes = data.get('notes', '')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO bookings (name, phone, service, date, time, notes)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (data['name'], data['phone'], data['service'], data['date'], data['time'], notes))
        
        conn.commit()
        booking_id = cursor.lastrowid
        conn.close()
            
        return jsonify({
            'message': 'Booking created successfully', 
            'booking': data,
            'id': booking_id
        }), 201

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    try:
        conn = get_db_connection()
        bookings = conn.execute('SELECT * FROM bookings ORDER BY date DESC, time DESC').fetchall()
        conn.close()
        
        bookings_list = [dict(row) for row in bookings]
        return jsonify(bookings_list), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("Server running on port 5000")
    app.run(port=5000, debug=True)
