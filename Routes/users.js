const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const {saveRedirectUrl} = require("../middleware.js")
const userController = require("../controllers/users.js")

router
    .route("/signup")
    .get(userController.signUpForm)
    .post(
        wrapAsync(userController.signsUp)
    )

router
    .route("/login")
    .get(userController.logInForm)
    .post(
        saveRedirectUrl,
        passport.authenticate(
        "local",{failureRedirect:"/login",failureFlash:true}
    ),
    userController.logsIn
    )


router.get('/logout',userController.logsOut);

module.exports = router;
