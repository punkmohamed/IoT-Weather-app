


const weatherSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("socket io connected", socket.id);

        const hi = "hello front end"
        socket.emit('client', hi)
        socket.on('country', (country, callback) => {
            if (!country) {
                callback({ error: "country value is missing" })
                return
            }
            console.log("country", country);
            callback({ message: `Country ${country} processed successfully!` })
        })
        socket.on('disconnect', () => {
            console.log("client disconnected");

        })
    })

}
export default weatherSocket