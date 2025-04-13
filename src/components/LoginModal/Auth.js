// Auth.js
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    const googleUser = queryParams.get("googleUser");

    if (token && googleUser) {
      try {
        const userData = JSON.parse(decodeURIComponent(googleUser));
        const authData = { token, user: userData };

        // Lưu vào localStorage
        localStorage.setItem("data", JSON.stringify(authData));

        // Chuyển về trang chủ
        navigate("/", { replace: true });
        window.location.reload(); // Reload trang để cập nhật UI
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
