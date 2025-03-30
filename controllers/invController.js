const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    console.log(`Fetching inventory for classification ID: ${classification_id}`) // Debugging log

    const data = await invModel.getInventoryByClassificationId(classification_id)
    console.log("Fetched Inventory Data:", data) // Debugging log

    if (!data || data.length === 0) {
      console.log("No vehicles found for classification ID:", classification_id)
      return res.status(404).send("No vehicles found.")
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0]?.classification_name || "Unknown Classification"

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid,
      vehicles: data,
    })
  } catch (error) {
    console.error("Error in buildByClassificationId:", error)
    next(error)
  }
}

/* ***************************
 *  Build vehicle detail view
 * ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id  // Get the inventory ID from the request
    console.log(`Fetching details for vehicle ID: ${inv_id}`) // Debugging log

    const vehicleData = await invModel.getVehicleById(inv_id) // Fetch vehicle data
    console.log("Fetched Vehicle Data:", vehicleData) // Debugging log

    if (!vehicleData) {
      return next({ status: 404, message: "Vehicle not found!" }) // Handle 404 error
    }

    const nav = await utilities.getNav() // Get navigation HTML

    // Format vehicle details into HTML
    const vehicleHtml = utilities.buildVehicleHtml(vehicleData)

    res.render("./inventory/detail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicleHtml,
    })
  } catch (error) {
    console.error("Error in getVehicleDetail:", error)
    next(error)  // Pass error to the error-handling middleware
  }
}

module.exports = invCont
