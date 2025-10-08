// Here is the class for a Player
class Player {
    // The only values needed to create a player instance will be their username, which remains constant
    // A players role will be decided at the start of every round, so it when an instance is created it won't have a role, which is why its null here
    constructor(username) {
        this.username = username
        this.role = null
        this.score = 0 
    }
    getUsername() {
        return this.username;
    }
    getRole() {
        return this.role;
    }
    getScore() {
        return this.score
    }
    // To change the role of a Player at the start of every round, a set function will be needed.
    setRole(updatedRole) {
        this.role = updatedRole; 
    }
    addToScore(addedScore) {
        this.score += addedScore
    }
}

module.exports = Player
