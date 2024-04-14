const express = require("express");
const router = express.Router();
const Recipe = require("../models/Recipe");
const authMiddleware = require("../middleware/authMiddleware");
const fs = require("fs");
const multer = require("multer");
const path = require("path");

const header = fs.readFileSync("./views/includes/header.hbs");
const footer = fs.readFileSync("./views/includes/footer.hbs");
const sidebar = fs.readFileSync("./views/includes/sidebar.hbs");

router.get("/recipes", authMiddleware, async (req, res) => {
  try {
    const recipes = await Recipe.find().lean();
    if (recipes.length) {
      res.render("recipe/view_recipes", {
        header,
        footer,
        sidebar,
        recipes,
      });
    } else {
      res.send("Error in retrieving admin list :" + err);
    }
  } catch (err) {
    res.send(err);
  }
});

router.get("/recipe/add", authMiddleware, (req, res) => {
  res.render("recipe/add_recipe", {
    header,
    footer,
    sidebar,
  });
});

// For Image upload
const storage = multer.diskStorage({
  destination: "./public/uploads/recipe", // Destination to store image
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "_" + Date.now() + path.extname(file.originalname)
    );
  },
});

// upload is middleware
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10000000, // This is Bytes (10 MB)
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      // For a single extension -> !file.originalname.endsWith('.jpg')
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
    // cb(new Error('File must be a JPG'));
  },
}).single("image");

router.post(
  "/recipe/add",
  upload,
  async (req, res) => {
    try {
      const { recipe_name, cook_time, difficulty, cuisine, ingredients } =
        req.body;
      const isRecipe = await Recipe.findOne({ name: recipe_name });

      if (!isRecipe) {
        const recipe = new Recipe({
          name: recipe_name,
          cookTimeMinutes: cook_time,
          difficulty,
          cuisine,
          ingredients: ingredients.split(","),
          image: req.file.filename,
        });

        await recipe.save((err, doc) => {
          if (!err) {
            req.flash("success", "Recipe added successfully!");
            res.redirect("/recipes");
          } else {
            console.log("Error during Recipe insertion : " + err);
          }
        });
      } else {
        req.flash("error", "Recipe already exists");
        res.render("recipe/add_recipe", { error_message: req.flash("error") });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  },
  (error, req, res, next) => {
    req.flash(
      "error",
      "Image size must be maximum 1 MB and upload only png | jpg | jpeg format"
    );
    res.render("recipe/view_recipe", { error_message: req.flash("error") });
  }
);

router.get("/recipe/edit/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).lean();
    if (recipe) {
      res.render("recipe/edit_recipe", {
        recipe,
        header,
        footer,
        sidebar,
      });
    }
  } catch (err) {
    res.send(err);
  }
});

router.post(
  "/recipe/edit/:id",
  upload,
  async (req, res) => {
    try {
      const { recipe_name, cook_time, difficulty, cuisine, ingredients } =
        req.body;
        const updateObj = {
          name: recipe_name,
          cookTimeMinutes: cook_time,
          difficulty,
          cuisine,
          ingredients: ingredients.split(","),
          // image: req.file.filename,
        }
      await Recipe.findOneAndUpdate({ _id: req.params.id }, updateObj);

      res.redirect("/recipes");

    } catch (err) {
      res.status(400).send(err);
    }
  }
);


router.get("/recipe/delete/:id", authMiddleware, async (req, res) => {
  try {
    await Recipe.findByIdAndRemove(req.params.id, (err, doc) => {
      if (!err) {
        res.redirect("/recipes");
      } else {
        res.send("Error in recipe delete :" + err);
      }
    });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
