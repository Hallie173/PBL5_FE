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
    const location = useLocation();
    const {
        selectedTags = [],
        startDate = "",
        endDate = "",
        selectedCity = "",
        selectedResTags = "",
        mode = "",
        title = "",
        description = "",
        itinerary_id = -1,
    } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(null);
    const [itineraryData, setitinararyData] = useState([]);
    const [addLocation, setAddLocation] = useState(false);
    const [cityAttraction, setCityAttraction] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const { user } = useAuth();
    const [daylist, setDay] = useState([]);
    const [selectedDay, setSelectedDay] = useState([]);
    function generateDayList(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const dayCount =
            Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

        return Array.from({ length: dayCount }, (_, i) => i + 1);
    }

    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                if (itinerary_id == -1) {
                    const startTime = "09:00";
                    const endTime = "15:00";
                    const tagParams = selectedTags.map((tag) => `tags=${tag}`).join("&");
                    const restagParams = selectedResTags.map((tag) => `${tag}`).join("&");
                    const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${restagParams}&startDate=${startDate}&endDate=${endDate}`;
                    const Itiresponse = await axios.get(url);
                    const cityResponse = await axios.get(`${BASE_URL}/cities/${selectedCity}`);
                    setCity(cityResponse.data);
                    const cityAttraction = await axios.get(`${BASE_URL}/attractions/city/${selectedCity}`);
                    setCityAttraction(cityAttraction.data);
                    setitinararyData(Itiresponse.data);
                    setDay(generateDayList(startDate, endDate));
                } else {
                    const Itiresponse = await axios.get(`${BASE_URL}/itineraryDetail/${user?.user_id}/${itinerary_id}`);
                    setitinararyData(Itiresponse.data);
                    const cityResponse = await axios.get(`${BASE_URL}/cities/${selectedCity}`);
                    setCity(cityResponse.data);
                    const cityAttraction = await axios.get(`${BASE_URL}/attractions/city/${selectedCity}`);
                    setCityAttraction(cityAttraction.data);
                    setDay(generateDayList(startDate, endDate));
                }

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [itinerary_id]);

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
    const handleAddLocation = () => {
        setAddLocation(!addLocation);
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
    setStartTime('');
    setEndTime('');
  };
    const handleCancel = () => {
        setAddLocation(false);
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
    const handleSaveItinerary = async () => {
        if (!user?.user_id) {
            alert('Need login to create itinerary.');
            return;
        }
        if (mode == 'create') {
            try {
                const response = await axios.post(`${BASE_URL}/itinerary/`, {
                    title: title,
                    city_id: selectedCity,
                    description: description,
                    start_date: startDate,
                    end_date: endDate,
                    status: 'private',
                    user_id: user?.user_id,
                    city_name: city?.name,
                    image_url: city?.image_url[0]
                });

        const newItineraryId = response.data.itinerary_id;
        alert("Itinerary created successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Failed to create itinerary");
      }
    }
  };
                const newItinerary = response.data;
                const newItineraryId = newItinerary.itinerary_id;

                for (const item of itineraryData) {
                    const data = {
                        user_id: user?.user_id,
                        itinerary_id: newItineraryId,
                        type: item.type,
                        name: item.name,
                        id: item.id,
                        arrival_time: item.arrival_time,
                        departure_time: item.departure_time,
                        duration_minutes: item.duration_minutes,
                        travel_from_prev_minutes: item.travel_from_prev_minutes || 0,
                        average_rating: item.average_rating,
                        rating_total: item.rating_total,
                        tags: item.tags,
                        image_url: item.image_url,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        warning: item.warning || '',
                        day: item.day,
                    };

                    const response = await axios.post(`${BASE_URL}/itineraryDetail/`, data);
                }
                alert('Lưu đc r');

            } catch (error) {
                console.error('Err:', error);
                alert('Lưu thất bại');
            }
        } else if (mode == 'edit'){
            console.log(itinerary_id);
            try {
                const deleteRespone = await axios.delete(`${BASE_URL}/itineraryDetail/delete/${itinerary_id}`,);
                for (const item of itineraryData) {
                    const data = {
                        user_id: user?.user_id,
                        itinerary_id: itinerary_id,
                        type: item.type,
                        name: item.name,
                        id: item.id,
                        arrival_time: item.arrival_time,
                        departure_time: item.departure_time,
                        duration_minutes: item.duration_minutes,
                        travel_from_prev_minutes: item.travel_from_prev_minutes || 0,
                        average_rating: item.average_rating,
                        rating_total: item.rating_total,
                        tags: item.tags,
                        image_url: item.image_url,
                        latitude: item.latitude,
                        longitude: item.longitude,
                        warning: item.warning || '',
                        day: item.day,
                    };
                    const response = await axios.post(`${BASE_URL}/itineraryDetail/`, data);
                }
            } catch (err) {
                alert('Edit Failed: ', err);
            }
        }
    };



  const handleSave = (editingDay, editingIndex) => {
    if (!selectedLocation || !startTime || !endTime) {
      alert("Please select a location and time!");
      return;
    }
    const handleSave = () => {
        if (!selectedLocation || !startTime || !endTime || !selectedDay) {
            alert("Vui lòng chọn địa điểm và thời gian.");
            return;
        }

        const timeToMinutes = (time) => {
            const [h, m] = time.split(':').map(Number);
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
        const minutesToTime = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
        };

        const estimateTravelTime = (from, to) => {
            const distance = haversineDistance(
                parseFloat(from.latitude),
                parseFloat(from.longitude),
                parseFloat(to.latitude),
                parseFloat(to.longitude)
            );
            const speed = 30;
            return (distance / speed) * 60;
        };
        // lên wiki search haversine là có (tính khoảng cách giữa 2 địa điểm bằng kinh độ và vĩ độ)
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

    const arrival = timeToMinutes(startTime);
    const departure = timeToMinutes(endTime);
    if (arrival >= departure) {
      alert("Start time must be before end time.");
      return;
    }
        const arrival = timeToMinutes(startTime);
        const departure = timeToMinutes(endTime);

        if (arrival >= departure) {
            alert("Thời gian bắt đầu phải trước thời gian kết thúc.");
            return;
        }

        // const visit_duration = departure - arrival;

        const newLocation = {
            type: "attraction",
            day: selectedDay,
            id: selectedLocation.attraction_id,
            name: selectedLocation.name,
            arrival_time: startTime,
            departure_time: endTime,
            duration_minutes: selectedLocation.visit_duration,
            travel_from_prev_minutes: 0, // tạm thời
            average_rating: selectedLocation.average_rating,
            rating_total: selectedLocation.rating_total,
            tags: selectedLocation.tags,
            image_url: selectedLocation.image_url,
            latitude: selectedLocation.latitude,
            longitude: selectedLocation.longitude,
            warning: ''
        };
        console.log(newLocation);
        let updatedItinerary = [...itineraryData, newLocation];

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

        updatedItinerary.sort((a, b) => {
            if (a.day !== b.day) {
                return a.day - b.day;
            }
            return timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time);
        });


        for (let i = 0; i < updatedItinerary.length; i++) {
            const curr = updatedItinerary[i];
            const prev = i === 0 ? null : updatedItinerary[i - 1];
    updatedItinerary.sort((a, b) => timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time));

    for (let i = 0; i < updatedItinerary.length; i++) {
      const curr = updatedItinerary[i];
      const prev = i === 0 ? null : updatedItinerary[i - 1];

            if (prev) {
                const travel = estimateTravelTime(prev, curr);
                const prevDeparture = timeToMinutes(prev.departure_time);
                const currArrival = timeToMinutes(curr.arrival_time);
                curr.travel_from_prev_minutes = Math.round(travel);
                if (prevDeparture + travel > currArrival) {
                    curr.warning = "You may not come to this destination on time!";
                } else {
                    curr.warning = '';
                }
            } else {
                curr.travel_from_prev_minutes = 0;
                curr.warning = '';
            }
        }
        setitinararyData(updatedItinerary);
        console.log(itineraryData);
        setSelectedLocation(null);
        setStartTime('');
        setEndTime('');
    };
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
    return (
        <div className="new-trip-container">
            <div className="city-name-container">
                <img src={newtrippic} alt="City" className="city-image" />
                <div className="title-overlay">
                    <h2>
                        {title}<span className="destination-name"></span>
                    </h2>
                    <div className="date-time">
                        <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
                        <span className="date-text">
                            {startDate} - {endDate}
                        </span>
                    </div>
                </div>
            </div>
            <div className="trip-details">
                <div className="trip-info">
                    <div className="trip-itinerary">
                        <h2 className="trip-itinerary-title">Itinerary</h2>
                        <div className="trip-day">
                            <div className="trip-day-header">
                                <h4>{startDate}</h4>
                            </div>
                            <div className="trip-day-content">
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
                                                <span className="day-label">Ngày {day}</span>
                                                <hr className="day-line" />
                                            </div>
                                            {items.map((item, index) => (
                                                <div key={index} className="location-details">
                                                    <div className="time">{item.arrival_time}</div>
                                                    <div className="timeline-line"></div>
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
                                                                <span className="rating-number">{item.rating_total}</span>
                                                            </div>
                                                            <span className="rating-number">{item.warning}</span>
                                                            <div className="location-type">
                                                                <FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />
                                                                {item.type}
                                                            </div>
                                                        </div>
                                                        <div className="delete-location"><FaXmark className="delete-icon" /></div>
                                                        <div className="edit-location"><FaPen className="edit-icon" /></div>
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
                                        <div className="add-location-form">
                                            <div
                                                className={`form-container ${addLocation ? "show" : ""
                                                    }`}
                                            >
                                                <div className="form-header">
                                                    <h4>Add location</h4>
                                                </div>
                                                <div className="form-body">
                                                    <div className="form-date-group">
                                                        <div className="form-date">

                                                            <Autocomplete
                                                                options={daylist}
                                                                getOptionLabel={(option) => `Ngày ${option}`}
                                                                value={selectedDay}
                                                                onChange={(event, newValue) => setSelectedDay(newValue)}
                                                                renderInput={(params) => (
                                                                    <TextField {...params} label="Select Date..." />
                                                                )}
                                                                sx={{ width: '100%' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="form-search-group">
                                                        <div className="search-box">
                                                            <Autocomplete
                                                                options={cityAttraction}
                                                                getOptionLabel={(option) => option.name}
                                                                value={selectedLocation}
                                                                onChange={(event, newValue) => setSelectedLocation(newValue)}
                                                                renderInput={(params) => <TextField {...params} label="Search for location..." />}
                                                                sx={{ width: '100%' }}
                                                            />
                                                        </div>
                                                        <button className="search-btn">Search</button>
                                                    </div>
                                                    <div className="form-time-group">
                                                        <div className="start-time">
                                                            <label>Start Time</label>
                                                            <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
                                                        </div>
                                                        <div className="end-time">
                                                            <label>End Time</label>
                                                            <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-footer">
                                                    <button className="cancel-btn" onClick={handleCancel}>
                                                        Cancel
                                                    </button>
                                                    <button className="save-btn" onClick={handleSave}>Save</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default NewTrip;
