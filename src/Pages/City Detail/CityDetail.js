import React, { useState, useEffect, useCallback } from "react";
import "./CityDetail.scss";
import { useNavigate, useParams } from "react-router-dom";
import useCityDetail from "./hooks/useCityDetail";
import LocationCard from "../../components/LocationCard/LocationCard";
import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Container,
  Skeleton,
} from "@mui/material";
import { Link } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Cấu hình theme cho Material-UI
const theme = createTheme({
  palette: {
    primary: { main: "#2d7a61" },
    secondary: { main: "#f5f5f5" },
    text: { primary: "#1a1a1a", secondary: "#666" },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontSize: "2.5rem",
      fontWeight: 700,
      "@media (max-width:600px)": { fontSize: "1.75rem" },
    },
    h5: { fontSize: "1.5rem", fontWeight: 600 },
    h6: { fontSize: "1.25rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: "0.875rem", lineHeight: 1.5 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
        },
      },
    },
    MuiIconButton: {
      styleOverrides: { root: { borderRadius: "50%" } },
    },
  },
});

// Component ImageCarousel được tối ưu hóa
const ImageCarousel = React.memo(
  ({ images, currentIndex, setCurrentIndex }) => {
    const [loadedImages, setLoadedImages] = useState([]);

    // Tải trước tất cả hình ảnh và theo dõi trạng thái tải
    useEffect(() => {
      if (!images || images.length === 0) return;

      const preload = (src) => {
        return new Promise((resolve) => {
          const img = new window.Image();
          img.src = src;
          img.onload = () => resolve(src);
          img.onerror = () => resolve(null); // Xử lý lỗi
        });
      };

      Promise.all(images.map(preload)).then((results) => {
        setLoadedImages(results.filter((src) => src !== null));
      });
    }, [images]);

    // Xử lý auto-slide chỉ chuyển đến hình đã tải
    const handleAutoSlide = useCallback(() => {
      const nextIndex = (currentIndex + 1) % images.length;
      if (loadedImages.includes(images[nextIndex])) {
        setCurrentIndex(nextIndex);
      } else {
        // Tìm hình đã tải tiếp theo
        let nextLoadedIndex = -1;
        for (let i = 1; i < images.length; i++) {
          const idx = (currentIndex + i) % images.length;
          if (loadedImages.includes(images[idx])) {
            nextLoadedIndex = idx;
            break;
          }
        }
        if (nextLoadedIndex !== -1) {
          setCurrentIndex(nextLoadedIndex);
        }
        // Nếu không tìm thấy hình đã tải, giữ nguyên hình hiện tại
      }
    }, [currentIndex, images, loadedImages, setCurrentIndex]);

    // Thiết lập interval cho auto-slide
    useEffect(() => {
      const interval = setInterval(handleAutoSlide, 4000);
      return () => clearInterval(interval);
    }, [handleAutoSlide]);

    return (
      <Box
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "5/2",
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
      >
        {images.map((src, index) => (
          <Box
            component="img"
            key={index}
            src={src}
            alt={`City view ${index + 1}`}
            sx={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "opacity 700ms ease-in-out",
              opacity: index === currentIndex ? 1 : 0,
              background:
                "#f0f0f0 url('/images/placeholder.png') center/cover no-repeat",
            }}
            loading={index === currentIndex ? "eager" : "lazy"}
            onError={(e) => {
              e.target.src = "/images/placeholder.png";
            }}
          />
        ))}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.2), transparent)",
            pointerEvents: "none",
          }}
        />
        <IconButton
          sx={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "white" },
            transition: "all 0.3s ease",
          }}
          onClick={() =>
            setCurrentIndex((prev) =>
              prev === 0 ? images.length - 1 : prev - 1
            )
          }
        >
          <ChevronLeft sx={{ width: 24, height: 24, color: "primary.main" }} />
        </IconButton>
        <IconButton
          sx={{
            position: "absolute",
            right: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "rgba(255,255,255,0.9)",
            "&:hover": { bgcolor: "white" },
            transition: "all 0.3s ease",
          }}
          onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        >
          <ChevronRight sx={{ width: 24, height: 24, color: "primary.main" }} />
        </IconButton>
        <Box
          sx={{
            position: "absolute",
            bottom: "16px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
          }}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              component="button"
              sx={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                bgcolor:
                  index === currentIndex
                    ? "primary.main"
                    : "rgba(255,255,255,0.7)",
                transform: index === currentIndex ? "scale(1.25)" : "scale(1)",
                transition: "all 0.3s ease",
                border: "none",
                cursor: "pointer",
              }}
              onClick={() => setCurrentIndex(index)}
            />
          ))}
        </Box>
      </Box>
    );
  }
);

