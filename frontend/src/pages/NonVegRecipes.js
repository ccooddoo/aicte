
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  Box,
  CircularProgress,
  Collapse,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { jwtDecode } from "jwt-decode";

const DrinkRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedRecipe, setExpandedRecipe] = useState(null);
  const [editRecipe, setEditRecipe] = useState(null);
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem("token");
  const loggedInUserId = token ? jwtDecode(token).userId : null;

  // Fetch Drink Recipes
  const fetchRecipes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get("http://localhost:5000/api/recipes?category=Drink");
      setRecipes(response.data);
    } catch (err) {
      setError("⚠️ Unable to fetch drink recipes. Please try again later.");
      console.error("Error fetching drink recipes:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleEditClick = (recipe) => {
    setEditRecipe(recipe);
    setTitle(recipe.title);
    setIngredients(recipe.ingredients.join("\n"));
    setInstructions(recipe.instructions);
    setOpen(true);
  };

  const handleEditRecipe = async () => {
    if (!title || !ingredients || !instructions) {
      alert("⚠️ All fields are required!");
      return;
    }

    const updatedData = {
      title,
      ingredients: ingredients.split("\n").map(i => i.trim()),
      instructions,
    };

    try {
      await axios.put(`http://localhost:5000/api/recipes/${editRecipe._id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("✅ Recipe updated successfully!");
      fetchRecipes();
      setOpen(false);
    } catch (error) {
      console.error("Error updating recipe:", error);
      alert("❌ Failed to update recipe. Please try again.");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      await axios.delete(`http://localhost:5000/api/recipes/${recipeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ Recipe deleted successfully!");
      setRecipes((prevRecipes) => prevRecipes.filter((r) => r._id !== recipeId));
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("❌ Failed to delete recipe. Please try again.");
    }
  };

  return (
    <Container>
      <Typography variant="h4" align="center" sx={{ fontWeight: "bold", color: "#0288D1", mb: 3 }}>
        🥤 Drink Recipes
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography align="center" sx={{ color: "red", fontSize: "1rem", mt: 3 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && (
        <Grid container spacing={3} justifyContent="center">
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card
                sx={{
                  maxWidth: 400,
                  borderRadius: 4,
                  boxShadow: 3,
                  textAlign: "center",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": { transform: "scale(1.05)", boxShadow: 6 },
                }}
              >
                {recipe.image && (
                  <CardMedia
                    component="img"
                    sx={{ width: "100%", height: 220, objectFit: "cover", borderRadius: "4px 4px 0 0" }}
                    image={recipe.image.startsWith("http") ? recipe.image : `http://localhost:5000${recipe.image}`}
                    alt={recipe.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: "bold", color: "#0288D1", mb: 1 }}>
                    {recipe.title}
                  </Typography>

                  <Typography sx={{ fontSize: "0.9rem", color: "#616161", mt: 1 }}>
                    <b>Added by:</b> {recipe.createdBy?.username || "Unknown"}
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() =>
                      setExpandedRecipe(expandedRecipe === recipe._id ? null : recipe._id)
                    }
                  >
                    {expandedRecipe === recipe._id ? "⬆️ Show Less" : "⬇️ Read More"}
                  </Button>

                  <Collapse in={expandedRecipe === recipe._id}>
                    <Box sx={{ textAlign: "left", mt: 2 }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#388E3C", mb: 1 }}>
                        Ingredients:
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line", color: "#616161" }}>
                        {recipe.ingredients.join("\n")}
                      </Typography>

                      <Typography variant="body2" sx={{ fontWeight: "bold", color: "#E65100", mt: 1 }}>
                        Instructions:
                      </Typography>
                      <Typography sx={{ whiteSpace: "pre-line", color: "#616161" }}>
                        {recipe.instructions}
                      </Typography>

                      {loggedInUserId === recipe.createdBy?._id && (
                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                          <Button
                            variant="contained"
                            color="success"
                            startIcon={<EditIcon />}
                            onClick={() => handleEditClick(recipe)}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteRecipe(recipe._id)}
                          >
                            Delete
                          </Button>
                        </Box>
                      )}
                    </Box>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth>
        <DialogTitle>Edit Drink Recipe</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Title" value={title} onChange={(e) => setTitle(e.target.value)} sx={{ mt: 2 }} />
          <TextField fullWidth label="Ingredients" value={ingredients} onChange={(e) => setIngredients(e.target.value)} sx={{ mt: 2 }} multiline rows={4} />
          <TextField fullWidth label="Instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} sx={{ mt: 2 }} multiline rows={4} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEditRecipe} color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default DrinkRecipes;
