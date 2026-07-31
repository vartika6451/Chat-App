import React from "react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toast alerts system */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "#18181B",
              color: "#FFFFFF",
              border: "1px solid #27272A",
              borderRadius: "12px",
              fontSize: "13px",
            },
          }}
        />
        
        {/* Core application routes */}
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;