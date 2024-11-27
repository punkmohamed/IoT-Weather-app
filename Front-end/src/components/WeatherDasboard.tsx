import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Country, State } from 'country-state-city';
import { Line } from 'react-chartjs-2';
// import night from '../assets/74-512.webp'
// import day from '../assets/6ef442c9fd7e8d00f43b2c6a0e4291fb.jpg'

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    SunIcon,
    MoonIcon,

    DropletIcon,
    WindIcon,
    MapPinIcon,
    ThermometerIcon,

    CloudLightningIcon,
    Wind,
    BarChart,
    Droplet,
    Thermometer,
    Clock,
    Cloud,
    Calendar,

} from 'lucide-react';
import FilterByCountries from './FilterByCountries';
import WeatherAlerts from './WeatherAlerts';

import { weatherPics } from './../constants/constant';
import WeatherCards from './WeatherCards';
interface WeatherData {
    main: {
        temp: number;
        humidity: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
    };
    weather: Array<{
        id: number;
        description: string;
        main: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    name: string;
    sys: {
        sunrise: number;
        sunset: number;
        country: string;
    };
    cod: number;
}

interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
            feels_like: number;
        };
        weather: Array<{
            description: string;
            main: string;
            id: number;
        }>;
        wind: {
            speed: number;
            deg: number;
        };
    }>;
}

export interface WeatherAlert {
    type: 'extreme' | 'warning' | 'info';
    message: string;
    description: string;
    icon: React.ReactNode;
}
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);


interface WeatherData {
    main: {
        temp: number;
        humidity: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
    };
    weather: Array<{
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
        deg: number;
    };
    name: string;
}

interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
        };
        weather: Array<{
            description: string;
            icon: string;
        }>;
        wind: {
            speed: number;
        };
    }>;
}

