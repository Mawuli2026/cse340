const jwt = require("jsonwebtoken")
require("dotenv").config()
const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")

const accountController = {}

/* ****************************************
 * Deliver login view
 **************************************** */
accountController.buildLogin = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
  })
}

/* ****************************************
 * Deliver registration view
 **************************************** */
accountController.buildRegister = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null
  })
}

/* ****************************************
 * Process registration
 **************************************** */
accountController.registerAccount = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  let hashedPassword
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", "Sorry, there was an error processing the registration.")
    return res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash("notice", `Congratulations, you're registered ${account_firstname}. Please log in.`)
    return res.status(201).render("account/login", {
      title: "Login",
      nav,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    return res.status(501).render("account/register", {
      title: "Registration",
      nav,
    })
  }
}

/* ****************************************
 * Process login
 **************************************** */
accountController.accountLogin = async function (req, res) {
  const nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)

  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    return res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
  }

  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password
      const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: 3600 * 1000,
      })

      const options = {
        httpOnly: true,
        maxAge: 3600 * 1000,
        ...(process.env.NODE_ENV !== "development" && { secure: true }),
      }

      res.cookie("jwt", accessToken, options)
      req.flash("notice", `Welcome back, ${accountData.account_firstname}`)
      return res.redirect("/account/")
    } else {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }
  } catch (error) {
    console.error(error)
    throw new Error("Access Forbidden")
  }
}

/* ****************************************
 * Deliver Account Management View
 **************************************** */
accountController.accountManagement = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    errors: null,
    message: req.flash("message"),
    accountData: res.locals.accountData,
    loggedin: res.locals.loggedin
  })
}

/* ****************************************
 * Build Account Management View (optional)
 **************************************** */
accountController.buildAccountManagement = async function (req, res) {
  const nav = await utilities.getNav()
  res.render("account/management", {
    title: "Account Management",
    nav,
    accountData: res.locals.accountData,
    loggedin: res.locals.loggedin,
    message: req.flash("notice")
  })
}

/* ****************************************
 * Show Update Account View
 **************************************** */
accountController.updateAccountView = async (req, res) => {
  const account_id = parseInt(req.params.account_id)
  const nav = await utilities.getNav()
  const accountData = await accountModel.getAccountById(account_id)

  res.render("account/update-account", {
    title: "Update Account",
    nav,
    accountData,
    message: req.flash("notice")
  })
}

/* ****************************************
 * Update Account Information
 **************************************** */
accountController.updateAccount = async (req, res) => {
  const { account_id, account_firstname, account_lastname, account_email } = req.body
  const updateResult = await accountModel.updateAccount(account_id, account_firstname, account_lastname, account_email)

  if (updateResult) {
    req.flash("notice", "Account updated successfully.")
    return res.redirect("/account")
  }

  req.flash("notice", "Account update failed.")
  return res.redirect(`/account/update/${account_id}`)
}

/* ****************************************
 * Update Account Password
 **************************************** */
accountController.updatePassword = async (req, res) => {
  const { account_id, account_password } = req.body
  const hashedPassword = await bcrypt.hash(account_password, 10)
  const updateResult = await accountModel.updatePassword(account_id, hashedPassword)

  if (updateResult) {
    req.flash("notice", "Password updated.")
    return res.redirect("/account")
  }

  req.flash("notice", "Password update failed.")
  return res.redirect(`/account/update/${account_id}`)
}

/* ****************************************
 * Logout and Clear JWT
 **************************************** */
accountController.logout = (req, res) => {
  res.clearCookie("jwt")
  res.redirect("/")
}

module.exports = accountController




