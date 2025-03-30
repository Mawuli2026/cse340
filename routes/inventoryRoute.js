// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to fetch details of a specific vehicle by inventory ID
router.get("/detail/:inv_id", utilities.handleErrors(invController.getVehicleDetail))

module.exports = router
