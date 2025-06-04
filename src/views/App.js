import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "../components/Navigation/Navbar";
import Footer from "../components/Footer/Footer";
import AllArticles from "../Pages/Articles/AllArticles";
import Homepage from "../Pages/Homepage/Homepage";
import Dashboard from "../Pages/Admin/Dashboard/Dashboard";
import AdminLayout from "../components/AdminLayout/AdminLayout";
import Restaurant from "../Pages/Restaurant/Restaurant";
import Users from "../Pages/Admin/Users/Users";
import Cities from "../Pages/Admin/Cities/Citites";
import MyTrips from "../Pages/Mytrips/Mytrips";
import Attractions from "../Pages/Admin/Attractions/Attractions";
import CityDetail from "../Pages/City Detail/CityDetail";
import Profile from "../Pages/Profile/Profile";
import Restaurants from "../Pages/Admin/Restaurants/Restaurants";
import Attraction from "../Pages/Attraction/Attraction";
import Auth from "../components/LoginModal/Auth";
import ResetPasswordPage from "../components/ForgotPasswordModal/ResetPasswordPage";
import NewTrip from "../Pages/NewTrip/NewTrip";
import NewArticle from "../Pages/Articles/NewArticle";
import Article from "../Pages/Articles/Article";
import { AuthProvider } from "../contexts/AuthContext";
import Review from "../Pages/Review/Review";
import AttractionReview from "../Pages/ReviewDetail/AttractionReview";
import RestaurantReview from "../Pages/ReviewDetail/RestaurantReview";
import Form from "../Pages/NewTrip/Form";
import OpenStreetMap from "../components/OpenStreetMap/OpenStreetMap";
import SavedPlaces from "../Pages/SavedPlaces/SavedPlaces";
import AttractionList from "../Pages/AttractionList/AttractionList";
import RestaurantList from "../Pages/RestaurantList/RestaurantList";

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes
            future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
          >
            {/* Route articles */}
            <Route path="/auth-callback" element={<Auth />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
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
                  <AllArticles />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/articles/:id"
              element={
                <>
                  <Navbar />
                  <Article />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/articles/new"
              element={
                <>
                  <Navbar />
                  <NewArticle />
                  <Footer />
                </>
              }
            />

            {/* Route homepage */}
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
              path="/tripguide/new-trip-form"
              element={
                <>
                  <Navbar />
                  <Form />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/newtrip"
              element={
                <>
                  <Navbar />
                  <NewTrip />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/attraction/:id"
              element={
                <>
                  <Navbar />
                  <Attraction />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/restaurant/:id"
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
              path="/tripguide/profile"
              element={
                <>
                  <Navbar />
                  <Profile />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/review"
              element={
                <>
                  <Navbar />
                  <Review />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/review/restaurant/:restaurantId"
              element={
                <>
                  <Navbar />
                  <RestaurantReview />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/review/attraction/:attractionId"
              element={
                <>
                  <Navbar />
                  <AttractionReview />
                  <Footer />
                </>
              }
            />

            <Route
              path="/tripguide/map"
              element={
                <>
                  <Navbar />
                  <OpenStreetMap />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/saved-places"
              element={
                <>
                  <Navbar />
                  <SavedPlaces />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/attractions"
              element={
                <>
                  <Navbar />
                  <AttractionList />
                  <Footer />
                </>
              }
            />
            <Route
              path="/tripguide/restaurants"
              element={
                <>
                  <Navbar />
                  <RestaurantList />
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
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
