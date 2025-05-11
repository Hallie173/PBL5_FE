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
function NewTrip() {
    const location = useLocation();
    const { selectedTags = [], startDate = '', endDate = '' } = location.state || {};

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [city, setCity] = useState(null);
    const [itineraryData, setitinararyData] = useState([]);
    useEffect(() => {
        setLoading(true);
        const fetchData = async () => {
            try {
                const city = 3;
                const res_tag = 'Buffet'
                const startTime = "09:00";
                const endTime = "20:00";

                const tagParams = selectedTags.map(tag => `tags=${tag}`).join('&');

                const url = `${BASE_URL}/attractions/tags?city=${city}&${tagParams}&startTime=${startTime}&endTime=${endTime}&res_tag=${res_tag}`;

                const Itiresponse = await axios.get(url);
                console.log('URL used:', url); // debug
                console.log('Response:', Itiresponse.data);
                setitinararyData(Itiresponse.data);


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


    return (
        <div className="new-trip-container">
            <div className="city-name-container">
                <img src={newtrippic} alt="City" className="city-image" />
                <div className="title-overlay">
                    <h2>Trip to <span className="destination-name">...</span></h2>
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
                                                        {/* Nếu bạn không có rating thì có thể bỏ đoạn này */}
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