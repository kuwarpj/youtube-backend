import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      requrired: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      requrired: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullname: {
      type: String,
      requrired: true,
      trim: true,
      index: true,
    },
    avatar: {
      type: String,
      requrired: true,
    },
    coverImage: {
      type: String,
    },
    watchHistory: {
      type: Schema.Types.ObjectId,
      ref: "Video",
    },
    password: {
      type: String,
      requrired: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);


//Pre hooks to encrypt password if password is not moidified
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = bcrypt.hash(this.password, 10);
  next();
});
export const User = mongoose.model("User", userSchema);
