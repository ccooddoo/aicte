import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  Paper,
} from "@mui/material";
import axios from "axios";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axios.post("http://localhost:5000/api/recipes", {
        title,
        ingredients,
        instructions,
      });

      setSuccess("Recipe added successfully!");
      setTitle("");
      setIngredients("");
      setInstructions("");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add recipe!");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Add Recipe
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <TextField
            label="Recipe Title"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            margin="normal"
          />

          <TextField
            label="Ingredients"
            variant="outlined"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            fullWidth
            required
            margin="normal"
            multiline
            rows={3}
          />

          <TextField
            label="Instructions"
            variant="outlined"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            fullWidth
            required
            margin="normal"
            multiline
            rows={4}
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ padding: "12px 0", mt: 2 }}
          >
            Add Recipe
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default AddRecipe;
