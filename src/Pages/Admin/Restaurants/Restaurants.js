import { useState, useEffect } from 'react';
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
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import RestaurantList from './components/RestaurantList';
import RestaurantModal from './components/RestaurantModal';
import useRestaurantManagement from './hooks/useRestaurantManagement';

const Restaurants = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [cities] = useState([
    { city_id: 1, name: 'Hanoi' },
    { city_id: 2, name: 'Da Nang' },
    { city_id: 3, name: 'Ho Chi Minh' },
  ]);
  const [restaurants, setRestaurants] = useState([]);
  const [error, setError] = useState(null);

  // Function to handle form submission for adding/editing restaurants
  const handleSubmit = async (values) => {
    try {
      const newRestaurant = {
        ...values,
        restaurant_id: isEdit ? selectedRestaurant.restaurant_id : Date.now(),
        average_rating: isEdit ? selectedRestaurant.average_rating : 0,
      };
      if (isEdit) {
        setRestaurants((prev) =>
          prev.map((r) => (r.restaurant_id === newRestaurant.restaurant_id ? newRestaurant : r))
        );
      } else {
        setRestaurants((prev) => [...prev, newRestaurant]);
      }
      handleCloseModal();
      setError(null); // Clear error message if successful
    } catch (err) {
      setError('Failed to save restaurant');
    }
  };

  const {
    isModalOpen,
    selectedRestaurant,
    handleOpenModal,
    handleCloseModal,
    isEdit,
    formik,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    imageError,
    setImageError,
  } = useRestaurantManagement(handleSubmit);

  // Load restaurant list when component mounts
  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setRestaurants([
          {
            restaurant_id: 1,
            name: 'Pho Thin',
            description: 'Famous pho restaurant in Hanoi',
            latitude: 21.0285,
            longitude: 105.8522,
            city_id: 1,
            address: '13 Lo Duc, Hanoi',
            phone_number: '+84 123 456 789',
            open_time: '06:00',
            close_time: '22:00',
            average_rating: 4.5,
            image_urls: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/af/c0/f4/outside.jpg?w=700&h=400&s=1'],
            tags: ['vietnamese', 'pho', 'noodles'],
            reservation_required: false,
          },
          {
            restaurant_id: 2,
            name: 'Pho Thin 2',
            description: 'Famous pho restaurant in Hanoi',
            latitude: 21.0285,
            longitude: 105.8522,
            city_id: 1,
            address: '13 Lo Duc, Hanoi',
            phone_number: '+84 123 456 789',
            open_time: '06:00',
            close_time: '22:00',
            average_rating: 4.5,
            image_urls: ['https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/af/c0/f4/outside.jpg?w=700&h=400&s=1'],
            tags: ['vietnamese', 'pho', 'noodles'],
            reservation_required: false,
          },
        ]);
      } catch (err) {
        setError('Failed to load restaurant list');
      }
    };
    fetchRestaurants();
  }, []);

  // Delete restaurant
  const handleDelete = (id) => {
    setRestaurants((prev) => prev.filter((r) => r.restaurant_id !== id));
  };

  // Filter restaurants by search query
  const filteredRestaurants = restaurants.filter((restaurant) =>
    restaurant.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    restaurant.address?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4, minHeight: '100vh' }}>
      <Paper
        elevation={0}
        sx={{ p: 3, mb: 4, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={700} color="primary.main">
              Restaurant Management
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
              Manage and explore culinary destinations in Vietnam
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
            sx={{ textTransform: 'none', px: 3, py: 1.5, borderRadius: 2, fontWeight: 600 }}
          >
            Add Restaurant
          </Button>
        </Box>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper
        elevation={0}
        sx={{ mb: 4, p: 2, borderRadius: 3, border: `1px solid ${theme.palette.divider}` }}
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
              '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(theme.palette.grey[500], 0.2) },
            },
          }}
          sx={{ maxWidth: 500 }}
        />
      </Paper>

      <Paper
        elevation={0}
        sx={{ p: 3, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, minHeight: '400px' }}
      >
        {filteredRestaurants.length === 0 ? (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 10,
              backgroundColor: alpha(theme.palette.background.paper, 0.5),
              borderRadius: 2,
              border: `1px dashed ${theme.palette.divider}`,
            }}
          >
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {searchQuery ? 'No matching restaurants found' : 'No restaurants available'}
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => handleOpenModal()}
              sx={{ textTransform: 'none', borderRadius: 2 }}
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
        isSubmitting={false}
        fileInputRef={fileInputRef}
        handleFileChange={handleFileChange}
        triggerFileInput={triggerFileInput}
        imageError={imageError}
        setImageError={setImageError}
      />
    </Container>
  );
};

export default Restaurants;