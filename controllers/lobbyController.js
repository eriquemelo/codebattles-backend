const Player = require("../models/player.js")
const Lobby = require("../models/lobby.js")

const lobbies = []

exports.getLobbyDetails = (req, res) => {
    const body = req.body 
    const lobbyCode = body.lobbyCode
    const matchedLobby= lobbies.find((lobby) => lobby.getLobbyCode() == lobbyCode)
    if (matchedLobby == undefined) {
        res.status(404).json({ message: "Lobby could not be found" })
    } else {
        const secondPlayer = matchedLobby.getSecondPlayer()
        let second_username; // In case the second player is null, only it's username will be returned
        if (secondPlayer == null) {
           second_username = null 
        } else {
            second_username = secondPlayer.username
        }
        const started = matchedLobby.started
        res.status(200).json({ host_username: matchedLobby.getHostPlayer().username, second_player_username: second_username, started })
    }
    
}

exports.createLobby = (req, res) => {
    const body = req.body; 
    const hostUsername = body.username 
    console.log(hostUsername)
    const hostPlayer = new Player(hostUsername);
    const lobby = new Lobby(hostPlayer) 
    lobbies.push(lobby)
    res.status(200).json({ host_username: hostPlayer.username, lobby_code: lobby.lobbyCode })

}
exports.joinLobby = (req, res) => {
    const body = req.body;
    const secondUsername = body.username;
    const lobbyCode = body.lobbyCode;
    // Search for first instance that matches the lobby code
    const matchedLobby = lobbies.find((lobby) => lobby.getLobbyCode() == lobbyCode)
    if (matchedLobby == undefined) { // In the case that no lobbies were matched
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } else if (matchedLobby.joinable == false) { // Where the lobby is full
        res.status(403).json({ errorMessage: "Lobby is full" })
    } else { 
        const secondPlayer = new Player(secondUsername)
        matchedLobby.setSecondPlayer(secondPlayer)
        res.status(200).json({ message: "Lobby Found Successfully", host_username: matchedLobby.getHostPlayer().username, second_username: matchedLobby.getSecondPlayer().username })
    }
}
exports.leaveLobby = (req, res) => {
    const { username, lobbyCode } = req.body;
    const matchedLobby = lobbies.find((lobby) => lobby.getLobbyCode() == lobbyCode)
    if (matchedLobby == undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } else {
        // If the user leaving the match is the host, then we assign the role of host to the second user
        if (username == matchedLobby.hostPlayer.username) {
            matchedLobby.hostPlayer = matchedLobby.secondPlayer ? new Player(matchedLobby.secondPlayer.username) : null
            matchedLobby.removeSecondPlayer()
            res.status(200).json({ message: "Leaving" })
        } else {
            matchedLobby.removeSecondPlayer()
            res.status(200).json({ message: "Leaving"})
        }
    }
}
exports.startGame = (req, res) => {
    const { username, lobbyCode } = req.body;
    const matchedLobby = lobbies.find((lobby) => lobby.getLobbyCode() == lobbyCode)
    if (matchedLobby == undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } else {
        matchedLobby.startGame();
        res.status(200).json({ message: "Game starting!" })
    }
}
