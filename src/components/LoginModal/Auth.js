// Auth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  // Auth.js
  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const googleUser = queryParams.get("googleUser");

    if (token && googleUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(googleUser));
        // Chuẩn hóa dữ liệu người dùng
        const normalizedUserData = {
          user_id: userData.id || userData.user_id,
          username: userData.username || "unknown",
          email: userData.email || "",
          full_name: userData.full_name || userData.fullName || "",
          avatar_url: userData.avatar || userData.avatar_url || "",
          role: userData.role || "user",
          created_at: userData.created_at || new Date().toISOString(),
          bio: userData.bio || {},
        };

        // Lưu token và user data riêng biệt
        localStorage.setItem("token", token);
        localStorage.setItem("data", JSON.stringify(normalizedUserData));

        navigate("/", { replace: true });
        window.location.reload();
      } catch (error) {
        console.error("Error processing auth data:", error);
        navigate("/");
      }
    } else {
      navigate("/");
    }
  }, [navigate]);
  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-lg">Đang đăng nhập...</p>
    </div>
  );
}

export default Auth;
