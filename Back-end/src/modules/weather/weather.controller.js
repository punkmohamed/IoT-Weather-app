
import { faker } from "@faker-js/faker";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const api = process.env.OPEN_WEATHER_API


const getCurrentWeather = async (req, res) => {
    try {
        const { q } = req.query
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${api}&units=metric`)
        const weather = response.data
        // Simulate IoT sensor data using faker and add to `main` object
        weather.main.simulated = {
            feels_like: faker.number.float({ min: -10, max: 40, precision: 0.1 }).toFixed(),
            humidity: faker.number.float({ min: 10, max: 100, precision: 0.1 }).toFixed(),
            pressure: faker.number.float({ min: 950, max: 1050, precision: 0.1 }).toFixed(),
            wind: {
                speed: faker.number.float({ min: 0, max: 40, precision: 0.1 }).toFixed(),
                direction: faker.number.float({ min: 0, max: 360, precision: 0.1 }).toFixed(),
            },
            timestamp: new Date().toISOString()
        };

        // Format final weather data for the response
        // const weatherData = {

        // };

        res.status(201).json({ message: "Current weather data", weather })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}
const getForecastWeather = async (req, res) => {
    try {
        const { q } = req.query
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${q}&appid=${api}`)
        const weather = response.data

        res.status(201).json({ message: "Forecast data", weather })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Something went wrong" });
    }
}



export {
    getCurrentWeather,
    getForecastWeather
}