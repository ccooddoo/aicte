import React, { useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { AppBar, Toolbar, Button, Typography, TextField, Box } from "@mui/material";

const Navbar = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ Track input
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return; // Prevent empty searches
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        {/* Brand Logo */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ textDecoration: "none", color: "white" }}>
            Cookpad
          </Link>
        </Typography>

        {/* Search Box */}
        <Box component="form" onSubmit={handleSearch} sx={{ mr: 2 }}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search recipes..."
            value={searchQuery} // ✅ Controlled input
            onChange={(e) => setSearchQuery(e.target.value)} // ✅ Update state
            sx={{ backgroundColor: "white", borderRadius: 1, width: "200px" }}
          />
          <Button type="submit" variant="contained" sx={{ ml: 1 }}>
            Search
          </Button>
        </Box>

        {/* Show Profile & Logout if logged in, otherwise Login/Register */}
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={Link} to="/profile">
              {user?.username || "Profile"}
            </Button>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
