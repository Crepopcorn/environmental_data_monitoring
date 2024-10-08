from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
CORS(app)  # Apply CORS to the Flask app

socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
client = MongoClient(os.getenv('MONGO_URI'))
db = client['proj_db']  # Use your database name here
collection = db['environment_data']  # Collection for storing sensor data

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}))
    
    # Convert ObjectId to string and format timestamp for each document
    for document in data:
        document['_id'] = str(document['_id'])
        document['timestamp'] = document.get('timestamp', datetime.now().isoformat())
    
    return jsonify(data)

@app.route('/api/data', methods=['POST'])
@app.route('/api/data', methods=['POST'])
def submit_data():
    json_data = request.json
    timestamp = json_data.get('timestamp')

    try:
        # Check if an entry with the same timestamp already exists
        existing_entry = collection.find_one({'timestamp': timestamp})
        
        if existing_entry:
            return jsonify({"error": "Data with this timestamp already exists."}), 400

        # Insert new data into the database
        json_data['timestamp'] = timestamp or datetime.now().isoformat()
        inserted_id = collection.insert_one(json_data).inserted_id

        # Emit the new data to all clients
        json_data['_id'] = str(inserted_id)
        emit('update', json_data, broadcast=True)
        
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@socketio.on('new_data')
def handle_new_data(json):
    try:
        # Insert new data into the database
        json['timestamp'] = json.get('timestamp', datetime.now().isoformat())
        if 'temperature' in json and 'humidity' in json:
            inserted_id = collection.insert_one(json).inserted_id
            
            # Convert the document to a serializable format
            json['_id'] = str(inserted_id)
            emit('update', json, broadcast=True)  # Emit the new data to all clients
        else:
            emit('error', {'error': 'Invalid data format'}, broadcast=True)
    except Exception as e:
        emit('error', {'error': str(e)}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000)