// Component chính CityDetail
const CityDetail = () => {
  const { id: cityId } = useParams();
  const navigate = useNavigate();
  const {
    city,
    images,
    placesToVisit,
    placesToEat,
    loading,
    error,
    currentIndex,
    renderStars,
    setCurrentIndex,
  } = useCityDetail(cityId);

  const toggleFaq = useCallback((index) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  }, []);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const handleNavigateAttraction = (attractionId) =>
    navigate(`/tripguide/attraction/${attractionId}`);
  const handleNavigateRestaurant = (restaurantId) =>
    navigate(`/tripguide/restaurant/${restaurantId}`);

  // Định dạng mô tả thành các đoạn văn
  const formatDescription = (description) => {
    if (!description) return [];
    return description.split(/(?<=[.!?])\s+/).filter((para) => para.trim());
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Skeleton
          variant="rectangular"
          height={400}
          sx={{ borderRadius: "12px", mb: 6 }}
        />
        <Skeleton variant="text" width="60%" height={48} sx={{ mb: 4 }} />
        <Skeleton variant="text" width="80%" height={24} sx={{ mb: 8 }} />
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "1fr 1fr",
              md: "1fr 1fr 1fr 1fr",
            },
            gap: 2,
          }}
        >
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              variant="rectangular"
              height={200}
              sx={{ borderRadius: "8px" }}
            />
          ))}
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h6"
          sx={{ textAlign: "center", color: "error.main" }}
        >
          Error: {error}
        </Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ py: 8, pt: 4 }}>
        <ImageCarousel
          images={images}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <Typography
          variant="body1"
          sx={{
            color: "#000",
            fontSize: "30px",
            fontWeight: "bold",
            mt: 5,
            maxWidth: "48rem",
          }}
        >
          {city?.name}
        </Typography>

        <Box sx={{ mt: 3, maxWidth: "48rem" }}>
          {formatDescription(city?.description).length > 0 ? (
            formatDescription(city?.description).map((paragraph, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  color: "text.secondary",
                  mb: 2,
                  textAlign: "justify",
                  lineHeight: 1.8,
                }}
              >
                {paragraph}
              </Typography>
            ))
          ) : (
            <Typography
              variant="body1"
              sx={{
                color: "text.secondary",
                mb: 2,
                textAlign: "justify",
                lineHeight: 1.8,
              }}
            >
              Không có mô tả nào cho {city?.name}. Hãy khám phá các điểm tham
              quan và lựa chọn ăn uống dưới đây để tìm hiểu điều gì làm nên sự
              đặc biệt của thành phố này!
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              Đi đâu chơi?
            </Typography>
            <Button
              sx={{
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Link to={`/tripguide/attractions`}>Xem tất cả</Link>
            </Button>
          </Box>
          {placesToVisit && placesToVisit.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {placesToVisit.map((place) => (
                <LocationCard
                  key={place.attraction_id}
                  item={{
                    id: place.attraction_id,
                    name: place.name,
                    image: place.image_url,
                    rating: parseFloat(place.average_rating),
                    reviewCount: place.rating_total,
                    tags: place.tags,
                    type: "attraction",
                  }}
                  onClick={() => handleNavigateAttraction(place.attraction_id)}
                  renderStars={renderStars}
                />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
            >
              Không tìm thấy điểm tham quan nào cho {city?.name}. Hãy quay lại
              sau hoặc khám phá các thành phố khác!
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 8 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 4,
            }}
          >
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              Ăn uống
            </Typography>
            <Button
              sx={{
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              <Link to={`/tripguide/restaurants`}>Xem tất cả</Link>
            </Button>
          </Box>
          {placesToEat && placesToEat.length > 0 ? (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "1fr 1fr",
                  md: "1fr 1fr 1fr 1fr",
                },
                gap: 2,
              }}
            >
              {placesToEat.map((place) => (
                <LocationCard
                  key={place.restaurant_id}
                  item={{
                    id: place.restaurant_id,
                    name: place.name,
                    image: place.image_url,
                    rating: parseFloat(place.average_rating),
                    reviewCount: place.rating_total,
                    tags: place.tags,
                    type: "restaurant",
                  }}
                  onClick={() => handleNavigateRestaurant(place.restaurant_id)}
                  renderStars={renderStars}
                />
              ))}
            </Box>
          ) : (
            <Typography
              variant="body1"
              sx={{ color: "text.secondary", textAlign: "center", py: 4 }}
            >
              Không tìm thấy nhà hàng nào cho {city?.name}. Hãy thử khám phá các
              thành phố lân cận hoặc quay lại sớm!
            </Typography>
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CityDetail;
