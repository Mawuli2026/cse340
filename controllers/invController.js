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
    });
  } catch (error) {
    next(error);
  }
};

// Task 1
invCont.buildManagementView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const classificationSelect = await utilities.buildClassificationList()

  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationSelect,
    errors: null,
    message: req.flash("message")
  })
}


// Task 2
invCont.addClassificationForm = async (req, res) => {
  const message = req.flash("message");
  const nav = await utilities.getNav(); 

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
  const nav = await utilities.getNav();
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    classificationSelect,
    sticky: req.body || {},
    message: req.flash("message"),
    nav
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


/* ***************************
 * Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData.length && invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build Edit Inventory View
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  const itemData = await invModel.getInventoryById(inv_id)
  const classificationSelect = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`

  res.render("./inventory/edit-inventory", {
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
  })
}


/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
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
  } = req.body
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
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationSelect: classificationSelect,
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
    })
  }
}

module.exports = invCont;

