const mongoose = require("mongoose");
const validator = require("validator");

const localizable = require("../locales/localizables");

const userSchema = mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: localizable.emailNonValida,
      },
    },
    id: {
      type: String,
      require: false,
    },
    password: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
