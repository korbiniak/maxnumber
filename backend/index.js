const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);


app.get('/', (req, res) =>{
    res.sendFile('index.html', { root: path.join(__dirname, '../frontend') });
    //res.sendFile(__dirname + "/index.html");
})


io.on('connection', (socket)=>{
    console.log("oh");

    socket.on("message", (msg) => {
        io.emit('new message', socket.id, msg);
    })
})



server.listen(3000, ()=>{
    console.log("listen on 3000");
})