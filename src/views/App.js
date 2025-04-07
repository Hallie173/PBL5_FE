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
import Users from "../Pages/Admin/Users/Users";
import Cities from "../Pages/Admin/Cities/Citites";
import MyTrips from "../components/Mytrips/Mytrips";
import Attractions from "../Pages/Admin/Attractions/Attractions";
import CityDetail from "../Pages/City Detail/CityDetail";
import Profile from "../Pages/Profile/Profile";
import Restaurants from "../Pages/Admin/Restaurants/Restaurants";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Route articles */}
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
            path="/tripguide/user-profile"
            element={
              <>
                <Navbar />
                <Profile />
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
          <Route
            path="/tripguide/citydetail/:id"
            element={
              <>
                <Navbar />
                <CityDetail />
                <Footer />
              </>
            }
          />
          <Route
            path="/tripguide/user-profile"
            element={
              <>
                <Navbar />
                <Profile />
                <Footer />
              </>
            }
          />
          {/* Route admin */}
          <Route path="/tripguide/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<Users />} />
            <Route path="cities" element={<Cities />} />
            <Route path="attractions" element={<Attractions />} />
            <Route path="restaurants" element={<Restaurants />} />

          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;