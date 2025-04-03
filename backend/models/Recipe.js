const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }], // 🔹 Change to an array
  instructions: { type: String, required: true },
  image: { type: String }, // Optional image URL
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User reference
}, { timestamps: true });

const Recipe = mongoose.model("Recipe", recipeSchema);
export default Recipe;
