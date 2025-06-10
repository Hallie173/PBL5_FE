import axios from "axios";
import BASE_URL from "../constants/BASE_URL";
import { authService } from "./authService";

const API_URL = `${BASE_URL}/users`;

class UserService {
  // Validate file type and size for uploads
  static _validateFile(file, maxSizeMB = 2) {
    if (!file) throw new Error("No file provided");
    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, or GIF images are allowed");
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`Image must be less than ${maxSizeMB}MB`);
    }
  }

  // Check for authenticated user
  static _getAuthenticatedUserId() {
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.user_id) {
      throw new Error("User must be logged in");
    }
    return currentUser.user_id;
  }

  // Validate URL format
  static _validateUrl(url, fieldName) {
    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (url && !urlRegex.test(url)) {
      throw new Error(`Invalid ${fieldName}: Must be a valid URL`);
    }
  }

  static async getUserById(userId) {
    if (!userId) throw new Error("User ID is required");
    return this._apiRequest(`${API_URL}/${userId}`, "GET");
  }

  static async updateProfile(userId, profileData) {
    if (!userId) throw new Error("User ID is required");
    if (!profileData) throw new Error("Profile data is required");

    const normalizedData = this._normalizeProfileData(profileData);
    const response = await this._apiRequest(
      `${API_URL}/${userId}`,
      "PUT",
      normalizedData
    );

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.user_id === userId) {
      const updatedUser = {
        ...currentUser,
        ...this._normalizeLocalProfileData(response),
      };
      authService.setCurrentUser(updatedUser);
    }

    return response;
  }

  static async uploadAvatar(file) {
    this._validateFile(file);
    const userId = this._getAuthenticatedUserId();

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data; // { avatarUrl: "url" }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload avatar"
      );
    }
  }

  static async uploadCover(file) {
    this._validateFile(file);
    const userId = this._getAuthenticatedUserId();

    try {
      const formData = new FormData();
      formData.append("cover", file);

      const response = await axios.post(`${API_URL}/upload-cover`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      return response.data; // { coverUrl: "url" }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload cover"
      );
    }
  }

  static _normalizeProfileData(profileData) {
    let bioString;
    try {
      bioString = JSON.stringify(profileData.bio || {});
      JSON.parse(bioString); // Validate JSON
    } catch (error) {
      throw new Error("Invalid bio format");
    }

    this._validateUrl(profileData.avatar_url, "avatar_url");
    this._validateUrl(profileData.cover_url, "cover_url");

    return {
      user_id: profileData.user_id || "",
      username: profileData.username || "",
      full_name: profileData.full_name || "",
      avatar_url: profileData.avatar_url || "",
      cover_url: profileData.cover_url || "",
      bio: bioString,
    };
  }

  static _normalizeLocalProfileData(profileData) {
    let bio;
    try {
      bio =
        typeof profileData.bio === "string"
          ? JSON.parse(profileData.bio || "{}")
          : profileData.bio || {};
    } catch (error) {
      bio = {};
    }

    return {
      user_id: profileData.user_id || "",
      username: profileData.username || "",
      full_name: profileData.full_name || "",
      avatar_url: profileData.avatar_url || "",
      cover_url: profileData.cover_url || "",
      bio,
    };
  }

  static async _apiRequest(url, method = "GET", data = null) {
    try {
      const token = localStorage.getItem("token");
      const config = {
        method,
        url,
        headers: {
          ...(data instanceof FormData
            ? { "Content-Type": "multipart/form-data" }
            : { "Content-Type": "application/json" }),
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      };

      if (data) {
        config.data = data;
      }

      const response = await axios(config);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        `Failed to ${
          method.toLowerCase() === "get" ? "fetch" : "update"
        } user data`;
      throw new Error(errorMsg);
    }
  }
}

export default UserService;
