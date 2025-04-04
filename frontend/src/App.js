import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthProvider from "./contexts/AuthProvider"; // ✅ Correct import

// Import Pages
import Home from "./pages/Home";
import VegetarianRecipes from "./pages/VegetarianRecipes";
import NonVegRecipes from "./pages/NonVegRecipes";
import DessertRecipes from "./pages/DessertRecipes";
import DrinksRecipes from "./pages/DrinksRecipes";
import SnacksRecipes from "./pages/SnacksRecipes";
import AddRecipe from "./components/AddRecipe";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import RecipeDetail from "./pages/RecipeDetail"; // ✅ Import RecipeDetail

// Import Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchResults from "./components/SearchResults";

const App = () => {
  return (
    <AuthProvider> {/* ✅ Correct usage */}
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vegetarian" element={<VegetarianRecipes />} />
          <Route path="/non-veg" element={<NonVegRecipes />} />
          <Route path="/desserts" element={<DessertRecipes />} />
          <Route path="/drinks" element={<DrinksRecipes />} />
          <Route path="/snacks" element={<SnacksRecipes />} />
          <Route path="/add-recipe" element={<AddRecipe/>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register/>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} /> 
          
           

        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
};

export default App;

