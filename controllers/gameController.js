const { lobbies } = require("../models/hashTable");
const engine = require("../helpers/compilation.js")
const ai = require("../helpers/ai.js")
const INITIALCODE = `print("Welcome to Codebattles!")`
const db = require("../helpers/database.js")
const gameWebSocketHandler = (socket, io) => {
    socket.on("joinLobby", (lobbyCode) => {
        socket.join(lobbyCode);
        const lobby = lobbies.get(lobbyCode);
        if (!lobby) {
            console.warn(`[WS] joinLobby: lobby not found for code=${lobbyCode}`);
            return;
        }
        console.log(`All lobbies: ${lobbies.data}`)
        const firstPlayer = lobby.getHostPlayer();
        const secondPlayer = lobby.getSecondPlayer();
        io.to(lobbyCode).emit("roles", [firstPlayer, secondPlayer]);
  });

    socket.on("rules_understood", (lobbyCode) => {
        const lobby = lobbies.get(lobbyCode);
        if (!lobby) return;
        lobby.rules_understood += 1;
        if (lobby.rules_understood === 2) {
          io.to(lobbyCode).emit("all_rules_understood");
        }
  });

  socket.on("challenge_submition", (lobbyCode, challengePrompt, inputs, outputs) => {
    const lobby = lobbies.get(lobbyCode);
    if (!lobby) return;
        lobby.setChallenges(challengePrompt, inputs, outputs);
        // When this happens, send the challenge information to the frontend 
        // Also, send the initial code that should be presented to both users. 
        io.to(lobbyCode).emit("challenge_submition", challengePrompt, inputs, outputs, INITIALCODE);
    
      });
      socket.on("code_change", (lobbyCode, newCode) => {
        socket.to(lobbyCode).emit("code_change", newCode)
      })
    socket.on("code_compile", async (lobbyCode, code) => {
        const output = await engine.execute(code);
        io.to(lobbyCode).emit("code_output", output.run.output)
    })
    socket.on("code_eval", async (lobbyCode, challengePrompt, expected_inputs, expected_outputs, user_code, code_output) => {
        console.log("Recieved")
        const response = await ai.evaluate_code(challengePrompt, expected_inputs, expected_outputs, user_code, code_output)
        console.log(`Res: ${response}`)
        io.to(lobbyCode).emit("eval_response", response)
    })
    socket.on("iterateCode", (lobbyCode) => {
        io.to(lobbyCode).emit("iterateCode")
    })
    socket.on("final_submission", async (lobbyCode, UserID, challenge, evaluation, inputs, outputs, code, saveChallengeChoice) => {
        if (saveChallengeChoice) { // if a user chooses to save the challenge
            const insertIntoDatabase = db.query(`
            INSERT INTO challenges (UserID, Challenge_prompt, Evaluation, Example_Inputs, Example_Outputs, User_Code) VALUES (?, ?, ?, ?, ?, ?);
        `)
            insertIntoDatabase.run(UserID, challenge, evaluation, inputs, outputs, code);
            const lobby = lobbies.get(lobbyCode);
            lobby.currentRound += 0.5; // One round is complete when both users are solvers and challengers
            lobby.rules_understood = 0;
            if (lobby.currentRound == 3) {
                io.to(lobbyCode).emit("game_over") 
                // Remove lobby from memory
                lobbies.delete(lobbyCode)
                console.log(`All Lobbies: ${lobbies.data}`)
            } else {
                lobby.swapRole()
                io.to(lobbyCode).emit("new_round", [lobby.getHostPlayer(), lobby.getSecondPlayer()])

            }
        } else { // if they choose not to 
                const lobby = lobbies.get(lobbyCode);
                lobby.currentRound += 0.5; // One round is complete when both users are solvers and challengers
                lobby.rules_understood = 0;
                if (lobby.currentRound == 3) {
                    io.to(lobbyCode).emit("game_over") 
                    // Remove lobby from memory
                    lobbies.delete(lobbyCode)
                    console.log(`All Lobbies: ${lobbies.data}`)
                } else {
                    lobby.swapRole()
                    io.to(lobbyCode).emit("new_round", [lobby.getHostPlayer(), lobby.getSecondPlayer()])
            }
        }
    })
 }

export default gameWebSocketHandler;
