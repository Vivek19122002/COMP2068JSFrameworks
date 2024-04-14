const mongoose = require("mongoose");
const recipeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    ingredients: {
      type: Array,
      required: true,
    },
    cookTimeMinutes: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Recipe = new mongoose.model("Recipe", recipeSchema);

module.exports = Recipe;
