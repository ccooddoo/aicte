require("dotenv").config(); // Load environment variables FIRST

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

const app = express();

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ✅ CORS setup
app.use(cors({
  origin: process.env.REACT_APP_FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

// ✅ Connect to MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log(`✅ Connected to MongoDB`))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model("User", userSchema);

// ✅ Recipe Schema
const recipeSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  category:     { type: String, required: true },
  ingredients:  [String],
  instructions: { type: String, required: true },
  image:        String,
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
const Recipe = mongoose.model("Recipe", recipeSchema);

// ✅ Register API
app.post("/api/auth/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password)
      return res.status(400).json({ message: "All fields are required!" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("❌ Registration error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Login API
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, username: user.username, userId: user._id });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ JWT Middleware
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Access denied!" });

  try {
    const decoded = jwt.verify(token.split(" ")[1], JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(403).json({ message: "Invalid token!" });
  }
};

// ✅ Multer Config (memory)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ✅ Helper: Upload to Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "recipes" },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    Readable.from(buffer).pipe(stream);
  });
};

// ✅ Add Recipe
app.post("/api/recipes", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, category, ingredients, instructions } = req.body;
    if (!title || !category || !ingredients || !instructions)
      return res.status(400).json({ message: "All fields are required!" });

    const formattedIngredients = Array.isArray(ingredients)
      ? ingredients
      : ingredients.split(",").map(i => i.trim());

    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadToCloudinary(req.file.buffer);
    }

    const newRecipe = new Recipe({
      title,
      category,
      ingredients: formattedIngredients,
      instructions,
      image: imageUrl,
      createdBy: req.user.userId,
    });

    await newRecipe.save();
    res.status(201).json({ message: "Recipe added successfully!", recipe: newRecipe });
  } catch (error) {
    console.error("❌ Error adding recipe:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Get Recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const { category } = req.query;
    const query = category ? { category } : {};
    const recipes = await Recipe.find(query).populate("createdBy", "username");
    res.status(200).json(recipes);
  } catch (error) {
    console.error("❌ Error fetching recipes:", error);
    res.status(500).json({ message: "Failed to fetch recipes!" });
  }
});

// ✅ Edit Recipe
app.put("/api/recipes/:id", verifyToken, upload.single("image"), async (req, res) => {
  try {
    const { title, category, ingredients, instructions } = req.body;

    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found!" });

    if (recipe.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized action!" });

    const updateData = {
      title,
      category,
      ingredients: Array.isArray(ingredients) ? ingredients : ingredients.split(",").map(i => i.trim()),
      instructions,
    };

    if (req.file) {
      updateData.image = await uploadToCloudinary(req.file.buffer);
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ message: "Recipe updated successfully!", recipe: updatedRecipe });
  } catch (error) {
    console.error("❌ Error updating recipe:", error);
    res.status(500).json({ message: "Failed to update recipe!" });
  }
});

// ✅ Delete Recipe
app.delete("/api/recipes/:id", verifyToken, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found!" });

    if (recipe.createdBy.toString() !== req.user.userId)
      return res.status(403).json({ message: "Unauthorized action!" });

    await Recipe.findByIdAndDelete(req.params.id);
    res.json({ message: "Recipe deleted successfully!" });
  } catch (error) {
    console.error("❌ Error deleting recipe:", error);
    res.status(500).json({ message: "Failed to delete recipe!" });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
