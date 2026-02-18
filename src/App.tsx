import { Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import Recommend from "./pages/Recommend";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";   // CAPITAL variable
import Register from "./pages/Register";
import Profile from "./pages/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/colleges" element={<Colleges />} />
      <Route path="/colleges/:id" element={<CollegeDetail />} />

      <Route path="/profile" element={<Profile />} />
      <Route path="/recommend" element={<Recommend />} />

      <Route path="/login" element={<Login />} />   {/* CAPITAL */}
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}