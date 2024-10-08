// server.js
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient, ObjectId } = require('mongodb');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
if (!uri) {
    console.error('Error: MONGO_URI is not defined in the environment variables.');
    process.exit(1);
}

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
let collection;

async function connectToDatabase() {
    try {
        await client.connect();
        const database = client.db('environmentData');
        collection = database.collection('records');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Failed to connect to MongoDB:', error);
        process.exit(1);
    }
}

// Endpoint to get data for a specific location
app.get('/api/data/:location', async (req, res) => {
    const location = req.params.location;
    try {
        const data = await collection.find({ location: location }).toArray();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Endpoint to manage locations
app.get('/api/locations', async (req, res) => {
    try {
        const locations = await collection.distinct('location');
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch locations' });
    }
});

app.post('/api/locations', async (req, res) => {
    const { name } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Location name is required' });
    }
    res.status(201).json({ message: 'Location added successfully' });
});

// Add data endpoint with location
app.post('/api/data', async (req, res) => {
    try {
        const newData = req.body;
        await collection.insertOne(newData);
        res.status(201).json({ message: 'Data inserted successfully' });

        io.emit('new_data', newData);
    } catch (error) {
        res.status(500).json({ error: 'Data insertion failed' });
    }
});

// Delete endpoint to remove data by ID
app.delete('/api/data/:id', async (req, res) => {
    try {
        const id = req.params.id;
        await collection.deleteOne({ _id: new ObjectId(id) });
        io.emit('delete_data', id); // Emit 'delete_data' event
        res.status(200).json({ message: 'Data deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete data' });
    }
});

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'DELETE'],
    }
});

io.on('connection', (socket) => {
    console.log('A user connected');
    
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const port = process.env.PORT || 4000;
connectToDatabase().then(() => {
    server.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
});

