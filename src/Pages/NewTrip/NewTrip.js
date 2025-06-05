import React, { useState } from "react";
// import DatePicker from "react-datepicker"; // Date picker for selecting dates
import "./NewTrip.scss"; // Main styles for the new trip page
import newtrippic from "../../assets/images/Cities/goldenbridge.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMountainSun } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons for Nature
import { faUtensils } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons for Restaurant
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"; // FontAwesome icons for else
// import MapComponent from '../../components/GoogleMap/GoogleMap';
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";
import { Autocomplete, selectClasses, TextField } from '@mui/material';
import { useAuth } from "../../contexts/AuthContext";
function NewTrip() {
  const location = useLocation();
  const {
    selectedTags = [],
    startDate = "",
    endDate = "",
    selectedCity = "",
    selectedResTags = "",
    mode = "",
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
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        console.log("tags", selectedTags);
        console.log("res", selectedResTags);
        const startTime = "09:00";
        const endTime = "15:00";
        console.log(selectedCity);
        const tagParams = selectedTags.map((tag) => `tags=${tag}`).join("&");
        const restagParams = selectedResTags.map((tag) => `${tag}`).join("&");
        const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${restagParams}&startDate=${startDate}&endDate=${endDate}`;
        const Itiresponse = await axios.get(url);
        console.log("URL used:", url); // debug
        console.log("Response:", Itiresponse.data);
        setitinararyData(Itiresponse.data);
        const cityResponse = await axios.get(`${BASE_URL}/cities/${selectedCity}`);
        setCity(cityResponse.data);
        console.log(city);
        const cityAttraction = await axios.get(`${BASE_URL}/attractions/city/${selectedCity}`);
        setCityAttraction(cityAttraction.data);

      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    if (mode == 'create') {
      fetchData();
    } else if (mode == 'update' && itinerary_id != -1) {

    }
  }, []);

  const handleAddLocation = () => {
    setAddLocation(!addLocation);
  };

  const handleCancel = () => {
    setAddLocation(false);
  };

  const handleSaveItinerary = async () => {
    if (!user?.user_id) {
      alert('Need login to create itinerary.');
      return;
    }
    if (mode == 'create') {
      try {
        const title = 'Trip to ' + city?.name;

        const response = await axios.post('http://localhost:8081/itinerary/', {
          title: title,
          description: 'A 3-day trip exploring Da Nang',
          start_date: startDate,
          end_date: endDate,
          status: 'private',
          user_id: user?.user_id,
        });

        const newItinerary = response.data;
        const newItineraryId = newItinerary.itinerary_id;

        alert('Lưu đc r');
      } catch (error) {
        console.error('Err:', error);
        alert('Lưu thất bại');
      }
    }
  };

  const handleSave = () => {
    if (!selectedLocation || !startTime || !endTime) {
      alert("Vui lòng chọn địa điểm và thời gian.");
      return;
    }

    const timeToMinutes = (time) => {
      const [h, m] = time.split(':').map(Number);
      return h * 60 + m;
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
      const speed = 30; // km/h
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
      alert("Thời gian bắt đầu phải trước thời gian kết thúc.");
      return;
    }

    const visit_duration = departure - arrival;

    const newLocation = {
      type: "attraction",
      name: selectedLocation.name,
      arrival_time: startTime,
      departure_time: endTime,
      duration_minutes: visit_duration,
      travel_from_prev_minutes: 0, // tạm thời
      average_rating: selectedLocation.average_rating,
      rating_total: selectedLocation.rating_total,
      tags: selectedLocation.tags,
      image_url: selectedLocation.image_url,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      warning: ''
    };

    let updatedItinerary = [...itineraryData, newLocation];


    updatedItinerary.sort((a, b) => timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time));

    // Cập nhật travel_from_prev_minutes + kiểm tra warning
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

  // const addNewAttraction = async (attraction, arrival_time, depature_time) => {
  //     const attractionRespone = await axios.get(`${BASE_URL}/attraction/name/${attraction}/cityid/${selectedCity}`);
  //     const newAttraction = attractionRespone.data;
  //     itineraryData.push({
  //         type: "attraction",
  //         name: attraction,
  //         arrival_time: minutesToTime(arrival_time),
  //         departure_time: minutesToTime(depature_time),
  //         duration_minutes: visit,
  //         travel_from_prev_minutes: Math.round(travel),
  //         average_rating: curr.average_rating,
  //         rating_total: curr.rating_total,
  //         tags: curr.tags,
  //         image_url: curr.image_url,
  //         latitude: curr.latitude,
  //         longitude: curr.longitude,
  //     })
  // }

  return (
    <div className="new-trip-container">
      <div className="city-name-container">
        <img src={newtrippic} alt="City" className="city-image" />
        <div className="title-overlay">
          <h2>
            Trip to {city?.name}<span className="destination-name"></span>
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
                            <div className="location-menu">⋯</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* {itineraryData.map((item, index) => (
                                        <div key={index} className="location-details">
                                            <div className="time">{item.arrival_time}</div>
                                            <div className="timeline-line"></div>
                                            <div className="location-card">
                                                <img
                                                    src={item.image_url[0] || "fallback.jpg"} // fallback nếu ảnh lỗi
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
                                                    <span className="rating-number">{item.warning}</span>
                                                    <div className="location-type">
                                                        <FontAwesomeIcon
                                                            icon={faMountainSun}
                                                            className="location-type-icon"
                                                        />
                                                        {item.type}
                                                    </div>
                                                </div>
                                                <div className="location-menu">⋯</div>
                                            </div>
                                        </div>
                                    ))} */}
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
                              <label>Select Date</label>
                              <input type="date" />
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

            {/*add another day*/}
          </div>
        </div>
        {/* <div className="trip-map">
                    <MapComponent />
                </div> */}
      </div>
    </div>
  );
}

export default NewTrip;
