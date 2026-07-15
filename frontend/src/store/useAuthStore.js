import { create } from "zustand";
import {
  changePasswordService,
  forgotPasswordService,
  getLoggedInUserService,
  loginService,
  logoutService,
  registerService,
  ResendEmailVerificationService,
  resetPasswordService,
} from "../services/authService";
import { getAxiosErrorMessage } from "../utils/errorHandling";
import useChatStore from "./useChatStore";

const useAuthStore = create((set, get) => ({
  loading: false,
  error: null,
  success: null,
  user: null,
  authChecked: false,
  verificationLoading: false,
  accessToken: localStorage.getItem("accessToken") ?? null,
  refreshToken: localStorage.getItem("refreshToken") ?? null,

  setTokens: (accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    } else {
      localStorage.removeItem("refreshToken");
    }

    set({ accessToken, refreshToken });
  },

  clearAuth: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    set({ user: null, accessToken: null, refreshToken: null, authChecked: false });
  },

  registerUser: async (userdata) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await registerService(userdata);

      if (response?.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
        });
      } else {
        throw new Error(response?.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },

  loginUser: async (userdata) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await loginService(userdata);

      const accessToken = response?.data?.accessToken ?? null;
      const refreshToken = response?.data?.refreshToken ?? null;

      if (response?.success) {
        localStorage.setItem("accessToken", accessToken ?? "");
        localStorage.setItem("refreshToken", refreshToken ?? "");
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          user: response?.data?.user ?? null,
          accessToken,
          refreshToken,
          authChecked: true,
        });
      } else {
        throw new Error(response?.message || "Login failed");
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
      });
    }
  },

  getLoggedInUser: async () => {
    const { loading, accessToken } = get();

    if (loading) return;
    if (!accessToken) {
      set({ authChecked: true, user: null, error: null, success: null });
      return;
    }

    try {
      set({ loading: true, error: null, success: null, authChecked: false });

      const response = await getLoggedInUserService();

      if (response?.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          user: response?.data ?? null,
          authChecked: true,
        });
      } else {
        throw new Error(response?.message || "Failed to fetch current user");
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
        authChecked: true,
        success: null,
        user: null,
      });
    }
  },

  logoutUser: async () => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await logoutService();

      if (response?.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
          user: null,
          accessToken: null,
          refreshToken: null,
        });

        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        useChatStore.persist.clearStorage();
      } else {
        throw new Error(response?.message || "Logout failed");
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong1!!",
        loading: false,
        authChecked: false,
        success: null,
      });
    }
  },

  changePassword: async (data) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await changePasswordService({
        oldPassword: data.old_password,
        newPassword: data.new_password,
      });

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
        success: null,
      });
    }
  },

  forgotPassword: async (data) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await forgotPasswordService(data);

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
        success: null,
      });
    }
  },

  resetPassword: async (data) => {
    const { loading } = get();

    if (loading) return;

    try {
      set({ loading: true, error: null, success: null });

      const response = await resetPasswordService(data.token, {
        newPassword: data.newPassword,
      });

      if (response.success) {
        set({
          error: null,
          loading: false,
          success: response?.message ?? "Success",
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        loading: false,
        success: null,
      });
    }
  },

  resendEmailVerficationLink: async () => {
    const { verificationLoading } = get();

    if (verificationLoading) return;

    try {
      set({ verificationLoading: true, error: null, success: null });

      const response = await ResendEmailVerificationService();

      if (response.success) {
        set({
          error: null,
          verificationLoading: false,
          success: response?.message ?? "Success",
        });
      }
    } catch (error) {
      const errorMessage = getAxiosErrorMessage(error);
      set({
        error: errorMessage ?? "Something went wrong!!",
        verificationLoading: false,
        success: null,
      });
    }
  },
}));

export default useAuthStore;
