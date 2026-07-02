import { Routes, Route } from "react-router-dom";

import Index          from "./pages/Index";
import Colleges       from "./pages/Colleges";
import CollegeDetail  from "./pages/CollegeDetail";
import Recommend      from "./pages/Recommend";
import NotFound       from "./pages/NotFound";
import Login          from "./pages/login";
import Register       from "./pages/Register";
import Profile        from "./pages/Profile";
import Compare        from "./pages/Compare";
import CutoffChecker  from "./pages/CutoffChecker";
import ROICalculator  from "./pages/ROICalculator";
import BudgetPlanner  from "./pages/BudgetPlanner";
import ForgotPassword from "./pages/ForgotPassword";

// Admin pages
import AdminLogin      from "./pages/admin/AdminLogin";
import AdminDashboard  from "./pages/admin/AdminDashboard";
import AdminColleges   from "./pages/admin/AdminColleges";
import AdminAddCollege from "./pages/admin/AdminAddCollege";
import AdminEditCollege from "./pages/admin/AdminEditCollege";
import AdminManageAdmins from "./pages/admin/AdminManageAdmins";
import AdminSetup from "./pages/admin/AdminSetup";

export default function App() {
  return (
    <Routes>
      {/* ── Student routes ── */}
      <Route path="/"                element={<Index />} />
      <Route path="/colleges"        element={<Colleges />} />
      <Route path="/colleges/:id"    element={<CollegeDetail />} />
      <Route path="/recommend"       element={<Recommend />} />
      <Route path="/compare"         element={<Compare />} />
      <Route path="/cutoff"          element={<CutoffChecker />} />
      <Route path="/roi"             element={<ROICalculator />} />
      <Route path="/budget"          element={<BudgetPlanner />} />
      <Route path="/profile"         element={<Profile />} />
      <Route path="/login"           element={<Login />} />
      <Route path="/register"        element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ── Admin routes ── */}
      <Route path="/admin"                        element={<AdminLogin />} />
      <Route path="/admin/setup"                  element={<AdminSetup />} />
      <Route path="/admin/dashboard"              element={<AdminDashboard />} />
      <Route path="/admin/colleges"               element={<AdminColleges />} />
      <Route path="/admin/colleges/add"           element={<AdminAddCollege />} />
      <Route path="/admin/colleges/:id/edit"      element={<AdminEditCollege />} />
      <Route path="/admin/college-admins"         element={<AdminManageAdmins />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}