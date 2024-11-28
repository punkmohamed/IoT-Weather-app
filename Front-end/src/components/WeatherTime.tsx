import { weatherIcons, weatherPics } from "@/constants/constant";
import { ForecastData } from "@/types/types";
import { useState, useEffect } from "react";
import Sunlight from "./Sunlight";

type WeatherTimeProps = {
    forecastData: ForecastData;

};

type Data = {
    temp: number;
    weather: string;
};

type WeatherDataProps = {
    morning: Data | null;
    afternoon: Data | null;
    evening: Data | null;
};

const WeatherTime = ({ forecastData }: WeatherTimeProps) => {
    const [weatherData, setWeatherData] = useState<WeatherDataProps>({
        morning: null,
        afternoon: null,
        evening: null,
    });

    const {
        cloud,
        cloudNight,
        cloudThunder,
        day,
        dayRain,
        snowDay,
        snowNight,
        sunset,
        nightRainIcon,
        nightIcon
    } = weatherIcons;

    useEffect(() => {
        const data = forecastData.list;


        const morningData = data.find((item) => item.dt_txt.includes("06:00:00"));
        const afternoonData = data.find((item) => item.dt_txt.includes("12:00:00"));
        const eveningData = data.find((item) => item.dt_txt.includes("18:00:00"));

        const morning = {
            temp: morningData?.main.temp,
            weather: morningData?.weather[0].main,
        };
        const afternoon = {
            temp: afternoonData?.main.temp,
            weather: afternoonData?.weather[0].main,
        };
        const evening = {
            temp: eveningData?.main.temp,
            weather: eveningData?.weather[0].main,
        };

        setWeatherData({
            morning,
            afternoon,
            evening,
        });
    }, [forecastData]);

    const getIconForTimeOfDay = (timeOfDay: string, weather: string) => {
        if (weather.toLowerCase().includes("snow")) {
            return timeOfDay === "evening" ? snowNight : snowDay;
        }
        if (weather.toLowerCase().includes("rain")) {
            return timeOfDay === "evening" ? nightRainIcon : dayRain;
        }
        if (weather.toLowerCase().includes("cloud")) {
            return timeOfDay === "evening" ? cloudNight : cloud;
        }
        if (weather.toLowerCase().includes("thunder")) {
            return cloudThunder;
        }

        if (timeOfDay === "morning") return day;
        if (timeOfDay === "afternoon") return sunset;
        return nightIcon;
    };
    const { day: dayPic, night: nightPic, sunset: sunsetPic } = weatherPics

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Morning */}
            <div
                className="relative flex flex-col items-center justify-center shadow-md py-6 px-4 rounded-lg text-white"
                style={{
                    backgroundImage: `url(${dayPic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >

                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                <Sunlight />
                <h3 className="font-semibold text-2xl leading-5 relative z-10 shadow-lg">Morning</h3>
                <div className="flex items-center relative z-10">
                    <img
                        src={getIconForTimeOfDay("morning", weatherData.morning?.weather || "")}
                        alt="morning weather"
                        className="size-24 mx-auto"
                    />
                    <p className="text-4xl font-bold shadow-lg">
                        {weatherData.morning !== null
                            ? `${weatherData.morning.temp}°C`
                            : "Loading..."}
                    </p>
                </div>
            </div>

            {/* Afternoon */}
            <div
                className="relative flex flex-col items-center justify-center shadow-md py-6 px-4 rounded-lg text-white"
                style={{
                    backgroundImage: `url(${sunsetPic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                <Sunlight />
                <h3 className="font-semibold text-2xl leading-5 relative z-10 shadow-lg">Afternoon</h3>
                <div className="flex items-center relative z-10">
                    <img
                        src={getIconForTimeOfDay("afternoon", weatherData.afternoon?.weather || "")}
                        alt="afternoon weather"
                        className="size-24 mx-auto"
                    />
                    <p className="text-4xl font-bold shadow-lg">
                        {weatherData.afternoon !== null
                            ? `${weatherData.afternoon.temp}°C`
                            : "Loading..."}
                    </p>
                </div>
            </div>

            {/* Evening */}
            <div
                className="relative flex flex-col items-center justify-center shadow-md py-6 px-4 rounded-lg text-white"
                style={{
                    backgroundImage: `url(${nightPic})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="absolute inset-0 bg-black bg-opacity-40 rounded-lg"></div>
                <Sunlight />
                <h3 className="font-semibold text-2xl leading-5 relative z-10 shadow-lg">Evening</h3>
                <div className="flex items-center relative z-10">
                    <img
                        src={getIconForTimeOfDay("evening", weatherData.evening?.weather || "")}
                        alt="evening weather"
                        className="size-24 mx-auto"
                    />
                    <p className="text-4xl font-bold shadow-lg">
                        {weatherData.evening !== null
                            ? `${weatherData.evening.temp}°C`
                            : "Loading..."}
                    </p>
                </div>
            </div>
        </div>

    );
};

export default WeatherTime;
