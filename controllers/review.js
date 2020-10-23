const Campground = require("../models/campground");
const Review = require("../models/review");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

module.exports.postReview = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  const review = new Review(req.body.review);
  const existingReview = campground.reviews.forEach(
    (review) => review.author === req.user._id
  );
  if (existingReview) {
    console.log(existingReview);
    req.flash("error", "You have already submitted a review");
    return res.redirect(`/campgrounds/${campground._id}`);
  }

  campground.reviews.push(review);
  review.author = req.user._id;
  await campground.save();
  await review.save();
  req.flash("success", "Review Created!!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res) => {
  await Campground.findByIdAndUpdate(req.params.id, {
    $pull: { reviews: req.params.reviewId },
  });
  await Review.findByIdAndDelete(req.params.reviewId);
  req.flash("success", "Review Deleted!!");
  res.redirect(`/campgrounds/${req.params.id}`);
});
