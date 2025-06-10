import React, { useState, useEffect } from "react";
import "./NewTrip.scss";
import newtrippic from "../../assets/images/Cities/goldenbridge.png";
import {
  faCalendarDay,
  faMountainSun,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { useLocation } from "react-router-dom";
import BASE_URL from "../../constants/BASE_URL";
import axios from "axios";
import { Autocomplete, TextField } from "@mui/material";
import { useAuth } from "../../contexts/AuthContext";
import { FaPen, FaXmark } from "react-icons/fa6";
import AddLocationForm from "./AddLocationForm";
import DeleteConfirm from "./DeleteConfirm";
import OptimizeConfirm from "./OptimizeConfirm";
import { useNavigate } from "react-router-dom";
function NewTrip() {
  const location = useLocation();
  const {
    selectedTags = [],
    title = "",
    startDate = "",
    endDate = "",
    selectedCity = "",
    selectedResTags = [],
    mode = "",
    description = "",
    itinerary_id = -1,
  } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [city, setCity] = useState(null);
  const [setStartDate] = useState("");
  const [setEndDate] = useState("");
  const [itineraryData, setitinararyData] = useState([]);

  const [formState, setFormState] = useState({
    visible: false,
    mode: "add",
    data: null,
    editingDay: null,
    editingIndex: null,
  });
  const [deleteConfirm, setDeleteConfirm] = useState({
    isOpen: false,
    item: null,
  });
  const [optimizeConfirm, setOptimizeConfirm] = useState({
    isOpen: false,
  });
  const [cityAttraction, setCityAttraction] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [daylist, setDay] = useState([]);
  const [endTime, setEndTime] = useState("");
  const { user } = useAuth();
  const [selectedDay, setSelectedDay] = useState([]);
  const [tripDescription, setTripDescription] = useState(description || "");
  const [tripitineraryId, settripitinerary] = useState(itinerary_id || 0);
  const [tripstartDate, settripstartDate] = useState(startDate || "");
  const [tripendDate, settripendDate] = useState(endDate || "");
  const [hasLoadedFromStorage, setHasLoadedFromStorage] = useState(false);
  const [createmode, setcreatmode] = useState(true);
  const navigate = useNavigate();
  const handleDeleteClick = (item) => {
    setDeleteConfirm({
      isOpen: true,
      item,
    });
  };

  const handleOptimizeClick = () => {
    setOptimizeConfirm({
      isOpen: true,
    });
  };

  // Hàm xác nhận xóa
  const handleDeleteConfirm = () => {
    const { item } = deleteConfirm;
    const updatedItinerary = itineraryData.filter(
      // (item, idx) => !(item.day === day && idx === index)
      (i) => i !== item
    );

    setitinararyData(updatedItinerary);
    setDeleteConfirm({ isOpen: false, day: null, index: null });
  };

  const handleOptimizeConfirm = () => {
    const optimized = [];
  let currentDay = null;
  let prevDepartureTimeInMin = 0;

  for (let i = 0; i < itineraryData.length; i++) {
    const item = { ...itineraryData[i] };

    // Khi bắt đầu ngày mới
    if (item.day !== currentDay) {
      currentDay = item.day;
      prevDepartureTimeInMin = timeToMinutes(item.arrival_time); // giữ nguyên arrival_time
    } else {
      // Arrival time = previous departure + travel
      const arrivalMin = prevDepartureTimeInMin + (item.travel_from_prev_minutes || 0);

      // Nếu vượt quá 24h => chuyển sang ngày mới
      if (arrivalMin >= 1440) {
        item.day += 1;
        item.arrival_time = "08:00";
        prevDepartureTimeInMin = timeToMinutes("08:00");
      } else {
        item.arrival_time = minutesToTime(arrivalMin);
        prevDepartureTimeInMin = arrivalMin;
      }
    }

    // Departure time = arrival + duration
    const arrivalMin = timeToMinutes(item.arrival_time);
    const departureMin = arrivalMin + (item.duration_minutes || 0);

    // Nếu departure vượt quá 24h => chuyển sang ngày mới
    if (departureMin >= 1440) {
      item.day += 1;
      item.arrival_time = "08:00";
      prevDepartureTimeInMin = timeToMinutes("08:00");
      const newDepartureMin = prevDepartureTimeInMin + (item.duration_minutes || 0);
      item.departure_time = minutesToTime(newDepartureMin);
      prevDepartureTimeInMin = newDepartureMin;
    } else {
      item.departure_time = minutesToTime(departureMin);
      prevDepartureTimeInMin = departureMin;
    }

    optimized.push(item);
  }
    setitinararyData(optimized);
    setOptimizeConfirm({ isOpen: false });
  };

  // Hàm hủy bỏ xóa
  const handleDeleteCancel = () => {
    setDeleteConfirm({ isOpen: false, day: null, index: null });
  };

  const handleOptimizeCancel = () => {
    setOptimizeConfirm({ isOpen: false });
  }

  function generateDayList(startDate, endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const dayCount = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;

    return Array.from({ length: dayCount }, (_, i) => i + 1);
  }

  useEffect(() => {
    const saved = localStorage.getItem("newTripState");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTripDescription(parsed.tripDescription || "");
        settripstartDate(parsed.tripstartDate || "");
        settripendDate(parsed.tripendDate || "");
        setitinararyData(parsed.itineraryData || []);
        setDay(parsed.daylist || []);
        settripitinerary(parsed.tripitineraryId || 0);
        setSelectedDay(parsed.selectedDay || []);
      } catch (e) { }
    }
    setHasLoadedFromStorage(true);
  }, []);

  useEffect(() => {
    if (!hasLoadedFromStorage) return;
    const state = {
      tripDescription,
      tripstartDate,
      tripendDate,
      itineraryData,
      daylist,
      tripitineraryId,
      selectedDay,
      // thêm các biến khác nếu cần
    };
    localStorage.setItem("newTripState", JSON.stringify(state));
  }, [
    tripDescription,
    tripstartDate,
    tripendDate,
    itineraryData,
    daylist,
    tripitineraryId,
    selectedDay,
  ]);

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        if (itinerary_id == -1) {
          const startTime = "09:00";
          const endTime = "15:00";
          const tagParams = selectedTags.map((tag) => `${tag}`).join("&");
          const restagParams = selectedResTags.map((tag) => `${tag}`).join("&");
          const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&tags=${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${restagParams}&startDate=${startDate}&endDate=${endDate}`;
          console.log("url", url)
          const Itiresponse = await axios.get(url);
          const cityResponse = await axios.get(
            `${BASE_URL}/cities/${selectedCity}`
          );
          setCity(cityResponse.data);
          const cityAttraction = await axios.get(
            `${BASE_URL}/attractions/city/${selectedCity}`
          );
          setCityAttraction(cityAttraction.data);
          setitinararyData(Itiresponse.data);
          setDay(generateDayList(startDate, endDate));
        } else {
          const Itiresponse = await axios.get(
            `${BASE_URL}/itineraryDetail/${user?.user_id}/${itinerary_id}`
          );
          setitinararyData(Itiresponse.data);
          const cityResponse = await axios.get(
            `${BASE_URL}/cities/${selectedCity}`
          );
          setCity(cityResponse.data);
          const cityAttraction = await axios.get(
            `${BASE_URL}/attractions/city/${selectedCity}`
          );
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

  const updateItinerarybyNewDate = (newDaylist) => {
    const updatedItinerary = itineraryData.filter((item) =>
      newDaylist.includes(item.day)
    );

    setitinararyData(updatedItinerary);
  };

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    settripstartDate(newStartDate);

    if (tripendDate && newStartDate > tripendDate) {
      alert("Start date must be before or equal to end date.");
    } else {
      const newdaylist = generateDayList(newStartDate, tripendDate);
      setDay(newdaylist);
      updateItinerarybyNewDate(newdaylist);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    settripendDate(newEndDate);

    if (tripstartDate && tripstartDate > newEndDate) {
      alert("Start date must be before or equal to end date.");
    } else {
      const newdaylist = generateDayList(tripstartDate, newEndDate);
      setDay(newdaylist);
      updateItinerarybyNewDate(newdaylist);
    }
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
  // const handleAddLocation = () => {
  //     setAddLocation(!addLocation);
  // };

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
  // const handleCancel = () => {
  //     setAddLocation(false);
  // };
  const handleDescription = async () => {
    try {
      if (itinerary_id != -1) {
        console.log("url: ", `${BASE_URL}/itinerary/update/${itinerary_id}`);
        const respone = await axios.put(
          `${BASE_URL}/itinerary/update/${itinerary_id}`,
          {
            description: tripDescription,
          }
        );
        alert("Edit description success");
      } else if (tripitineraryId != -1) {
        console.log("url: ", `${BASE_URL}/itinerary/update/${tripitineraryId}`);
        const respone = await axios.put(
          `${BASE_URL}/itinerary/update/${tripitineraryId}`,
          {
            description: tripDescription,
          }
        );
        alert("Edit description success");
      } else {
        alert("Save your new itinerary first");
      }
    } catch (err) {
      alert("Edit failed");
    }
  };

  const handleSaveItinerary = async () => {
    if (!user?.user_id) {
      alert("Need login to create itinerary!");
      return;
    }

    if (mode === "create" && createmode === true) {
      console.log("create");
      try {
        if (!user?.user_id) {
          alert("Need login to create itinerary.");
          return;
        }
        const response = await axios.post(`${BASE_URL}/itinerary/`, {
          title: title,
          city_id: selectedCity,
          description: tripDescription,
          start_date: tripstartDate,
          end_date: tripendDate,
          status: "private",
          user_id: user?.user_id,
          city_name: city?.name,
          image_url: city?.image_url[0],
        });
        const newItinerary = response.data;
        const newItineraryId = newItinerary.itinerary_id;
        settripitinerary(newItineraryId);

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
            warning: item.warning || "",
            day: item.day,
          };

          const response = await axios.post(
            `${BASE_URL}/itineraryDetail/`,
            data
          );
        }
        setcreatmode(false);
        alert("Save new itinerary");
      } catch (error) {
        console.error("Err:", error);
        alert("Save failed");
      }
    } else if (mode == "edit" || createmode === false) {
      console.log("edit");
      console.log(tripitineraryId);
      try {
        const updaterespone = await axios.put(
          `${BASE_URL}/itinerary/update/${tripitineraryId}`,
          {
            start_date: tripstartDate,
            end_date: tripendDate,
          }
        );
        const deleteRespone = await axios.delete(
          `${BASE_URL}/itineraryDetail/delete/${tripitineraryId}`
        );
        for (const item of itineraryData) {
          const data = {
            user_id: user?.user_id,
            itinerary_id: tripitineraryId,
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
            warning: item.warning || "",
            day: item.day,
          };
          const response = await axios.post(
            `${BASE_URL}/itineraryDetail/`,
            data
          );
        }
        alert("Edit success!");
      } catch (err) {
        alert("Edit Failed: ", err);
      }
    }
  };

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };
  function minutesToTime(minutes) {
    const h = Math.floor((minutes % 1440) / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }

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

  const handleEdit = (
    item,
    startTime,
    endTime,
    selectedDay,
    location,
    editingDay,
    editingIndex
  ) => {
    const arrival = timeToMinutes(startTime);
    const departure = timeToMinutes(endTime);
    if (arrival >= departure) {
      alert("Start time must be before end time.");
      return;
    }

    const newLocation = {
      type: "attraction",
      day: selectedDay,
      id: location.attraction_id ?? location.id,
      name: location.name,
      arrival_time: startTime,
      departure_time: endTime,
      duration_minutes: location.duration_minutes ?? location.visit_duration,
      travel_from_prev_minutes: 0,
      average_rating: location.average_rating,
      rating_total: location.rating_total,
      tags: location.tags,
      image_url: location.image_url,
      latitude: location.latitude,
      longitude: location.longitude,
      warning: "",
    };

    // let updatedItinerary;

    // // Chỉnh sửa item tại editingIndex nếu có
    // if (editingDay !== null && editingIndex !== null) {
    //     updatedItinerary = itineraryData.map((it, idx) =>
    //         it.day === editingDay && idx === editingIndex ? newLocation : it
    //     );
    // } else {
    //     updatedItinerary = [...itineraryData, newLocation];
    // }

    // xoas item cần sửa trong list đi r thêm newLocation vào
    let updatedItinerary = [
      ...itineraryData.filter((i) => i !== item),
      newLocation,
    ];

    // Sắp xếp theo ngày và giờ
    updatedItinerary.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time);
    });

    // Tính travel time và warning
    for (let i = 0; i < updatedItinerary.length; i++) {
      const curr = updatedItinerary[i];
      const prev = i === 0 ? null : updatedItinerary[i - 1];
      if (!prev || curr.day !== prev.day) {
        // Điểm đầu tiên của ngày mới
        curr.travel_from_prev_minutes = 0;
        curr.warning = "";
        continue;
      }
      if (prev) {
        const travel = estimateTravelTime(prev, curr);
        const prevDeparture = timeToMinutes(prev.departure_time);
        const currArrival = timeToMinutes(curr.arrival_time);
        curr.travel_from_prev_minutes = Math.round(travel);
        curr.warning =
          prevDeparture + travel > currArrival
            ? "You may not come to this destination on time!"
            : "";
      } else {
        curr.travel_from_prev_minutes = 0;
        curr.warning = "";
      }
    }

    // ✅ Gọi setItineraryData duy nhất một lần sau khi xử lý xong
    setitinararyData(updatedItinerary);

    // 👇 Reset UI & log
    setSelectedLocation(null);
    setStartTime("");
    setEndTime("");
    handleCancel();
  };

  const handleSave = (editingDay, editingIndex) => {
    if (!selectedLocation || !startTime || !endTime) {
      alert("Please select a location and time!");
      return;
    }

    const arrival = timeToMinutes(startTime);
    const departure = timeToMinutes(endTime);

    if (arrival >= departure) {
      alert("Start time must be before end time.");
      return;
    }

    const newLocation = {
      type: "attraction",
      day: selectedDay,
      id: selectedLocation.attraction_id,
      name: selectedLocation.name,
      arrival_time: startTime,
      departure_time: endTime,
      duration_minutes: selectedLocation.visit_duration,
      travel_from_prev_minutes: 0,
      average_rating: selectedLocation.average_rating,
      rating_total: selectedLocation.rating_total,
      tags: selectedLocation.tags,
      image_url: selectedLocation.image_url,
      latitude: selectedLocation.latitude,
      longitude: selectedLocation.longitude,
      warning: "",
    };

    let updatedItinerary;

    if (editingDay !== null && editingIndex !== null) {
      updatedItinerary = itineraryData.map((item, idx) =>
        item.day === editingDay && idx === editingIndex ? newLocation : item
      );
    } else {
      updatedItinerary = [...itineraryData, newLocation];
    }

    // Sắp xếp theo ngày và thời gian đến
    updatedItinerary.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return timeToMinutes(a.arrival_time) - timeToMinutes(b.arrival_time);
    });

    // Cập nhật travel_from_prev_minutes và warning
    for (let i = 0; i < updatedItinerary.length; i++) {
      const curr = updatedItinerary[i];
      const prev = i === 0 ? null : updatedItinerary[i - 1];

      if (prev && curr.day === prev.day) {
        const travel = estimateTravelTime(prev, curr);
        const prevDeparture = timeToMinutes(prev.departure_time);
        const currArrival = timeToMinutes(curr.arrival_time);

        curr.travel_from_prev_minutes = Math.round(travel);
        curr.warning =
          prevDeparture + travel > currArrival
            ? "You may not come to this destination on time!"
            : "";
      } else {
        curr.travel_from_prev_minutes = 0;
        curr.warning = "";
      }
    }

    // Cập nhật state và reset form
    setitinararyData(updatedItinerary);
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
          <h2>{title}</h2>
          <div className="date-time">
            <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
            <span className="date-text">
              {tripstartDate} - {tripendDate}
            </span>
          </div>
        </div>
      </div>

      <div className="trip-details">
        <div className="trip-description">
          <h2 className="trip-description-title">Trip Description</h2>
          <div className="trip-description-content">
            <textarea
              id="autoHeightTextArea"
              rows="1"
              className="trip-description-input"
              value={tripDescription}
              onChange={(e) => setTripDescription(e.target.value)}
            />
            <button
              className="save-description-btn"
              onClick={handleDescription}
            >
              Save
            </button>
          </div>
        </div>
        <div className="trip-date">
          <h2 className="trip-date-title">Trip Date</h2>
          <div className="trip-date-content">
            <div className="date-input">
              <label>Start Date</label>
              <input
                type="date"
                value={tripstartDate}
                onChange={handleStartDateChange}
              />
            </div>
            <div className="date-input">
              <label>End Date</label>
              <input
                type="date"
                value={tripendDate}
                onChange={handleEndDateChange}
              />
            </div>
          </div>
        </div>
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
                            onClick={() =>
                              navigate(`/tripguide/${item.type}/${item.id}`)
                            }
                          />
                          <div className="location-info">
                            <div className="location-title">{item.name}</div>
                            <div className="departure-time">
                              <FontAwesomeIcon
                                icon={faClock}
                                className="departure-icon"
                              />
                              <span>Departure time:</span>
                              <strong>{item.departure_time}</strong>
                            </div>
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
                              onClick={() => handleDeleteClick(item)}
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
                          day={day}
                          item={item}
                          numberday={Number(day)}
                          index={index}
                          handleedit={handleEdit}
                          daylist={daylist}
                          editData={formState.data}
                          cityAttraction={cityAttraction}
                          selectedLocation={selectedLocation}
                          setSelectedLocation={setSelectedLocation}
                          startTime={startTime}
                          setStartTime={setStartTime}
                          endTime={endTime}
                          setEndTime={setEndTime}
                          itineraryData={itineraryData}
                          setItineraryData={setitinararyData}
                          handleCancel={handleCancel}
                          handleSave={() => handleSave(Number(day), index)}
                          selectedDay={selectedDay}
                          setSelectedDay={setSelectedDay}
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
                <button
                  className="optimize-btn"
                  onClick={handleOptimizeClick}
                >
                  Optimize
                </button>
                <AddLocationForm
                  visible={formState.visible && formState.mode === "add"}
                  mode="add"
                  daylist={daylist}
                  editData={formState.data}
                  cityAttraction={cityAttraction}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={setSelectedLocation}
                  startTime={startTime}
                  setStartTime={setStartTime}
                  selectedDay={selectedDay}
                  setSelectedDay={setSelectedDay}
                  endTime={endTime}
                  setEndTime={setEndTime}
                  itineraryData={itineraryData}
                  setItineraryData={setitinararyData}
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
      <OptimizeConfirm
        isOpen={optimizeConfirm.isOpen}
        onConfirm={handleOptimizeConfirm}
        onCancel={handleOptimizeCancel}
        message="Optimize this Itinerary?"
      />
    </div>
  );
}

export default NewTrip;