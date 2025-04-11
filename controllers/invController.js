const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      return res.status(404).send("No vehicles found.");
    }

    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown Classification";

    res.render("inventory/classification", {
      title: className + " Vehicles",
      nav,
      vehicles: data,
      nav,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Build vehicle detail view
 ************************** */
invCont.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.params.inv_id, 10);
    if (isNaN(inv_id)) {
      return next({ status: 400, message: "Invalid vehicle ID" });
    }

    const vehicleData = await invModel.getVehicleById(inv_id);
    if (!vehicleData) {
      return next({ status: 404, message: "Vehicle not found!" });
    }

    const nav = await utilities.getNav();
    res.render("inventory/inventoryDetail", {
      title: `${vehicleData.inv_make} ${vehicleData.inv_model}`,
      nav,
      vehicle: vehicleData,
      nav,
    });
  } catch (error) {
    next(error);
  }
};

// Task 1
invCont.buildManagementView = async function (req, res) {
  const message = req.flash("message");
  res.render("inventory/management", {
    title: "Inventory Management",
    message,
    nav,
  });
};

// Task 2
invCont.addClassificationForm = (req, res) => {
  const message = req.flash("message");
  res.render("inventory/add-classification", {
    title: "Add Classification",
    message,
    nav,
  });
};

invCont.addClassification = async (req, res) => {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("message", "Classification added successfully.");
      return res.redirect("/inv");
    } else {
      req.flash("message", "Failed to add classification.");
      return res.redirect("/inv/add-classification");
    }
  } catch (error) {
    req.flash("message", "Server error.");
    return res.redirect("/inv/add-classification");
  }
};

// Task 3
invCont.addInventoryForm = async (req, res) => {
  const classificationSelect = await utilities.buildClassificationList();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classificationSelect,
    sticky: {},
    message: req.flash("message"),
    nav,
  });
};

invCont.addInventory = async (req, res) => {
  try {
    const result = await invModel.addInventory(req.body);
    if (result) {
      req.flash("message", "Vehicle added successfully.");
      return res.redirect("/inv");
    }
    throw new Error("Insert failed");
  } catch (error) {
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    req.flash("message", "Vehicle insert failed.");
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      classificationSelect,
      sticky: req.body,
      message: req.flash("message")
    });
  }
};

module.exports = invCont;

