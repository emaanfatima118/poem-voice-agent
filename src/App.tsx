import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignupPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import UploadSeatingPlanPage from "./pages/UploadSeatingPlanPage";
import DashboardPage from "./pages/DashboardPage";
import IncidentsPage from "./pages/Incidents";
import LoginSuccess from "./pages/LoginSuccess"; // ✅ fixed import name
import ProtectedRoute from "./components/ProtectedRoute";
import SelectRole from "./pages/SelectRole";

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to dashboard */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        {/* Main Routes */}
        <Route path="/select-role" element={<SelectRole />} />;
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/upload-seating-plan"
          element={<UploadSeatingPlanPage />}
        />
        <Route path="/incidents" element={<IncidentsPage />} />
        {/* Google Login redirect handler */}
        <Route path="/login-success" element={<LoginSuccess />} />
      </Routes>
    </Router>
  );
}

export default App;
