import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CircularProgress,
} from "@mui/material";

const RecipeDetails = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/recipes/${id}`);
        setRecipe(response.data);
      } catch (err) {
        console.error("❌ Error fetching recipe:", err);
        setError("Failed to load recipe.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, API_BASE_URL]);

  if (loading) {
    return <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />;
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      {recipe && (
        <Card>
          {recipe.image && (
            <CardMedia
              component="img"
              height="300"
              image={
                recipe.image.startsWith("http")
                  ? recipe.image
                  : `${API_BASE_URL}${recipe.image}`
              }
              alt={recipe.title}
            />
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {recipe.title}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Ingredients:
            </Typography>
            <Typography variant="body1">
              {recipe.ingredients?.join(", ")}
            </Typography>

            <Typography variant="h6" sx={{ mt: 2 }}>
              Instructions:
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
              {recipe.instructions}
            </Typography>
          </CardContent>
        </Card>
      )}
    </Container>
  );
};

export default RecipeDetails;

