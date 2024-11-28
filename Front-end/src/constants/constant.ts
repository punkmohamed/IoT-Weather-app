import day from '../assets/day.jpg'
import rain from '../assets/rain.svg'
import snow from '../assets/snow.svg'
import thunder from '../assets/thunder.svg'
import fog from '../assets/fog.jpg'
import night from '../assets/night.jpg'
import cloud from '../assets/cloud Night.jpg'

type weatherPics = {
    day: string
    rain: string
    snow: string
    thunder: string
    fog: string
    cloud: string
    night: string
}

export const weatherPics: weatherPics = {
    day,
    rain, snow, thunder, fog, night, cloud
}