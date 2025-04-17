const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");
const reviewModel = require("../models/review-model");

const invController = {};

/* ***************************
 *  Build inventory by classification view
 ************************** */
invController.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId;
    const data = await invModel.getInventoryByClassificationId(classification_id);

    if (!data || data.length === 0) {
      return res.status(404).send("No vehicles found.");
    }

    let nav = await utilities.getNav();
    const className = data[0]?.classification_name || "Unknown Classification";

    res.render("inventory/classification", {
      title: `${className} Vehicles`,
      nav,
      vehicles: data,
    });
  } catch (error) {
    next(error);
  }
};

/* ***************************
 *  Vehicle Detail View with Reviews
 ************************** */
invController.getVehicleDetail = async function (req, res, next) {
  try {
    const inv_id = req.params.inv_id;
    const nav = await utilities.getNav();
    const vehicle = await invModel.getVehicleById(inv_id);

    if (!vehicle) {
      req.flash("notice", "Vehicle not found.");
      return res.redirect("/");
    }

    const reviews = await reviewModel.getReviewsByInvId(inv_id);

    res.render("inventory/inventoryDetail", {
      title: `${vehicle.inv_make} ${vehicle.inv_model}`,
      nav,
      vehicle,
      reviews,
      loggedin: res.locals.loggedin
    })
  } catch (error) {
    console.error("Error loading vehicle detail:", error);
    next(error);
  }
};

/* ***************************
 *  Inventory Management View (Admin Only)
 ************************** */
invController.buildManagementView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("message")
  });
};

/* ***************************
 *  Add Classification
 ************************** */
invController.addClassificationForm = async (req, res) => {
  const nav = await utilities.getNav();

  res.render("inventory/add-classification", {
    title: "Add Classification",
    message: req.flash("message"),
    nav,
  });
};

invController.addClassification = async (req, res) => {
  const { classification_name } = req.body;

  try {
    const result = await invModel.addClassification(classification_name);
    if (result) {
      req.flash("message", "Classification added successfully.");
      return res.redirect("/inv");
    }
    throw new Error("Failed to add classification.");
  } catch (error) {
    req.flash("message", "Server error.");
    return res.redirect("/inv/add-classification");
  }
};

/* ***************************
 *  Add Inventory
 ************************** */
invController.addInventoryForm = async (req, res) => {
  const nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();

  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    classificationSelect,
    sticky: req.body || {},
    message: req.flash("message")
  });
};

invController.addInventory = async (req, res) => {
  try {
    const result = await invModel.addInventory(req.body);
    if (result) {
      req.flash("message", "Vehicle added successfully.");
      return res.redirect("/inv");
    }
    throw new Error("Insert failed");
  } catch (error) {
    const nav = await utilities.getNav();
    const classificationSelect = await utilities.buildClassificationList(req.body.classification_id);
    req.flash("message", "Vehicle insert failed.");
    return res.render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      classificationSelect,
      sticky: req.body,
      message: req.flash("message")
    });
  }
};

/* ***************************
 * Return Inventory JSON by Classification
 ************************** */
invController.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(classification_id);
  if (invData.length && invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/* ***************************
 *  Edit Inventory View
 ************************** */
invController.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("notice"),

    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  });
};

/* ***************************
 *  Update Inventory
 ************************** */
invController.updateInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body;

  const updateResult = await invModel.updateInventory(
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  );

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model;
    req.flash("notice", `The ${itemName} was successfully updated.`);
    return res.redirect("/inv/");
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id);
    const itemName = `${inv_make} ${inv_model}`;
    req.flash("notice", "Update failed.");
    res.status(501).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors: null,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id
    });
  }
};

/* ***************************
 *  Delete Inventory View
 ************************** */
invController.deleteInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id);
  const nav = await utilities.getNav();
  const itemData = await invModel.getInventoryById(inv_id);
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`;

  res.render("inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price
  });
};

/* ***************************
 *  Process Inventory Deletion
 ************************** */
invController.deleteInventoryItem = async function (req, res, next) {
  const inv_id = parseInt(req.body.inv_id);
  const deleteResult = await invModel.deleteInventory(inv_id);

  if (deleteResult) {
    req.flash("notice", "Vehicle was successfully deleted.");
    res.redirect("/inv");
  } else {
    req.flash("notice", "Sorry, the delete failed.");
    res.redirect(`/inv/delete/${inv_id}`);
  }
};

module.exports = invController;

