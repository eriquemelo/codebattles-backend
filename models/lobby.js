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
        this.rules_understood = 0;
        this.currentRound = 1 
        this.currentChallengePrompt = null
        this.currentInputs = null 
        this.currentOutputs = null
    } 
    getHostPlayer() {
        return this.hostPlayer
    }
    getSecondPlayer() {
        return this.secondPlayer
    }
    setChallenges(prompt, inputs, outputs) {
        this.currentChallengePrompt = prompt;
        this.currentInputs = inputs;
        this.currentOutputs = outputs;
    }
    removeSecondPlayer() {
        this.secondPlayer = null;
        this.joinable = true;
    }
    setSecondPlayer(secondPlayer) {
        this.secondPlayer = secondPlayer
        this.joinable = false
    }
    setRole() {
        const num = Math.floor(Math.random() * 2)
        if (num == 0) {
            this.hostPlayer.role = "Challenger"
            this.secondPlayer.role = "Solver"
        } else {
            this.hostPlayer.role = "Solver"
            this.secondPlayer.role = "Challenger"
        }
    }
    getLobbyCode() {
        return this.lobbyCode;
    }
    startGame() {
        this.started = true;
        this.setRole()
    } 
}
module.exports = Lobby;
