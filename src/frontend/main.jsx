import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import BelowHero from "./BelowHero.jsx";
import Hero from "./Hero.jsx";
import FilterTab from "./FilterTab.jsx"; 
import Navbar from "./Navbar.jsx"
import Footer from "./Footer.jsx"

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Navbar />
    <FilterTab /> 
    <Hero />
    <BelowHero />
    <Footer />
  </StrictMode>
);
