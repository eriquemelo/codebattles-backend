const express = require("express")
const accountRouter = express.Router()
const accountController = require("../controllers/accountController.js")

accountRouter.post("/create", accountController.createAccount)
accountRouter.post("/signin", accountController.signIntoAccount)
accountRouter.post("/verify", accountController.verifyUserToken)
accountRouter.post("/getChallenges", accountController.getUsersChallenges)
module.exports = accountRouter
