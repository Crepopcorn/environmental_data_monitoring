import React, { useState, useRef, useEffect } from 'react';

function DataTable({ data, onEdit, onDelete, selectedIndex, onRowClick }) {
    const [editIndex, setEditIndex] = useState(-1);
    const [editTemp, setEditTemp] = useState('');
    const [editHumidity, setEditHumidity] = useState('');
    const scrollToRef = useRef(null);

    // Scroll to the selected row when selectedIndex changes
    useEffect(() => {
        if (scrollToRef.current) {
            scrollToRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [selectedIndex]);

    const handleEditClick = (index) => {
        // If already in edit mode for this row, exit edit mode
        if (editIndex === index) {
            setEditIndex(-1);
        } else {
            setEditIndex(index);
            setEditTemp(data[index].temperature);
            setEditHumidity(data[index].humidity);
        }
    };

    const handleSaveClick = (index) => {
        onEdit(index, { temperature: editTemp, humidity: editHumidity });
        setEditIndex(-1); // Exit edit mode
    };

    const handleDelete = (index) => {
        onDelete(index);
        setEditIndex(-1); // Exit edit mode when a row is deleted
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
            <div>
                <h2 style={{ textAlign: 'center' }}>Recorded Data</h2>
                <table border="1" cellPadding="10" cellSpacing="0">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Temperature (°C)</th>
                            <th>Humidity (%)</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((entry, index) => (
                            <tr
                                key={index}
                                style={{
                                    backgroundColor: selectedIndex === index ? '#a0a0a0' : 'white',
                                }}
                                ref={selectedIndex === index ? scrollToRef : null}
                                onClick={() => onRowClick(index)} // Handle row click
                            >
                                <td>{new Date(entry.timestamp).toLocaleString('en-GB')}</td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editTemp}
                                            onChange={(e) => setEditTemp(e.target.value)}
                                        />
                                    ) : (
                                        entry.temperature
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <input
                                            type="number"
                                            value={editHumidity}
                                            onChange={(e) => setEditHumidity(e.target.value)}
                                        />
                                    ) : (
                                        entry.humidity
                                    )}
                                </td>
                                <td>
                                    {editIndex === index ? (
                                        <button onClick={() => handleSaveClick(index)}>Save</button>
                                    ) : (
                                        <button onClick={() => handleEditClick(index)}>Edit</button>
                                    )}
                                    <button onClick={() => handleDelete(index)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DataTable;
