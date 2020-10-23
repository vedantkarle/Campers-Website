const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {
    type: String,
    required: [true, "Email is required!"],
    unique: true,
  },
});

UserSchema.plugin(passportLocalMongoose);

const User = new mongoose.model("User", UserSchema);

module.exports = User;
