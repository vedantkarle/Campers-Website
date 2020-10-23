const express = require("express");
const router = express.Router();
const campgroundController = require("../controllers/campground");
const { isLoggedIn, validateCampground, isAuthor } = require("../middleware");
const sharp = require("sharp");
const multer = require("multer");
const { storage } = require("../cloudinary");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb("Please upload only images.", false);
  }
};

const upload = multer({ storage: storage, fileFilter: multerFilter });

router.get("/", campgroundController.getCampgrounds);

router.get("/new", isLoggedIn, campgroundController.getCreateCampground);

router.post(
  "/",
  isLoggedIn,
  upload.array("image", 3),
  campgroundController.postCreateCampground
);

router.get("/:id", campgroundController.getCampground);

router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  campgroundController.getEditCampground
);

router.put(
  "/:id",
  isLoggedIn,
  isAuthor,
  upload.array("image", 3),
  campgroundController.postEditCampground
);

router.delete(
  "/:id",
  isLoggedIn,
  isAuthor,
  campgroundController.deleteCampground
);

module.exports = router;
