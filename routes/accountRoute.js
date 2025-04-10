// Required external modules
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')


// Route to handle GET requests to the account login page
router.get(
  "/login", 
  utilities.handleErrors(accountController.buildLogin)
);

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

// Process the login attempt
router.post(
  "/login",
  (req, res) => {
    res.status(200).send('login process')
  }
)

// management view
router.get("/", utilities.handleErrors(accountController.buildLogin))

// Export the router
module.exports = router;

