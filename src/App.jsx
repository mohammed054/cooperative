import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GhaimAEHeader from "./components/GhaimAEHeader";
import Footer from "./components/Footer";
import OurProjects from "./components/OurProjects";
import ScrollToTop from "./components/ScrollToTop";
import Home from "./pages/Home";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <GhaimAEHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<OurProjects />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
