import { ForecastData } from '@/types/types';
import { Clock, Cloud, Sun, Umbrella, Wind, CloudRain } from 'lucide-react';
import Sunlight from './Sunlight';
type HourlyForecastProps = {
    forecastData: ForecastData
    theme: string
    sensorData: boolean
}
const HourlyForecast = ({ forecastData, theme, sensorData }: HourlyForecastProps) => {

    const weatherIcons: Record<string, JSX.Element> = {
        Clear: <Sun className={`h-6 w-6 ${theme ? 'text-white ' : 'text-yellow-300'}`} />,
        Rain: <Umbrella className={`h-6 w-6 ${theme ? 'text-white' : 'text-blue-300'}`} />,
        Clouds: <Cloud className={`h-6 w-6 ${theme ? 'text-white' : 'text-gray-400'}`} />,
        Drizzle: <CloudRain className={`h-6 w-6 ${theme ? 'text-white' : 'text-blue-200'}`} />,
        Thunderstorm: <Wind className={`h-6 w-6 ${theme ? 'text-white' : 'text-indigo-400'}`} />,
        Snow: <Cloud className={`h-6 w-6 ${theme ? 'text-white' : 'text-gray-200'}`} />,
        Mist: <Wind className={`h-6 w-6 ${theme ? 'text-white' : 'text-gray-500'}`} />,
        Default: <Cloud className={`h-6 w-6 ${theme ? 'text-white' : 'text-gray-500'}`} />,
    };

    return (
        <div className={` relative flex flex-col gap-3 p-4 backdrop-blur-md ${theme === 'light' ? 'bg-black/10' : 'bg-black/10 '} rounded-lg`}>
            {theme === 'light' && <Sunlight />}
            <div className={`flex gap-1 ${theme === 'light' ? 'text-white font-semibold' : 'text-slate-300'}  text-md`}>
                <Clock />
                <h2 className="uppercase">hourly forecast</h2>
            </div>
            <hr />
            <div className={`flex items-center whitespace-nowrap overflow-auto scrollbar-thin ${theme === 'light' ? 'scrollbar-thumb-white ' : 'scrollbar-thumb-gray-200 '} scrollbar-track-transparent scrollbar-thumb-rounded-full gap-3 z-50`}>
                {forecastData?.list.map((forecast, index) => {
                    const time = new Date(forecast.dt * 1000).toLocaleTimeString([], {
                        hour: 'numeric',
                        hour12: true,
                    });
                    const condition = forecast.weather[0]?.main || 'Default';
                    return (
                        <div
                            key={index}
                            className={`py-2 mb-3 flex flex-col items-center justify-center gap-2 rounded-xl text-white ${index === 0 ? theme === 'light' ? 'bg-yellow-400 bg-glass' : "bg-[#34333d]" : 'bg-transparent'}  w-[100px] xl:w-[130px] flex-shrink-0`}
                        >
                            <span>{time}</span>
                            <h3 className="text-3xl">{sensorData ? forecast.main.temp.toFixed() : forecast.simulated.feels_like}°</h3>
                            {weatherIcons[condition] || weatherIcons['Default']}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HourlyForecast;
