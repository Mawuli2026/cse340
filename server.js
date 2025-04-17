const path = require("path")

/* ******************************************
 * Require Statements
 *******************************************/
const express = require("express")
const session = require("express-session")
const pgSession = require("connect-pg-simple")(session)
const pool = require("./database/")
const expressLayouts = require("express-ejs-layouts")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const flash = require("connect-flash")

require("dotenv").config()

const app = express()

// Controllers & Routes
const baseController = require("./controllers/baseController")
const staticRoutes = require("./routes/static")
const inventoryRoute = require("./routes/inventoryRoute")
const accountRoute = require("./routes/accountRoute")
const errorRoute = require("./routes/errorRoute")
const utilities = require("./utilities/")

/* ******************************************
 * Middleware
 *******************************************/

// Serve static files
app.use(express.static(path.join(__dirname, "public")))

// Session configuration
app.use(
  session({
    store: new pgSession({
      pool,
      tableName: "session",
      createTableIfMissing: true,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    name: "sessionId",
    cookie: { maxAge: 3600000 }, // 1 hour
  })
)

// Flash messages (must come after session)
app.use(flash())

// Body parsing
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser())

// Inject flash into response locals
app.use((req, res, next) => {
  res.locals.message = req.flash("notice")
  next()
})

// JWT Middleware - always before routes
app.use(utilities.checkJWTToken)

// Set login state for all views (based on JWT decoded data)
app.use((req, res, next) => {
  res.locals.loggedin = res.locals.loggedin || false
  res.locals.accountData = res.locals.accountData || null
  next()
})

/* ******************************************
 * View Engine and Templates
 *******************************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout")
app.set("views", path.join(__dirname, "views"))


app.use(require('connect-flash')())

// ✅ Add this block right after connect-flash
const expressMessages = require("express-messages")
app.use((req, res, next) => {
  res.locals.messages = expressMessages(req, res)
  next()
})


/* ******************************************
 * Routes
 *******************************************/
app.use(staticRoutes)
app.get("/", utilities.handleErrors(baseController.buildHome))
app.use("/inv", inventoryRoute)
app.use("/account", accountRoute)
app.use("/error", errorRoute)

// Review Route
const reviewRoute = require("./routes/reviewRoute");
app.use("/reviews", reviewRoute);



// 404 Handler
app.use((req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." })
})

/* ******************************************
 * Express Error Handler
 *******************************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  let message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?"

  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  })
})

/* ******************************************
 * Local Server Info
 *******************************************/
const port = process.env.PORT || 5500
const host = process.env.HOST || "localhost"

app.listen(port, () => {
  console.log(`App listening on ${host}:${port}`)
})

const db = require('./database/')

// Session setup
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    pool: db.pool, // ✅ Use raw Pool
    createTableIfMissing: true,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
