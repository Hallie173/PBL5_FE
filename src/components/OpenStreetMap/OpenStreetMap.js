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
  const tileLayerRef = useRef(null);
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
    }),
    []
  );

  // Hàm định dạng khoảng cách
  const formatDistance = (distance) => {
    if (distance >= 1000) {
      return `${(distance / 1000).toFixed(2)} km`;
    }
    return `${Math.round(distance)} m`;
  };

  // CSS tối ưu hóa, thêm style cho nút go-to-marker
  const styles = `
    .leaflet-container { border-radius: 12px; overflow: hidden; }
    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.7; }
      100% { transform: scale(1.5); opacity: 0; }
    }
    .current-location-pulse {
      will-change: transform, opacity;
      animation: pulse 2s infinite ease-in-out;
    }
    .locate-button, .style-button, .go-to-marker-button {
      position: absolute;
      z-index: 1000;
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 8px;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .locate-button { bottom: 16px; right: 16px; }
    .style-button { bottom: 60px; right: 16px; }
    .go-to-marker-button { bottom: 104px; right: 16px; }
    .locate-button:hover, .style-button:hover, .go-to-marker-button:hover { background-color: #f9fafb; }
    .locate-button svg, .style-button svg, .go-to-marker-button svg { width: 20px; height: 20px; color: #3b82f6; }
    .leaflet-popup-content { font-size: 14px; }
  `;

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    document.head.appendChild(styleEl);
    return () => document.head.removeChild(styleEl);
  }, []);

  // Cấu hình marker mặc định của Leaflet
  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  // Marker vị trí hiện tại sử dụng SVG
  const currentLocationIcon = useMemo(() => {
    return L.divIcon({
      className: "current-location-icon",
      html: `
        <svg width="32" height="32" viewBox="0 0 32 32">
          <circle cx="16" cy="16" r="12" fill="rgba(59,130,246,0.3)" class="current-location-pulse"/>
          <circle cx="16" cy="16" r="6" fill="#2563eb" stroke="white" stroke-width="2"/>
        </svg>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });
  }, []);

  // Marker tùy chỉnh sử dụng SVG
  const standardMarkerIcon = useMemo(() => {
    return L.divIcon({
      className: "custom-marker",
      html: `
        <svg width="24" height="32" viewBox="0 0 24 32">
          <path d="M12 0C5.373 0 0 5.373 0 12c0 8 12 20 12 20s12-12 12-20c0-6.627-5.373-12-12-12z" fill="#ef4444" stroke="white" stroke-width="1.5"/>
          <circle cx="12" cy="12" r="4" fill="white"/>
        </svg>
      `,
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
    });
  }, []);

  // Khởi tạo bản đồ
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    mapInstanceRef.current = L.map(mapContainerRef.current, {
      center,
      zoom,
      attributionControl: false,
      zoomControl: true,
      zoomAnimation: true,
    });

    tileLayerRef.current = L.tileLayer(mapStyle, {
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
    }, 100);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markersLayerRef.current = null;
        currentLocationMarkerRef.current = null;
        tileLayerRef.current = null;
        setIsMapReady(false);
      }
    };
  }, []);

  // Cập nhật tile layer khi đổi style
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady || !tileLayerRef.current) return;
    tileLayerRef.current.setUrl(mapStyle);
  }, [mapStyle, isMapReady]);

  // Cập nhật center và zoom
  useEffect(() => {
    if (!mapInstanceRef.current || !isMapReady) return;
    mapInstanceRef.current.setView(center, zoom, { animate: true });
  }, [center, zoom, isMapReady]);

  // Cập nhật markers và tính khoảng cách
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

      // Tính khoảng cách nếu có vị trí hiện tại
      const updatePopupContent = () => {
        let popupContent = popup || title || "Địa điểm";
        if (currentPosition) {
          const distance = L.latLng(currentPosition).distanceTo(position);
          popupContent += `<br>Khoảng cách: ${formatDistance(distance)}`;
        }
        leafletMarker.bindPopup(`<div>${popupContent}</div>`);
      };

      updatePopupContent();

      // Cập nhật popup khi nhấp vào marker
      leafletMarker.on("click", () => {
        updatePopupContent();
        leafletMarker.openPopup();
      });

      if (title) {
        leafletMarker.bindTooltip(title, {
          direction: "top",
          offset: [0, -10],
        });
      }
    });
  }, [markers, isMapReady, currentPosition, standardMarkerIcon]);

  // Cập nhật vị trí hiện tại
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
          currentLocationMarkerRef.current.bindPopup("Bạn đang ở đây!");
        }
      },
      (error) => console.error("Không thể lấy vị trí:", error),
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isMapReady, showCurrentLocation, currentLocationIcon]);

  // Tự động resize bản đồ
  useEffect(() => {
    if (mapInstanceRef.current && isMapReady) {
      setTimeout(() => mapInstanceRef.current.invalidateSize(), 0);
    }
  }, [height, width, isMapReady]);

  // Xử lý nút định vị
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

  // Xử lý nút chuyển về vị trí marker
  const handleGoToMarker = () => {
    if (!mapInstanceRef.current || !isMapReady || markers.length === 0) return;
    const firstMarker = markers[0]; // Chuyển đến marker đầu tiên
    mapInstanceRef.current.setView(firstMarker.position, 17, { animate: true });
  };

  // Xử lý đổi kiểu bản đồ
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
      <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
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
            strokeWidth="2"
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
          strokeWidth="2"
        >
          <path d="M3 3h18v18H3z" />
          <path d="M12 3v18M3 12h18" />
        </svg>
      </button>
      {markers.length > 0 && (
        <button
          className="go-to-marker-button"
          onClick={handleGoToMarker}
          title="Đi đến marker"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default OpenStreetMap;
