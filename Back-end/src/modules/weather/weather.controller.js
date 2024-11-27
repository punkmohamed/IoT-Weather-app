
import { faker } from "@faker-js/faker";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const api = process.env.OPEN_WEATHER_API


const getCurrentWeather = async (req, res) => {
    try {
        const { q } = req.query
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${api}`)
        const weather = response.data
        const weatherData = {
            ...weather,
            temp: faker.number.float({ min: -10, max: 40, precision: 0.1 }).toFixed(2),
            humidity: faker.number.float({ min: 10, max: 100, precision: 0.1 }).toFixed(2),
            pressure: faker.number.float({ min: 950, max: 1050, precision: 0.1 }).toFixed(2),
            timestamp: new Date().toISOString()
        }
        res.status(201).json({ message: "Current weather data", weatherData })
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