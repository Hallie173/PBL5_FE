const formatDate = (isoDateString) => {
  // Kiểm tra input
  if (!isoDateString) return "N/A";

  try {
    const date = new Date(isoDateString);

    if (isNaN(date.getTime())) {
      console.error("Invalid date:", isoDateString);
      return "Invalid date";
    }

    return new Intl.DateTimeFormat("en", {
      month: "short",
      year: "numeric",
    }).format(date);
  } catch (error) {
    console.error("Error formatting date:", error);
    return "Error";
  }
};

export default formatDate;
