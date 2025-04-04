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

const API_URL = "https://cookpad.onrender.com/api/recipes"; // Ensure API URL is correct

const AddRecipe = () => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [ingredients, setIngredients] = useState([]);  // Store as array
  const [instructions, setInstructions] = useState([]); // Store as array
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle ingredient input as multiline
  const handleIngredientsChange = (e) => {
    setIngredients(e.target.value.split("\n")); // Split on new lines
  };

  // Handle instructions input as multiline
  const handleInstructionsChange = (e) => {
    setInstructions(e.target.value.split("\n")); // Split on new lines
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!title || !category || ingredients.length === 0 || instructions.length === 0) {
      setMessage("All fields are required!");
      setMessageType("error");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("ingredients", ingredients.join("\n")); // Join before sending
    formData.append("instructions", instructions.join("\n")); // Join before sending
    if (image) formData.append("image", image);

    const token = localStorage.getItem("token"); // Get token from storage

    if (!token) {
      setMessage("You must be logged in to add a recipe.");
      setMessageType("error");
      return;
    }

    try {
      console.log("Token being sent:", token); // Debugging token
      console.log("Sending data:", formData); // Debugging request data

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
      setIngredients([]);
      setInstructions([]);
      setImage(null);
    } catch (error) {
      console.error("Error Response:", error.response); // Debugging API response
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
        <Typography
          variant="h4"
          sx={{ marginBottom: "20px", textAlign: "center" }}
        >
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
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
              <MenuItem value="Desserts">Desserts</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
            </Select>
          </FormControl>

          {/* Ingredients with spacing */}
          <TextField
            label="Ingredients (Enter each ingredient on a new line)"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={ingredients.join("\n")} // Join array for display
            onChange={handleIngredientsChange}
            required
            margin="normal"
          />

          {/* Instructions with spacing */}
          <TextField
            label="Instructions (Enter each step on a new line)"
            fullWidth
            multiline
            rows={5}
            variant="outlined"
            value={instructions.join("\n")} // Join array for display
            onChange={handleInstructionsChange}
            required
            margin="normal"
          />

          <input type="file" accept="image/*" onChange={handleImageChange} style={{ marginTop: "10px" }} />

          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: "20px" }}>
            Add Recipe
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddRecipe;

