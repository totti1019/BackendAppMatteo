const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    nome: {
      type: String,
      required: false,
    },
    cognome: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    id: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
