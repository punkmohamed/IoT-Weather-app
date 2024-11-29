import { faker } from '@faker-js/faker';
import axios from 'axios';
import dotenv from "dotenv";
import NodeCache from 'node-cache';

dotenv.config();

export const api = process.env.OPEN_WEATHER_API;

// Cache with a 10-minute TTL
const weatherCache = new NodeCache({ stdTTL: 600 });

// Generate simulated data
const generateSimulatedData = () => ({
    feels_like: faker.number.float({ min: -10, max: 40, precision: 0.1 }).toFixed(),
    humidity: faker.number.float({ min: 10, max: 100, precision: 0.1 }).toFixed(),
    pressure: faker.number.float({ min: 950, max: 1050, precision: 0.1 }).toFixed(),
    wind: {
        speed: faker.number.float({ min: 0, max: 40, precision: 0.1 }).toFixed(),
        direction: faker.number.float({ min: 0, max: 360, precision: 0.1 }).toFixed(),
    },
    timestamp: new Date().toISOString(),
});

// Fetch weather data and cache it
const getCachedWeather = async (country) => {
    const cachedData = weatherCache.get(country);
    if (cachedData) {
        console.log(`Serving cached weather for ${country}`);
        return cachedData;
    }

    const [currentResponse, forecastResponse] = await Promise.allSettled([
        axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${api}&units=metric`),
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=${api}&units=metric`),
    ]);

    if (currentResponse.status === 'fulfilled' && forecastResponse.status === 'fulfilled') {
        const weather = currentResponse.value.data;
        const forecast = forecastResponse.value.data;

        // Add initial simulated data
        weather.main.simulated = generateSimulatedData();
        forecast.list.forEach(item => {
            item.simulated = generateSimulatedData();
        });

        const data = { weather, forecast };
        weatherCache.set(country, data);
        return data;
    } else {
        throw new Error('Failed to fetch weather data.');
    }
};

// Socket.IO real-time updates
const weatherSocket = (io) => {
    const intervalMap = new Map();

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('subscribe', async (country, callback) => {
            if (!country || typeof country !== 'string') {
                callback({ error: 'Invalid country name' });
                return;
            }

            try {
                const { weather, forecast } = await getCachedWeather(country);

                // Emit the current weather and forecast data
                socket.emit('weather', { weather, forecast });
                callback({ message: `Subscribed to updates for ${country}` });

                // Start emitting real-time updates for this country
                if (!intervalMap.has(country)) {
                    const intervalId = setInterval(async () => {
                        weather.main.simulated = generateSimulatedData();
                        forecast.list.forEach(item => {
                            item.simulated = generateSimulatedData();
                        });

                        // Send updated data to all clients subscribed to this country
                        io.to(country).emit('weather', { weather, forecast });
                    }, 600);

                    intervalMap.set(country, intervalId);
                }
                socket.leaveAll();
                socket.join(country);
            } catch (error) {
                callback({ error: 'Failed to subscribe to weather updates' });
            }
        });

        // Handle unsubscription
        socket.on('unsubscribe', (country, callback) => {
            if (!country || typeof country !== 'string') {
                callback({ error: 'Invalid country name' });
                return;
            }

            socket.leave(country);
            callback({ message: `Unsubscribed from ${country} updates` });

            if (!io.sockets.adapter.rooms.get(country)) {
                clearInterval(intervalMap.get(country));
                intervalMap.delete(country);
            }
        });

        // Handle disconnection
        socket.on('disconnect', () => {
            console.log('Socket disconnected:', socket.id);
        });
    });
};

export default weatherSocket;
