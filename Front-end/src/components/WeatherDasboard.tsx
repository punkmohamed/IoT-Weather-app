import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Country, State } from 'country-state-city';


import {
    DropletIcon,
    WindIcon,
    ThermometerIcon,
    CloudLightningIcon,
    MessageCircleWarningIcon,
} from 'lucide-react';
import FilterByCountries from './FilterByCountries';
import WeatherAlerts from './WeatherAlerts';

import { weatherPics } from './../constants/constant';
import WeatherCards from './WeatherCards';
import WeatherChartLine from './charts/WeatherChartLine';
import TemptureChart from './charts/TemptureChart';
import { ForecastData, WeatherAlert, WeatherData } from '@/types/types';
import HourlyForecast from './HourlyForecast';
import DailyForecast from './DailyForecast';

import { Button } from './ui/button';
import WeatherTime from './WeatherTime';
import socket from '@/socket.io/socket';
import Loading from './Loading';
import Search from './Search';
import PastWeather from './PastWeather';
import axios from 'axios';



const WeatherDashboard: React.FC = () => {

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedCountry, setSelectedCountry] = useState<string>('EG');
    const [selectedState, setSelectedState] = useState<string>('Minya');
    const [sensorData, setSensorData] = useState<boolean>(false);
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [pastWeatherData, setPastWeatherData] = useState<WeatherData[] | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const determineBackground = () => {
        const { day, rain, snow, thunder, cloud, fog, night } = weatherPics
        if (!weatherData) return;

        const { weather, sys } = weatherData;
        const currentTime = new Date().getTime();
        const isNight = currentTime < sys.sunrise * 1000 || currentTime > sys.sunset * 1000;

        const mainWeather = weather[0]?.main.toLowerCase();
        const weatherId = weather[0]?.id;

        if (mainWeather.includes('rain')) return rain
        if (mainWeather.includes('snow')) return snow;
        if (mainWeather.includes('clouds')) return cloud;
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


        if (weatherData.wind.speed > 10) {
            alerts.push({
                type: 'warning',
                message: 'High Wind Advisory',
                description: 'Strong winds may cause potential hazards.',
                icon: <WindIcon className="text-gray-500" />
            });
        }


        if (weatherData.main.humidity > 80) {
            alerts.push({
                type: 'info',
                message: 'High Humidity Notice',
                description: 'High humidity levels may cause discomfort.',
                icon: <DropletIcon className="text-blue-500" />
            });
        }


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

    useEffect(() => {
        const fetchWeatherData = async () => {
            setLoading(true);
            setError(null);

            if (selectedState) {
                socket.emit('subscribe', selectedState, (response: any) => {
                    if (response.error) {
                        setError(response.error);
                        setLoading(false);
                    } else {
                        console.log(response.message);
                        setLoading(false);
                    }
                });
                const response = await axios.get(`http://localhost:3001/weather/past/${selectedState}`)
                const weatherData = response?.data?.weather
                setPastWeatherData(weatherData)

            }
        };
        socket.on('weather', (data) => {
            setLoading(false);
            setError(null);
            if (data.weather && data.forecast) {
                const weather = data.weather;
                const forecast = data.forecast;
                const alerts = generateWeatherAlerts(weather);
                setWeatherAlerts(alerts);
                const { sunrise, sunset } = weather.sys;
                const currentTime = new Date().getTime();
                setTheme(currentTime < sunrise * 1000 || currentTime > sunset * 1000 ? 'dark' : 'light');
                setWeatherData(weather);
                setForecastData(forecast);
            }
        });
        fetchWeatherData();
        return () => {
            socket.off('weather');
        };
    }, [selectedState, generateWeatherAlerts]);

    useEffect(() => {
        socket.on('connect_error', (err) => {
            setLoading(false);
            setError(err.message);
        });
        return () => {
            socket.off('connect_error');
        };
    }, []);

    console.log(pastWeatherData);
    const props = {
        selectedCountry, setSelectedCountry, setSelectedState,
        countries, selectedState,
        states, theme
    }
    const handleSearch = (search: string) => {
        if (search) {
            setLoading(true);
            setError(null);

            socket.emit('subscribe', search, (response: any) => {
                if (response.error) {
                    setError(response.error);
                    setLoading(false);
                } else {
                    setError(null);
                    console.log(response.message);

                    const fetchWeatherData = async () => {
                        try {
                            const response = await axios.get(`http://localhost:3001/weather/past/${search}`);
                            const weatherData = response?.data?.weather;
                            setPastWeatherData(weatherData);
                            setLoading(false);
                        } catch (error) {
                            setError("Error fetching past weather data");
                            setLoading(false);
                        }
                    };

                    fetchWeatherData();
                }
            });
        }
    };


    if (loading)
        return <Loading />

    return (
        <div
            className={`min-h-screen p-4 sm:p-6 md:p-8 lg:p-9 transition-all ${theme === 'light' ? 'text-gray-900' : 'text-white'
                }`}
            style={{
                backgroundImage: `url(${backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            {error && (
                <div className="flex justify-center items-center p-4 max-w-md mx-auto bg-red-100 text-red-800 border border-red-400 rounded-lg shadow-md">
                    <span className="mr-2 text-xl"><MessageCircleWarningIcon /></span>
                    <span className="font-semibold text-sm">{error}</span>
                </div>
            )}


            <div className='flex items-center justify-center my-3 mx-7 fixed top-0 right-0 z-40'>   {weatherAlerts.length > 0 && <WeatherAlerts weatherAlerts={weatherAlerts} />}
            </div>
            <div className={`w-full max-w-7xl mx-auto ${theme === 'light' ? 'bg-[#348dcf]' : 'bg-black/40 backdrop-blur'} rounded-lg p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4`}>

                <div className='flex flex-col gap-4 lg:col-span-1'>

                    <FilterByCountries  {...props} />

                    <div className='lg:hidden flex gap-1 items-center justify-between'>
                        <div className="  flex w-full max-w-sm items-center space-x-2">
                            <Search theme={theme} handleSearch={handleSearch} setSelectedState={setSelectedState} />
                        </div>
                        <Button type="button" onClick={() => setSensorData((prev) => !prev)} className={` ${theme === 'light' && 'bg-white text-black hover:bg-yellow-400'}`} >{sensorData ? 'Sensor Data' : 'Acuurate Data'}</Button>
                    </div>
                    {forecastData && weatherData && (
                        <div
                            className='w-full h-full rounded-lg p-3 xl:p-6 transition-all flex flex-col justify-evenly'
                            style={{
                                backgroundImage: `url(${backgroundImage})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                            }}
                        >
                            <div className='text-white text-center flex flex-col items-center'>
                                <p className='text-2xl font-semibold mb-2'>{weatherData?.name}</p>
                                <h2 className='text-4xl sm:text-5xl md:text-6xl mb-2'>
                                    {weatherData?.main?.temp.toFixed()}°
                                </h2>
                                <p className='text-lg mb-2'>{weatherData?.weather[0].main}</p>
                                <p className='text-sm px-2 mb-4'>
                                    {weatherData?.weather[0].description}
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                                <WeatherCards
                                    theme={theme}
                                    sensorData={sensorData}
                                    title="Feels like"
                                    icon="temperature"
                                    accMeasure={weatherData?.main?.feels_like}
                                    sensorMeasure={weatherData?.main?.simulated?.feels_like}
                                    unit="°C"
                                />
                                <WeatherCards
                                    theme={theme}
                                    sensorData={sensorData}
                                    title="Humidity"
                                    icon="humidity"
                                    accMeasure={weatherData?.main?.humidity}
                                    sensorMeasure={weatherData?.main?.simulated?.humidity}
                                    unit="%"
                                />
                                <WeatherCards
                                    theme={theme}
                                    sensorData={sensorData}
                                    title="Wind Speed"
                                    icon="wind"
                                    accMeasure={weatherData?.wind.speed}
                                    sensorMeasure={weatherData?.main?.simulated?.wind.speed}
                                    unit="m/s"
                                />
                                <WeatherCards
                                    theme={theme}
                                    sensorData={sensorData}
                                    title="Pressure"
                                    icon="pressure"
                                    accMeasure={weatherData?.main?.pressure}
                                    sensorMeasure={weatherData?.main?.simulated?.pressure}
                                    unit="hPa"
                                />
                            </div>
                        </div>
                    )}

                </div>

                <div className='flex flex-col gap-4 lg:col-span-2'>
                    <div className='hidden lg:flex items-center justify-between'>
                        <div className=" flex w-full max-w-sm items-center space-x-2">
                            <Search theme={theme} handleSearch={handleSearch} setSelectedState={setSelectedState} />
                        </div>
                        <Button type="button" onClick={() => setSensorData((prev) => !prev)} className={` ${theme === 'light' && 'bg-white text-black hover:bg-yellow-400'}`} >{sensorData ? 'Sensor Data' : 'Acuurate Data'}</Button>
                    </div>
                    {forecastData && (
                        <>
                            <HourlyForecast theme={theme} forecastData={forecastData} sensorData={sensorData} />
                            <DailyForecast theme={theme} forecastData={forecastData} sensorData={sensorData} />
                        </>
                    )}
                    {pastWeatherData && pastWeatherData.length > 0 && <PastWeather theme={theme} pastWeatherData={pastWeatherData} />}
                </div>


                {forecastData && (
                    <>
                        <div className="lg:col-span-3 ">
                            <WeatherTime forecastData={forecastData}
                            />
                        </div>
                        <div className="lg:col-span-3 grid grid-cols-1 lg:grid-cols-2 gap-4 ">
                            <div className={` ${theme === 'light' ? 'bg-sky' : 'bg-black/40 backdrop-blur'} rounded-lg p-4 sm:p-6`}>
                                <WeatherChartLine
                                    forecastData={forecastData}
                                    theme={theme}
                                />
                            </div>
                            <div className={` ${theme === 'light' ? 'bg-sky' : 'bg-black/40 backdrop-blur'} rounded-lg p-4 sm:p-6`}>
                                <TemptureChart
                                    forecastData={forecastData}
                                    theme={theme}
                                />
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default WeatherDashboard;