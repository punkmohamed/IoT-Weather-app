import { io, Socket } from "socket.io-client"

const socket: Socket =
    io('https://weather-backend-production-4eda.up.railway.app', {
        transports: ['websocket'],
    })

export default socket