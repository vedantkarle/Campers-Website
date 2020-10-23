const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const User = require("../models/user");
const passport = require("passport");
const { isLoggedIn } = require("../middleware");

router.get("/register", (req, res) => {
  res.render("users/register", {
    title: "Register",
  });
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const user = await new User({ email, username });
      const registeredUser = await User.register(user, password);
      req.flash("success", "Successfully Registered ! You can now Log In");
      return res.redirect("/login");
    } catch (err) {
      req.flash("error", err.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login", {
    title: "Login",
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    // req.flash("success", "welcome back");
    const redirectUrl = req.session.returnTo || "/campgrounds";
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

router.get("/logout", (req, res) => {
  req.logOut();
  req.flash("success", "Logged Out");
  res.redirect("/campgrounds");
});

module.exports = router;
