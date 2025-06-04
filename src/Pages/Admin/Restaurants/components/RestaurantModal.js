import React, { useCallback, useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import { toast } from "react-toastify";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  CircularProgress,
  Typography,
  IconButton,
  Grid,
  Switch,
  FormControlLabel,
  Autocomplete,
  Chip,
  Pagination,
} from "@mui/material";
import {
  Close,
  LocationOn,
  Image as ImageIcon,
  LocalOffer,
  Info,
  Check,
  Error,
  CloudUpload,
  Phone,
  AccessTime,
} from "@mui/icons-material";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format, parse } from "date-fns";

const RestaurantModal = React.memo(
  ({
    open,
    onClose,
    cities,
    isEdit,
    formik,
    imageError,
    fileInputRef,
    handleFileChange,
    triggerFileInput,
    setImageError,
    availableTags,
  }) => {
    const [dragActive, setDragActive] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [localDescription, setLocalDescription] = useState(
      formik.values.description || ""
    );
    const imagesPerPage = 5;

    useEffect(() => {
      setLocalDescription(formik.values.description || "");
    }, [formik.values.description, open]);

    const handleDrag = useCallback((e) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(e.type === "dragenter" || e.type === "dragover");
    }, []);

    const handleDrop = useCallback(
      (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        handleFileChange(e);
      },
      [handleFileChange]
    );

    const handleRemoveImage = useCallback(
      (index) => {
        const newImages = formik.values.image_urls.filter(
          (_, i) => i !== index
        );
        formik.setFieldValue("image_urls", newImages);
        if (imageError && newImages.length < 10) {
          setImageError(null);
        }
        if (currentPage > Math.ceil(newImages.length / imagesPerPage)) {
          setCurrentPage(
            Math.max(1, Math.ceil(newImages.length / imagesPerPage))
          );
        }
      },
      [imageError, currentPage, formik, setImageError]
    );

    const parseTimeString = useCallback((timeString) => {
      if (!timeString) return null;
      return parse(timeString, "HH:mm", new Date());
    }, []);

    const handleTimeChange = useCallback(
      (field, newTime) => {
        if (!newTime) return;
        const formattedTime = format(newTime, "HH:mm");
        const [hours, minutes] = formattedTime.split(":").map(Number);
        const minutesSinceMidnight = hours * 60 + minutes;

        const newWeekRanges = formik.values.hours.weekRanges.map((day) => [
          {
            ...day[0],
            [field]: formattedTime,
            [field === "openHours" ? "open" : "close"]: minutesSinceMidnight,
          },
        ]);

        formik.setFieldValue("hours.weekRanges", newWeekRanges);
      },
      [formik]
    );

    const handleTagsChange = useCallback(
      (event, newValue) => {
        const tagsString = newValue.join(", ");
        formik.setFieldValue("tags", tagsString);
      },
      [formik]
    );

    const handleTagsInput = useCallback(
      (event) => {
        if (event.key === "Enter" && event.target.value.trim()) {
          event.preventDefault();
          const newTag = event.target.value.trim();
          const currentTags = formik.values.tags
            ? formik.values.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [];
          if (!currentTags.includes(newTag)) {
            const updatedTags = [...currentTags, newTag].join(", ");
            formik.setFieldValue("tags", updatedTags);
          }
          event.target.value = "";
        }
      },
      [formik]
    );

    const { totalImages, totalPages, currentImages, indexOfFirstImage } =
      useMemo(() => {
        const totalImages = formik.values.image_urls.length;
        const totalPages = Math.ceil(totalImages / imagesPerPage);
        const indexOfLastImage = currentPage * imagesPerPage;
        const indexOfFirstImage = indexOfLastImage - imagesPerPage;
        const currentImages = formik.values.image_urls.slice(
          indexOfFirstImage,
          indexOfLastImage
        );
        return { totalImages, totalPages, currentImages, indexOfFirstImage };
      }, [formik.values.image_urls, currentPage]);

    const handlePageChange = useCallback((event, page) => {
      setCurrentPage(page);
    }, []);

    const syncDescriptionToFormik = useCallback(
      debounce((value) => {
        formik.setFieldValue("description", value);
      }, 300),
      [formik]
    );

    const handleDescriptionChange = useCallback(
      (e) => {
        const newValue = e.target.value;
        setLocalDescription(newValue);
        syncDescriptionToFormik(newValue);
      },
      [syncDescriptionToFormik]
    );

    const handleSubmit = useCallback(async () => {
      const errors = await formik.validateForm();
      if (Object.keys(errors).length > 0) {
        formik.setTouched({
          name: true,
          city_id: true,
          address: true,
          phone_number: true,
          latitude: true,
          longitude: true,
          average_rating: true,
          hours: true,
          description: true,
          image_urls: true,
          tags: true,
          reservation_required: true,
        });
        toast.error("Vui lòng sửa các lỗi trong biểu mẫu!", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      try {
        await formik.handleSubmit();
        // Thông báo thành công được xử lý trong useRestaurantManagement.js
      } catch (error) {
        const errorMessage =
          error.response?.data?.message || "Đã xảy ra lỗi khi lưu nhà hàng!";
        if (errorMessage.includes("invalid input syntax for type integer")) {
          toast.error("Vui lòng chọn một thành phố hợp lệ!", {
            position: "top-right",
            autoClose: 3000,
          });
        } else {
          toast.error(errorMessage, {
            position: "top-right",
            autoClose: 3000,
          });
        }
      }
    }, [formik]);

    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="lg"
        fullWidth
        sx={{
          "& .MuiDialog-paper": {
            borderRadius: 3,
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          },
        }}
      >
        <DialogTitle sx={{ borderBottom: "1px solid #eee", py: 2 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight="600">
              {isEdit ? "Cập nhật Nhà hàng" : "Thêm Nhà hàng Mới"}
            </Typography>
            <IconButton onClick={onClose} size="small">
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ maxHeight: "70vh" }}>
          <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    <Info sx={{ color: "primary.main", mr: 1 }} />
                    Thông tin Cơ bản
                  </Typography>

                  <TextField
                    fullWidth
                    label="Tên Nhà hàng *"
                    name="name"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    error={formik.touched.name && Boolean(formik.errors.name)}
                    helperText={formik.touched.name && formik.errors.name}
                    sx={{ mb: 2 }}
                  />

                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Thành phố *</InputLabel>
                    <Select
                      name="city_id"
                      value={formik.values.city_id || ""}
                      onChange={(e) => {
                        formik.setFieldValue("city_id", Number(e.target.value));
                      }}
                      error={
                        formik.touched.city_id && Boolean(formik.errors.city_id)
                      }
                      label="Thành phố *"
                    >
                      <MenuItem value="">Chọn thành phố</MenuItem>
                      {cities.map((city) => (
                        <MenuItem key={city.city_id} value={city.city_id}>
                          {city.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {formik.touched.city_id && formik.errors.city_id && (
                      <Typography variant="caption" color="error">
                        {formik.errors.city_id}
                      </Typography>
                    )}
                  </FormControl>

                  <TextField
                    fullWidth
                    label="Địa chỉ *"
                    name="address"
                    value={formik.values.address}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.address && Boolean(formik.errors.address)
                    }
                    helperText={formik.touched.address && formik.errors.address}
                    InputProps={{
                      startAdornment: (
                        <LocationOn sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label="Số điện thoại *"
                    name="phone_number"
                    value={formik.values.phone_number}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.phone_number &&
                      Boolean(formik.errors.phone_number)
                    }
                    helperText={
                      formik.touched.phone_number && formik.errors.phone_number
                    }
                    InputProps={{
                      startAdornment: (
                        <Phone sx={{ color: "action.active", mr: 1 }} />
                      ),
                    }}
                    sx={{ mb: 2 }}
                  />

                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Vĩ độ *"
                        name="latitude"
                        type="number"
                        value={formik.values.latitude}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.latitude &&
                          Boolean(formik.errors.latitude)
                        }
                        helperText={
                          formik.touched.latitude && formik.errors.latitude
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Kinh độ *"
                        name="longitude"
                        type="number"
                        value={formik.values.longitude}
                        onChange={formik.handleChange}
                        error={
                          formik.touched.longitude &&
                          Boolean(formik.errors.longitude)
                        }
                        helperText={
                          formik.touched.longitude && formik.errors.longitude
                        }
                      />
                    </Grid>
                  </Grid>

                  <TextField
                    fullWidth
                    label="Xếp hạng Trung bình"
                    name="average_rating"
                    type="number"
                    value={formik.values.average_rating}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.average_rating &&
                      Boolean(formik.errors.average_rating)
                    }
                    helperText={
                      formik.touched.average_rating &&
                      formik.errors.average_rating
                    }
                    sx={{ mb: 2 }}
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    <AccessTime sx={{ color: "primary.main", mr: 1 }} />
                    Giờ Hoạt động
                  </Typography>

                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2} sx={{ mb: 2 }}>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Giờ Mở cửa (Tất cả các ngày)"
                          value={parseTimeString(
                            formik.values.hours.weekRanges[0][0].openHours
                          )}
                          onChange={(newTime) =>
                            handleTimeChange("openHours", newTime)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error:
                                formik.touched.hours?.weekRanges?.[0]?.[0]
                                  ?.openHours &&
                                Boolean(
                                  formik.errors.hours?.weekRanges?.[0]?.[0]
                                    ?.openHours
                                ),
                              helperText:
                                formik.touched.hours?.weekRanges?.[0]?.[0]
                                  ?.openHours &&
                                formik.errors.hours?.weekRanges?.[0]?.[0]
                                  ?.openHours,
                            },
                          }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TimePicker
                          label="Giờ Đóng cửa (Tất cả các ngày)"
                          value={parseTimeString(
                            formik.values.hours.weekRanges[0][0].closeHours
                          )}
                          onChange={(newTime) =>
                            handleTimeChange("closeHours", newTime)
                          }
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error:
                                formik.touched.hours?.weekRanges?.[0]?.[0]
                                  ?.closeHours &&
                                Boolean(
                                  formik.errors.hours?.weekRanges?.[0]?.[0]
                                    ?.closeHours
                                ),
                              helperText:
                                formik.touched.hours?.weekRanges?.[0]?.[0]
                                  ?.closeHours &&
                                formik.errors.hours?.weekRanges?.[0]?.[0]
                                  ?.closeHours,
                            },
                          }}
                        />
                      </Grid>
                    </Grid>
                  </LocalizationProvider>

                  <FormControlLabel
                    control={
                      <Switch
                        checked={formik.values.reservation_required}
                        onChange={(e) =>
                          formik.setFieldValue(
                            "reservation_required",
                            e.target.checked
                          )
                        }
                        color="primary"
                      />
                    }
                    label="Yêu cầu Đặt chỗ"
                  />
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    <LocalOffer sx={{ color: "primary.main", mr: 1 }} />
                    Thẻ
                  </Typography>
                  <Autocomplete
                    multiple
                    freeSolo
                    options={availableTags}
                    value={
                      formik.values.tags
                        ? formik.values.tags
                            .split(",")
                            .map((tag) => tag.trim())
                            .filter((tag) => tag)
                        : []
                    }
                    onChange={handleTagsChange}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Nhập thẻ (phân tách bằng dấu phẩy hoặc Enter)"
                        placeholder="Nhập thẻ và nhấn Enter"
                        helperText="Ví dụ: Ý, hải sản, cao cấp"
                        onKeyDown={handleTagsInput}
                      />
                    )}
                    renderTags={(value, getTagProps) =>
                      value.map((option, index) => (
                        <Chip
                          label={option}
                          {...getTagProps({ index })}
                          sx={{ m: 0.5 }}
                        />
                      ))
                    }
                    sx={{ mb: 2 }}
                  />
                </Box>
              </Grid>

              <Grid item xs={12} md={6}>
                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    <ImageIcon sx={{ color: "primary.main", mr: 1 }} />
                    Hình ảnh (Tối đa 10)
                  </Typography>

                  <Box
                    sx={{
                      border: `2px dashed ${dragActive ? "#2196f3" : "#ddd"}`,
                      borderRadius: 2,
                      p: 2,
                      textAlign: "center",
                      cursor: "pointer",
                      minHeight: 100,
                      backgroundColor: dragActive
                        ? "rgba(33,150,243,0.1)"
                        : "inherit",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    onClick={triggerFileInput}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <CloudUpload
                      sx={{ fontSize: 40, color: "text.secondary", mb: 1 }}
                    />
                    <Typography variant="body2" color="textSecondary">
                      {formik.values.image_urls.length >= 10
                        ? "Đã đạt số lượng hình ảnh tối đa (10/10)"
                        : `Kéo và thả hình ảnh hoặc nhấp để tải lên (${formik.values.image_urls.length}/10)`}
                    </Typography>
                    <input
                      type="file"
                      hidden
                      multiple
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      disabled={formik.values.image_urls.length >= 10}
                    />
                  </Box>

                  {imageError && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 1, display: "flex", alignItems: "center" }}
                    >
                      <Error fontSize="small" sx={{ mr: 0.5 }} />
                      {imageError}
                    </Typography>
                  )}

                  <Box
                    sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}
                  >
                    {currentImages.map((url, index) => (
                      <Box key={index} sx={{ position: "relative" }}>
                        <img
                          src={url}
                          alt={`Preview ${index + indexOfFirstImage}`}
                          style={{
                            width: 100,
                            height: 100,
                            objectFit: "cover",
                            borderRadius: 8,
                            border: "1px solid #ddd",
                          }}
                          onError={(e) => {
                            e.target.src =
                              "https://via.placeholder.com/100?text=Invalid+Image";
                          }}
                          loading="lazy"
                        />
                        <IconButton
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 4,
                            right: 4,
                            color: "error.main",
                            backgroundColor: "rgba(255,255,255,0.8)",
                            "&:hover": {
                              backgroundColor: "rgba(255,255,255,0.9)",
                            },
                          }}
                          onClick={() =>
                            handleRemoveImage(index + indexOfFirstImage)
                          }
                        >
                          <Close fontSize="small" />
                        </IconButton>
                      </Box>
                    ))}
                  </Box>

                  {totalImages > imagesPerPage && (
                    <Box
                      sx={{ display: "flex", justifyContent: "center", mt: 2 }}
                    >
                      <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        color="primary"
                        size="small"
                      />
                    </Box>
                  )}
                </Box>

                <Box mb={3}>
                  <Typography variant="subtitle1" gutterBottom fontWeight="600">
                    <Info sx={{ color: "primary.main", mr: 1 }} />
                    Mô tả
                  </Typography>
                  <TextField
                    fullWidth
                    label="Mô tả Nhà hàng"
                    name="description"
                    value={localDescription}
                    onChange={handleDescriptionChange}
                    multiline
                    rows={4}
                    error={
                      formik.touched.description &&
                      Boolean(formik.errors.description)
                    }
                    helperText={
                      formik.touched.description && formik.errors.description
                    }
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>

        <DialogActions sx={{ borderTop: "1px solid #eee", py: 2, px: 3 }}>
          <Button onClick={onClose} color="inherit">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={formik.isSubmitting}
            startIcon={
              formik.isSubmitting ? <CircularProgress size={20} /> : <Check />
            }
            sx={{ boxShadow: "0 1px 2px rgba(0,0,0,0.1)" }}
          >
            {isEdit ? "Cập nhật" : "Tạo"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default RestaurantModal;
