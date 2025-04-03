import React, { useState, useContext } from "react";
import { TextField, Button, Container, Typography, Alert, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext"; // Importing the AuthContext for login handling
import axios from "axios"; // Axios for HTTP requests

const Login = () => {
  const [email, setEmail] = useState(""); // State for email input
  const [password, setPassword] = useState(""); // State for password input
  const [error, setError] = useState(null); // State to handle error messages
  const { login } = useContext(AuthContext); // Getting login function from AuthContext
  const navigate = useNavigate(); // For navigation after successful login

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Resetting the error state before new login attempt

    try {
      // Sending a POST request to the backend for authentication
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });

      // Storing received token and username in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);

      // Calling the login function from context and redirecting to the profile page
      login(response.data.token);
      navigate("/profile"); // Redirect to the profile page after login
    } catch (error) {
      // Handling error and displaying the error message
      setError(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: "40px", backgroundColor: "white", borderRadius: "8px", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)" }}>
        <Typography variant="h4" sx={{ marginBottom: "20px", textAlign: "center" }}>
          Login
        </Typography>

        {error && <Alert severity="error" sx={{ marginBottom: "15px" }}>{error}</Alert>}

        <form onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
            margin="normal"
          />
          <Button type="submit" variant="contained" fullWidth sx={{ marginTop: "20px" }}>
            Login
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default Login;