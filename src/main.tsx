import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="959782862112-ct20v4a141ch8uabasr8bvk120s14kbu.apps.googleusercontent.com">
      <BrowserRouter>
      <AuthProvider>
        <App />
        </AuthProvider>
      </BrowserRouter>
    </GoogleOAuthProvider>
  </React.StrictMode>
);