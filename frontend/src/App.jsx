import { Route, Routes } from "react-router";

import GridLayout from "./layouts/GridLayout";
import MainLayout from "./layouts/MainLayout";

import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ChatPage from "./pages/ChatPage";
import NotFoundPage from "./pages/NotFoundPage";

import GuestRoute from "./routes/GuestRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import { Toaster } from "@/components/ui/sonner";

import { useEffect } from "react";
import useAuthStore from "./store/useAuthStore";

import "./App.css";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import useSockeStore from "./store/useSocketStore";

const App = () => {
  const { getLoggedInUser, user } = useAuthStore();
  const { initSocket, cleanupSocket } = useSockeStore();

  // Fetch Logged In User on App Load
  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken) {
      getLoggedInUser();
    } else {
      useAuthStore.setState({ authChecked: true, user: null });
    }
  }, [getLoggedInUser]);

  // Initialize Socket When User is Authenticated
  useEffect(() => {
    if (!user) {
      cleanupSocket();
      return;
    }

    initSocket();
  }, [user, initSocket, cleanupSocket]);

  return (
    <>
      <GridLayout />

      <Routes>
        <Route element={<MainLayout />}>
          <Route element={<GuestRoute />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route
              path="forgot-password/:token"
              element={<ResetPasswordPage />}
            />
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route index element={<ChatPage />} />
          </Route>

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>

      <Toaster />
    </>
  );
};

export default App;
