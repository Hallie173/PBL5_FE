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
                
                console.log("notfinish: ",notfinishItinerary);
                console.log("finish: ", finishItinerary);
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
                        <p>You dont have any upcoming trips.</p>
                    ) : (
                        notfinishItinerary.map((trip) => (
                            <Link
                                key={trip.itinerary_id}
                                to="/tripguide/newtrip"
                                state={{
                                    itinerary_id: trip.itinerary_id,
                                    mode: 'edit',
                                    startDate: trip.start_date,
                                    endDate: trip.end_date,
                                    title: trip.title,
                                    selectedCity: trip.city_id,
                                }}
                                className="trip-content"
                            >
                                <img
                                    src={trip.image_url || "fallback.jpg"} // fallback nếu không có ảnh
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
                                        📍 {trip.city_name || "Unknown location"}
                                    </p>
                                </div>
                            </Link>
                        ))
                    )}
                </div>

                <div className="upcoming-trip">
                    <h3 className="upcoming-trip-title">Completed trips</h3>
                    {finishItinerary.length === 0 ? (
                        <p>You don't have any completed trips.</p>
                    ) : (
                        finishItinerary.map((trip) => (
                            <Link
                                key={trip.itinerary_id}
                                to="/tripguide/newtrip"
                                state={{
                                    itinerary_id: trip.itinerary_id,
                                    mode: 'edit',
                                    startDate: trip.start_date,
                                    endDate: trip.end_date,
                                    title: trip.title,
                                    selectedCity: trip.city_id,
                                }}
                                className="trip-content"
                            >
                                <img
                                    src={trip.image_url || "fallback.jpg"} // fallback nếu không có ảnh
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
                                        📍 {trip.city_name || "Unknown location"}
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