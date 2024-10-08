from flask import Flask, jsonify, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS  # Import CORS
from pymongo import MongoClient
import os
from dotenv import load_dotenv
from datetime import datetime
from bson import ObjectId

# load dotenv
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
CORS(app)

socketio = SocketIO(app, cors_allowed_origins="*")

# database setup
client = MongoClient(os.getenv('MONGO_URI'))
db = client['proj_db']
collection = db['environment_data']

@app.route('/api/data', methods=['GET'])
def get_data():
    data = list(collection.find({}))
    
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
        existing_entry = collection.find_one({'timestamp': timestamp})
        
        if existing_entry:
            return jsonify({"error": "Data with this timestamp already exists."}), 400

        json_data['timestamp'] = timestamp or datetime.now().isoformat()
        inserted_id = collection.insert_one(json_data).inserted_id

        json_data['_id'] = str(inserted_id)
        emit('update', json_data, broadcast=True)
        
        return jsonify({"success": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@socketio.on('new_data')
def handle_new_data(json):
    try:
        json['timestamp'] = json.get('timestamp', datetime.now().isoformat())
        if 'temperature' in json and 'humidity' in json:
            inserted_id = collection.insert_one(json).inserted_id
            
            json['_id'] = str(inserted_id)
            emit('update', json, broadcast=True)
        else:
            emit('error', {'error': 'Invalid data format'}, broadcast=True)
    except Exception as e:
        emit('error', {'error': str(e)}, broadcast=True)

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=4000)
