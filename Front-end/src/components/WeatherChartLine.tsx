import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from 'chart.js';
import { Cloud, Sun, Moon, Wind, Droplet, ThermometerSun } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

// Type definitions
interface WeatherDataItem {
    date: string;
    temperature: number;
    humidity: number;
    windSpeed: number;
}

interface ChartConfig {
    label: string;
    color: string;
    icon: JSX.Element;
}

const WeatherChartLine: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherDataItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [activeChart, setActiveChart] = useState<'temperature' | 'humidity' | 'windSpeed'>('temperature');


    const CITY = 'tokyo';

    useEffect(() => {
        const fetchWeatherData = async () => {
            try {
                const forecastResponse = await fetch(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${CITY}&appid=c91a55a5b102d26daf9d5ce0e708b2fa&units=metric`
                );

                if (!forecastResponse.ok) {
                    throw new Error('Weather data fetch failed');
                }

                const forecastData = await forecastResponse.json();

                const processedData: WeatherDataItem[] = forecastData.list.map((item: any) => ({
                    date: new Date(item.dt * 1000).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                    }),
                    temperature: item.main.temp,
                    humidity: item.main.humidity,
                    windSpeed: item.wind.speed,
                }));

                setWeatherData(processedData);
                setLoading(false);
            } catch (err: unknown) {
                setError((err as Error).message);
                setLoading(false);
            }
        };

        fetchWeatherData();
    }, []);

    const chartConfigs: Record<'temperature' | 'humidity' | 'windSpeed', ChartConfig> = {
        temperature: {
            label: 'Temperature (°C)',
            color: 'rgb(255, 99, 132)',
            icon: <ThermometerSun className="w-6 h-6 text-red-500" />,
        },
        humidity: {
            label: 'Humidity (%)',
            color: 'rgb(54, 162, 235)',
            icon: <Droplet className="w-6 h-6 text-blue-500" />,
        },
        windSpeed: {
            label: 'Wind Speed (m/s)',
            color: 'rgb(75, 192, 192)',
            icon: <Wind className="w-6 h-6 text-green-500" />,
        },
    };

    const createChartData = (dataKey: 'temperature' | 'humidity' | 'windSpeed') => {
        const { color } = chartConfigs[dataKey];
        const fillColor = 'rgba(255, 223, 0, 0.4)'; // Yellow with transparency
        return {
            labels: weatherData?.map((item) => item.date) || [],
            datasets: [
                {
                    label: chartConfigs[dataKey].label,
                    data: weatherData?.map((item) => item[dataKey]) || [],
                    borderColor: color,
                    backgroundColor: fillColor,
                    tension: 0.4,
                    borderWidth: 2,
                    fill: true,
                },
            ],
        };
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(0,0,0,0.1)',
                },
            },
            x: {
                grid: {
                    display: false,
                },
            },
        },
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <Cloud className="animate-pulse w-12 h-12 text-gray-400" />
            </div>
        );

    if (error)
        return (
            <div className="text-red-500 text-center p-4">
                Error: {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
            <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">{CITY} Weather</h1>
                        <div className="flex items-center space-x-2">
                            <Sun className="w-8 h-8 text-yellow-500" />
                            <Moon className="w-8 h-8 text-indigo-500" />
                        </div>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        {Object.keys(chartConfigs).map((key) => (
                            <button
                                key={key}
                                onClick={() => setActiveChart(key as 'temperature' | 'humidity' | 'windSpeed')}
                                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${activeChart === key
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                    }`}
                            >
                                {chartConfigs[key as 'temperature' | 'humidity' | 'windSpeed'].icon}
                                <span className="font-medium">
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </span>
                            </button>
                        ))}
                    </div>

                    <div className="h-96">
                        <Line data={createChartData(activeChart)} options={chartOptions} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherChartLine;
