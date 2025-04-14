// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidator = require("../utilities/validators/classificationValidator")
const inventoryValidator = require("../utilities/validators/inventoryValidator")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to fetch details of a specific vehicle by inventory ID
router.get("/detail/:inv_id", utilities.handleErrors(invController.getVehicleDetail))

// Add classification
router.get("/add-classification", utilities.handleErrors(invController.addClassificationForm))
router.post(
  "/add-classification",
  ...classificationValidator,
  utilities.handleErrors(invController.addClassification)
)

// Inventory Management View
router.get("/", utilities.handleErrors(invController.buildManagementView))

// ADD Inventory - FIXED
router.post(
  "/add-inventory",
  ...inventoryValidator.newInventoryRules(), // <-- Spread the rules array
  inventoryValidator.checkUpdateData,        // <-- Handle errors and stickiness
  utilities.handleErrors(invController.addInventory)
)

// Get inventory by classification as JSON
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
)

// Edit inventory view
router.get(
  "/edit/:inv_id",
  utilities.handleErrors(invController.editInventoryView)
)


router.post(
  "/update",
  ...inventoryValidator.newInventoryRules(),
  inventoryValidator.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

module.exports = router
