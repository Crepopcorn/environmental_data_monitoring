import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-moment';
import { Chart, TimeScale } from 'chart.js';
import 'chart.js/auto';

Chart.register(TimeScale); // Register time scale

function SensorChart({ data, onPointClick }) {
    const chartData = {
        labels: data.map(d => new Date(d.timestamp)),
        datasets: [
            {
                label: 'Temperature (°C)',
                data: data.map(d => ({ x: new Date(d.timestamp), y: d.temperature })),
                fill: false,
                borderColor: 'red',
                yAxisID: 'y_temp',
            },
            {
                label: 'Humidity (%)',
                data: data.map(d => ({ x: new Date(d.timestamp), y: d.humidity })),
                fill: false,
                borderColor: 'blue',
                yAxisID: 'y_humidity',
            },
        ],
    };

    const options = {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day',
                    displayFormats: {
                        day: 'DD/MM/YYYY',
                    },
                    tooltipFormat: 'DD/MM/YYYY',
                },
                ticks: {
                    autoSkip: false,
                    maxRotation: 0,
                    minRotation: 0,
                },
                min: data.length > 0 ? new Date(data[0].timestamp).setDate(new Date(data[0].timestamp).getDate() - 1) : undefined,
                max: data.length > 0 ? new Date(data[data.length - 1].timestamp).setDate(new Date(data[data.length - 1].timestamp).getDate() + 1) : undefined,
            },
            y_temp: {
                type: 'linear',
                position: 'left',
                min: -50,
                max: 50,
                ticks: {
                    stepSize: 10,
                },
                title: {
                    display: true,
                    text: 'Temperature (°C)',
                },
                grid: {
                    drawOnChartArea: true,
                },
            },
            y_humidity: {
                type: 'linear',
                position: 'right',
                min: 0,
                max: 100,
                ticks: {
                    stepSize: 10,
                },
                grid: {
                    drawOnChartArea: false,
                },
                title: {
                    display: true,
                    text: 'Humidity (%)',
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        onClick: (event, elements) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                onPointClick(index);
            }
        },
    };

    return (
        <div style={{ height: '400px' }}>
            <Line data={chartData} options={options} />
        </div>
    );
}

export default SensorChart;
