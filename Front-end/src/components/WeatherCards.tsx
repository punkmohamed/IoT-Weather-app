
import { Wind, Droplet, ThermometerSun, BarChartHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import Sunlight from './Sunlight';
type WeatherCardsProps = {
    title: string
    icon: string
    accMeasure: number | undefined
    sensorMeasure: string | undefined
    unit: string
    theme: string
    sensorData: boolean
}
const WeatherCards = ({ title, icon, accMeasure, sensorMeasure, unit, theme, sensorData }: WeatherCardsProps) => {
    const className = "mr-2 h-4 w-4 md:h-6 md:w-6 uppercase "
    const iconMapping: Record<WeatherCardsProps['icon'], JSX.Element> = {
        temperature: <ThermometerSun className={className} />,
        humidity: <Droplet className={className} />,
        wind: <Wind className={className} />,
        pressure: <BarChartHorizontal className={className} />,
    };
    return (
        <Card className={`relative ${theme === 'light' ? "bg-sky text-black shadow-lg" : "backdrop-blur-md bg-black/45 shadow-xl"} text-white border-none rounded-lg`}>
            {theme === 'light' && <Sunlight />}

            <CardHeader className="pb-2 p-2 xl:p-3 relative z-10">
                <CardTitle className={`flex items-center text-sm md:text-base ${theme === 'light' ? 'text-white' : 'text-gray-300'}`}>
                    {iconMapping[icon]}
                    {title && title}
                </CardTitle>
            </CardHeader>

            <CardContent className="py-1 md:py-3 p-2 xl:p-3 relative z-10">
                <div className="flex items-center space-x-2">
                    <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold">
                        {sensorData ? accMeasure : sensorMeasure}
                    </span>
                    <span className="text-gray-200 text-sm sm:text-base md:text-lg lg:text-xl">
                        {unit}
                    </span>
                </div>
                <p className="text-gray-200 text-xs md:text-sm mt-1">{title}   {sensorData ? accMeasure : sensorMeasure} {unit}</p>
            </CardContent>
        </Card>

    )
}

export default WeatherCards