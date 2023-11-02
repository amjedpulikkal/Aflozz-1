const socketIO = require("socket.io")
const {updataUserPresence}= require("./userModel")
const userSockets = new Map()
const user = new Array()
module.exports = { Server:(Server) => {
    const io = socketIO(Server);
    io.on('connection', async (socket) => {
        console.log('A user connected.');
        
        socket.on("userId", async (res) => {
            console.log(res); 
            const userId = res   
            userSockets.set(userId,socket)
            user.push({userId,socketId:socket.id})
            await updataUserPresence(userId,true)
        })
        socket.on('disconnect', async () => {
           
            const userId = user.filter(data=>data.socketId===socket.id)

            console.log(userId);
            await updataUserPresence(userId.userId,socket.handshake.time)

            console.log('A user disconnected.');
        });
    });

    return io;
},userSockets}
