import axiosInstance from "./apiService";

export const getAllAvailableUsersService = async (search = "") => {
  const response = await axiosInstance.get("/chat-app/chats/users", {
    params: { query: search },
  });
  return response.data;
};

export const getLoggedInUserAssociatedChatService = async () => {
  const response = await axiosInstance.get("/chat-app/chats");
  return response.data;
};

export const initiateOneOnOneChatService = async (receiverId) => {
  const response = await axiosInstance.post(`/chat-app/chats/c/${receiverId}`);
  return response.data;
};

export const getAllMessagesService = async (chatId) => {
  const response = await axiosInstance.get(`/chat-app/messages/${chatId}`);
  return response.data;
};

export const sendMessageService = async (chatId, payload) => {
  const response = await axiosInstance.post(
    `/chat-app/messages/${chatId}`,
    payload,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const deleteMessageService = async (chatId, messageId) => {
  const response = await axiosInstance.delete(
    `/chat-app/messages/${chatId}/${messageId}`
  );
  return response.data;
};

export const deleteOneOnOneChatService = async (chatId) => {
  const response = await axiosInstance.delete(
    `/chat-app/chats/remove/${chatId}`
  );
  return response.data;
};
