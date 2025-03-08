import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss';
import Navbar from "../components/Navigation/Navbar";
import Articles from "../components/Articles/Articles";
import Footer from "../components/Footer/Footer";
import Homepage from '../components/Homepage/Homepage';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Router>
        <Routes>
          <Route path="/tripguide/articles" element={<Articles />} />
          <Route path="/tripguide/homepage" element={<Homepage />} />
        </Routes>
      </Router>

      <Footer />
    </div>
  );
}

export default App;
