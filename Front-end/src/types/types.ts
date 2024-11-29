export type WeatherData = {
    coord: {
        lon: number;
        lat: number;
    };
    weather: Array<{
        id: number;
        main: string;
        description: string;
        icon: string;
    }>;
    base: string;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        humidity: number;
        simulated: {
            feels_like: string;
            pressure: string;
            humidity: string;
            wind: {
                speed: string,
                direction: string
            }
        }
    };
    visibility: number;
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    clouds: {
        all: number;
    };
    dt: number;
    sys: {
        type: number;
        id: number;
        country: string;
        sunrise: number;
        sunset: number;
    };
    timezone: number;
    id: number;
    name: string;
    cod: number;
};
type Weather = {
    id: number;
    main: string;
    description: string;
    icon: string;
}
type List = {
    dt: number;
    main: {
        temp: number;
        feels_like: number;
        temp_min: number;
        temp_max: number;
        pressure: number;
        sea_level?: number;
        grnd_level?: number;
        humidity: number;
        temp_kf?: number;
    };
    simulated: {
        feels_like: string;
        pressure: string;
        humidity: string;
        wind: {
            speed: string,
            direction: string
        }
    }
    weather: Weather[]
    clouds: {
        all: number;
    };
    wind: {
        speed: number;
        deg: number;
        gust?: number;
    };
    visibility?: number;
    pop: number;
    rain?: {
        '3h': number;
    };
    snow?: {
        '3h': number;
    };
    sys?: {
        pod: string;
    };
    dt_txt: string;
}
export type ForecastData = {
    cod: string;
    message: number;
    cnt: number;
    list: List[]
    city: {
        id: number;
        name: string;
        coord: {
            lat: number;
            lon: number;
        };
        country: string;
        timezone: number;
        sunrise: number;
        sunset: number;
    };
};
export interface WeatherAlert {
    type: 'extreme' | 'warning' | 'info';
    message: string;
    description: string;
    icon: React.ReactNode;
}

