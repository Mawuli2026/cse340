const reviewModel = require("../models/review-model");
const utilities = require("../utilities");

const reviewController = {
  // ✅ Submit a review
  async submitReview(req, res) {
    let { inv_id, review_text } = req.body;
    const account_id = res.locals.accountData.account_id;

    inv_id = parseInt(inv_id, 10);
    if (!inv_id || isNaN(inv_id)) {
      req.flash("notice", "Invalid vehicle selected.");
      return res.redirect("/inv"); // fallback
    }

    if (!review_text.trim()) {
      req.flash("notice", "Review text cannot be empty.");
      return res.redirect(`/inv/detail/${inv_id}`);
    }

    try {
      await reviewModel.createReview(account_id, inv_id, review_text);
      req.flash("notice", "Your review was submitted.");
    } catch (err) {
      console.error("Review creation failed:", err);
      req.flash("notice", "Something went wrong submitting your review.");
    }

    res.redirect(`/inv/detail/${inv_id}`);
  },

  // ✅ Display user's reviews
  async myReviews(req, res) {
    const nav = await utilities.getNav();
    const account_id = res.locals.accountData.account_id;
    const reviews = await reviewModel.getReviewsByAccount(account_id);

    res.render("account/my-reviews", {
      title: "My Reviews",
      nav,
      reviews,
      message: req.flash("notice")
    });
  },

  // ✅ Delete a review
  async deleteReview(req, res) {
    const { review_id } = req.body;
    const account_id = res.locals.accountData.account_id;

    const deleted = await reviewModel.deleteReview(review_id, account_id);

    if (deleted) {
      req.flash("notice", "Review deleted.");
    } else {
      req.flash("notice", "Unable to delete review.");
    }

    res.redirect("/account/my-reviews");
  }
};

module.exports = reviewController;
