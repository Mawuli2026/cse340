const { body, validationResult } = require("express-validator")
const utilities = require("../index") // to use getNav()

const inventoryValidator = {}

inventoryValidator.newInventoryRules = () => {
  return [
    body("inv_make").notEmpty().withMessage("Make is required"),
    body("inv_model").notEmpty().withMessage("Model is required"),
    body("inv_year").isInt().withMessage("Year is required"),
    body("inv_description").notEmpty().withMessage("Description is required"),
    body("inv_image").notEmpty().withMessage("Image path required"),
    body("inv_thumbnail").notEmpty().withMessage("Thumbnail path required"),
    body("inv_price").isFloat({ min: 0 }).withMessage("Price is required"),
    body("inv_miles").isInt({ min: 0 }).withMessage("Mileage is required"),
    body("inv_color").notEmpty().withMessage("Color is required"),
    body("classification_id").isInt().withMessage("Classification is required")
  ]
}


inventoryValidator.checkUpdateData = async (req, res, next) => {
  const {
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
  } = req.body

  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`

    return res.status(400).render("inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationSelect,
      errors,
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

  next()
}

module.exports = inventoryValidator

