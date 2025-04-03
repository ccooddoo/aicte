import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, CircularProgress } from "@mui/material";

const SearchResults = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  
  const searchQuery = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!searchQuery) return;

    const fetchRecipes = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://localhost:5000/api/recipes/search?q=${encodeURIComponent(searchQuery)}`);
        setRecipes(response.data);
      } catch (error) {
        console.error("❌ Error fetching search results:", error);
        setError("Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [searchQuery]);

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Search Results for "{searchQuery || "..."}"
      </Typography>

      {loading ? (
        <CircularProgress sx={{ display: "block", mx: "auto", my: 3 }} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : recipes.length === 0 ? (
        <Typography>No recipes found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card>
                {recipe.image && (
                  <CardMedia component="img" height="200" image={`http://localhost:5000${recipe.image}`} alt={recipe.title} />
                )}
                <CardContent>
                  <Typography variant="h5">{recipe.title}</Typography>
                  <Typography variant="body2">
                    {Array.isArray(recipe.ingredients) ? recipe.ingredients.join(", ") : "Ingredients not available"}
                  </Typography>
                  <Button
                    sx={{ mt: 1 }}
                    variant="contained"
                    color="primary"
                    onClick={() => navigate(`/recipe/${recipe._id}`)}
                  >
                    View Recipe
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default SearchResults;
