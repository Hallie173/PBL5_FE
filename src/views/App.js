import React, { useState, useContext, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.scss';
import Navbar from "../components/Navigation/Navbar";
import Articles from "../components/Articles/Articles";
import Footer from "../components/Footer/Footer";
import Homepage from '../components/Homepage/Homepage';
import Restaurant from "../components/Food/Restaurant";
import MyTrips from "../components/Mytrips/Mytrips";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Navbar />
                <Homepage />
                <Footer />
              </>
            }
          />
          <Route
            path="/tripguide/articles"
            element={
              <>
                <Navbar />
                <Articles />
                <Footer />
              </>
            }
          />
          <Route
            path="/tripguide/homepage"
            element={
              <>
                <Navbar />
                <Homepage />
                <Footer />
              </>
            }
          />
          <Route
            path="/tripguide/mytrip"
            element={
              <>
                <Navbar />
                <MyTrips />
                <Footer />
              </>
            }
          />
          <Route
            path="/tripguide/foodpage/:id"
            element={
              <>
                <Navbar />
                <Restaurant />
                <Footer />
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
