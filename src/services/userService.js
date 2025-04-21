import axios from "axios";
import BASE_URL from "../constants/BASE_URL";
import { authService } from "./authService";
const API_URL = `${BASE_URL}/users`;

class UserService {
  // Simplified core methods
  static async getUserById(userId) {
    return this.apiRequest(`${API_URL}/${userId}`, "GET");
  }

  static async updateProfile(userId, profileData) {
    // Create a normalized structure to match backend expectations

    const normalizedData = this.normalizeProfileData(profileData);

    const response = await this.apiRequest(
      `${API_URL}/${userId}`,
      "PUT",
      normalizedData
    );

    // Update local storage with consistent structure
    if (response) {
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.user_id === userId) {
        const updatedUser = {
          ...currentUser,
          ...this.extractUserData(response),
        };
        authService.setCurrentUser(updatedUser);
      }
    }

    return response;
  }

  static async uploadAvatar(file) {
    try {
      if (!file) return null;

      // Create a new FormData object
      const formData = new FormData();
      formData.append("avatar", file); // Make sure this key matches what backend expects

      // Get current user ID - this is important to include in URL or headers
      const currentUser = authService.getCurrentUser();
      if (!currentUser || !currentUser.user_id) {
        throw new Error("User ID is required to upload avatar");
      }

      // Include auth token in the request
      const token = authService.getToken();

      // Make sure the URL is correct - this could be a problem point
      const uploadUrl = `${API_URL}/upload-avatar`;

      // Set up headers correctly for multipart/form-data
      const headers = {
        ...(token && { Authorization: `Bearer ${token}` }),
        // Don't manually set Content-Type for FormData - browser will set it with boundary
      };

      // Debug logs
      console.log("Uploading avatar with:", {
        url: uploadUrl,
        token: !!token,
        fileSize: file.size,
        fileType: file.type,
      });

      const response = await axios.post(uploadUrl, formData, {
        headers,
        withCredentials: true,
      });

      // If successful, return the avatar URL from the response
      return response.data;
    } catch (error) {
      console.error("Avatar upload error:", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
      }
      throw error;
    }
  }

  // Helper methods for consistent data handling
  static normalizeProfileData(profileData) {
    let avatar = null;
    if (profileData.avatar_url && profileData.avatar_url.trim() !== "") {
      avatar = profileData.avatar_url;
    }
    return {
      username: profileData.username,
      full_name: profileData.full_name,
      avatar_url: avatar,
      // Convert bio to a string if it's an object
      bio:
        typeof profileData.bio === "object"
          ? JSON.stringify(profileData.bio)
          : profileData.bio,
    };
  }

  static extractUserData(userData) {
    return {
      username: userData.username,
      full_name: userData.full_name,
      avatar_url: userData.avatar_url,
      bio: userData.bio || {},
    };
  }

  // Generic API request handler with error handling
  static async apiRequest(url, method = "GET", data = null) {
    try {
      const token = authService.getToken();
      const config = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        withCredentials: true,
      };

      if (data) config.data = data;

      const response = await axios(config);
      return response.data;
    } catch (error) {
      console.error(`API ${method} request error:`, error);
      const errorMsg =
        error.response?.data?.message ||
        `Failed to ${method === "GET" ? "fetch" : "update"} data`;
      throw new Error(errorMsg);
    }
  }
}

export default UserService;
