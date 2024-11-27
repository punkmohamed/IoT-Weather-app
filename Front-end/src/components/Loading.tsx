import loading from '../assets/WeatherIcons.gif'

const Loading = () => {
    return (
        <div className="bg-slate-500 flex items-center justify-center">
            <img src={loading} className='size-[300px]' width={300} height={300} alt="loader" />
        </div>
    )
}

export default Loading