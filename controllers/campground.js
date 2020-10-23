const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;

const geocoder = mbxGeocoding({ accessToken: mbxToken });

module.exports.getCampgrounds = async (req, res, next) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", {
    title: "All Campgrounds",
    campgrounds: campgrounds,
  });
};

module.exports.getCreateCampground = (req, res) => {
  res.render("campgrounds/new", {
    title: "New",
  });
};

module.exports.postCreateCampground = catchAsync(async (req, res) => {
  const geoData = await geocoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Campground Created!!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.getCampground = catchAsync(async (req, res, next) => {
  let avgRating = 0;
  let totalRating = 0;
  let ratingsNumber = 0;
  const campground = await Campground.findById(req.params.id)
    .populate({ path: "reviews", populate: { path: "author" } })
    .populate("author");

  if (!campground) {
    req.flash("error", "Campground doesnt exists!");
    return res.redirect("/campgrounds");
  }
  campground.reviews.forEach((review) => {
    totalRating += review.rating;
  });
  avgRating = Math.floor(totalRating / campground.reviews.length);
  ratingsNumber = campground.reviews.length;
  res.render("campgrounds/show", {
    title: campground.title,
    campground: campground,
    avgRating,
    ratingsNumber,
  });
});

module.exports.getEditCampground = catchAsync(async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    eq.flash("error", "Campground doesnt exists!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", {
    title: campground.title,
    campground: campground,
  });
});

module.exports.postEditCampground = catchAsync(async (req, res) => {
  const { id } = req.params;

  const campground = await Campground.findByIdAndUpdate(
    id,
    { ...req.body.campground },
    { new: true, runValidators: true }
  );
  const images = req.files.map((file) => ({
    url: file.path,
    filename: file.filename,
  }));
  campground.images.push(...images);

  await campground.save();

  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
  }

  req.flash("success", "Campground Updated Successfully!!");
  res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Campground Deleted!!");
  res.redirect("/campgrounds");
});
