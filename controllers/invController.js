const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    console.log(`Fetching inventory for classification ID: ${classification_id}`);

    const data = await invModel.getInventoryByClassificationId(classification_id);
    console.log("Fetched Inventory Data:", data);

    if (!data || data.length === 0) {
      console.log("No vehicles found for classification ID:", classification_id);
      return res.status(404).send("No vehicles found.");
    }

    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown Classification";

    res.render("./inventory/classification", {
      title: className + " Vehicles",
      nav,
      vehicles: data,
    });
  } catch (error) {
    console.error("Error in buildByClassificationId:", error);
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10); // Ensure inv_id is an integer
    console.log(`Fetching details for vehicle ID: ${inv_id}`);

    if (isNaN(inv_id)) {
      return next({ status: 400, message: "Invalid vehicle ID" });
    }

    const vehicleData = await invModel.getVehicleById(inv_id);
    console.log("Fetched Vehicle Data:", vehicleData);

    if (!vehicleData) {
      return next({ status: 404, message: "Vehicle not found!" });
    }

    const nav = await utilities.getNav();

    // Render the details view with vehicle data (not vehicleHtml)
    res.render("./inventory/inventoryDetail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData, // Pass vehicle object instead of HTML
    });

  } catch (error) {
    console.error("Error in getVehicleDetail:", error);
    next(error);
  }
};

module.exports = invCont;

