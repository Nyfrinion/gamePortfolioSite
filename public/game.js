const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

const socket = io()

const scoreEl = document.querySelector('#scoreEl')

const devicePixelRatio = window.devicePixelRatio || 1

canvas.width = innerWidth * devicePixelRatio
canvas.height = innerHeight * devicePixelRatio

const x = canvas.width / 2
const y = canvas.height / 2

//front end representation of other players
const frontendPlayers = {}

//listener of backend players data
socket.on('updatePlayers', (backendPlayers) => {

    //for each player object in backend players
    for (const id in backendPlayers){
        const backendPlayer = backendPlayers[id]

        //check if backend player is in frontend players
        //if not then create it at backend players x and y values
        if (!frontendPlayers[id]){
            frontendPlayers[id] = new Player
            ({
                x: backendPlayer.x, 
                y: backendPlayer.y, 
                radius: 10, 
                color:backendPlayer.color
            })
        } else {
            frontendPlayers[id].x = backendPlayer.x
            frontendPlayers[id].y = backendPlayer.y
        }
    }
    //if a player exists on frontend but not backend; delete from frontend
    for (const id in frontendPlayers){
        if (!backendPlayers[id]){
            delete frontendPlayers[id]
        }
    }
})

let animationId
function animate() {
    animationId = requestAnimationFrame(animate)
    c.fillStyle = 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    //draw the player
    //player.draw()

    //draw other players
    for (const id in frontendPlayers){
        const player = frontendPlayers[id]
        player.draw()
    }

}

animate()

const keys = {
    w: {
        pressed:false,
    },
    a: {
        pressed:false,
    },
    s: {
        pressed:false,
    },
    d: {
        pressed:false,
    }
}

const SPEED = 5
setInterval(() => {
    if (keys.w.pressed){
        frontendPlayers[socket.id].y -= SPEED
        socket.emit('keydown', 'KeyW')
    }
    if (keys.a.pressed){
        frontendPlayers[socket.id].x -= SPEED
        socket.emit('keydown', 'KeyA')
    }
    if (keys.s.pressed){
        frontendPlayers[socket.id].y += SPEED
        socket.emit('keydown', 'KeyS')
    }
    if (keys.d.pressed){
        frontendPlayers[socket.id].x += SPEED
        socket.emit('keydown', 'KeyD')
    }
}, 15)

window.addEventListener('keydown', (event) => {
    if (!frontendPlayers[socket.id]) return

    switch(event.code) {
        case 'KeyW':
            keys.w.pressed = true
            break
        case 'KeyA':
            keys.a.pressed = true
            break
        case 'KeyS':
            keys.s.pressed = true
            break
        case 'KeyD':
            keys.d.pressed = true
            break
        
    }
})

window.addEventListener('keyup', (event) => {
    if (!frontendPlayers[socket.id]) return

    switch(event.code) {
        case 'KeyW':
            keys.w.pressed = false
            break
        case 'KeyA':
            keys.a.pressed = false
            break
        case 'KeyS':
            keys.s.pressed = false
            break
        case 'KeyD':
            keys.d.pressed = false
            break
        
    }
})