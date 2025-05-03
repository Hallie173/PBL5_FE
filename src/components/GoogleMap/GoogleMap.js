import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const MapComponent = ({ address }) => {
  const [location, setLocation] = useState(null);
  const apiKey = "AIzaSyCCnsE1CCMUcR_BiT0HRajs5buYHNXqyaE";

  useEffect(() => {
    if (!address) return;

    const fetchCoordinates = async () => {
      try {
        const response = await fetch(
          ``
        );
        const data = await response.json();
        if (data.status === "OK") {
          const { lat, lng } = data.results[0].geometry.location;
          setLocation({ lat, lng });
        } else {
          console.error("Không tìm thấy địa điểm:", data.status);
        }
      } catch (error) {
        console.error("Lỗi khi gọi API Geocode:", error);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      {location ? (
        <GoogleMap mapContainerStyle={containerStyle} center={location} zoom={15}>
          <Marker position={location} />
        </GoogleMap>
      ) : (
        <p>Đang tải bản đồ...</p>
      )}
    </LoadScript>
  );
};

export default MapComponent;