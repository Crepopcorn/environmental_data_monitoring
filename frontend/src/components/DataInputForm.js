import React, { useState, useEffect } from 'react';
import socket from '../socket'; 

function DataInputForm({ currentLocation }) {
    const [temperature, setTemperature] = useState('');
    const [humidity, setHumidity] = useState('');
    const [timestamp, setTimestamp] = useState('');
    const [message, setMessage] = useState('');
    const [existingTimestamps, setExistingTimestamps] = useState([]);

    useEffect(() => {
        if (!currentLocation) return;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data/${currentLocation}`)
            .then(response => response.json())
            .then(data => {
                const timestamps = data.map(entry => {
                    const date = new Date(entry.timestamp);
                    date.setSeconds(0, 0);
                    return date.toISOString();
                });
                setExistingTimestamps(timestamps);
            })
            .catch(error => {
                console.error('Failed to fetch initial data', error);
            });
    }, [currentLocation]);

    useEffect(() => {
        const singaporeTime = new Date().toLocaleString('en-SG', {
            timeZone: 'Asia/Singapore',
            hour12: false,
        });
        const [date, time] = singaporeTime.split(', ');
        const formattedTime = time.slice(0, 5);
        const formattedTimestamp = `${date.split('/').reverse().join('-')}T${formattedTime}`;
        setTimestamp(formattedTimestamp);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!temperature || !humidity) {
            setMessage('Please enter both temperature and humidity.');
            return;
        }

        if (temperature < -50 || temperature > 50) {
            alert('Temperature out of range! Please input a value between -50 and 50.');
            return;
        }

        if (humidity < 0 || humidity > 100) {
            alert('Humidity out of range! Please input a value between 0 and 100.');
            return;
        }

        const formattedTimestamp = timestamp || new Date().toISOString();
        const dateToCheck = new Date(formattedTimestamp);
        dateToCheck.setSeconds(0, 0);

        if (existingTimestamps.includes(dateToCheck.toISOString())) {
            alert('This timestamp (accurate to the minute) already exists. Please select a different timestamp.');
            return;
        }

        const newData = {
            temperature: parseFloat(temperature),
            humidity: parseFloat(humidity),
            timestamp: dateToCheck.toISOString(),
            location: currentLocation
        };

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newData),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to submit data');
            }
            return response.json();
        })
        .then((data) => {
            console.log(data.message);
            socket.emit('new_data', newData);

            // Clear form inputs
            setExistingTimestamps(prevTimestamps => [...prevTimestamps, dateToCheck.toISOString()]);
            setTemperature('');
            setHumidity('');

            const singaporeTime = new Date().toLocaleString('en-SG', {
                timeZone: 'Asia/Singapore',
                hour12: false,
            });
            const [date, time] = singaporeTime.split(', ');
            const newFormattedTime = time.slice(0, 5);
            const newFormattedTimestamp = `${date.split('/').reverse().join('-')}T${newFormattedTime}`;
            setTimestamp(newFormattedTimestamp);

            setMessage('Data submitted successfully!');
        })
        .catch((error) => {
            console.error('Failed to submit data:', error);
            setMessage('Failed to submit data.');
        });
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Temperature:</label>
                    <input
                        type="number"
                        value={temperature}
                        onChange={(e) => setTemperature(e.target.value)}
                        className="input-box"
                        step="0.1"
                    />
                </div>
                <div>
                    <label>Humidity:</label>
                    <input
                        type="number"
                        value={humidity}
                        onChange={(e) => setHumidity(e.target.value)}
                        className="input-box"
                        step="0.1"
                    />
                </div>
                <div>
                    <label>Timestamp (optional):</label>
                    <input
                        type="datetime-local"
                        value={timestamp}
                        onChange={(e) => setTimestamp(e.target.value)}
                        className="input-box"
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}

export default DataInputForm;
