import React, { useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useCityDetail from "./hooks/useCityDetail";
import LocationCard from "../../components/LocationCard/LocationCard";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Utensils,
  Calendar,
  Heart,
} from "lucide-react";
import {
  Box,
  Button,
  Typography,
  IconButton,
  Collapse,
  Container,
  Tooltip,
  Skeleton,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Place } from "@mui/icons-material";
import { parse } from "date-fns";

// Theme configuration
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

// FAQ Data
const faqData = [
  {
    question: "What are the best beachfront accommodations in Da Nang?",
    answer:
      "Da Nang offers a range of beachfront accommodations, from luxury resorts like InterContinental Danang Sun Peninsula to budget-friendly options like Sea Phoenix Hotel.",
  },
  {
    question: "What are popular dining options in Da Nang?",
    answer:
      "Popular dining spots include Madame Lan for authentic Vietnamese cuisine, Waterfront Restaurant for seafood, and Olivia’s Prime Grill for Western dishes.",
  },
  {
    question: "What are the transportation options from Da Nang airport?",
    answer:
      "From Da Nang airport, you can take taxis, Grab rides, airport shuttles, or rent a motorbike. Taxis and Grab are the most convenient for tourists.",
  },
  {
    question: "What should I know about visiting Ba Na Hills?",
    answer:
      "Ba Na Hills is famous for its Golden Bridge and cable car. Visit early to avoid crowds, and bring a jacket as it can be cooler at higher altitudes.",
  },
  {
    question: "What is the typical weather like in Da Nang?",
    answer:
      "Da Nang has a tropical climate with a wet season (September–January) and a dry season (February–August). Expect warm temperatures year-round, averaging 25–30°C.",
  },
  {
    question: "What are the recommended ways to experience Hai Van Pass?",
    answer:
      "Hai Van Pass is best experienced by motorbike or guided tour for stunning views. Ensure you have a reliable vehicle and check weather conditions before traveling.",
  },
  {
    question: "What are the travel highlights for Bana Hills?",
    answer:
      "Highlights include the Golden Bridge, Fantasy Park, French Village, and the cable car ride offering panoramic views of the surrounding mountains.",
  },
];

// Component con cho Carousel
const ImageCarousel = React.memo(
  ({ images, currentIndex, setCurrentIndex }) => (
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
          }}
          loading="lazy"
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
          setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
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
  )
);

