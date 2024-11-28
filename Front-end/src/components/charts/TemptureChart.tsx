import { Line } from 'react-chartjs-2';

import {
    Card,
    CardContent,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ForecastData } from '@/types/types';

type TemptureChart = {
    forecastData: ForecastData
    theme: string
}
const TemptureChart = ({ forecastData, theme }: TemptureChart) => {

    const prepareForecastChartData = () => {
        if (!forecastData) return null;

        const labels = forecastData.list
            .filter((_, index) => index % 8 === 0)
            .map(item => new Date(item.dt * 1000).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric'
            }));

        const temperatures = forecastData.list
            .filter((_, index) => index % 8 === 0)
            .map(item => item.main.temp);

        return {
            labels,
            datasets: [{
                label: 'Daily Temperature (°C)',
                data: temperatures,
                borderColor: theme === 'light' ? '#3B82F6' : '#93C5FD',
                backgroundColor: theme === 'light'
                    ? 'rgba(59, 130, 246, 0.2)'
                    : 'rgba(147, 197, 253, 0.2)',
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: theme === 'light' ? '#3B82F6' : '#93C5FD'
            }]
        };
    };
    const chartData = prepareForecastChartData();
    if (!chartData) return null;

    return (
        <Card className={`w-full ${theme === 'light'
            ? 'bg-white shadow-lg'
            : 'bg-gray-900/80 text-white border-gray-700'} backdrop-blur-lg `}>
            <CardHeader>
                <CardTitle className="text-xl font-bold">
                    5-Day Temperature Forecast
                </CardTitle>
            </CardHeader>
            <CardContent>
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: false,
                                ticks: {
                                    color: theme === 'light' ? 'black' : 'white'
                                }
                            },
                            x: {
                                ticks: {
                                    color: theme === 'light' ? 'black' : 'white'
                                }
                            }
                        },
                        plugins: {
                            legend: {
                                labels: {
                                    color: theme === 'light' ? 'black' : 'white'
                                }
                            }
                        }
                    }}
                    height={300}
                />
            </CardContent>
        </Card>
    );
};
export default TemptureChart