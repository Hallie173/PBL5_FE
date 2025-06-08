import { useState, useRef } from "react";

export function useNewArticle() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [lastSaved, setLastSaved] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const coverImageInputRef = useRef(null);

  // Đếm từ và ký tự mỗi khi content thay đổi
  const updateWordCharCount = (text) => {
    const cleanText = text.replace(/<[^>]+>/g, " ").trim();
    setWordCount(cleanText.split(/\s+/).filter(Boolean).length);
    setCharCount(cleanText.length);
  };

  // Gọi hàm này khi content thay đổi (CKEditor)
  const handleContentChange = (data) => {
    setContent(data);
    updateWordCharCount(data);
    if (autoSave && (title.trim() || data.trim())) {
      setLastSaved(new Date());
    }
  };

  const handlePublish = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert("Bài viết đã được đăng!");
      setLoading(false);
    }, 1000);
  };

  const handleCoverImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setCoverImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const insertImage = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage({
          src: reader.result,
          alt: file.name,
          title: file.name,
        });
        setShowImageModal(true);
      };
      reader.readAsDataURL(file);
    }
  };

  // Chèn ảnh vào nội dung CKEditor (HTML)
  const handleInsertImageToContent = (imageConfig) => {
    const imgHtml = `<p style="text-align:${imageConfig.alignment};"><img src="${imageConfig.src}" alt="${imageConfig.alt}" title="${imageConfig.title}" style="width:${imageConfig.width};" /></p>`;
    setContent((prev) => {
      const newContent = prev + imgHtml;
      updateWordCharCount(newContent);
      return newContent;
    });
  };

  return {
    title,
    setTitle,
    content,
    setContent,
    coverImage,
    setCoverImage,
    loading,
    wordCount,
    charCount,
    selectedImage,
    setSelectedImage,
    showImageModal,
    setShowImageModal,
    autoSave,
    setAutoSave,
    lastSaved,
    isFullscreen,
    setIsFullscreen,
    showPreview,
    setShowPreview,
    fileInputRef,
    coverImageInputRef,
    handleContentChange,
    handlePublish,
    handleCoverImage,
    insertImage,
    handleInsertImageToContent,
  };
}
