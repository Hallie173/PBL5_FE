import axios from "axios";
import BASE_URL from "../constants/BASE_URL";
import { authService } from "./authService";

const API_URL = `${BASE_URL}/users`;

class UserService {
  static async getUserById(userId) {
    if (!userId) throw new Error("User ID is required");
    return this.apiRequest(`${API_URL}/${userId}`, "GET");
  }

  static async updateProfile(userId, profileData) {
    if (!userId) throw new Error("User ID is required");
    if (!profileData) throw new Error("Profile data is required");

    const normalizedData = this.normalizeProfileData(profileData);
    console.log("Sending profile update payload:", normalizedData);
    const response = await this.apiRequest(
      `${API_URL}/${userId}`,
      "PUT",
      normalizedData
    );

    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.user_id === userId) {
      const updatedUser = {
        ...currentUser,
        ...this.normalizeLocalProfileData(response),
      };
      authService.setCurrentUser(updatedUser);
    }

    return response;
  }

  static async uploadAvatar(file) {
    if (!file) throw new Error("No file provided");
    const currentUser = authService.getCurrentUser();
    if (!currentUser?.user_id)
      throw new Error("User must be logged in to upload avatar");

    const validTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new Error("Only JPG, PNG, or GIF images are allowed");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Avatar image must be less than 2MB");
    }

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await axios.post(`${API_URL}/upload-avatar`, formData, {
        headers: {},
        withCredentials: true,
      });

      return response.data; // Đảm bảo trả về { avatarUrl: "url" }
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to upload avatar"
      );
    }
  }

  static normalizeProfileData(profileData) {
    let bioString;
    try {
      bioString = JSON.stringify(profileData.bio || {});
      JSON.parse(bioString);
    } catch (error) {
      console.error("Invalid bio data:", profileData.bio, error);
      throw new Error("Invalid bio format");
    }

    const urlRegex = /^https?:\/\/[^\s/$.?#].[^\s]*$/;
    if (profileData.avatar_url && !urlRegex.test(profileData.avatar_url)) {
      console.error("Invalid avatar_url:", profileData.avatar_url);
      throw new Error("Invalid avatar_url: Must be a valid URL");
    }

    return {
      user_id: profileData.user_id,
      username: profileData.username || "",
      full_name: profileData.full_name || "",
      avatar_url: profileData.avatar_url || "",
      bio: bioString,
    };
  }

  static normalizeLocalProfileData(profileData) {
    let bio;
    try {
      bio =
        typeof profileData.bio === "string"
          ? JSON.parse(profileData.bio || "{}")
          : profileData.bio || {};
    } catch (error) {
      console.error("Error parsing bio:", profileData.bio, error);
      bio = {};
    }

    return {
      user_id: profileData.user_id,
      username: profileData.username || "",
      full_name: profileData.full_name || "",
      avatar_url: profileData.avatar_url || "",
      bio,
    };
  }

  static async apiRequest(url, method = "GET", data = null) {
    try {
      const config = {
        method,
        url,
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      };

      if (data) config.data = data;

      const response = await axios(config);
      return response.data;
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${
          method.toLowerCase() === "get" ? "fetch" : "update"
        } user data`;
      throw new Error(errorMsg);
    }
  }
}

export default UserService;
