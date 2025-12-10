const Player = require("../models/player.js")
const Lobby = require("../models/lobby.js")
const hash = require("../helpers/hash.js")

const lobbiesHashTable = []

exports.getLobbyDetails = (req, res) => {
    const body = req.body 
    const lobbyCode = body.lobbyCode
     // Generating a hash to locate the index of where it should be stored
    const index = hash.generateHash(lobbyCode)
    const element = lobbiesHashTable[index]
    // If at the index the element is empty, we exit early and return a 404 NOT FOUND status    
    if (element === undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } 
    let lobby;
    // We loop through the array at the index in increments of two to find the right lobby code
    for (let i=0; i<element.length;i+=2) {
        if (i >= element.length) return
        if (element[i] == lobbyCode) {
            // We assign the lobby variable to the lobby element adjacent to the lobby code 
            lobby = element[i+1]
        }
    }

    if (lobby == undefined) {
        res.status(404).json({ message: "Lobby could not be found" })
    } else {
        const secondPlayer = lobby.getSecondPlayer()
        let second_username; // In case the second player is null, only it's username will be returned
        if (secondPlayer == null) {
           second_username = null 
        } else {
            second_username = secondPlayer.username
        }
        const started = lobby.started
        res.status(200).json({ host_username: lobby.getHostPlayer().username, second_player_username: second_username, started })
    }
    
}

exports.createLobby = (req, res) => {
    // Obtaining user details from HTTP Request
    const body = req.body; 
    const hostUsername = body.username 
    
    const hostPlayer = new Player(hostUsername);
    const lobby = new Lobby(hostPlayer) 
    // Generating a hash based on the lobby code so it can be stored in the hash table of lobbies 
    const lobbyCode = lobby.getLobbyCode()
    const index = hash.generateHash(lobbyCode)
    // To deal with potential collisions, check if there is a lobby already at the index
    if (Array.isArray(lobbiesHashTable[index])) {
        // Here the lobby code and the lobby instance are being appeneded
        lobbiesHashTable[index].push(lobbyCode, lobby)
    } else {
        lobbiesHashTable[index] = [lobbyCode, lobby]
    }
    res.status(200).json({ host_username: hostPlayer.username, lobby_code: lobby.lobbyCode })

}
exports.joinLobby = (req, res) => {
    const body = req.body;
    const secondUsername = body.username;
    const lobbyCode = body.lobbyCode;

    // Generating a hash to locate the index of where it should be stored
    const index = hash.generateHash(lobbyCode)
    const element = lobbiesHashTable[index]
    // If at the index the element is empty, we exit early and return a 404 NOT FOUND status    
    if (element === undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } 
    let lobby;
    // We loop through the array at the index in increments of two to find the right lobby code
    for (let i=0; i<element.length;i+=2) {
        if (i >= element.length) return
        if (element[i] == lobbyCode) {
            // We assign the lobby variable to the lobby element adjacent to the lobby code 
            lobby = element[i+1]
        }
    }

    if (lobby == undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    }
    
    if (lobby.joinable == false) { // Where the lobby is full
        res.status(403).json({ errorMessage: "Lobby is full" })
    } else { 
        const secondPlayer = new Player(secondUsername)
        lobby.setSecondPlayer(secondPlayer)
        res.status(200).json({ message: "Lobby Found Successfully", host_username: lobby.getHostPlayer().username, second_username: lobby.getSecondPlayer().username })
    }
}
exports.leaveLobby = (req, res) => {
    const { username, lobbyCode } = req.body;
    
    // Generating a hash to locate the index of where it should be stored
    const index = hash.generateHash(lobbyCode)
    const element = lobbiesHashTable[index]
    // If at the index the element is empty, we exit early and return a 404 NOT FOUND status    
    if (element === undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } 
    let lobby;
    // We loop through the array at the index in increments of two to find the right lobby code
    for (let i=0; i<element.length;i+=2) {
        if (i >= element.length) return
        if (element[i] == lobbyCode) {
            // We assign the lobby variable to the lobby element adjacent to the lobby code 
            lobby = element[i+1]
        }
    }



    if (lobby == undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } else {
        // If the user leaving the match is the host, then we assign the role of host to the second user
        if (username == lobby.hostPlayer.username) {
            lobby.hostPlayer = lobby.secondPlayer ? new Player(lobby.secondPlayer.username) : null
            lobby.removeSecondPlayer()
            res.status(200).json({ message: "Leaving" })
        } else {
            lobby.removeSecondPlayer()
            res.status(200).json({ message: "Leaving"})
        }
    }
}
exports.startGame = (req, res) => {
    const { lobbyCode } = req.body;
    // Generating a hash to locate the index of where it should be stored
    const index = hash.generateHash(lobbyCode)
    const element = lobbiesHashTable[index]
    // If at the index the element is empty, we exit early and return a 404 NOT FOUND status    
    if (element === undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } 
    let lobby;
    // We loop through the array at the index in increments of two to find the right lobby code
    for (let i=0; i<element.length;i+=2) {
        if (i >= element.length) return
        if (element[i] == lobbyCode) {
            // We assign the lobby variable to the lobby element adjacent to the lobby code 
            lobby = element[i+1]
        }
    }


    if (lobby == undefined) {
        res.status(404).json({ errorMessage: "Could not find a lobby with that lobby code" })
    } else {
        lobby.startGame();
        res.status(200).json({ message: "Game starting!" })
    }
}
