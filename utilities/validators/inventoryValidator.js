const { body, validationResult } = require("express-validator");

module.exports = [
  body("inv_make").notEmpty().withMessage("Make is required."),
  body("inv_model").notEmpty().withMessage("Model is required."),
  body("inv_year").isInt({ min: 1886 }).withMessage("Valid year is required."),
  body("inv_description").notEmpty().withMessage("Description is required."),
  body("inv_price").isFloat({ min: 0 }).withMessage("Price must be positive."),
  body("inv_miles").isInt({ min: 0 }).withMessage("Miles must be a number."),
  body("inv_color").notEmpty().withMessage("Color is required."),
  body("classification_id").notEmpty().withMessage("Classification is required."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("message", errors.array().map(e => e.msg).join(", "));
      return res.redirect("/inv/add-inventory");
    }
    next();
  },
];