import { useState, useRef, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const useAttractionManagement = () => {
  const [selectedAttraction, setSelectedAttraction] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [imageError, setImageError] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const fileInputRef = useRef(null);

  const isEdit = !!selectedAttraction?.attraction_id;

  // Initialize form when selectedAttraction changes
  useEffect(() => {
    if (selectedAttraction?.image_url) {
      setPreviewImage(selectedAttraction.image_url);
    } else {
      setPreviewImage('');
    }
    setUploadedFile(null);
    setImageError(false);
  }, [selectedAttraction]);

  const validationSchema = Yup.object({
    name: Yup.string().required('Attraction name is required'),
    city_id: Yup.string().required('Please select a city'),
    latitude: Yup.number()
      .required('Latitude is required')
      .min(-90, 'Invalid latitude value (min -90)')
      .max(90, 'Invalid latitude value (max 90)'),
    longitude: Yup.number()
      .required('Longitude is required')
      .min(-180, 'Invalid longitude value (min -180)')
      .max(180, 'Invalid longitude value (max 180)'),
    address: Yup.string().required('Address is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      description: '',
      latitude: '',
      longitude: '',
      city_id: '',
      address: '',
      image_url: '',
      tags: '',
    },
    validationSchema,
    onSubmit: () => {}, // To be overridden by parent component
  });

  // Update form values when selectedAttraction changes
  useEffect(() => {
    if (selectedAttraction) {
      formik.setValues({
        name: selectedAttraction.name || '',
        description: selectedAttraction.description || '',
        latitude: selectedAttraction.latitude || '',
        longitude: selectedAttraction.longitude || '',
        city_id: selectedAttraction.city_id || '',
        address: selectedAttraction.address || '',
        image_url: selectedAttraction.image_url || '',
        tags: selectedAttraction.tags?.join(', ') || '',
      });
    }
  }, [selectedAttraction]);

  const handleOpenModal = (attraction = null) => {
    setSelectedAttraction(attraction);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAttraction(null);
    formik.resetForm();
    setPreviewImage('');
    setUploadedFile(null);
  };

  const handleImageUrlChange = (e) => {
    formik.handleChange(e);
    setPreviewImage(e.target.value);
    setImageError(false);
    if (uploadedFile) setUploadedFile(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setUploadedFile(file);
      setPreviewImage(URL.createObjectURL(file));
      formik.setFieldValue('image_url', '');
      setImageError(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return {
    // Modal state
    isModalOpen,
    selectedAttraction,
    handleOpenModal,
    handleCloseModal,
    
    // Form state
    isEdit,
    isSubmitting,
    formik,
    
    // Image handling
    previewImage,
    imageError,
    uploadedFile,
    fileInputRef,
    handleImageUrlChange,
    handleFileChange,
    triggerFileInput,
    setImageError,
  };
};

export default useAttractionManagement;