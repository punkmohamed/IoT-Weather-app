
import express from 'express'
// import dateBase from './datebase/dbConnection'
import cors from 'cors'
import dotenv from "dotenv";
import weatherRoute from './src/modules/weather/weather.routes.js';
import http from 'http'
import { Server } from 'socket.io';
dotenv.config();

const app = express()
const server = http.createServer(app)
const io = new Server(server)
app.use(express.json())
app.use(cors())
app.use(weatherRoute)
// dateBase
io.on('connection', () => {
    console.log("socket io connected");



    socket.on('disconnect', () => {
        console.log("client disconnected");

    })
})

const PORT = process.env.PORT || 3001

server.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`))