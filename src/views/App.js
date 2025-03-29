import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Footer/Footer";
import Articles from "../Pages/Articles/Articles";
import Homepage from "../Pages/Homepage/Homepage";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Restaurant from "../Pages/Food/Restaurant";
import RestaurantInfo from "../Pages/Food/RestaurantInfo";
import Hours from "../Pages/Food/Hours";
import Reviews from "../Pages/Food/Reviews";
import Nearby from "../Pages/Food/Nearby";
import Users from "../Pages/Admin/Users/Users";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route articles */}
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

          {/* Route homepage */}
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

          {/* Route foodpage */}
          <Route
            path="/tripguide/foodpage"
            element={
              <>
                <Navbar />
                <Restaurant />
                <RestaurantInfo />
                <Hours />
                <Reviews />
                <Nearby />
                <Footer />
              </>
            }
          />

          {/* Route admin */}
          <Route path="/tripguide/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
