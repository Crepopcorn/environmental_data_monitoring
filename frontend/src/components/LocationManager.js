// frontend/src/components/LocationManager.js
import React, { useState, useEffect } from 'react';

function LocationManager({ setCurrentLocation }) {
    const [locations, setLocations] = useState([]);
    const [newLocationName, setNewLocationName] = useState('');

    useEffect(() => {
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations`)
            .then(response => response.json())
            .then(data => setLocations(data))
            .catch(error => console.error('Failed to fetch locations:', error));
    }, []);

    const handleAddLocation = () => {
        if (!newLocationName) return;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: newLocationName }),
        })
        .then(() => {
            setLocations([...locations, newLocationName]);
            setNewLocationName('');
        })
        .catch(error => console.error('Failed to add location:', error));
    };

    return (
        <div>
            <h2>Locations</h2>
            <div>
                <input
                    type="text"
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="New Location Name"
                />
                <button onClick={handleAddLocation}>Add Location</button>
            </div>
            <div>
                {locations.map((location, index) => (
                    <button key={index} onClick={() => setCurrentLocation(location)}>
                        {location}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default LocationManager;
