import axiosInstance from "./apiService";

export const registerService = async (userdata) => {
  const response = await axiosInstance.post("/users/register", userdata);
  return response.data;
};

export const loginService = async (userdata) => {
  const response = await axiosInstance.post("/users/login", userdata);
  return response.data;
};

export const getLoggedInUserService = async () => {
  const response = await axiosInstance.get("/users/current-user");
  return response.data;
};

export const logoutService = async () => {
  const response = await axiosInstance.post("/users/logout");
  return response.data;
};

export const changePasswordService = async (payload) => {
  const response = await axiosInstance.post("/users/change-password", payload);
  return response.data;
};

export const forgotPasswordService = async (payload) => {
  const response = await axiosInstance.post("/users/forgot-password", payload);
  return response.data;
};

export const resetPasswordService = async (resetToken, payload) => {
  const response = await axiosInstance.post(
    `/users/reset-password/${resetToken}`,
    payload
  );
  return response.data;
};

export const ResendEmailVerificationService = async () => {
  const response = await axiosInstance.post(`/users/resend-email-verification`);
  return response.data;
};
