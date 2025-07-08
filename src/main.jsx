import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Authenticated from "./components/Authenticated.jsx";
import UserLogs from "./components/UserLogs.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route
          path="/login"
          element={
            <Authenticated>
              <LoginPage />
            </Authenticated>
          }
        />
        <Route
          path="/register"
          element={
            <Authenticated>
              <RegisterPage />
            </Authenticated>
          }
        />
        <Route path="/logs" element={<UserLogs />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
