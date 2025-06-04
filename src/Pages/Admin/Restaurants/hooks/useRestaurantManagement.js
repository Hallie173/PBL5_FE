import { useState, useRef, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { toast } from "react-toastify";
import BASE_URL from "../../../../constants/BASE_URL";

// Hàm debounce để giới hạn tần suất gọi API
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
};

const useRestaurantManagement = () => {
  const fileInputRef = useRef(null);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageError, setImageError] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [cities, setCities] = useState([]); // State mới cho danh sách cities
  const [error, setError] = useState(null);

  const isEdit = !!selectedRestaurant?.restaurant_id;

  const validationSchema = Yup.object({
    name: Yup.string().required("Tên nhà hàng là bắt buộc"),
    city_id: Yup.number()
      .typeError("Vui lòng chọn một thành phố hợp lệ")
      .required("Thành phố là bắt buộc")
      .integer("Thành phố phải là một số nguyên"),
    latitude: Yup.number()
      .required("Vĩ độ là bắt buộc")
      .min(-90, "Giá trị vĩ độ không hợp lệ (tối thiểu -90)")
      .max(90, "Giá trị vĩ độ không hợp lệ (tối đa 90)"),
    longitude: Yup.number()
      .required("Kinh độ là bắt buộc")
      .min(-180, "Giá trị kinh độ không hợp lệ (tối thiểu -180)")
      .max(180, "Giá trị kinh độ không hợp lệ (tối đa 180)"),
    address: Yup.string().required("Địa chỉ là bắt buộc"),
    phone_number: Yup.string().required("Số điện thoại là bắt buộc"),
    hours: Yup.object()
      .shape({
        timezone: Yup.string().required("Múi giờ là bắt buộc"),
        weekRanges: Yup.array()
          .of(
            Yup.array().of(
              Yup.object().shape({
                openHours: Yup.string().required("Giờ mở cửa là bắt buộc"),
                closeHours: Yup.string().required("Giờ đóng cửa là bắt buộc"),
                open: Yup.number().required("Phút mở cửa là bắt buộc"),
                close: Yup.number().required("Phút đóng cửa là bắt buộc"),
              })
            )
          )
          .required("Giờ hoạt động hàng tuần là bắt buộc"),
      })
      .required("Giờ hoạt động là bắt buộc"),
    reservation_required: Yup.boolean().required("Yêu cầu đặt chỗ là bắt buộc"),
    image_urls: Yup.array()
      .max(10, "Tối đa 10 hình ảnh được phép")
      .test("is-valid-url", "URL không hợp lệ", (values) =>
        values.every(
          (url) =>
            url.startsWith("data:") ||
            url.match(/^(ftp|http|https):\/\/[^ "]+$/)
        )
      ),
    tags: Yup.string(),
    description: Yup.string(),
    average_rating: Yup.number().min(0).max(5),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      description: "",
      latitude: "",
      longitude: "",
      city_id: "",
      address: "",
      phone_number: "",
      hours: {
        timezone: "Asia/Ho_Chi_Minh",
        weekRanges: Array(7)
          .fill()
          .map(() => [
            { open: 480, close: 1320, openHours: "08:00", closeHours: "22:00" },
          ]),
      },
      image_urls: [],
      tags: "",
      reservation_required: false,
      average_rating: 0,
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const processedValues = {
          ...values,
          image_urls: values.image_urls.filter((url) => url.trim() !== ""),
          tags: values.tags
            ? values.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter((tag) => tag)
            : [],
          latitude: Number(values.latitude),
          longitude: Number(values.longitude),
          average_rating: Number(values.average_rating),
        };

        let uploadedImageUrls = processedValues.image_urls;
        const dataUrls = processedValues.image_urls.filter((url) =>
          url.startsWith("data:")
        );

        if (dataUrls.length > 0) {
          const formData = new FormData();
          await Promise.all(
            dataUrls.map(async (dataUrl, index) => {
              const response = await fetch(dataUrl);
              const blob = await response.blob();
              formData.append("images", blob, `image-${index}.png`);
            })
          );

          const uploadResponse = await axios.post(
            `${BASE_URL}/restaurants/upload`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          );

          uploadedImageUrls = [
            ...processedValues.image_urls.filter(
              (url) => !url.startsWith("data:")
            ),
            ...uploadResponse.data.imageUrls,
          ];
        }

        const finalValues = {
          ...processedValues,
          image_url: uploadedImageUrls,
        };

        const response = isEdit
          ? await axios.put(
              `${BASE_URL}/restaurants/${selectedRestaurant.restaurant_id}`,
              finalValues
            )
          : await axios.post(`${BASE_URL}/restaurants`, finalValues);

        setRestaurants((prev) =>
          isEdit
            ? prev.map((r) =>
                r.restaurant_id === response.data.restaurant_id
                  ? {
                      ...response.data,
                      latitude: Number(response.data.latitude),
                      longitude: Number(response.data.longitude),
                      average_rating: Number(response.data.average_rating),
                    }
                  : r
              )
            : [
                ...prev,
                {
                  ...response.data,
                  latitude: Number(response.data.latitude),
                  longitude: Number(response.data.longitude),
                  average_rating: Number(response.data.average_rating),
                },
              ]
        );

        handleCloseModal();
        setError(null);
        toast.success(
          isEdit
            ? "Restaurant updated successfully"
            : "Restaurant created successfully"
        );
        debouncedFetchRestaurants();
      } catch (error) {
        setError("Failed to save restaurant");
        toast.error("Failed to save restaurant: " + error.message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const fetchRestaurants = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/restaurants`);
      setRestaurants(
        response.data.map((r) => ({
          ...r,
          latitude: Number(r.latitude),
          longitude: Number(r.longitude),
          average_rating: Number(r.average_rating),
        }))
      );
      setError(null);
    } catch (error) {
      setError("Failed to load restaurant list");
      toast.error("Failed to load restaurant list");
    }
  }, []);

  const debouncedFetchRestaurants = useCallback(
    debounce(fetchRestaurants, 500),
    [fetchRestaurants]
  );

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/tags/restaurants`);
      setAvailableTags(response.data);
    } catch (error) {
      console.error("Error fetching tags:", error);
      setAvailableTags([]);
    }
  };

  const fetchCities = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/cities`);
      setCities(response.data);
      setError(null);
    } catch (error) {
      setError("Failed to load cities");
      toast.error("Failed to load cities");
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/restaurants/${id}`);
      setRestaurants((prev) => prev.filter((r) => r.restaurant_id !== id));
      toast.success("Restaurant deleted successfully");
      debouncedFetchRestaurants();
    } catch (error) {
      setError("Failed to delete restaurant");
      toast.error("Failed to delete restaurant: " + error.message);
    }
  };

  const handleFileChange = (e) => {
    setImageError(null);
    const files = Array.from(
      e.target.files || (e.dataTransfer && e.dataTransfer.files) || []
    );

    if (files.length + formik.values.image_urls.length > 10) {
      setImageError(
        `Cannot add ${files.length} images. Maximum 10 images allowed (currently ${formik.values.image_urls.length})`
      );
      return;
    }

    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
    ];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type)
    );
    if (invalidFiles.length > 0) {
      setImageError(
        `Invalid file type(s): ${invalidFiles
          .map((f) => f.name)
          .join(", ")}. Only images are allowed.`
      );
      return;
    }

    const promises = files.map(
      (file) =>
        new Promise((resolve) => {
          if (file.size > 5 * 1024 * 1024) {
            setImageError(
              `File ${file.name} is too large. Maximum size is 5MB.`
            );
            resolve(null);
            return;
          }

          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = () => {
            setImageError(`Error reading file: ${file.name}`);
            resolve(null);
          };
          reader.readAsDataURL(file);
        })
    );

    Promise.all(promises).then((newImages) => {
      const validImages = newImages.filter((url) => url);
      formik.setFieldValue("image_urls", [
        ...formik.values.image_urls,
        ...validImages,
      ]);
    });
  };

  const triggerFileInput = () => {
    if (formik.values.image_urls.length >= 10) {
      setImageError("Maximum 10 images allowed");
      return;
    }
    fileInputRef.current?.click();
  };

  const handleOpenModal = (restaurant = null) => {
    setSelectedRestaurant(restaurant);
    setIsModalOpen(true);

    const initialImageUrls = restaurant?.image_url || [];
    const limitedImageUrls = Array.isArray(initialImageUrls)
      ? initialImageUrls.slice(0, 10)
      : [];

    if (restaurant) {
      formik.setValues({
        name: restaurant.name || "",
        description: restaurant.description || "",
        latitude: Number(restaurant.latitude) || "",
        longitude: Number(restaurant.longitude) || "",
        city_id: restaurant.city_id || "",
        address: restaurant.address || "",
        phone_number: restaurant.phone_number || "",
        hours: restaurant.hours || {
          timezone: "Asia/Ho_Chi_Minh",
          weekRanges: Array(7)
            .fill()
            .map(() => [
              {
                open: 480,
                close: 1320,
                openHours: "08:00",
                closeHours: "22:00",
              },
            ]),
        },
        image_urls: limitedImageUrls,
        tags: Array.isArray(restaurant.tags) ? restaurant.tags.join(",") : "",
        reservation_required: restaurant.reservation_required,
        average_rating: Number(restaurant.average_rating) || 0,
      });
    } else {
      formik.resetForm();
    }

    setImageError(null);
    fetchTags();
    fetchCities(); // Gọi fetchCities khi mở modal
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRestaurant(null);
    formik.resetForm();
    setImageError(null);
  };

  useEffect(() => {
    debouncedFetchRestaurants();
    fetchCities(); // Gọi fetchCities khi component mount
  }, [debouncedFetchRestaurants]);

  return {
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
    restaurants,
    fetchRestaurants: debouncedFetchRestaurants,
    handleDelete,
    error,
    setError,
    availableTags,
    cities,
  };
};

export default useRestaurantManagement;
