import mongoose from "mongoose";

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

export const User = mongoose.model("User", userSchema);
