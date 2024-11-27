import { Thermometer } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"

const WeatherCards = () => {
    return (
        <Card className="backdrop-blur-md bg-black/45 text-white border-none">
            <CardHeader className="pb-2 p-3">
                <CardTitle className="flex items-center text-sm md:text-base text-gray-300">
                    <Thermometer className="mr-2 h-4 w-4 md:h-6 md:w-6 uppercase " />
                    Feels like
                </CardTitle>
            </CardHeader>
            <CardContent className="py-1 md:py-3 p-3">
                <div className="flex items-center  space-x-2">
                    <span className="text-xl md:text-1xl lg:text-3xl font-bold">21</span>
                    <span className="text-gray-200 text-xl md:text-2xl">°C</span>
                </div>
                <p className="text-gray-200 text-xs md:text-sm mt-1">Feels like 32°C</p>
            </CardContent>
        </Card>
    )
}

export default WeatherCards