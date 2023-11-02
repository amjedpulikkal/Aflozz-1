const socketIO = require("socket.io")
const { updataUserPresence } = require("./userModel")
const userSockets = new Map()
// const user = new Array()
module.exports = {
    Server: (Server) => {
        const io = socketIO(Server);
        io.on('connection', async (socket) => {
            console.log('A user connected.');
            socket.on("userId", async (res) => {
                console.log(res);
                const userId = res
                userSockets.set(userId, socket)
                // user.push({ userId, socketId: socket.id })
                // await updataUserPresence(userId, "online")
                io.emit("UStatus", { userId,Status:"online"})

            })
            socket.on('disconnect', async () => {
                // const userId = user.filter(data => data.socketId === socket.id)
                // // console.log();
                // if(userId.length>0){

                //     await updataUserPresence(userId[0].userId, socket.handshake.time)
                //     io.emit("UStatus", {userId:userId[0].userId,Status:socket.handshake.time})
                // }
                console.log('A user disconnected.');
            });
        });

        return io;
    }, userSockets
}
