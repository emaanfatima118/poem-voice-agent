import { Routes, Route } from "react-router-dom";
import { ProtectedRoute, PublicOnlyRoute } from "./components/ProtectedRoute";
import { AppLayout } from "./components/Layout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Resumes from "./pages/Resumes";
import MyResume from "./pages/MyResume";
import Jobs from "./pages/Jobs";
import Analyze from "./pages/Analyze";
import Interview from "./pages/Interview";
import History from "./pages/History";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route element={<PublicOnlyRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resumes/me" element={<MyResume />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/analyze" element={<Analyze />} />
          <Route path="/interview" element={<Interview />} />
          <Route path="/history" element={<History />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
