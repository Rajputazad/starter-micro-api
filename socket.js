const express = require('express')
const http  =require("http")
const app = express()
const socketio= require("socket.io")
const server = http.createServer(app);
const port=3000
// const io = socketio(server);

const io = require('socket.io')(server, {
  cors: {origin : ['*',"http://localhost:4200"]}
});

io.on('connection', client => {
  client.on('message', data => { console.log(data);
    io.emit('message', data)
}
  );
  client.on('disconnect', () => {console.log('disconnect');});
});
server.listen(port,()=>{
    console.log("port:-"+port);
});
