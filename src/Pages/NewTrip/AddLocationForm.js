import React, { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";

const AddLocationForm = ({
    visible,
    mode,
    daylist,
    editData,
    cityAttraction,
    selectedLocation,
    setSelectedLocation,
    startTime,
    setStartTime,
    endTime,
    setEndTime,
    itineraryData,
    setItineraryData,
    handleCancel,
    handleSave, // Sử dụng prop handleSave từ NewTrip
    selectedDay,         
    setSelectedDay
}) => {
    useEffect(() => {
        console.log("AddLocationForm visible:", visible, "mode:", mode); // Debug
        console.log("Addlocaiton",daylist);
        if (visible) {
            if (mode === "edit" && editData) {
                setSelectedLocation(editData);
                setStartTime(editData.arrival_time);
                setEndTime(editData.departure_time);
            } else {
                setSelectedLocation(null);
                setStartTime("");
                setEndTime("");
            }
        }
    }, [visible, mode, editData, setSelectedLocation, setStartTime, setEndTime]);

    return (
        <div className={`form-container ${visible ? "show" : ""}`}>
            <div className="form-header">
                <h4>{mode === "edit" ? "Edit Location" : "Add Location"}</h4>
            </div>
            <div className="form-body">
                <div className="form-date-group">
                    <div className="form-date">
                        <label>Select Date</label>
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
                            renderInput={(params) => (
                                <TextField {...params} label="Search for location..." />
                            )}
                            sx={{ width: "100%" }}
                        />
                    </div>
                    <button className="search-btn">Search</button>
                </div>
                <div className="form-time-group">
                    <div className="start-time">
                        <label>Start Time</label>
                        <input
                            type="time"
                            value={startTime}
                            onChange={(e) => setStartTime(e.target.value)}
                        />
                    </div>
                    <div className="end-time">
                        <label>End Time</label>
                        <input
                            type="time"
                            value={endTime}
                            onChange={(e) => setEndTime(e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="form-footer">
                <button className="cancel-btn" onClick={handleCancel}>
                    Cancel
                </button>
                <button className="save-btn" onClick={handleSave}>
                    Save
                </button>
            </div>
        </div>
    );
};

export default AddLocationForm;