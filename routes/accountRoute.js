const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");
const accountValidator = require("../utilities/validators/accountValidator");


// Login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process registration
router.post(
  "/register",
  regValidate.registrationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
);

// Process login
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
);

// Account dashboard
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkLogin, // <-- this now works because checkJWTToken sets res.locals
  utilities.handleErrors(accountController.accountManagement)
)


router.get("/update/:account_id", 
  utilities.checkJWTToken, 
  accountController.updateAccountView)

router.post("/update", 
  accountValidator.accountUpdateRules(), 
  accountValidator.checkAccountUpdate, 
  accountController.updateAccount)



router.post("/update-password", 
  accountValidator.passwordRules(), 
  accountValidator.checkPasswordUpdate, 
  accountController.updatePassword)

  router.get("/logout", accountController.logout)


  // My Reviews Page
router.get(
  "/my-reviews",
  utilities.checkJWTToken,
  utilities.checkLogin,
  require("../controllers/reviewController").myReviews
)


module.exports = router;