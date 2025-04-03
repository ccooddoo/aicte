import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// ✅ Import Images
import heroImage from "../pages/hero.jpg";
import vegImage from "../pages/veg.jpg";
import nonVegImage from "../pages/nonveg.jpg";
import dessertImage from "../pages/dessert.jpg";
import drinkImage from "../pages/drink.jpg";
import snackImage from "../pages/snack.jpg";

// ✅ Recipe Categories
const categories = [
  { name: "Vegetarian", image: vegImage, link: "/vegetarian" },
  { name: "Non-Vegetarian", image: nonVegImage, link: "/non-veg" },
  { name: "Desserts", image: dessertImage, link: "/desserts" },
  { name: "Drinks", image: drinkImage, link: "/drinks" },
  { name: "Snacks", image: snackImage, link: "/snacks" },
];

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleAddRecipeClick = () => {
    navigate(isLoggedIn ? "/add-recipe" : "/login");
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        color: "white",
      }}
    >
      {/* ✅ Hero Background Image */}
      <img
        src={heroImage}
        alt="Hero"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: -1,
          filter: "brightness(70%)",
        }}
      />

      {/* ✅ Main Hero Content */}
      <Typography
        variant="h2"
        sx={{ fontWeight: "bold", mb: 2, textShadow: "2px 2px 8px rgba(0,0,0,0.7)" }}
      >
        Discover Delicious Recipes
      </Typography>
      <Typography variant="h5" sx={{ textShadow: "1px 1px 5px rgba(0,0,0,0.6)", mb: 3 }}>
        Cook, Share, and Enjoy!
      </Typography>

      {/* ✅ Category Slider (on Hero Image) */}
      <Box sx={{ width: "80%", mb: 3, margin: "0 auto", "& .slick-slide": { padding: "0 5px" } }}>
        <Slider
          dots={false}
          infinite={true}
          speed={500}
          slidesToShow={3}
          slidesToScroll={1}
          autoplay={true}
          autoplaySpeed={2000}
          responsive={[
            { breakpoint: 1024, settings: { slidesToShow: 3 } },
            { breakpoint: 768, settings: { slidesToShow: 2 } },
            { breakpoint: 500, settings: { slidesToShow: 1 } },
          ]}
        >
          {categories.map((category) => (
            <Box
              key={category.name}
              sx={{
                textAlign: "center",
                cursor: "pointer",
                transition: "transform 0.3s",
                "&:hover .image-container img": { transform: "scale(1.1)" },
              }}
              onClick={() => navigate(category.link)}
            >
              {/* ✅ Image Wrapper */}
              <Box
                className="image-container"
                sx={{
                  width: "180px",
                  height: "180px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  position: "relative",
                  border: "4px solid #ff6600",
                  boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  margin: "0 auto",
                }}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.3s ease-in-out",
                  }}
                />
              </Box>

              {/* ✅ Category Name */}
              <Typography
                sx={{
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                  color: "white",
                  textShadow: "2px 2px 8px rgba(0,0,0,0.7)",
                  mt: 1,
                }}
              >
                {category.name}
              </Typography>
            </Box>
          ))}
        </Slider>
      </Box>

      {/* ✅ Add Recipe Button */}
      <Button
        variant="contained"
        color="warning"
        sx={{
          fontSize: "18px",
          padding: "12px 25px",
          borderRadius: "30px",
          boxShadow: "0px 5px 10px rgba(255,102,0,0.3)",
          "&:hover": { backgroundColor: "#ff5500" },
        }}
        onClick={handleAddRecipeClick}
      >
        Add Recipes
      </Button>
    </Box>
  );
};

export default Home;
