import { useState, useEffect } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert,
  Container,
  Paper,
  TextField,
  InputAdornment,
  useTheme,
  alpha,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import AttractionList from "./components/AttractionList";
import AttractionModal from "./components/AttractionModal";
import useAttractionManagement from "./hooks/useAttractionManagement";

const Attractions = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");
  const [cities] = useState([
    { city_id: 1, name: "Hanoi" },
    { city_id: 2, name: "Da Nang" },
    { city_id: 3, name: "Ho Chi Minh" },
  ]);
  const [attractions, setAttractions] = useState([]);
  const [error, setError] = useState(null);

  const {
    isModalOpen,
    selectedAttraction,
    handleOpenModal,
    handleCloseModal,
    isEdit,
    isSubmitting,
    formik,
    previewImage,
    imageError,
    uploadedFile,
    fileInputRef,
    handleImageUrlChange,
    handleFileChange,
    triggerFileInput,
    setImageError,
  } = useAttractionManagement();

  useEffect(() => {
    const fetchAttractions = async () => {
      try {
        setAttractions([
          {
            attraction_id: 1,
            name: "Hoan Kiem Lake",
            description:
              "Historic lake in the heart of Hanoi, surrounded by legends and cultural landmarks",
            latitude: 21.0285,
            longitude: 105.8522,
            city_id: 1,
            address: "Hang Trong, Hoan Kiem District, Hanoi",
            average_rating: 4.7,
            image_url:
              "https://upload.wikimedia.org/wikipedia/commons/7/79/Thap_Rua.jpg",
            tags: ["historical", "lake", "park"],
          },
          {
            attraction_id: 2,
            name: "Dragon Bridge",
            description:
              "Modern 666-meter bridge featuring a dragon that breathes fire and water on weekends",
            latitude: 16.0612,
            longitude: 108.2277,
            city_id: 2,
            address: "Nguyen Van Linh Street, Da Nang",
            average_rating: 4.8,
            image_url:
              "https://media.cnn.com/api/v1/images/stellar/prod/140630220413-dragon-bridge-fire-breathing.jpg?q=w_3432,h_2287,x_0,y_0,c_fill",
            tags: ["modern", "architecture", "landmark"],
          },
          {
            attraction_id: 3,
            name: "Hoi An Ancient Town",
            description:
              "Well-preserved Southeast Asian trading port dating from the 15th to the 19th century",
            latitude: 15.8772,
            longitude: 108.3327,
            city_id: 4,
            address: "Hoi An City, Quang Nam Province",
            average_rating: 4.9,
            image_url:
              "https://image.vietnam.travel/sites/default/files/2021-12/shutterstock_1506184586_resize_0.jpg?v=1742648524",
            tags: ["unesco", "historical", "river"],
          },
          {
            attraction_id: 4,
            name: "Golden Bridge",
            description:
              "150-meter pedestrian bridge held up by giant stone hands in Ba Na Hills",
            latitude: 15.9987,
            longitude: 107.9973,
            city_id: 2,
            address: "Ba Na Hills, Da Nang",
            average_rating: 4.8,
            image_url:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Golden_Bridge_Da-Nang.jpg/800px-Golden_Bridge_Da-Nang.jpg",
            tags: ["viewpoint", "modern", "mountain"],
          },
          {
            attraction_id: 5,
            name: "Cu Chi Tunnels",
            description:
              "Network of underground tunnels used during the Vietnam War",
            latitude: 11.0633,
            longitude: 106.5175,
            city_id: 3,
            address: "Phu Hiep Hamlet, Cu Chi District",
            average_rating: 4.6,
            image_url:
              "https://statics.vinpearl.com/cu-chi-tunnels-8_1689392552.jpg",
            tags: ["historical", "museum", "war"],
          },
          {
            attraction_id: 6,
            name: "Halong Bay",
            description:
              "UNESCO World Heritage Site with thousands of limestone islands",
            latitude: 20.9101,
            longitude: 107.1839,
            city_id: 1,
            address: "Halong City, Quang Ninh Province",
            average_rating: 4.9,
            image_url:
              "https://www.paradisevietnam.com/public/backend/uploads/images/places-to-visit-in-halong-bay%20(6).jpg",
            tags: ["unesco", "nature", "boat"],
          },
        ]);
      } catch (err) {
        setError("Failed to load attractions");
      }
    };
    fetchAttractions();
  }, []);

  const handleSubmit = async (formData) => {
    try {
      // API call logic...
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };

  const handleDelete = async (id) => {
    try {
      // API call logic...
    } catch (err) {
      setError(err.message);
    } finally {
    }
  };

  const filteredAttractions = attractions.filter((attr) =>
    attr.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${alpha(
            theme.palette.primary.main,
            0.1
          )}, ${alpha(theme.palette.primary.light, 0.2)})`,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary.main"
            >
              Attraction Management
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Explore and manage Vietnam's tourist attractions
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{
              textTransform: "none",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 3,
              "&:hover": {
                boxShadow: 5,
                transform: "translateY(-2px)",
                transition: "all 0.3s",
              },
            }}
          >
            Add Attraction
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3, borderRadius: 2, boxShadow: 2 }}
          onClose={() => setError(null)}
        >
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: 2,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search attractions..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
            sx: {
              borderRadius: 2,
              backgroundColor: theme.palette.background.paper,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: alpha(theme.palette.grey[500], 0.2),
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.grey[500],
              },
            },
          }}
          sx={{ maxWidth: 500 }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          minHeight: "400px",
        }}
      >
        {filteredAttractions.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 10,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery
                ? "No matching attractions found"
                : "No attractions available"}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              mb={3}
              textAlign="center"
            >
              {searchQuery
                ? "Try adjusting your search terms"
                : "Start by adding your first attraction"}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{ textTransform: "none", borderRadius: 2 }}
            >
              Add Attraction
            </Button>
          </Box>
        ) : (
          <AttractionList
            attractions={filteredAttractions}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            cities={cities}
          />
        )}
      </Paper>

      <AttractionModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        cities={cities}
        initialData={selectedAttraction}
        isEdit={isEdit}
        isSubmitting={isSubmitting}
        formik={formik}
        previewImage={previewImage}
        imageError={imageError}
        uploadedFile={uploadedFile}
        fileInputRef={fileInputRef}
        handleImageUrlChange={handleImageUrlChange}
        handleFileChange={handleFileChange}
        triggerFileInput={triggerFileInput}
        setImageError={setImageError}
      />
    </Container>
  );
};

export default Attractions;
