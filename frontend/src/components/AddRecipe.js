import React, { useState } from "react";
import {
  TextField,
  Button,
  Container,
  Typography,
  Alert,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "https://cookpad.onrender.com/api/recipes"; // Ensure this is correct

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
      const token = localStorage.getItem("token");
      if (!token) {
        setMessage("You must be logged in to add a recipe.");
        setMessageType("error");
        return;
      }

      const response = await axios.post(API_URL, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setMessage(response.data.message || "Recipe added successfully!");
      setMessageType("success");

      // Reset form fields
      setTitle("");
      setCategory("");
      setIngredients("");
      setInstructions("");
      setImage(null);
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to add recipe. Try again later.");
      setMessageType("error");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          padding: "40px",
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
          Add New Recipe
        </Typography>

        {message && <Alert severity={messageType} sx={{ marginBottom: "15px" }}>{message}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select value={category} onChange={(e) => setCategory(e.target.value)} required>
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
              <MenuItem value="Desserts">Desserts</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Ingredients (comma-separated)"
            fullWidth
            variant="outlined"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
            margin="normal"
          />
          <TextField
            label="Instructions"
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
            margin="normal"
          />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "10px", display: "block", marginBottom: "15px" }}
          />

          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: "20px" }}>
            Add Recipe
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddRecipe;
