import React from "react";
import "./Restaurant.css";

const Hours = () => {
    return (
        <div className="hours">
            <h3>Hours</h3>
            <p className="open-status">Open until 12:00 AM</p>
            <table>
                <tbody>
                    <tr><td>Sunday</td><td><b>8:00 AM - 12:00 AM</b></td></tr>
                    <tr><td>Monday</td><td>8:00 AM - 12:00 AM</td></tr>
                    <tr><td>Tuesday</td><td>8:00 AM - 12:00 AM</td></tr>
                    <tr><td>Wednesday</td><td>8:00 AM - 12:00 AM</td></tr>
                    <tr><td>Thursday</td><td>8:00 AM - 12:00 AM</td></tr>
                    <tr><td>Friday</td><td>8:00 AM - 12:00 AM</td></tr>
                    <tr><td>Saturday</td><td>8:00 AM - 12:00 AM</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default Hours;
