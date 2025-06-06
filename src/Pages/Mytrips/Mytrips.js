import React from "react";
import "./Mytrips.scss";
import { Link } from "react-router-dom";
import { faMapLocation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const MyTrips = () => {
    return (
        <div className="my-trips-container">
            <div className="my-trips"><h1>Make your trip unforgettable!</h1></div>
            <div className="trip-actions">
                <Link to="/tripguide/new-trip-form" className="create-trip"><FontAwesomeIcon icon={faMapLocation} />Create a new trip</Link>
            </div>

            <div className="trip-list">
                <div className="upcoming-trip">
                    <h3 className="upcoming-trip-title">Upcoming trips</h3>
                    <Link to="/tripguide/newtrip" className="trip-content">
                        <img src="https://toquoc.mediacdn.vn/280518851207290880/2024/1/7/dsdgtdy-1704616308047440689926.jpg" alt="Trip" className="trip-image" />
                        <div className="trip-details">
                            <h4>Trip To Da Nang</h4>
                            <p>📅 Mar 28, 2025 📍 Da Nang</p>
                        </div>
                    </Link>
                    <Link to="/tripguide/newtrip" className="trip-content">
                        <img src="https://www.bambooairways.com/documents/20122/1165110/kinh-nghiem-du-lich-hoi-an-1.jpg/05c3f051-1623-c052-7a25-40a77f385ccf?t=1695007973161" alt="Trip" className="trip-image" />
                        <div className="trip-details">
                            <h4>Around Hoi An in 7 days</h4>
                            <p>📅 June 10, 2025 📍 Hoi An</p>
                        </div>
                    </Link>
                    <Link to="/tripguide/newtrip" className="trip-content">
                        <img src="https://cdn.vntrip.vn/cam-nang/wp-content/uploads/2017/07/ha-noi-mua-thu-2-1.jpg" alt="Trip" className="trip-image" />
                        <div className="trip-details">
                            <h4>Summer in Ha Noi</h4>
                            <p>📅 June 20, 2025 📍 Ha Noi</p>
                        </div>
                    </Link>
                </div>

                <div className="completed-trip">
                    <h3 className="completed-trip-title">Completed trips</h3>
                    <div className="trip-content">
                        <img src="https://huecitytour.com/wp-content/uploads/2023/03/mon-banh-hue.jpg" alt="Completed Trip" className="trip-image" />
                        <div className="trip-details">
                            <h4>Hue Food Tour</h4>
                            <p>📅 Jan 17 → Jan 23, 2025 📍 Hue</p>
                        </div>
                    </div>
                    <div className="trip-content">
                        <img src="https://mettavoyage.com/wp-content/uploads/2023/05/nha-trang-beaches-1.webp" alt="Completed Trip" className="trip-image" />
                        <div className="trip-details">
                            <h4>5 days camping at Nha Trang's Coast</h4>
                            <p>📅 Jan 17 → Jan 23, 2025 📍 Hue</p>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};

export default MyTrips;