import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const user = queryParams.get("user");

    if (token && user) {
      try {
        const userData = JSON.parse(decodeURIComponent(user));
        const normalizedUserData = {
          user_id: userData.user_id,
          username: userData.username || "unknown",
          email: userData.email || "",
          full_name: userData.fullName || "",
          avatar_url: userData.avatar || "",
          role: userData.role || "user",
          created_at: userData.joinedAt || new Date().toISOString(),
          bio: userData.bio || null,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("data", JSON.stringify(normalizedUserData));

        navigate("/", { replace: true });
        window.location.reload();
      } catch (error) {
        console.error("Error processing auth data:", error);
        navigate("/login");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Đang đăng nhập...</p>
    </div>
  );
}

export default Auth;
