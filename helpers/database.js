const { Database } = require("bun:sqlite")
const db = new Database("codebattles.sqlite")
db.run("PRAGMA foreign_keys=ON;")
db.run(`
    CREATE TABLE IF NOT EXISTS Users (
        UserID INTEGER PRIMARY KEY AUTOINCREMENT,
        email_address TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS Challenges (
        ChallengeID INTEGER PRIMARY KEY AUTOINCREMENT,    
        UserID INTEGER NOT NULL,                          
        Challenge_prompt TEXT NOT NULL,
        Evaluation TEXT NOT NULL,
        Example_Inputs TEXT, 
        Example_Outputs TEXT,
        User_Code TEXT NOT NULL, 
        FOREIGN KEY (UserID) REFERENCES Users(UserID)
        ON DELETE CASCADE                               
        ON UPDATE CASCADE
   );
`)
module.exports = db



