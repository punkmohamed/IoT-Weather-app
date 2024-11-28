import { ForecastData } from '@/types/types';
import { Calendar, Sun, Umbrella, Cloud, CloudRain, Wind } from 'lucide-react';
import Sunlight from './Sunlight';

type DailyForecastProps = {
    forecastData: ForecastData;
    theme: string
};

const DailyForecast = ({ forecastData, theme }: DailyForecastProps) => {
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

    const today = new Date().toISOString().split('T')[0];

    const dailyForecast = forecastData.list.reduce<Record<string, any>>((acc, forecast) => {
        const date = new Date(forecast.dt * 1000).toISOString().split('T')[0];

        if (!acc[date]) {
            acc[date] = forecast;
        }
        return acc;
    }, {});

    return (
        <div className={` relative flex flex-col gap-3 p-4 backdrop-blur-md ${theme === 'light' ? 'bg-black/10' : 'bg-black/10 '} rounded-lg`}>
            {theme === 'light' && <Sunlight />}
            <div className={`flex gap-1 ${theme === 'light' ? 'text-white font-semibold' : 'text-slate-300'}  text-md`}>
                <Calendar />
                <h2 className="uppercase">5-Day Forecast</h2>
            </div>
            <hr />
            <div className={`flex items-center whitespace-nowrap overflow-auto scrollbar-thin ${theme === 'light' ? 'scrollbar-thumb-white ' : 'scrollbar-thumb-gray-200 '} scrollbar-track-transparent scrollbar-thumb-rounded-full gap-3 z-50`}>
                {Object.entries(dailyForecast).map(([date, forecast], index) => {
                    const condition = forecast.weather[0]?.main || 'Default';
                    const temp = forecast.main.temp.toFixed();
                    const icon = weatherIcons[condition] || weatherIcons['Default'];
                    const isToday = date === today;
                    return (
                        <div
                            key={index}
                            className={`py-2 mb-3 flex flex-col items-center justify-center gap-2 rounded-xl text-white ${isToday ? theme === 'light' ? 'bg-yellow-400 bg-glass' : "bg-[#34333d]" : 'bg-transparent'} w-[100px] xl:w-[130px] flex-shrink-0`}
                        >
                            <span>{isToday ? 'Today' : new Date(date).toLocaleDateString('en-US', { weekday: 'long' })}</span>
                            <span className="text-gray-100">{new Date(date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                            <h3 className="text-3xl">{temp}°</h3>
                            {icon}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DailyForecast;
