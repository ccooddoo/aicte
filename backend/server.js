require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();

// ✅ CORS Configuration
const CLIENT_URL = process.env.REACT_APP_FRONTEND_URL || "http://localhost:3000"; // Frontend URL from .env
app.use(cors({
  origin: CLIENT_URL,  // Allow requests only from the frontend URL set in .env
  credentials: true    // Allow cookies to be sent with requests
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Support form data
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // Serve uploaded images

// ✅ MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ JWT Secret and Backend URL
const JWT_SECRET = process.env.JWT_SECRET;
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000"; // Backend URL from .env

// ✅ User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// ✅ Recipe Schema
const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  ingredients: [String],
  instructions: { type: String, required: true },
  image: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
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
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ userId: user._id, username: user.username }, JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "Login successful", token, username: user.username, userId: user._id });
  } catch (error) {
    console.error("❌ Login error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Middleware to verify JWT token
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

// ✅ Image Upload Configuration
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// ✅ API to upload recipe image
app.post("/api/recipes/upload", upload.single("image"), (req, res) => {
  try {
    const imageUrl = `${BACKEND_URL}/uploads/${req.file.filename}`;
    res.json({ message: "Image uploaded successfully", imageUrl });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Recipe API - Create a new recipe
app.post("/api/recipes", verifyToken, async (req, res) => {
  try {
    const { title, category, ingredients, instructions, image } = req.body;
    const newRecipe = new Recipe({
      title,
      category,
      ingredients,
      instructions,
      image,
      createdBy: req.user.userId, // Linking recipe to the user
    });
    await newRecipe.save();
    res.status(201).json({ message: "Recipe created successfully", recipe: newRecipe });
  } catch (error) {
    console.error("❌ Recipe creation error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Recipe API - Get all recipes
app.get("/api/recipes", async (req, res) => {
  try {
    const recipes = await Recipe.find().populate("createdBy", "username");
    res.json({ recipes });
  } catch (error) {
    console.error("❌ Get recipes error:", error);
    res.status(500).json({ message: "Server error. Try again!" });
  }
});

// ✅ Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
