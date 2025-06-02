import { useState } from "react";
import {
  Box,
  Button,
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
import RestaurantList from "./components/RestaurantList";
import RestaurantModal from "./components/RestaurantModal";
import useRestaurantManagement from "./hooks/useRestaurantManagement";

const Restaurants = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    isModalOpen,
    handleOpenModal,
    handleCloseModal,
    isEdit,
    formik,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    imageError,
    setImageError,
    restaurants,
    handleDelete,
    error,
    setError,
    availableTags,
    cities,
  } = useRestaurantManagement();

  const filteredRestaurants = restaurants.filter(
    (r) =>
      r.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: "100vh" }}>
      <Paper
        elevation={0}
        sx={{
          p: 3,
          mb: 4,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              fontWeight={700}
              color="primary.main"
            >
              Restaurant Management
            </Typography>
            <Typography
              variant="subtitle1"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Manage and explore culinary destinations in Vietnam
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
              boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            Add Restaurant
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
            borderRadius: 2,
            boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          }}
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
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Search restaurants..."
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
          boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
          minHeight: "400px",
        }}
      >
        {filteredRestaurants.length === 0 ? (
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
            <Typography variant="h6" color="text.secondary">
              {searchQuery
                ? "No matching restaurants found"
                : "No restaurants available"}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{
                textTransform: "none",
                borderRadius: 2,
                boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
              }}
            >
              Add Restaurant
            </Button>
          </Box>
        ) : (
          <RestaurantList
            restaurants={filteredRestaurants}
            onEdit={handleOpenModal}
            onDelete={handleDelete}
            cities={cities}
          />
        )}
      </Paper>

      <RestaurantModal
        open={isModalOpen}
        onClose={handleCloseModal}
        cities={cities}
        isEdit={isEdit}
        formik={formik}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        triggerFileInput={triggerFileInput}
        imageError={imageError}
        setImageError={setImageError}
        availableTags={availableTags}
      />
    </Container>
  );
};

export default Restaurants;
