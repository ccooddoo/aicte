import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Grid,
  InputLabel,
  MenuItem,
  FormControl,
  Select,
  Box,
  Alert,
  Paper,
} from "@mui/material";

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation for empty fields
    if (!title || !category || !ingredients || !instructions) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("ingredients", ingredients);
    formData.append("instructions", instructions);
    if (image) formData.append("image", image);

    try {
      const token = localStorage.getItem("token"); // Assuming you store token in localStorage after login
      const response = await axios.post("http://localhost:5000/api/recipes", formData, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message);
      setMessageType("success");
    } catch (error) {
      console.error("Error adding recipe:", error);
      setMessage("Failed to add recipe. Try again later.");
      setMessageType("error");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 3 }}>
          Add New Recipe
        </Typography>
        <Box sx={{ paddingTop: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {/* Title Field */}
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  fullWidth
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Category Field */}
              <Grid item xs={12}>
                <FormControl fullWidth required sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    label="Category"
                  >
                    <MenuItem value="Vegetarian">Vegetarian</MenuItem>
                    <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
                    <MenuItem value="Desserts">Desserts</MenuItem>
                    <MenuItem value="Drinks">Drinks</MenuItem>
                    <MenuItem value="Snacks">Snacks</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Ingredients Field */}
              <Grid item xs={12}>
                <TextField
                  label="Ingredients (comma separated)"
                  variant="outlined"
                  fullWidth
                  value={ingredients}
                  onChange={(e) => setIngredients(e.target.value)}
                  required
                  multiline
                  rows={4} // Set the initial rows to allow more space when user presses Enter
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Instructions Field */}
              <Grid item xs={12}>
                <TextField
                  label="Instructions"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={4} // Set the initial rows to allow more space when user presses Enter
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  required
                  sx={{ mb: 2 }}
                />
              </Grid>

              {/* Image Upload Field */}
              <Grid item xs={12}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ marginBottom: "1rem" }}
                />
              </Grid>

              {/* Submit Button */}
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ padding: "12px 0" }}
                >
                  Add Recipe
                </Button>
              </Grid>
            </Grid>
          </form>
        </Box>

        {/* Display success or error message */}
        {message && (
          <Alert severity={messageType === "error" ? "error" : "success"} sx={{ marginTop: 2 }}>
            {message}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default AddRecipe;
