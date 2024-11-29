import loading from '../assets/WeatherIcons.gif'
import Sunlight from './Sunlight'

const Loading = () => {
    return (
        <div className="bg-sky relative flex items-center justify-center min-h-screen">
            <Sunlight />
            <img src={loading} className='size-[300px]' width={300} height={300} alt="loader" />
        </div>
    )
}

export default Loading