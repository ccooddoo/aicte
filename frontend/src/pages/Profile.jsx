import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Button,
  Avatar,
  Card,
  CardContent,
  TextField,
  Box,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import UploadIcon from "@mui/icons-material/Upload";

const ProfilePage = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    profilePic: "https://via.placeholder.com/150",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });

  useEffect(() => {
    const storedUsername = localStorage.getItem("username") || "Guest User";
    const storedEmail = localStorage.getItem("email") || "guest@example.com";
    const storedProfilePic =
      localStorage.getItem("profilePic") || "https://via.placeholder.com/150";

    setUser({ username: storedUsername, email: storedEmail, profilePic: storedProfilePic });
    setUpdatedUser({ username: storedUsername, email: storedEmail, profilePic: storedProfilePic });
  }, []);

  // Convert image to Base64 for storage
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const base64 = await convertToBase64(file);
      setUpdatedUser({ ...updatedUser, profilePic: base64 });
    }
  };

  const handleSave = () => {
    if (!updatedUser.username.trim()) {
      alert("Username cannot be empty!");
      return;
    }
    if (!updatedUser.email.includes("@")) {
      alert("Enter a valid email address!");
      return;
    }

    setUser(updatedUser);
    localStorage.setItem("username", updatedUser.username);
    localStorage.setItem("email", updatedUser.email);
    localStorage.setItem("profilePic", updatedUser.profilePic);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card sx={{ p: 3, boxShadow: 3, borderRadius: 3, textAlign: "center", mb: 4 }}>
        {/* Profile Image Section */}
        <Box sx={{ position: "relative", display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
          <Avatar src={updatedUser.profilePic} sx={{ width: 120, height: 120, mb: 2 }} />

          {/* Upload Button */}
          {isEditing && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                id="profile-pic-upload"
                style={{ display: "none" }}
              />
              <label htmlFor="profile-pic-upload">
                <Button variant="contained" color="secondary" startIcon={<UploadIcon />} component="span">
                  Upload
                </Button>
              </label>
            </>
          )}
        </Box>

        <CardContent>
          {isEditing ? (
            <>
              <TextField
                fullWidth
                label="Username"
                variant="outlined"
                value={updatedUser.username}
                onChange={(e) => setUpdatedUser({ ...updatedUser, username: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Email"
                type="email"
                variant="outlined"
                value={updatedUser.email}
                onChange={(e) => setUpdatedUser({ ...updatedUser, email: e.target.value })}
                sx={{ mb: 2 }}
              />
              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" color="success" startIcon={<SaveIcon />} onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" color="error" startIcon={<CancelIcon />} onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
              </Box>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                {user.username}
              </Typography>
              <Typography variant="body1" sx={{ color: "gray", mb: 3 }}>
                {user.email}
              </Typography>

              <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                <Button variant="contained" color="primary" startIcon={<EditIcon />} onClick={() => setIsEditing(true)}>
                  Edit Profile
                </Button>
              </Box>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
};

export default ProfilePage;
