const express = require('express');
const path = require('path');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require('socket.io');

const io = new Server(server);


messages = []

nicknames = {}

actualNick = 0;


app.get('/', (req, res) =>{
    res.sendFile('index.html', { root: path.join(__dirname, '../frontend') });
    //res.sendFile(__dirname + "/index.html");
})


io.on('connection', (socket)=>{
    nicknames[socket.id] = actualNick;
    actualNick ++;

    socket.emit("load messages", messages);

    socket.on("message", (msg) => {
        messages.push([msg, nicknames[socket.id]]);
        io.emit('new message', nicknames[socket.id], msg);
    })
})



server.listen(3000, ()=>{
    console.log("listen on 3000");
})