import express from "express";
import multer from "multer";
import fs from "fs";
import path from "path";
import Recipe from "../models/Recipe.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Ensure "uploads" folder exists
const uploadDir = "uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
// ✅ Fetch User Profile (Protected Route)
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password"); // Exclude password
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Multer setup for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ✅ Create Recipe (with Image Upload)
router.post("/", authMiddleware, upload.single("image"), async (req, res) => {
  try {
    const { title, ingredients, instructions } = req.body;
    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

    // Ensure ingredients are stored as an array
    const ingredientsArray = typeof ingredients === "string" ? ingredients.split(",").map(i => i.trim()) : ingredients;

    const newRecipe = new Recipe({
      title,
      ingredients: ingredientsArray,
      instructions,
      image: imagePath,
      createdBy: req.user.id,
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully", recipe: newRecipe });
  } catch (error) {
    console.error("❌ Error adding recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Get All Recipes
router.get("/", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username");
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Delete Recipe (Only By Creator)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    // Ensure only the creator can delete it
    if (recipe.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Delete image file from uploads folder
    if (recipe.image) {
      const imagePath = path.join(__dirname, "..", recipe.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await recipe.deleteOne();
    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});
// ✅ Get Single Recipe
router.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate("createdBy", "username");
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });

    res.status(200).json(recipe);
  } catch (error) {
    console.error("❌ Error fetching recipe:", error);
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;
