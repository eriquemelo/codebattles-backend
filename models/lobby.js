function generateLobbyCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}


class Lobby {
    constructor(hostPlayer) {
        this.hostPlayer = hostPlayer
        this.secondPlayer = null;
        this.lobbyCode = generateLobbyCode() 
        this.joinable = true;
        this.started = false;
    } 
    getHostPlayer() {
        return this.hostPlayer
    }
    getSecondPlayer() {
        return this.secondPlayer
    }
    removeSecondPlayer() {
        this.secondPlayer = null;
        this.joinable = true;
    }
    setSecondPlayer(secondPlayer) {
        this.secondPlayer = secondPlayer
        this.joinable = false
    }
    getLobbyCode() {
        return this.lobbyCode;
    }
    startGame() {
        this.started = true;
    } 
}
module.exports = Lobby;