// Weather Dashboard Component
const WeatherDashboard: React.FC = () => {
    // State management
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedCountry, setSelectedCountry] = useState<string>('EG');
    const [selectedState, setSelectedState] = useState<string>('Minya');

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
    const determineBackground = () => {
        const { day, rain, snow, thunder, fog, night } = weatherPics
        if (!weatherData) return;

        const { weather, sys } = weatherData;
        const currentTime = new Date().getTime();
        const isNight = currentTime < sys.sunrise * 1000 || currentTime > sys.sunset * 1000;

        const mainWeather = weather[0]?.main.toLowerCase();
        const weatherId = weather[0]?.id;

        if (mainWeather.includes('rain')) return rain
        if (mainWeather.includes('snow')) return snow;
        if (weatherId >= 200 && weatherId <= 232) return thunder
        if (mainWeather.includes('fog')) return fog;

        return isNight ? night : day;
    };
    const backgroundImage = useMemo(determineBackground, [weatherData]);
    const countries = useMemo(() => Country.getAllCountries(), []);
    const states = useMemo(() =>
        selectedCountry ? State.getStatesOfCountry(selectedCountry) : [],
        [selectedCountry]
    );

    const generateWeatherAlerts = useCallback((weatherData: WeatherData): WeatherAlert[] => {
        const alerts: WeatherAlert[] = [];

        // Temperature Alerts
        if (weatherData.main.feels_like > 35) {
            alerts.push({
                type: 'extreme',
                message: 'Extreme Heat Warning',
                description: 'Very high temperatures. Take precautions to stay cool.',
                icon: <ThermometerIcon className="text-red-500" />
            });
        }

        if (weatherData.main.feels_like < 0) {
            alerts.push({
                type: 'extreme',
                message: 'Extreme Cold Warning',
                description: 'Dangerously low temperatures. Dress warmly and limit outdoor exposure.',
                icon: <ThermometerIcon className="text-blue-500" />
            });
        }

        // Wind Alerts
        if (weatherData.wind.speed > 10) {
            alerts.push({
                type: 'warning',
                message: 'High Wind Advisory',
                description: 'Strong winds may cause potential hazards.',
                icon: <WindIcon className="text-gray-500" />
            });
        }

        // Humidity Alerts
        if (weatherData.main.humidity > 80) {
            alerts.push({
                type: 'info',
                message: 'High Humidity Notice',
                description: 'High humidity levels may cause discomfort.',
                icon: <DropletIcon className="text-blue-500" />
            });
        }

        // Weather Condition Alerts
        const severeCodes = [200, 201, 202, 210, 211, 212, 221, 230, 231, 232];
        if (severeCodes.includes(weatherData.weather[0].id)) {
            alerts.push({
                type: 'extreme',
                message: 'Severe Thunderstorm Warning',
                description: 'Thunderstorm activity detected. Stay indoors and away from windows.',
                icon: <CloudLightningIcon className="text-yellow-500" />
            });
        }

        return alerts;
    }, []);
    // Fetch weather data
    useEffect(() => {
        const fetchWeatherData = async () => {
            if (!selectedState) return;
            try {
                const weatherResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/weather?q=${selectedState}&appid=c91a55a5b102d26daf9d5ce0e708b2fa&units=metric`
                );
                const forecastResponse = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?q=${selectedState}&appid=c91a55a5b102d26daf9d5ce0e708b2fa&units=metric`
                );
                const alerts = generateWeatherAlerts(weatherResponse.data);
                setWeatherAlerts(alerts);
                // Determine theme based on current time
                const { sunrise, sunset } = weatherResponse.data.sys;
                const currentTime = new Date().getTime();
                setTheme(currentTime < sunrise * 1000 || currentTime > sunset * 1000 ? 'dark' : 'light');

                setWeatherData(weatherResponse.data);
                setForecastData(forecastResponse.data);

            } catch (error) {
                console.error('Error fetching weather data', error);
            }
        };

        fetchWeatherData();
    }, [selectedState, generateWeatherAlerts]);

    // Prepare forecast chart data
    const prepareForecastChartData = () => {
        if (!forecastData) return null;

        const labels = forecastData.list
            .filter((_, index) => index % 8 === 0) // Get one data point per day
            .map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }));

        const temperatures = forecastData.list
            .filter((_, index) => index % 8 === 0)
            .map(item => item.main.temp);

        return {
            labels,
            datasets: [{
                label: 'Daily Temperature (°C)',
                data: temperatures,
                borderColor: theme === 'light' ? '#3B82F6' : '#93C5FD',
                backgroundColor: theme === 'light'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(147, 197, 253, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: theme === 'light' ? '#3B82F6' : '#93C5FD'
            }]
        };
    };

    // Render weather details
    const renderWeatherDetails = () => {
        if (!weatherData) return null;

        return (
            <Card className={`w-full ${theme === 'light'
                ? 'bg-white shadow-lg'
                : 'bg-gray-800 text-white border-gray-700'}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold flex items-center">
                        <MapPinIcon className="mr-2" />
                        {weatherData.name}
                    </CardTitle>
                    {theme === 'light' ? <SunIcon /> : <MoonIcon />}
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                <ThermometerIcon className="mr-2" />
                                {weatherData.weather[0].description}
                            </p>
                            <p className="text-2xl font-semibold">
                                {weatherData.main.temp.toFixed(1)}°C
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Feels like {weatherData.main.feels_like.toFixed(1)}°C
                            </p>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <DropletIcon className="mr-2 text-blue-500" />
                                <span>Humidity: {weatherData.main.humidity}%</span>
                            </div>
                            <div className="flex items-center">
                                <WindIcon className="mr-2 text-green-500" />
                                <span>Wind: {weatherData.wind.speed} m/s</span>
                            </div>
                            <div className="flex items-center">
                                <ThermometerIcon className="mr-2 text-red-500" />
                                <span>
                                    Min/Max: {weatherData.main.temp_min.toFixed(1)}°C /
                                    {weatherData.main.temp_max.toFixed(1)}°C
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        );
    };

    // Render forecast chart
    const renderForecastChart = () => {
        const chartData = prepareForecastChartData();
        if (!chartData) return null;

        return (
            <Card className={`w-full ${theme === 'light'
                ? 'bg-white shadow-lg'
                : 'bg-gray-800 text-white border-gray-700'}`}>
                <CardHeader>
                    <CardTitle className="text-xl font-bold">
                        5-Day Temperature Forecast
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Line
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: false,
                                    ticks: {
                                        color: theme === 'light' ? 'black' : 'white'
                                    }
                                },
                                x: {
                                    ticks: {
                                        color: theme === 'light' ? 'black' : 'white'
                                    }
                                }
                            },
                            plugins: {
                                legend: {
                                    labels: {
                                        color: theme === 'light' ? 'black' : 'white'
                                    }
                                }
                            }
                        }}
                        height={300}
                    />
                </CardContent>
            </Card>
        );
    };
    const props = {
        selectedCountry, setSelectedCountry, setSelectedState,
        countries, selectedState,
        states
    }


    return (
        <div className={`min-h-screen p-6 md:p-8 lg:p-12 transition-all ${theme === 'light'
            ? ' text-gray-900'
            : ' text-white'}`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
            {weatherAlerts.length > 0 && <WeatherAlerts weatherAlerts={weatherAlerts} />}


            <div className="w-full max-w-6xl mx-auto bg-black/40 backdrop-blur rounded-lg p-4 md:p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Left Column */}
                <div className='flex flex-col gap-4 '>
                    <FilterByCountries {...props} />

                    <div
                        className='w-full h-full h-auto rounded-lg gap-1 xl:gap-12 lg p-4 transition-all flex flex-col justify-between'
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',

                        }}
                    >
                        <div className='text-white text-center flex flex-col items-center'>
                            {/* <img src={theme ? night : night} className='size-14' alt="weather Type" /> */}
                            <h2 className='text-4xl md:text-5xl lg:text-6xl mb-2'>28°</h2>
                            <p className='text-lg mb-2'>Rainy Day</p>
                            <p className='text-sm px-2 mb-4'>Lorem ipsum, dolor sit amet consectetur adipisicing elit.</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <WeatherCards />
                            <WeatherCards />
                            <WeatherCards />
                            <WeatherCards />
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className='col-span-1 md:col-span-2 flex flex-col gap-4'>
                    <div className='flex flex-col gap-3 p-4 backdrop-blur-md bg-black/10 rounded-lg'>
                        <div className='flex gap-1 text-slate-300 text-md'>
                            <Clock />
                            <h2 className='uppercase'>hourly forecast</h2>
                        </div>
                        <hr />
                        <div className='flex items-center whitespace-nowrap overflow-auto gap-3'>
                            <div className='py-2 mb-3 flex flex-col items-center justify-center gap-2 rounded-xl text-white bg-[#34333d] w-[100px] flex-shrink-0'>
                                <span>Now</span>
                                <h3 className='text-3xl'>28°</h3>
                                <Cloud />
                            </div>


                        </div>
                    </div>
                    <div className='flex flex-col gap-3 p-4 backdrop-blur-md bg-black/10 rounded-lg'>
                        <div className='flex gap-1 text-slate-300 text-md'>
                            <Calendar />
                            <h2 className='uppercase'>10-day forecast</h2>
                        </div>
                        <hr />
                        <div className='flex items-center whitespace-nowrap overflow-auto gap-3  scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent scrollbar-thumb-rounded-full'>
                            <div className='py-2 mb-3 flex flex-col items-center justify-center gap-2 rounded-xl text-white bg-[#34333d] w-[100px] flex-shrink-0'>
                                <span>Now</span>
                                <span className='text-gray-400'>16/9</span>
                                <h3 className='text-3xl'>28°</h3>
                                <Cloud />
                            </div>


                        </div>
                    </div>

                </div>
            </div>

            <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur p-4 py-5 rounded-lg">

                <FilterByCountries {...props} />

                {weatherAlerts.length > 0 && <WeatherAlerts weatherAlerts={weatherAlerts} />}

                {/* Weather Details */}
                {weatherData && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {renderWeatherDetails()}
                        {renderForecastChart()}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;