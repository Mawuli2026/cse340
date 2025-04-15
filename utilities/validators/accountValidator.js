// utilities/validators/accountValidator.js
const { body, validationResult } = require("express-validator")
const utilities = require("../../utilities")
const accountModel = require("../../models/account-model")

const accountValidator = {}

/* **********************************
 * Account Update Validation Rules
 * ********************************* */
accountValidator.accountUpdateRules = () => {
  return [
    body("account_firstname")
      .trim()
      .notEmpty()
      .withMessage("First name is required"),

    body("account_lastname")
      .trim()
      .notEmpty()
      .withMessage("Last name is required"),

    body("account_email")
      .trim()
      .isEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email, { req }) => {
        const accountId = req.body.account_id
        const existingEmail = await accountModel.getAccountByEmail(account_email)

        if (existingEmail && existingEmail.account_id != accountId) {
          throw new Error("Email already in use.")
        }
      }),
  ]
}

/* **********************************
 * Check Account Update Data
 * ********************************* */
accountValidator.checkAccountUpdate = async (req, res, next) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/update", {
      title: "Edit Account",
      nav,
      errors,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
    })
  }

  next()
}

/* **********************************
 * Password Change Validation Rules
 * ********************************* */
accountValidator.passwordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password must be at least 12 characters and include uppercase, lowercase, number, and special character.")
  ]
}

/* **********************************
 * Check Password Update
 * ********************************* */
accountValidator.checkPasswordUpdate = async (req, res, next) => {
  const { account_id } = req.body
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    const nav = await utilities.getNav()
    return res.status(400).render("account/update", {
      title: "Edit Account",
      nav,
      errors,
      account_id,
    })
  }

  next()
}

module.exports = accountValidator
