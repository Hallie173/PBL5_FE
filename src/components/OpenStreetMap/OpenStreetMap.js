import React, { useEffect, useRef, useState, useMemo } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const OpenStreetMap = ({
  center = [21.0285, 105.8542],
  zoom = 15,
  markers = [],
  height = "400px",
  width = "100%",
  showCurrentLocation = true,
  onMapClick = () => {},
}) => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const currentLocationMarkerRef = useRef(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [isMapReady, setIsMapReady] = useState(false);
  const [mapStyle, setMapStyle] = useState(
    "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
  );

  const mapStyles = useMemo(
    () => ({
      voyager:
        "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
      satellite: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      dark: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    }),
    []
  );

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = `
      @keyframes pulse {
        0% { transform: scale(0.8); opacity: 0.7; }
        100% { transform: scale(1.8); opacity: 0; }
      }
      .pulse-animation {
        animation: pulse 2s infinite;
      }
      .custom-marker {
        transition: transform 0.3s ease;
      }
      .custom-marker:hover {
        transform: scale(1.2);
      }
      .leaflet-popup-content-wrapper {
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        background: #fff;
        padding: 8px;
      }
      .leaflet-tooltip {
        background: rgba(0, 0, 0, 0.85);
        color: white;
        border: none;
        border-radius: 6px;
        padding: 4px 8px;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
      }
      .locate-button, .style-button {
        position: absolute;
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
      .locate-button {
        bottom: 20px;
        right: 20px;
      }
      .style-button {
        bottom: 70px;
        right: 20px;
      }
      .locate-button:hover, .style-button:hover {
        background-color: #f9fafb;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      }
      .locate-button svg, .style-button svg {
        width: 24px;
        height: 24px;
        color: #3b82f6;
      }
      .current-location-icon {
        position: relative;
      }
      .current-location-icon .location-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 30px;
        height: 30px;
        background-color: rgba(59, 130, 246, 0.3);
        border-radius: 50%;
        animation: pulse 1.5s infinite ease-in-out;
      }
      .current-location-icon .location-pulse::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 14px;
        height: 14px;
        background-color: #2563eb;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .custom-marker {
        position: relative;
      }
      .custom-marker .marker-main {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 20px;
        height: 20px;
        background-color: #ef4444;
        border: 2px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      }
      .custom-marker .marker-main::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 8px;
        height: 8px;
        background-color: white;
        border-radius: 50%;
      }
      .custom-marker .marker-main::after {
        content: '';
        position: absolute;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 7px solid transparent;
        border-right: 7px solid transparent;
        border-top: 16px solid #ef4444;
      }
      .custom-marker .marker-shadow {
        position: absolute;
        bottom: -2px;
        left: 50%;
        transform: translateX(-50%);
        width: 16px;
        height: 4px;
        background-color: rgba(0,0,0,0.2);
        border-radius: 50%;
        filter: blur(2px);
      }
    `;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
      iconUrl: require("leaflet/dist/images/marker-icon.png"),
      shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
    });
  }, []);

  const currentLocationIcon = useMemo(() => {
    return L.divIcon({
      className: "current-location-icon",
      html: '<div class="location-pulse"></div>',
      iconSize: [40, 40],
      iconAnchor: [20, 20],
    });
  }, []);

  const standardMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <div class="marker-main"></div>
        <div class="marker-shadow"></div>
      `,
      iconSize: [28, 36],
      iconAnchor: [14, 36],
      popupAnchor: [0, -36],
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      attributionControl: false,
      zoomControl: true,
      zoomAnimation: true,
    });

    L.tileLayer(mapStyle, {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(mapInstanceRef.current);

    markersLayerRef.current = L.layerGroup().addTo(mapInstanceRef.current);

    mapInstanceRef.current.on("click", (e) => onMapClick(e.latlng));

    setTimeout(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
        setIsMapReady(true);
      }
    }, 300);

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

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    const tileLayer = L.tileLayer(mapStyle, {
      attribution:
        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    });
    mapInstanceRef.current.eachLayer((layer) => {
      if (layer instanceof L.TileLayer)
        mapInstanceRef.current.removeLayer(layer);
    });
    tileLayer.addTo(mapInstanceRef.current);
  }, [mapStyle, isMapReady]);

  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom, isMapReady]);

  useEffect(() => {
    if (!markersLayerRef.current || !isMapReady) return;

    markersLayerRef.current.clearLayers();

    markers.forEach((marker) => {
      const { position, popup, icon, title } = marker;
      const markerOptions = {
        title: title || "",
        icon: icon ? L.icon(icon) : standardMarkerIcon,
      };

      const leafletMarker = L.marker(position, markerOptions).addTo(
        markersLayerRef.current
      );

      if (popup) {
        leafletMarker.bindPopup(`<div>${popup}</div>`, {
          className: "custom-popup",
          closeButton: true,
        });
      }
      if (title) {
        leafletMarker.bindTooltip(title, {
          permanent: false,
          direction: "top",
          offset: [0, -10],
        });
      }
    });
  }, [markers, isMapReady, standardMarkerIcon]);

  useEffect(() => {
    if (!isMapReady || !showCurrentLocation) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newPos = [latitude, longitude];
        setCurrentPosition(newPos);

        if (currentLocationMarkerRef.current) {
          currentLocationMarkerRef.current.setLatLng(newPos);
        } else {
          currentLocationMarkerRef.current = L.marker(newPos, {
            icon: currentLocationIcon,
            zIndexOffset: 1000,
          }).addTo(mapInstanceRef.current);
          currentLocationMarkerRef.current.bindPopup(
            "<strong>Vị trí hiện tại</strong><br>Bạn đang ở đây!",
            { className: "custom-popup" }
          );
        }
      },
      (error) => console.error("Không thể lấy vị trí:", error),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isMapReady, showCurrentLocation, currentLocationIcon]);

  useEffect(() => {
    if (mapInstanceRef.current && isMapReady) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 0);
    }
  }, [height, width, isMapReady]);

  const handleLocateClick = () => {
    if (!mapInstanceRef.current || !isMapReady) return;
    if (currentPosition) {
      mapInstanceRef.current.setView(currentPosition, 17, { animate: true });
      currentLocationMarkerRef.current?.openPopup();
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPos = [position.coords.latitude, position.coords.longitude];
          setCurrentPosition(newPos);
          mapInstanceRef.current.setView(newPos, 17, { animate: true });
        },
        (error) => {
          console.error("Không thể lấy vị trí:", error);
          alert("Không thể xác định vị trí của bạn.");
        },
        { enableHighAccuracy: true }
      );
    }
  };

  const handleStyleChange = () => {
    const styles = Object.keys(mapStyles);
    const currentIndex = styles.indexOf(
      Object.keys(mapStyles).find((key) => mapStyles[key] === mapStyle) ||
        "voyager"
    );
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(mapStyles[styles[nextIndex]]);
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
      <button
        className="style-button"
        onClick={handleStyleChange}
        title="Đổi kiểu bản đồ"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
        >
          <path d="M3 3h18v18H3z" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      </button>
    </div>
  );
};

export default OpenStreetMap;
