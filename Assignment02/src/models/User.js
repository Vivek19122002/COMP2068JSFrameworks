const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
      required: true,
    },
    lastname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Generting token - This is a type of middleware
userSchema.methods.generateUserAuthToken = async function () {
  try {
    const user = this;
    // here the secret key is minimum 32 character thisisloginregistrationforpractice
    const token = jwt.sign(
      { _id: user._id.toString() },
      process.env.TOKEN_SECRET_KEY
    );

    return token;
  } catch (error) {
    console.log(error);
  }
};

// Hash the plain text password before saving
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

const User = new mongoose.model("User", userSchema);

module.exports = User;
