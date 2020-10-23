if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const AppError = require("./utils/AppError");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const mongoStore = require("connect-mongo")(session);
const campgroundRoutes = require("./routes/campgroundRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const userRoutes = require("./routes/userRoutes");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user");

mongoose
  .connect(
    `mongodb+srv://vedant:${process.env.MONGO_PASSWORD}@cluster0.wdo3r.mongodb.net/Yelpcamp?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("DB Connected");
  });

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());
app.use(helmet({ contentSecurityPolicy: false }));

const store = new mongoStore({
  url: `mongodb+srv://vedant:${process.env.MONGO_PASSWORD}@cluster0.wdo3r.mongodb.net/Yelpcamp?retryWrites=true&w=majority`,
  secret: "StoreSecret",
  touchAfter: 24 * 60 * 60,
});

app.use(
  session({
    secret: "SessionSecret",
    store: store,
    resave: false,
    saveUninitialized: true,
    cookie: {
      expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
      // secure:true,
    },
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

app.use(userRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds", reviewRoutes);

app.get("/", (req, res, next) => {
  res.render("home");
});

app.all("*", (req, res, next) => {
  // res.status(404).send("NOT FOUND");
  next(new AppError("Page Not Found!!", 404));
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Something went wrong!" } = err;
  res.status(status).render("error", {
    title: "ERROR",
    message: message,
  });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log("Server Started!");
});
