import { useState, useEffect, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Container,
  Paper,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { useDebounce } from "use-debounce";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AttractionList from "./components/AttractionList";
import AttractionModal from "./components/AttractionModal";
import useAttractionManagement from "./hooks/useAttractionManagement";
import axios from "axios";

const Attractions = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery] = useDebounce(searchQuery, 300);
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const {
    isModalOpen,
    isEdit,
    isSubmitting,
    submissionError,
    formik,
    imageUrls,
    previewUrls,
    imageError,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    setImageError,
    setImageUrls,
    removeImage,
    tagList,
    tagError,
    handleTagChange,
    handleOpenModal,
    handleCloseModal,
    deleteAttraction,
  } = useAttractionManagement({ setAttractions });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [citiesResponse, attractionsResponse] = await Promise.all([
          axios.get("/cities").catch(() => ({ data: [] })),
          axios.get("/attractions").catch(() => ({ data: [] })),
        ]);
        const parsedAttractions = attractionsResponse.data.map((attr) => ({
          ...attr,
          image_url:
            typeof attr.image_url === "string"
              ? JSON.parse(attr.image_url)
              : attr.image_url,
        }));
        if (JSON.stringify(citiesResponse.data) !== JSON.stringify(cities)) {
          setCities(citiesResponse.data);
        }
        if (JSON.stringify(parsedAttractions) !== JSON.stringify(attractions)) {
          setAttractions(parsedAttractions);
        }
      } catch {
        toast.error("Failed to load attractions or cities", {
          position: "top-right",
          autoClose: 3000,
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // No dependencies

  useEffect(() => {
    const ids = attractions.map((attr) => attr.attraction_id);
    const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index);
    if (duplicates.length > 0) {
      toast.error(
        "Duplicate attraction IDs detected. Please check your data.",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
    }
  }, [attractions]);

  useEffect(() => {
    if (submissionError) {
      toast.error(submissionError, {
        position: "top-right",
        autoClose: 3000,
      });
    }
  }, [submissionError]);

  const filteredAttractions = useMemo(
    () =>
      attractions.filter((attr) =>
        attr.name?.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      ),
    [attractions, debouncedSearchQuery]
  );

  return (
    <>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper sx={{ p: 3, mb: 4, borderRadius: 2, border: "1px solid #eee" }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Attraction Management
              </Typography>
              <Typography variant="subtitle1" color="textSecondary">
                Explore and manage Vietnam's tourist attractions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleOpenModal}
              sx={{ px: 3, py: 1.5, borderRadius: 2 }}
            >
              Add Attraction
            </Button>
          </Box>
        </Paper>

        <Paper sx={{ mb: 4, p: 2, borderRadius: 2, border: "1px solid #eee" }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search attractions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{ maxWidth: 500 }}
          />
        </Paper>

        <Paper sx={{ p: 3, borderRadius: 2, border: "1px solid #eee" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : filteredAttractions.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 10 }}>
              <Typography variant="h6" color="textSecondary">
                {searchQuery
                  ? "No matching attractions found"
                  : "No attractions available"}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleOpenModal}
                sx={{ mt: 2 }}
              >
                Add Attraction
              </Button>
            </Box>
          ) : (
            <AttractionList
              attractions={filteredAttractions}
              onEdit={handleOpenModal}
              onDelete={deleteAttraction}
              cities={cities}
            />
          )}
        </Paper>

        <AttractionModal
          open={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={formik.handleSubmit}
          cities={cities}
          isEdit={isEdit}
          isSubmitting={isSubmitting}
          formik={formik}
          previewUrls={previewUrls}
          imageError={imageError}
          imageUrls={imageUrls}
          fileInputRef={fileInputRef}
          handleFileChange={handleFileChange}
          triggerFileInput={triggerFileInput}
          setImageError={setImageError}
          setImageUrls={setImageUrls}
          removeImage={removeImage}
          tagList={tagList}
          tagError={tagError}
          handleTagChange={handleTagChange}
        />
      </Container>
      <ToastContainer />
    </>
  );
};

export default Attractions;
