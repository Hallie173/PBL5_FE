import React, { useState, useEffect } from "react";
import "./NewTrip.scss";
import newtrippic from "../../assets/images/Cities/goldenbridge.png";
import {
  faCalendarDay,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { FaPen, FaXmark } from "react-icons/fa6";
import AddLocationForm from "./AddLocationForm";
import DeleteConfirm from "./DeleteConfirm";

function NewTrip() {
  const location = useLocation();
  const {
    selectedTags = [],
    startDate = "",
    endDate = "",
    selectedCity = "",
    selectedResTags = [],
    mode = "",
    itinerary_id = -1,
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
  const [itineraryData, setItineraryData] = useState([]);
  const [formState, setFormState] = useState({
    visible: false,
    mode: "add",
    data: null,
    editingDay: null,
    editingIndex: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    day: null,
    index: null,
  });
  const [cityAttraction, setCityAttraction] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const startTime = "09:00";
        const endTime = "15:00";
        const tagParams = selectedTags.map((tag) => `tags=${tag}`).join("&");
        const restagParams = selectedResTags.map((tag) => `${tag}`).join("&");
        const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${restagParams}&startDate=${startDate}&endDate=${endDate}`;
        const Itiresponse = await axios.get(url);
        setItineraryData(Itiresponse.data);

        const cityResponse = await axios.get(
          `${BASE_URL}/cities/${selectedCity}`
        );
        setCity(cityResponse.data);

        const cityAttraction = await axios.get(
          `${BASE_URL}/attractions/city/${selectedCity}`
        );
        setCityAttraction(cityAttraction.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (mode === "create") {
      fetchData();
    } else if (mode === "update" && itinerary_id !== -1) {
      // Handle update mode here
    }
  }, []);

  const handleDeleteClick = (day, index) => {
    setDeleteConfirm({
      isOpen: true,
      day,
      index,
    });
  };

  // Hàm xác nhận xóa
  const handleDeleteConfirm = () => {
    const { day, index } = deleteConfirm;
    const updatedItinerary = itineraryData.filter(
      (item, idx) => !(item.day === day && idx === index)
    );
    setItineraryData(updatedItinerary);
    setDeleteConfirm({ isOpen: false, day: null, index: null });
  };

  // Hàm hủy bỏ xóa
  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, day: null, index: null });
  };

  const handleAddLocation = () => {
    setFormState({
      visible: true,
      mode: "add",
      data: null,
      editingDay: null,
      editingIndex: null,
    });
  };

  const handleEditLocation = (location, day, index) => {
    setFormState({
      visible: true,
      mode: "edit",
      data: location,
      editingDay: day,
      editingIndex: index,
    });
  };

  const handleCancel = () => {
    setFormState({
      visible: false,
      mode: "add",
      data: null,
      editingDay: null,
      editingIndex: null,
    });
    setSelectedLocation(null);
    setStartTime("");
    setEndTime("");
  };

  const handleSaveItinerary = async () => {
    if (!user?.user_id) {
      alert("Need login to create itinerary!");
      return;
    }

    if (mode === "create") {
      try {
        const title = "Trip to " + city?.name;
        const response = await axios.post(`${BASE_URL}/itinerary/`, {
          title,
          description: "A 3-day trip exploring Da Nang",
          start_date: startDate,
          end_date: endDate,
          status: "private",
          user_id: user.user_id,
        });

        const newItineraryId = response.data.itinerary_id;
        alert("Itinerary created successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to create itinerary");
      }
    }
  };

  const handleSave = (editingDay, editingIndex) => {
    if (!selectedLocation || !startTime || !endTime) {
      alert("Please select a location and time!");
      return;
    }

    const timeToMinutes = (time) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const haversineDistance = (lat1, lon1, lat2, lon2) => {
      const toRad = (x) => (x * Math.PI) / 180;
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const estimateTravelTime = (from, to) => {
      const distance = haversineDistance(
        parseFloat(from.latitude),
        parseFloat(from.longitude),
        parseFloat(to.latitude),
        parseFloat(to.longitude)
      );
      const speed = 30; // km/h
      return (distance / speed) * 60;
    };

    const arrival = timeToMinutes(startTime);
    const departure = timeToMinutes(endTime);
    if (arrival >= departure) {
      alert("Start time must be before end time.");
      return;
    }

    const visit_duration = departure - arrival;

    const newLocation = {
      type: "attraction",
      name: selectedLocation.name,
      arrival_time: startTime,
      departure_time: endTime,
      duration_minutes: visit_duration,
      travel_from_prev_minutes: 0,
      average_rating: selectedLocation.average_rating,
      rating_total: selectedLocation.rating_total,
      tags: selectedLocation.tags,
      image_url: selectedLocation.image_url,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      warning: "",
      day: selectedLocation.day || 1,
    };

    let updatedItinerary;
    if (editingDay !== null && editingIndex !== null) {
      updatedItinerary = itineraryData.map((item, idx) =>
        item.day === editingDay && idx === editingIndex ? newLocation : item
      );
    } else {
      updatedItinerary = [...itineraryData, newLocation];
    }

    updatedItinerary.sort(
      (a, b) => timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time)
    );

    for (let i = 0; i < updatedItinerary.length; i++) {
      const curr = updatedItinerary[i];
      const prev = i === 0 ? null : updatedItinerary[i - 1];

      if (prev) {
        const travel = estimateTravelTime(prev, curr);
        const prevDeparture = timeToMinutes(prev.departure_time);
        const currArrival = timeToMinutes(curr.arrival_time);

        curr.travel_from_prev_minutes = Math.round(travel);
        curr.warning =
          prevDeparture + travel > currArrival
            ? "You may not arrive at this destination on time!"
            : "";
      } else {
        curr.travel_from_prev_minutes = 0;
        curr.warning = "";
      }
    }

    setItineraryData(updatedItinerary);
    setSelectedLocation(null);
    setStartTime("");
    setEndTime("");
    handleCancel();
  };

  return (
    <div className="new-trip-container">
      <div className="city-name-container">
        <img src={newtrippic} alt="City" className="city-img" />
        <div className="title-overlay">
          <h2>Trip to {city?.name}</h2>
          <div className="date-time">
            <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
            <span className="date-text">
              {startDate} - {endDate}
            </span>
          </div>
        </div>
      </div>

      <div className="trip-details">
        <div className="trip-itinerary">
          <h2 className="trip-itinerary-title">Itinerary</h2>
          <div className="trip-day">
            <div className="trip-timeline">
              {Object.entries(
                itineraryData.reduce((acc, item) => {
                  if (!acc[item.day]) acc[item.day] = [];
                  acc[item.day].push(item);
                  return acc;
                }, {})
              ).map(([day, items]) => (
                <div key={day}>
                  <div className="day-divider">
                    <span className="day-label">Day {day}</span>
                    <hr className="day-line" />
                  </div>
                  {items.map((item, index) => (
                    <div key={`${day}-${index}`} className="location-details">
                      <div className="time">{item.arrival_time}</div>
                      <div className="timeline-line"></div>
                      <div className="edit-location-card">
                        <div className="location-card">
                          <img
                            src={item.image_url[0] || "fallback.jpg"}
                            alt={item.name}
                            className="location-img"
                          />
                          <div className="location-info">
                            <div className="location-title">{item.name}</div>
                            <div className="item-rating">
                              <span className="rating-dots">🟢🟢🟢🟢</span>
                              <span className="rating-number">
                                {item.rating_total}
                              </span>
                            </div>
                            <span className="rating-number">
                              {item.warning}
                            </span>
                            <div className="location-type-info">
                              <FontAwesomeIcon
                                icon={faMountainSun}
                                className="location-type-icon"
                              />
                              {item.type}
                            </div>
                          </div>
                          <div className="delete-location">
                            <FaXmark
                              className="delete-icon"
                              onClick={() => handleDeleteClick(day, index)}
                            />
                          </div>
                          <div className="edit-location">
                            <FaPen
                              className="edit-icon"
                              onClick={() =>
                                handleEditLocation(item, Number(day), index)
                              }
                            />
                          </div>
                        </div>
                        <AddLocationForm
                          visible={
                            formState.visible &&
                            formState.editingDay === Number(day) &&
                            formState.editingIndex === index
                          }
                          mode="edit"
                          editData={formState.data}
                          cityAttraction={cityAttraction}
                          selectedLocation={selectedLocation}
                          setSelectedLocation={setSelectedLocation}
                          startTime={startTime}
                          setStartTime={setStartTime}
                          endTime={endTime}
                          setEndTime={setEndTime}
                          itineraryData={itineraryData}
                          setItineraryData={setItineraryData}
                          handleCancel={handleCancel}
                          handleSave={() => handleSave(Number(day), index)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}

              <div className="add-location">
                <button
                  className="add-location-btn"
                  onClick={handleAddLocation}
                >
                  + Add
                </button>
                <button
                  className="save-location-btn"
                  onClick={handleSaveItinerary}
                >
                  Save
                </button>
                <AddLocationForm
                  visible={formState.visible && formState.mode === "add"}
                  mode="add"
                  editData={formState.data}
                  cityAttraction={cityAttraction}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  itineraryData={itineraryData}
                  setItineraryData={setItineraryData}
                  handleCancel={handleCancel}
                  handleSave={() => handleSave(null, null)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <DeleteConfirm
        isOpen={deleteConfirm.isOpen}
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        message="Are you sure you want to delete this location?"
      />
    </div>
  );
}

export default NewTrip;
