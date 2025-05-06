import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Tối ưu hóa OpenStreetMap Component
 */
const OpenStreetMap = ({
  center = [21.0285, 105.8542],
  zoom = 15,
  markers = [],
  height = "400px",
  width = "100%",
  showCurrentLocation = true,
  mapStyle = "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
  onMapClick = () => {},
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);

  // Thêm CSS tùy chỉnh một lần khi component được mount
  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes pulse {
        0% { transform: scale(0.5); opacity: 1; }
        100% { transform: scale(1.5); opacity: 0; }
      }
      
      .pulse-animation {
        animation: pulse 2s infinite;
      }
      
      .custom-marker {
        transition: transform 0.2s ease;
      }

      
      .leaflet-popup-content-wrapper {
        border-radius: 8px;
      }
      
      .locate-button {
        position: absolute;
        bottom: 20px;
        right: 20px;
        z-index: 1000;
        background: white;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        cursor: pointer;
        transition: all 0.2s;
      }
      
      .locate-button:hover {
        background-color: #f9fafb;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      
      .locate-button svg {
        width: 24px;
        height: 24px;
        color: #3b82f6;
      }
    `;
    document.head.appendChild(styleEl);

    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);

  // Sửa lỗi icon Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  // Tạo icon cho marker vị trí hiện tại
  const createCurrentLocationIcon = () => {
    return L.divIcon({
      className: "current-location-icon",
      html: `
        <div style="position: relative; width: 40px; height: 40px;">
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
               width: 14px; height: 14px; background-color: #2563eb; border: 2px solid white; 
               border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3); z-index: 10;"></div>
          <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
               width: 30px; height: 30px; background-color: rgba(59, 130, 246, 0.3); 
               border-radius: 50%;" class="pulse-animation"></div>
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  };

  // Tạo icon cho marker địa điểm
  const createStandardMarkerIcon = () => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div style="position: relative; width: 28px; height: 36px;">
          <!-- Marker head -->
          <div style="position: absolute; top: 0; left: 50%; transform: translateX(-50%); 
               width: 20px; height: 20px; background-color: #ef4444; border: 2px solid white; 
               border-radius: 50%; box-shadow: 0 0 5px rgba(0,0,0,0.3); z-index: 2;"></div>
          <!-- Marker point -->
          <div style="position: absolute; top: 16px; left: 50%; transform: translateX(-50%); 
               width: 0; height: 0; border-left: 7px solid transparent; 
               border-right: 7px solid transparent; border-top: 16px solid #ef4444; z-index: 1;"></div>
          <!-- Inner circle -->
          <div style="position: absolute; top: 6px; left: 50%; transform: translateX(-50%); 
               width: 8px; height: 8px; background-color: white; border-radius: 50%; z-index: 3;"></div>
          <!-- Shadow -->
          <div style="position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); 
               width: 14px; height: 3px; background-color: rgba(0,0,0,0.2); 
               border-radius: 50%; filter: blur(2px);"></div>
        </div>
      `,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -36],
    });
  };

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    try {
      // Khởi tạo bản đồ
      mapInstanceRef.current = L.map(mapContainerRef.current, {
        center,
        zoom,
        attributionControl: false,
        zoomControl: true,
      });

      // Thêm tile layer
      L.tileLayer(mapStyle, {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current);

      // Tạo layer group cho markers
      markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

      // Thêm sự kiện click
      mapInstanceRef.current.on("click", (e) => {
        if (typeof onMapClick === "function") {
          onMapClick(e.latlng);
        }
      });

      // Đảm bảo bản đồ được render đúng kích thước
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
          setIsMapReady(true);
        }
      }, 300);
    } catch (error) {
      console.error("Lỗi khi khởi tạo bản đồ:", error);
    }

    // Cleanup khi component unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        currentLocationMarkerRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []);

  // Cập nhật vị trí và zoom level khi thay đổi props
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;

    try {
      mapInstanceRef.current.setView(center, zoom, { animate: true });
    } catch (error) {
      console.error("Lỗi khi cập nhật vị trí bản đồ:", error);
    }
  }, [center, zoom, isMapReady]);

  // Thêm markers lên bản đồ
  useEffect(() => {
    if (!markersLayerRef.current || !isMapReady) return;

    try {
      markersLayerRef.current.clearLayers();

      const standardMarkerIcon = createStandardMarkerIcon();

      markers.forEach((marker) => {
        const { position, popup, icon, title } = marker;

        // Tạo marker
        const markerOptions = {
          title: title || "",
          icon: icon ? L.icon(icon) : standardMarkerIcon,
        };

        const leafletMarker = L.marker(position, markerOptions).addTo(
          markersLayerRef.current
        );

        if (popup) {
          leafletMarker.bindPopup(popup, {
            className: "custom-popup",
            closeButton: true,
          });
        }
      });
    } catch (error) {
      console.error("Lỗi khi thêm markers:", error);
    }
  }, [markers, isMapReady]);

  // Lấy vị trí hiện tại của người dùng và hiển thị marker
  useEffect(() => {
    if (!isMapReady || !showCurrentLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setCurrentPosition(newPos);

        try {
          // Cập nhật hoặc tạo marker vị trí hiện tại
          if (currentLocationMarkerRef.current) {
            currentLocationMarkerRef.current.setLatLng(newPos);
          } else {
            const currentLocationIcon = createCurrentLocationIcon();
            currentLocationMarkerRef.current = L.marker(newPos, {
              icon: currentLocationIcon,
              zIndexOffset: 1000,
            }).addTo(mapInstanceRef.current);

            currentLocationMarkerRef.current.bindPopup(
              "<strong>Vị trí hiện tại của bạn</strong>",
              { className: "custom-popup" }
            );
          }
        } catch (error) {
          console.error("Lỗi khi cập nhật vị trí hiện tại:", error);
        }
      },
      (error) => {
        console.error("Không thể lấy vị trí hiện tại:", error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [isMapReady, showCurrentLocation]);

  // Thay đổi kích thước bản đồ khi thay đổi height/width
  useEffect(() => {
    if (mapInstanceRef.current && isMapReady) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 0);
    }
  }, [height, width, isMapReady]);

  // Xử lý sự kiện click nút "Vị trí của tôi"
  const handleLocateClick = () => {
    if (!mapInstanceRef.current || !isMapReady) return;

    if (currentPosition) {
      try {
        mapInstanceRef.current.setView(currentPosition, 17, { animate: true });
        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.openPopup();
        }
      } catch (error) {
        console.error("Lỗi khi di chuyển đến vị trí hiện tại:", error);
      }
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPos = [latitude, longitude];
          setCurrentPosition(newPos);

          try {
            mapInstanceRef.current.setView(newPos, 17, { animate: true });
          } catch (error) {
            console.error("Lỗi khi di chuyển đến vị trí mới:", error);
          }
        },
        (error) => {
          console.error("Không thể lấy vị trí hiện tại:", error);
          alert("Không thể xác định vị trí của bạn.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  return (
    <div style={{ position: "relative", width, height }}>
      <div
        ref={mapContainerRef}
        style={{ width: "100%", height: "100%" }}
        className="rounded-xl shadow-lg overflow-hidden"
      />

      {showCurrentLocation && (
        <button
          className="locate-button"
          onClick={handleLocateClick}
          title="Vị trí của tôi"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="12" cy="12" r="5" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpenStreetMap;
