const Recipe = require("../models/Recipe");
const fs = require("fs");

const recipeData = fs.readFileSync("./src/seeder/recipe.json");
const recipeJson =  JSON.parse(recipeData);

(async function() {
  const recipes = await Recipe.find().lean()
  if (!recipes.length) {
    await Recipe.insertMany(recipeJson);
  }
})();
