const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");

const header = fs.readFileSync("./views/includes/header.hbs");
const footer = fs.readFileSync("./views/includes/footer.hbs");
const sidebar = fs.readFileSync("./views/includes/sidebar.hbs");

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  try {
    const { firstname, lastname, email, password, confirm_password } = req.body;
    const checkEmail = await User.find({ email }).countDocuments();

    if (checkEmail === 0) {
      if (password === confirm_password) {
        const user = new User({
          firstname,
          lastname,
          email,
          password,
        });

        // save data
        await user.save();

        req.flash("success", "User registration successfully!");
        res.status(201).render("login", {
          success_message: req.flash("success"),
        });
      } else {
        req.flash("error", "Password not Match!");
        res.render("register", {
          error_message: req.flash("error"),
        });
      }
    } else {
      req.flash("error", "Email Already exists!");
      res.render("register", {
        error_message: req.flash("error"),
      });
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    let isMatch;
    if (password && user) {
      isMatch = await bcrypt.compare(password, user?.password);
    }
    if (isMatch) {
      const token = await user.generateUserAuthToken();
      res.cookie("user", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        httpOnly: true,
      });

      res.redirect("/home");
    } else {
      req.flash("error", "Email or Password Invalid");
      res.render("login", {
        error_message: req.flash("error"),
      });
    }
  } catch (err) {
    console.log(err);
    req.flash("error", "Email or Password Invalid");
    res.render("login", {
      error_message: req.flash("error"),
    });
  }
});

router.get("/home", (req, res) => {
  res.render("user/dashboard", { header, footer, sidebar });
});

router.get("/users", authMiddleware, async (req, res) => {
  try {
    const users = await User.find().lean();
    if (users.length) {
      res.render("user/view_users", {
        header,
        footer,
        sidebar,
        users,
      });
    } else {
      res.send("Error in retrieving admin list :" + err);
    }
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
