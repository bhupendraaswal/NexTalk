export const getAxiosErrorMessage = (error) => {
  return error?.response?.data?.errors?.[0]
    ? Object.values(error?.response?.data?.errors?.[0])?.[0]
    : error?.response?.data?.message;
};
