


const weatherSocket = (io) => {
    io.on('connection', (socket) => {
        console.log("socket io connected", socket.id);



        socket.on('disconnect', () => {
            console.log("client disconnected");

        })
    })

}
export default weatherSocket