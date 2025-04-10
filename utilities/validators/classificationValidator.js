const { body, validationResult } = require("express-validator");

module.exports = [
  body("classification_name")
    .trim()
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("Classification name must contain only letters and numbers."),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash("message", errors.array().map(e => e.msg).join(", "));
      return res.redirect("/inv/add-classification");
    }
    next();
  },
];