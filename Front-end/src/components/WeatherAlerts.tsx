import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertCircleIcon } from "lucide-react";
import { WeatherAlert } from "./WeatherDasboard";
type WeatherAlertsProps = {
    weatherAlerts: WeatherAlert[]
}
const WeatherAlerts = ({ weatherAlerts }: WeatherAlertsProps) => {

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <button className="flex items-center bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg hover:bg-yellow-200 transition">
                    <AlertCircleIcon className="mr-2" />
                    {weatherAlerts.length} Active Weather Alert{weatherAlerts.length > 1 ? 's' : ''}
                </button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Weather Alerts</AlertDialogTitle>
                    <AlertDialogDescription>
                        Important weather conditions to be aware of:
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="space-y-4">
                    {weatherAlerts.map((alert, index) => (
                        <div
                            key={index}
                            className={`p-4 rounded-lg flex items-center 
                                ${alert.type === 'extreme' ? 'bg-red-100 text-red-800' :
                                    alert.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-blue-100 text-blue-800'}`}
                        >
                            {alert.icon}
                            <div className="ml-4">
                                <h3 className="font-bold">{alert.message}</h3>
                                <p className="text-sm">{alert.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
                <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default WeatherAlerts