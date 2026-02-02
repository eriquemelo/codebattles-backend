const { lobbies } = require("../models/hashTable");

const gameWebSocketHandler = (socket, io) => {
    socket.on("joinLobby", (lobbyCode) => {
        socket.join(lobbyCode)
        const lobby = lobbies.get(lobbyCode)
        const firstPlayer = lobby.getHostPlayer()
        const secondPlayer = lobby.getSecondPlayer()
        io.to(lobbyCode).emit("roles", [
            firstPlayer,
            secondPlayer
        ])
    })
    socket.on("rules_understood", (lobbyCode) => {
        const lobby = lobbies.get(lobbyCode)
        lobby.rules_understood += 1
        console.log(lobby.rules_understood)
        if (lobby.rules_understood == 2) {
            console.log("All understood")
            io.to(lobbyCode).emit("all_rules_understood")
        }

    })
    socket.on("challenge_submition", (lobbyCode, challengePrompt, inputs, outputs) => {
        const lobby = lobbies.get(lobbyCode)
        lobby.setChallenges(challengePrompt, inputs, outputs)
        io.to(lobbyCode).emit("challenge_submition", challengePrompt, inputs, outputs)
    })
}

export default gameWebSocketHandler;
