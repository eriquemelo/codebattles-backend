const db = require("../helpers/database.js")
const auth = require("../helpers/auth.js")
exports.createAccount = async (req, res) => {
    try {
        // Parse email address and password from request body
        const { email_address, password } = req.body 
        // Hash users password 
        const hashedPassword = await Bun.password.hash(password)
        const insertIntoDatabase = db.query(`
            INSERT INTO users (email_address, password) VALUES (?, ?);
        `)
        insertIntoDatabase.run(email_address, hashedPassword)
        // Create JWT Token for user
        
        const user = db.query("SELECT * FROM Users WHERE email_address = ?").get(email_address)
        const token = auth.signToken(email_address, user.UserID) 

        res.status(200).json({ result: "complete", token }) 
    } catch (error) {
        // if the error number is 2067 this means that email is already used on another record
        if (error.errno == 2067) {
            res.status(401).json({ result: "error", error_message: "This email is already in use "})
        } 
        console.log(error)
        res.status(400).json({ error_message: error })
    }
}
exports.signIntoAccount = async (req, res) => {
    try {
        // Parse email address and password from request body
        const { email_address, password } = req.body; 
        // Query database for record matching the email address inputted
        const user_query = db.query(`SELECT * FROM Users WHERE email_address = ?`)
        const user = user_query.get(email_address) 
        if (!user) { // if there is no record found with the email address
            res.status(404).json({ result: "error", "error_message": "No account with that email address was found! "})
        } 
        if (!await Bun.password.verify(password, user.password)) { // Compare the password to the hashed password
            res.status(401).json({ result: "error", "error_message": "Password does not match"})
        }
        const token = auth.signToken(email_address, user.UserID) 
        res.status(200).json({ token })
   
    } catch (error) {
        res.status(400).json({ error_message: error })        
    }
}
exports.verifyUserToken = async (req, res) => {
    // Extract user token from request header 
    const header = req.headers.authorization || "";
    const [, token] = header.split(" ")
    if (!token) { 
        return res.status(401).json({ result: "error", error_message: "Not signed in" })
    }
    try {
        const payload = auth.verifyToken(token)
        res.status(200).json({ result: "verfied", payload }) 
    } catch (error) {
        res.status(400).json({ result: "error", error_message: "Invalid or expired token" }) 
    }
}
exports.getUsersChallenges = async (req, res) => {
    // Extract user ID from request 
    try {
        const { userID } = req.body; 
        console.log(userID)
        // Fetch all challenges belonging to the user that is requesting
        const challengesQuery = db.query(`SELECT * FROM Challenges WHERE UserID = ?`)
        const challenges = challengesQuery.all(userID); 
        console.log(challenges)
        res.status(200).json({ challenges })
    } catch (error) {
       res.status(400).json({ result: "error", error }) 
    }
}
