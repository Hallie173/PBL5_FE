import React, { useEffect, useState } from "react";
import "./Mytrips.scss";
import { Link } from "react-router-dom";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import BASE_URL from "../../constants/BASE_URL";
import { useAuth } from "../../contexts/AuthContext";
const MyTrips = () => {
    const { user } = useAuth();
    const [finishItinerary, setfItinerary] = useState([]);
    const [notfinishItinerary, setnotfItinerary] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const finishItineraryRespone = await axios.get(`${BASE_URL}/itinerary/finished/${user?.user_id}`);
                const notfinishItineraryRespone = await axios.get(`${BASE_URL}/itinerary/notfinished/${user?.user_id}`)

                setfItinerary(finishItineraryRespone.data);
                setnotfItinerary(notfinishItineraryRespone.data);


                console.log('gas');
                console.log(finishItinerary);
            } catch (err) {

            }
        };
        fetchData();

    }, [])

    return (
        <div className="my-trips-container">
            <div className="my-trips"><h1>Make your trip unforgettable!</h1></div>
            <div className="trip-actions">
                <Link to="/tripguide/new-trip-form" className="create-trip"><FontAwesomeIcon icon={faMapLocation} />Create a new trip</Link>
            </div>

            <div className="trip-list">
                <div className="upcoming-trip">
                    <h3 className="upcoming-trip-title">Upcoming trips</h3>
                    {notfinishItinerary.length === 0 ? (
                        <p>Không có lịch trình sắp tới.</p>
                    ) : (
                        finishItinerary.map((trip) => (
                            <Link
                                key={trip.itinerary_id}
                                to={`/tripguide/${trip.itinerary_id}`}
                                className="trip-content"
                            >
                                <img
                                    src={trip.image_url?.[0] || "fallback.jpg"} // fallback nếu không có ảnh
                                    alt={trip.title}
                                    className="trip-image"
                                />
                                <div className="trip-details">
                                    <h4>{trip.title}</h4>
                                    <p>
                                        📅 {new Date(trip.start_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}{" "}
                                        📍 {trip.location || "Unknown location"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="upcoming-trip">
                    <h3 className="upcoming-trip-title">Upcoming trips</h3>
                    {finishItinerary.length === 0 ? (
                        <p>Không có lịch trình sắp tới.</p>
                    ) : (
                        finishItinerary.map((trip) => (
                            <Link
                                key={trip.itinerary_id}
                                to={`/tripguide/${trip.itinerary_id}`}
                                className="trip-content"
                            >
                                <img
                                    src={trip.image_url?.[0] || "fallback.jpg"} // fallback nếu không có ảnh
                                    alt={trip.title}
                                    className="trip-image"
                                />
                                <div className="trip-details">
                                    <h4>{trip.title}</h4>
                                    <p>
                                        📅 {new Date(trip.start_date).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}{" "}
                                        📍 {trip.location || "Unknown location"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>
            </div>
        </div >
    );
};

export default MyTrips;