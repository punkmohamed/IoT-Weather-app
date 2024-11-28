import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { Country, State } from 'country-state-city';

// import night from '../assets/74-512.webp'
// import day from '../assets/6ef442c9fd7e8d00f43b2c6a0e4291fb.jpg'


import {
    DropletIcon,
    WindIcon,
    ThermometerIcon,
    CloudLightningIcon,
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
import { Input } from './ui/input';
import { Button } from './ui/button';
import WeatherTime from './WeatherTime';



const WeatherDashboard: React.FC = () => {

    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [selectedCountry, setSelectedCountry] = useState<string>('EG');
    const [selectedState, setSelectedState] = useState<string>('Minya');

    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [forecastData, setForecastData] = useState<ForecastData | null>(null);
    const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([]);
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



    const props = {
        selectedCountry, setSelectedCountry, setSelectedState,
        countries, selectedState,
        states, theme
    }

    console.log(weatherData, "setWeatherData");
    console.log(forecastData, "setForecastData");
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
            <div className='flex items-center justify-center my-3 mx-7 fixed top-0 right-0 z-40'>   {weatherAlerts.length > 0 && <WeatherAlerts weatherAlerts={weatherAlerts} />}
            </div>
            <div className={`w-full max-w-7xl mx-auto ${theme === 'light' ? 'bg-[#348dcf]' : 'bg-black/40 backdrop-blur'} rounded-lg p-4 sm:p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-4`}>

                <div className='flex flex-col gap-4 lg:col-span-1'>
                    <FilterByCountries  {...props} />
                    <div className=" lg:hidden flex w-full max-w-sm items-center space-x-2">
                        <Input type="search" placeholder="Search...." className={` ${theme === 'light' && 'bg-white text-black'}`} />
                        <Button type="submit" className={` ${theme === 'light' && 'bg-white text-black hover:bg-yellow-400'}`} >Search</Button>
                    </div>
                    <div
                        className='w-full rounded-lg p-3 xl:p-6 transition-all flex flex-col justify-between'
                        style={{
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                        }}
                    >
                        <div className='text-white text-center flex flex-col items-center'>
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
                                title="Feels like"
                                icon="temperature"
                                measure={weatherData?.main?.feels_like}
                                unit="°C"
                            />
                            <WeatherCards
                                theme={theme}
                                title="Humidity"
                                icon="humidity"
                                measure={weatherData?.main.humidity}
                                unit="%"
                            />
                            <WeatherCards
                                theme={theme}
                                title="Wind Speed"
                                icon="wind"
                                measure={weatherData?.wind.speed}
                                unit="m/s"
                            />
                            <WeatherCards
                                theme={theme}
                                title="Pressure"
                                icon="pressure"
                                measure={weatherData?.main.pressure}
                                unit="hPa"
                            />
                        </div>
                    </div>
                </div>

                <div className='flex flex-col gap-4 lg:col-span-2'>
                    <div className=" hidden lg:flex w-full max-w-sm items-center space-x-2">
                        <Input type="search" placeholder="Search...." className={` ${theme === 'light' && 'bg-white text-black'}`} />
                        <Button type="submit" className={`  ${theme === 'light' && 'bg-white text-sky hover:bg-yellow-400'}`} >Search</Button>
                    </div>
                    {forecastData && (
                        <>
                            <HourlyForecast theme={theme} forecastData={forecastData} />
                            <DailyForecast theme={theme} forecastData={forecastData} />
                        </>
                    )}
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