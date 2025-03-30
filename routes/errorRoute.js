const express = require("express");
const router = new express.Router();
const errorController = require("../controllers/errorController");

// Route to intentionally trigger a 500 error
router.get("/trigger", errorController.triggerError);

module.exports = router;
