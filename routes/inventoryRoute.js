// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidator = require("../utilities/validators/classificationValidator")
const inventoryValidator = require("../utilities/validators/inventoryValidator")



// =============================
// PUBLIC ROUTES
// =============================

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to fetch vehicle details by inventory ID
router.get("/detail/:inv_id", utilities.handleErrors(invController.getVehicleDetail))

// Get inventory by classification as JSON (used in dropdown JS fetch)
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

// =============================
// ADMIN ROUTES (REQUIRES JWT + ADMIN)
// =============================

// Inventory Management View
router.get(
  "/",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.buildManagementView)
)

// Add Classification View
router.get(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.addClassificationForm)
)

// Add Classification Action
router.post(
  "/add-classification",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  ...classificationValidator,
  utilities.handleErrors(invController.addClassification)
)

// Add Inventory View
router.get(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.addInventoryForm)
)

// Add Inventory Action
router.post(
  "/add-inventory",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  ...inventoryValidator.newInventoryRules(),
  inventoryValidator.checkUpdateData,
  utilities.handleErrors(invController.addInventory)
)

// Edit Inventory View
router.get(
  "/edit/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.editInventoryView)
)

// Update Inventory Action
router.post(
  "/update",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  ...inventoryValidator.newInventoryRules(),
  inventoryValidator.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
)

// Delete Confirmation View
router.get(
  "/delete/:inv_id",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventoryView)
)

// Delete Inventory Action
router.post(
  "/delete/",
  utilities.checkJWTToken,
  utilities.checkAdmin,
  utilities.handleErrors(invController.deleteInventoryItem)
)

module.exports = router
