// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidator = require("../utilities/validators/classificationValidator");
const inventoryValidator = require("../utilities/validators/inventoryValidator");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId)

// Route to fetch details of a specific vehicle by inventory ID
router.get("/detail/:inv_id", utilities.handleErrors(invController.getVehicleDetail))

router.get("/add-classification", utilities.handleErrors(invController.addClassificationForm))
router.post(
  "/add-classification",
  classificationValidator, // you’ll create this next
  utilities.handleErrors(invController.addClassification)
)

router.get("/", utilities.handleErrors(invController.buildManagementView));

router.get("/add-classification", utilities.handleErrors(invController.addClassificationForm));
router.post("/add-classification",
  classificationValidator,
  utilities.handleErrors(invController.addClassification)
);

router.get("/add-inventory", utilities.handleErrors(invController.addInventoryForm));
router.post("/add-inventory",
  inventoryValidator,
  utilities.handleErrors(invController.addInventory)
);

module.exports = router
