const express = require("express")
const router = express.Router()
const {isAuthorized} = require("../controllers/controller")
const userRoutes  = require("./user")
const homeRoutes  = require("./home")

router.use("/", userRoutes)
router.use("/home", isAuthorized, homeRoutes)

module.exports = router
