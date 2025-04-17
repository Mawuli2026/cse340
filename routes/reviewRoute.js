const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities")

// Middleware: only logged-in users can submit/delete reviews
router.post(
  "/submit",
  utilities.checkJWTToken,
  utilities.checkLogin,
  reviewController.submitReview
)

router.post(
  "/delete",
  utilities.checkJWTToken,
  utilities.checkLogin,
  reviewController.deleteReview
)

router.get(
  "/my-reviews",
  utilities.checkJWTToken,
  utilities.checkLogin,
  reviewController.myReviews
)

module.exports = router
