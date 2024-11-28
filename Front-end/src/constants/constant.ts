import day from '../assets/day.jpg'
import rain from '../assets/rain.svg'
import snow from '../assets/snow.svg'
import thunder from '../assets/thunder.svg'
import fog from '../assets/fog.jpg'
import night from '../assets/night.jpg'
import cloud from '../assets/cloud Night.jpg'
import sunset from '../assets/denys-nevozhai-duo-xV0TU7s-unsplash.jpg'


import cloudIcon from '../assets/icons/cloud-day.svg'
import cloudNightIcon from '../assets/icons/cloud-night.svg'
import cloudThunderIcon from '../assets/icons/cloud-thunder.svg'
import dayIcon from '../assets/icons/day-icon.svg'
import dayRainIcon from '../assets/icons/day-rain.svg'
import snowDayIcon from '../assets/icons/snow-day.svg'
import snowNightIcon from '../assets/icons/snow-night.svg'
import sunsetIcon from '../assets/icons/sunset-icon.svg'
import nightIcon from '../assets/icons/night-icon.svg'
import nightRainIcon from '../assets/icons/night-rain.svg'


export type weatherPics = {
    day: string
    rain: string
    snow: string
    thunder: string
    fog: string
    cloud: string
    night: string
    sunset: string
}

export const weatherPics: weatherPics = {
    day,
    rain, snow, thunder, fog, night, cloud, sunset
}

export type WeatherIcons = {
    cloud: string;
    cloudNight: string;
    cloudThunder: string;
    day: string;
    dayRain: string;
    snowDay: string;
    snowNight: string;
    sunset: string;
    nightRainIcon: string
    nightIcon: string
}

export const weatherIcons: WeatherIcons = {
    cloud: cloudIcon,
    cloudNight: cloudNightIcon,
    cloudThunder: cloudThunderIcon,
    day: dayIcon,
    dayRain: dayRainIcon,
    snowDay: snowDayIcon,
    snowNight: snowNightIcon,
    sunset: sunsetIcon,
    nightRainIcon,
    nightIcon
}