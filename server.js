const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server, {pingInterval: 2000, pingTimeout:5000 });

const PORT = 3000;

// serve static files from the "public" directory
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
  })

  //backend players
const backendPlayers = {}

// new connection handling
io.on('connection', (socket) => {
    console.log('A user connected');
    // new player object
    backendPlayers[socket.id] = {
        x:500 * Math.random(),
        y:500 * Math.random(),
        color: `hsl(${360 * Math.random()}, 100%, 50%)`
    }

    //io.emit -> every player; socket.emit <-- only to that one client.
    io.emit('updatePlayers', backendPlayers)
    console.log(backendPlayers)

    //key press handling
    const SPEED = 5
    socket.on('keydown', (keycode) => {
        switch(keycode) {
            case 'KeyW':
                backendPlayers[socket.id].y -= SPEED
                break
            case 'KeyA':
                backendPlayers[socket.id].x -= SPEED
                break
            case 'KeyS':
                backendPlayers[socket.id].y += SPEED
                break
            case 'KeyD':
                backendPlayers[socket.id].x += SPEED
                break
            
        }
    })

    // disconnect handling
    socket.on('disconnect', (reason) => {
        console.log(reason);
        //if a player disconnects; remove their player object from the backend
        delete backendPlayers[socket.id]
        //inform each player of this removal
        io.emit('updatePlayers', backendPlayers)
    });
});

setInterval(() => {
    io.emit('updatePlayers', backendPlayers)
}, 15)

// start server
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
