import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userType = params.get("user_type");
    const userId = params.get("id");

    if (token) {
      // Save auth details
      localStorage.setItem("token", token);
      if (userType) localStorage.setItem("user_type", userType);
      if (userId) localStorage.setItem("user_id", userId);

      console.log("✅ Token saved:", token);
      console.log("✅ User type:", userType);
      console.log("✅ User ID:", userId);

      // Redirect after a short delay to ensure storage completes
      setTimeout(() => {
        navigate("/dashboard", { replace: true });
      }, 800);
    } else {
      console.warn("❌ No token found — redirecting to login");
      navigate("/login", { replace: true });
    }
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-2">Logging you in...</h1>
      <p className="text-gray-600">Please wait while we redirect you.</p>
    </div>
  );
};

export default LoginSuccess;
