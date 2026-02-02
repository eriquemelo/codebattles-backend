import gameWebSocketHandler from "./controllers/gameController.js"

const express = require("express")
const cors = require("cors")
const app = express()
const http = require("http")
const db = require("./helpers/database.js")
const server = http.createServer(app)
const lobbyRouter = require("./routes/lobbyRouter.js")
const { Server } = require("socket.io")
const accountRouter = require("./routes/accountRouter.js")
const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173"
        }
    }
)



app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json())
app.use("/lobby", lobbyRouter)
app.use("/account", accountRouter)
const onConnection = (socket) => {
    console.log("Connection")
    gameWebSocketHandler(socket, io)
}
io.on('connection', onConnection)

server.listen(3000, () => {
    console.log("Server running on port 3000")
})
