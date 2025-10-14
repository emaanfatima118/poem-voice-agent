import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const SelectRole: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const emailParam = params.get("email");
    const nameParam = params.get("name");

    if (!emailParam) {
      setError("Email not provided. Please try logging in again.");
      return;
    }

    setEmail(emailParam);
    setName(nameParam || "");
  }, [location.search]);

  const handleSubmit = async () => {
    if (!role) {
      setError("Please select a role.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/register-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, name, role }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed.");
      }

      const data = await response.json();

      // Save token and user info
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user_type", data.user_type);
      localStorage.setItem("user_id", data.id);

      navigate("/dashboard", { replace: true });
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4">
          Welcome, {name || "User"} 👋
        </h1>
        <p className="text-gray-600 text-center mb-6">
          Select your role to complete login
        </p>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <div className="space-y-3 mb-6">
          {["Admin", "Invigilator", "Investigator"].map((r) => (
            <button
              key={r}
              onClick={() => setRole(r.toLowerCase())}
              className={`w-full py-3 rounded-lg border ${
                role === r.toLowerCase()
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white hover:bg-gray-50 text-gray-700 border-gray-300"
              } transition-all duration-200`}
            >
              {r}
            </button>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded-lg text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 transition-all"
          }`}
        >
          {loading ? "Submitting..." : "Continue"}
        </button>
      </div>
    </div>
  );
};

export default SelectRole;
