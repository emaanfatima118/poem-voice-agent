import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UploadSeatingPlanPage from "./pages/UploadSeatingPlanPage";
import DashboardPage from "./pages/DashboardPage";
import IncidentsPage from "./pages/Incidents"; // Add this import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/upload-seating-plan" element={<UploadSeatingPlanPage />} />
        <Route path="/incidents" element={<IncidentsPage />} /> {/* Add this route */}
      </Routes>
    </Router>
  );
}

export default App;
