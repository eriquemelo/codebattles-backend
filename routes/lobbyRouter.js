const express = require("express")
const lobbyRouter = express.Router()
const lobbyController = require("../controllers/lobbyController.js")
lobbyRouter.post("/details", lobbyController.getLobbyDetails)
lobbyRouter.post("/create", lobbyController.createLobby) 
lobbyRouter.post("/join", lobbyController.joinLobby)
lobbyRouter.post("/leave", lobbyController.leaveLobby)
lobbyRouter.post("/start", lobbyController.startGame)
module.exports = lobbyRouter;
