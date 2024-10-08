import React, { useEffect, useState } from 'react';
import SensorChart from './components/SensorChart';
import DataInputForm from './components/DataInputForm';
import DataTable from './components/DataTable';
import LocationManager from './components/LocationManager';
import './App.css';
import socket from './socket';

function App() {
    const [data, setData] = useState([]);
    const [error, setError] = useState(null);
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [currentLocation, setCurrentLocation] = useState('');

    useEffect(() => {
        if (!currentLocation) return;

        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data/${currentLocation}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                data.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                setData(data);
            })
            .catch(err => {
                console.error('Failed to fetch initial data:', err);
                setError('Failed to fetch initial data');
            });

        socket.on('new_data', newData => {
            if (newData.location === currentLocation) {
                setData(prevData => {
                    const updatedData = [...prevData, newData];
                    updatedData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
                    return updatedData;
                });
            }
        });

        socket.on('delete_data', (deletedDataId) => {
            setData(prevData => prevData.filter(data => data._id !== deletedDataId));
        });

        socket.on('error', errorMsg => {
            setError(errorMsg.error);
        });

        return () => {
            socket.off('new_data');
            socket.off('delete_data');
            socket.disconnect();
        };
    }, [currentLocation]); // Re-run when currentLocation changes

    const handleDelete = (index) => {
        const itemToDelete = data[index];
        fetch(`${process.env.REACT_APP_BACKEND_URL}/api/data/${itemToDelete._id}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete data');
            }
            setData(prevData => prevData.filter((_, i) => i !== index));
            socket.emit('delete_data', itemToDelete._id); // Notify clients about deletion
        })
        .catch(err => {
            console.error('Failed to delete data:', err);
            setError('Failed to delete data');
        });
    };

    const handleEdit = (index, updatedData) => {
        const newData = [...data];
        newData[index] = { ...newData[index], ...updatedData };
        newData.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setData(newData);
        setSelectedIndex(null);
    };

    const handlePointClick = (index) => {
        setSelectedIndex(selectedIndex === index ? null : index);
    };

    const handleRowClick = (index) => {
        if (selectedIndex === index) {
            setSelectedIndex(null);
        } else {
            setSelectedIndex(index);
        }
    };

    return (
        <div className="App">
            <h1>Environmental Data Monitoring</h1>
            <LocationManager setCurrentLocation={setCurrentLocation} />
            {error && data.length === 0 && <p className="error">{error}</p>}
            {currentLocation && (
                <>
                    <SensorChart data={data} onPointClick={handlePointClick} />
                    <DataInputForm currentLocation={currentLocation} />
                    <DataTable
                        data={data}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        selectedIndex={selectedIndex}
                        onRowClick={handleRowClick}
                    />
                </>
            )}
        </div>
    );
}

export default App;
