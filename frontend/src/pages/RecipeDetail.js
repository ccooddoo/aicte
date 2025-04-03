import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Card, CardMedia, CardContent, CircularProgress } from "@mui/material";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error("❌ Error fetching recipe:", error);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      {recipe && (
        <Card>
          {recipe.image && <CardMedia component="img" height="300" image={`http://localhost:5000${recipe.image}`} alt={recipe.title} />}
          <CardContent>
            <Typography variant="h4">{recipe.title}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Ingredients:</Typography>
            <Typography>{recipe.ingredients?.join(", ")}</Typography>
            <Typography variant="h6" sx={{ mt: 2 }}>Instructions:</Typography>
            <Typography>{recipe.instructions}</Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RecipeDetails;
