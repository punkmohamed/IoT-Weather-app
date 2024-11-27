import express from 'express'
import { getForecastWeather, getCurrentWeather } from './weather.controller.js';

const weatherRoute = express.Router()


weatherRoute.get('/weather/current', getCurrentWeather)
weatherRoute.get('/weather/forecast', getForecastWeather)



export default weatherRoute;