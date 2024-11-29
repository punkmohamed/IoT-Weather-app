import { Calendar, Sun, Umbrella, Cloud, CloudRain, Wind } from 'lucide-react';
import Sunlight from './Sunlight';
import { WeatherData } from '@/types/types';

type DailyForecastProps = {
    pastWeatherData: WeatherData[];
    theme: string;
};

const PastWeather = ({ theme, pastWeatherData }: DailyForecastProps) => {
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

    const today = new Date();

    const simulatePastDates = (data: WeatherData[]) => {
        return data.map((item, index) => {
            const pastDate = new Date(today);
            pastDate.setDate(today.getDate() - (index + 1));
            return {
                ...item,
                simulatedDate: pastDate.toISOString().split('T')[0],
            };
        });
    };

    const simulatedData = simulatePastDates(pastWeatherData);

    return (
        <div className={`relative flex flex-col gap-3 p-4 backdrop-blur-md ${theme === 'light' ? 'bg-black/10' : 'bg-black/10'} rounded-lg`}>
            {theme === 'light' && <Sunlight />}
            <div className={`flex gap-1 ${theme === 'light' ? 'text-white font-semibold' : 'text-slate-300'} text-md`}>
                <Calendar />
                <h2 className="uppercase">Past Weather</h2>
            </div>
            <hr />
            <div className={`flex items-center whitespace-nowrap overflow-auto scrollbar-thin ${theme === 'light' ? 'scrollbar-thumb-white' : 'scrollbar-thumb-gray-200'} scrollbar-track-transparent scrollbar-thumb-rounded-full gap-3 z-50`}>
                {simulatedData.map((item, index) => {
                    const condition = item.weather[0]?.main || 'Default';
                    const temp = item.main.temp.toFixed();
                    const icon = weatherIcons[condition] || weatherIcons['Default'];
                    const dateLabel = `${index + 1} Days Ago`;

                    return (
                        <div
                            key={item._id}
                            className={`py-2 mb-3 flex flex-col items-center justify-center gap-2 rounded-xl text-white ${theme === 'light' ? 'bg-yellow-400 bg-glass' : 'bg-[#34333d]'} w-[100px] xl:w-[130px] flex-shrink-0`}
                        >
                            <span>{dateLabel}</span>
                            <span className="text-gray-100">{new Date(item.simulatedDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric' })}</span>
                            <h3 className="text-3xl">{temp}°</h3>
                            {icon}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default PastWeather;
