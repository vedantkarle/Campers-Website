const express = require("express");
const router = express.Router();
const { reviewSchema } = require("../schemas");
const { isLoggedIn, isReviewAuthor } = require("../middleware");
const reviewController = require("../controllers/review");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new AppError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/:id/reviews",
  isLoggedIn,
  validateReview,
  reviewController.postReview
);

router.delete(
  "/:id/reviews/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  reviewController.deleteReview
);

module.exports = router;
