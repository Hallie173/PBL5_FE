import React, { useState } from 'react';
import DatePicker from 'react-datepicker'; // Date picker for selecting dates
import "./NewTrip.scss"; // Main styles for the new trip page
import newtrippic from "../../assets/images/Cities/goldenbridge.png";
import marblemountains from "../../assets/images/Cities/marblemountains.png";
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMountainSun } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for Nature
import { faUtensils } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for Restaurant
import { faLocationDot } from '@fortawesome/free-solid-svg-icons'; // FontAwesome icons for else
// import MapComponent from '../../components/GoogleMap/GoogleMap';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import BASE_URL from '../../constants/BASE_URL';
import axios from 'axios';
import { Autocomplete, TextField } from '@mui/material';

function NewTrip() {
    const location = useLocation();
    const { selectedTags = [], startDate = '', endDate = '', selectedCity = '', selectedResTags = '' } = location.state || {};
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(null);
    const [itineraryData, setitinararyData] = useState([]);
    const [addLocation, setAddLocation] = useState(false);
    const [cityAttraction, setCityAttraction] = useState([]);
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {

                console.log("tags", selectedTags);
                console.log("res", selectedResTags);
                const startTime = "09:00";
                const endTime = "15:00";
                console.log(selectedCity);
                const tagParams = selectedTags.map(tag => `tags=${tag}`).join('&');
                const restagParams = selectedResTags.map(tag => `${tag}`).join('&');
                const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${restagParams}`;
                //const url = `${BASE_URL}/attractions/tags?city=${selectedCity}&${tagParams}&startTime=${startTime}&endTime=${endTime}`;

                const Itiresponse = await axios.get(url);
                console.log('URL used:', url); // debug
                console.log('Response:', Itiresponse.data);
                setitinararyData(Itiresponse.data);
                
                const cityResponse = await axios.get(`${BASE_URL}/cities/${selectedCity}`);
                setCity(cityResponse.data);
                console.log(city);
                const cityAttraction = await axios.get(`${BASE_URL}/attractions/city/${selectedCity}`);
                setCityAttraction(cityAttraction.data);

                // return response.data;
                // // const params = new URLSearchParams();
                // params.append('city', city);
                // selectedTags.forEach(tag => params.append('tags', tag));
                // params.append('startTime', startTime);
                // params.append('endTime', endTime);
                // params.append('res_tag', res_tag);
                // const url = `${BASE_URL}/attractions/tags?${params.toString()}`;
                // console.log("Day la url",url);
                //const response = await axios.get(url);
                //console.log('Response:', response.data);
                //return response.data;
            } catch (err) {
                setError(err)
            } finally {
                setLoading(false)
            }
        };
        fetchData();
    }, [])

    const handleAddLocation = () => {
        setAddLocation(!addLocation);
    }

    const handleCancel = () => {
        setAddLocation(false);
    }
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
                    <h2>Trip to <span className="destination-name">{city?.name}</span></h2>
                    <div className="date-time">
                        <FontAwesomeIcon icon={faCalendarDay} className="date-icon" />
                        <span className="date-text">{startDate} - {endDate}</span>
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
                                    {itineraryData.map((item, index) => (
                                        <div key={index} className="location-details">
                                            <div className="time">{item.arrival_time}</div>
                                            <div className="timeline-line"></div>
                                            <div className="location-card">
                                                <img
                                                    src={item.image_url[0] || 'fallback.jpg'} // fallback nếu ảnh lỗi
                                                    alt={item.name}
                                                    className="location-img"
                                                />
                                                <div className="location-info">
                                                    <div className="location-title">{item.name}</div>
                                                    <div className="item-rating">
                                                        <span className="rating-dots">🟢🟢🟢🟢</span>
                                                        <span className="rating-number">{item.rating_total}</span>
                                                    </div>
                                                    <div className="location-type">
                                                        <FontAwesomeIcon icon={faMountainSun} className="location-type-icon" />
                                                        {item.type}
                                                    </div>
                                                </div>
                                                <div className="location-menu">⋯</div>
                                            </div>
                                        </div>
                                    ))}
                                    <div className="add-location">
                                        <button className="add-location-btn" onClick={handleAddLocation}>+ Add</button>
                                        <div className="add-location-form">
                                            <div className={`form-container ${addLocation ? 'show' : ''}`}>
                                                <div className="form-header">
                                                    <h4>Add location</h4>
                                                </div>
                                                <div className="form-body">
                                                    <div className="form-search-group">
                                                        <div className="search-box">
                                                            <Autocomplete
                                                                options={cityAttraction}
                                                                getOptionLabel={(option) => option.name}
                                                                renderInput={(params) => <TextField {...params} label="Search for location..." />}
                                                                sx={{ width: '100%' }}
                                                            />
                                                        </div>
                                                        <button className="search-btn">Search</button>
                                                    </div>
                                                    <div className="form-time-group">
                                                        <div className="start-time">
                                                            <label>Start Time</label>
                                                            <input type="time" />
                                                        </div>
                                                        <div className="end-time">
                                                            <label>End Time</label>
                                                            <input type="time" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-footer">
                                                    <button className="cancel-btn" onClick={handleCancel}>Cancel</button>
                                                    <button className="save-btn">Save</button>
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