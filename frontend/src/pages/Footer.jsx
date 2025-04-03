import React from "react";
import { Box, Typography } from "@mui/material";
import { startSession } from "mongoose";

const Footer = () => {
  return (
    <Box sx={{ textAlign: "center", p: 2, bgcolor: "#222", color: "white" }}>
      <Typography variant="body2">© 2025 Recipe Sharing Platform</Typography>
    </Box>
  );
};

export default Footer;
