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
import ResetPassword  from "./pages/ResetPassword";

export default function App() {
  return (
    <Routes>
      <Route path="/"                        element={<Index />} />
      <Route path="/colleges"                element={<Colleges />} />
      <Route path="/colleges/:id"            element={<CollegeDetail />} />

      <Route path="/recommend"               element={<Recommend />} />
      <Route path="/compare"                 element={<Compare />} />
      <Route path="/cutoff"                  element={<CutoffChecker />} />
      <Route path="/roi"                     element={<ROICalculator />} />
      <Route path="/budget"                  element={<BudgetPlanner />} />

      <Route path="/profile"                 element={<Profile />} />
      <Route path="/login"                   element={<Login />} />
      <Route path="/register"                element={<Register />} />

      {/* password reset flow */}
      <Route path="/forgot-password"         element={<ForgotPassword />} />
      <Route path="/reset-password/:token"   element={<ResetPassword />} />

      <Route path="*"                        element={<NotFound />} />
    </Routes>
  );
}