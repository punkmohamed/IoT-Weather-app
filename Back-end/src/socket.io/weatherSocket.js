import { faker } from '@faker-js/faker';
import axios from 'axios';
import dotenv from "dotenv";
import NodeCache from 'node-cache';
import WeatherModel from '../../datebase/models/Weather.js';

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

    try {
        const [currentResponse, forecastResponse] = await Promise.allSettled([
            axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${country}&appid=${api}&units=metric`),
            axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${country}&appid=${api}&units=metric`),
        ]);

        if (currentResponse.status === 'fulfilled' && forecastResponse.status === 'fulfilled') {
            const weather = currentResponse.value.data;
            const forecast = forecastResponse.value.data;
            if (!weather || !forecast) {
                throw new Error('Weather data or forecast data is missing.');
            }
            // Add initial simulated data
            weather.main.simulated = generateSimulatedData();
            forecast.list.forEach(item => {
                item.simulated = generateSimulatedData();
            });
            const today = new Date(); // Current date and time
            const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day (00:00:00)
            const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day (23:59:59.999)
            const time = weather.main.simulated.timestamp;

            // Extract the date (yyyy-mm-dd) from the time and createdAt

            const existingData = await WeatherModel.findOne({
                name: { $regex: new RegExp(country, "i") },
                createdAt: {
                    $gte: startOfDay,
                    $lt: endOfDay
                }
            });
            console.log(existingData, "existingData");

            const dateFromTimestamp = new Date(time).toISOString().split('T')[0];
            const createdAtDate = existingData && new Date(existingData.createdAt).toISOString().split('T')[0];

            console.log(createdAtDate, "createdAtDate");
            console.log(dateFromTimestamp, "dateFromTimestamp");
            console.log(dateFromTimestamp === createdAtDate, "true or not");

            if (!existingData && dateFromTimestamp !== createdAtDate) {
                console.log(`No existing data found for ${country} today. Saving to database.`);
                const weatherInstance = new WeatherModel(weather);
                await weatherInstance.save();

            }

            const data = { weather, forecast };
            weatherCache.set(country, data);
            return data;
        } else {
            throw new Error('City not found or invalid API response.');
        }
    } catch (error) {
        console.error(`Error fetching weather for ${country}:`, error.message);
        throw new Error('City not found or invalid API response.');
    }

};

// Socket.IO real-time updates
const weatherSocket = (io) => {
    const intervalMap = new Map();

    io.on('connection', (socket) => {
        console.log('Socket connected:', socket.id);

        socket.on('subscribe', async (country, callback) => {

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
                    }, 60000);

                    intervalMap.set(country, intervalId);
                }
                socket.leaveAll();
                socket.join(country);
            } catch (error) {
                console.error(`Error fetching weather for ${country}:`, error.message);
                callback({ error: error.message || 'Failed to subscribe to weather updates' });
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