// Component con cho FAQ Item
const FAQItem = React.memo(
  ({ question, answer, index, activeIndex, toggleFaq }) => (
    <Box sx={{ borderBottom: "1px solid", borderColor: "grey.200" }}>
      <Button
        fullWidth
        sx={{
          justifyContent: "space-between",
          py: 2,
          color: "text.primary",
          "&:hover": { color: "primary.main" },
          transition: "color 0.3s ease",
        }}
        onClick={() => toggleFaq(index)}
      >
        <Typography
          variant="body1"
          sx={{ textAlign: "left", fontWeight: "medium", flex: 1 }}
        >
          {question}
        </Typography>
        <Typography sx={{ color: "primary.main", fontSize: "1rem" }}>
          {activeIndex === index ? "▴" : "▾"}
        </Typography>
      </Button>
      <Collapse in={activeIndex === index}>
        <Typography variant="body2" sx={{ pb: 2, color: "text.secondary" }}>
          {answer}
        </Typography>
      </Collapse>
    </Box>
  )
);

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
  // console.log(placesToVisit);

  const [saved, setSaved] = useState(false);

  const toggleSaveCity = () => setSaved((prev) => !prev);
  const toggleFaq = useCallback((index) => {
    setActiveFaqIndex((prev) => (prev === index ? null : index));
  }, []);
  const [activeFaqIndex, setActiveFaqIndex] = useState(null);

  const handleNavigateAttraction = (attractionId) =>
    navigate(`/tripguide/attraction/${attractionId}`);
  const handleNavigateRestaurant = (restaurantId) =>
    navigate(`/tripguide/restaurant/${restaurantId}`);

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
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="body2"
          sx={{
            mb: 4,
            color: "text.secondary",
            "& span": {
              cursor: "pointer",
              "&:hover": { color: "primary.main" },
              transition: "color 0.3s ease",
            },
          }}
        >
          <span>Viet Nam</span> {" > "} <span>{city?.name}</span>
        </Typography>

        <ImageCarousel
          images={images}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 4,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="h3" sx={{ color: "text.primary" }}>
            {city?.name}
          </Typography>
          <Tooltip
            title={saved ? "Remove from Saved" : "Save this city"}
            placement="top"
          >
            <Button
              variant="outlined"
              startIcon={
                <Heart
                  sx={{
                    width: 20,
                    height: 20,
                    color: saved ? "red" : "primary.main",
                    fill: saved ? "red" : "none",
                    transition: "all 0.3s ease",
                  }}
                />
              }
              sx={{
                borderColor: saved ? "primary.main" : "grey.300",
                bgcolor: saved ? "primary.main/0.1" : "transparent",
                "&:hover": {
                  bgcolor: "primary.main/0.2",
                  borderColor: "primary.main",
                },
                transition: "all 0.3s ease",
              }}
              onClick={toggleSaveCity}
            >
              {saved ? "Saved" : "Save"}
            </Button>
          </Tooltip>
        </Box>

        <Typography
          variant="body1"
          sx={{ mt: 4, color: "text.secondary", maxWidth: "48rem" }}
        >
          {city?.description}
        </Typography>

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
              Where to go?
            </Typography>
            <Button
              sx={{
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              See all
            </Button>
          </Box>
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
              Food & Drink
            </Typography>
            <Button
              sx={{
                color: "primary.main",
                "&:hover": { textDecoration: "underline" },
              }}
            >
              See all
            </Button>
          </Box>
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
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ color: "text.primary", mb: 4 }}>
            Our Recommended Plan for Your Trip
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "1fr 1fr",
                md: "1fr 1fr 1fr",
              },
              gap: 2,
            }}
          >
            {[
              {
                title: "4 days in Da Nang for friend groups",
                tags: ["Friends", "Natural Wonders", "Night Markets"],
                icon: MapPin,
              },
              {
                title: "5 days in Da Nang for couples",
                tags: ["Couples", "Wine & Beer", "History"],
                icon: Utensils,
              },
              {
                title: "7 days in Da Nang for families",
                tags: ["Family", "Natural Wonders", "Outdoors"],
                icon: Calendar,
              },
            ].map((plan, index) => (
              <Box
                key={index}
                sx={{
                  bgcolor: "white",
                  borderRadius: "8px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  p: 3,
                  "&:hover": {
                    boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s ease",
                }}
              >
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
                >
                  <plan.icon
                    sx={{ width: 24, height: 24, color: "primary.main" }}
                  />
                  <Typography variant="h6" sx={{ color: "text.primary" }}>
                    {plan.title}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {plan.tags.map((tag) => (
                    <Typography
                      key={tag}
                      sx={{
                        bgcolor: "primary.main/0.1",
                        color: "primary.main",
                        fontSize: "0.75rem",
                        px: 1.5,
                        py: 0.5,
                        borderRadius: "12px",
                      }}
                    >
                      {tag}
                    </Typography>
                  ))}
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    🤖 Powered by AI
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" sx={{ color: "text.primary", mb: 2 }}>
            <Typography component="span" sx={{ color: "primary.main" }}>
              {city?.name}
            </Typography>{" "}
            Travel Advice
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary", mb: 4 }}>
            These questions and answers were created by AI, using the most
            common questions travelers ask in the forums.
          </Typography>
          <Box>
            {faqData.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                index={index}
                activeIndex={activeFaqIndex}
                toggleFaq={toggleFaq}
              />
            ))}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CityDetail;
