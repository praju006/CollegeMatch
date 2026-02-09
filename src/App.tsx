import { Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Colleges from "./pages/Colleges";
import CollegeDetail from "./pages/CollegeDetail";
import Recommend from "./pages/Recommend";
import NotFound from "./pages/NotFound";
import Login from "./pages/login";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/colleges" element={<Colleges />} />
      <Route path="/colleges/:id" element={<CollegeDetail />} />
      <Route path="/recommend" element={<Recommend />} />

      {/* ADD THESE TWO */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}