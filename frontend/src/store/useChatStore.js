import { create } from "zustand";
import { persist } from "zustand/middleware";

import { getAxiosErrorMessage } from "../utils/errorHandling";
import {
  deleteMessageService,
  deleteOneOnOneChatService,
  getAllAvailableUsersService,
  getAllMessagesService,
  getLoggedInUserAssociatedChatService,
  initiateOneOnOneChatService,
  sendMessageService,
} from "../services/chatService";

const useChatStore = create(
  persist(
    (set, get) => ({
      loading: false,
      chatsLoading: false,
      error: null,
      success: null,
      availableUsers: [],
      loggedInChats: null,
      selectedUser: null,
      selectedUserChats: [],
      activeUser: JSON.parse(localStorage.getItem("activeChatUser")) ?? null,
      presenceMap: {},
      searchQuery: "",
      unreadCounts: {},
      lastOpenedChatId: null,

      setSearchQuery: (query) => set({ searchQuery: query ?? "" }),

      setPresence: ({ userId, status }) =>
        set((state) => ({
          presenceMap: {
            ...state.presenceMap,
            [userId]: status,
          },
        })),

      markChatAsRead: (chatId, participantId) =>
        set((state) => {
          const nextUnreadCounts = { ...state.unreadCounts };
          if (chatId) delete nextUnreadCounts[chatId];
          if (participantId) delete nextUnreadCounts[participantId];

          const nextMessages = state.selectedUserChats.map((message) => {
            if (message?.sender?._id === state.selectedUser?._id) {
              return { ...message, isRead: true };
            }
            return message;
          });

          return {
            unreadCounts: nextUnreadCounts,
            lastOpenedChatId: chatId ?? state.lastOpenedChatId,
            selectedUserChats: nextMessages,
          };
        }),

      getAvailableUsers: async (search = "") => {
        const { loading } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await getAllAvailableUsersService();

          if (response?.success) {
            const normalizedQuery = search?.toLowerCase().trim();
            const users = Array.isArray(response?.data) ? response?.data : [];
            const filteredUsers = normalizedQuery
              ? users.filter((user) => {
                  const searchableString = `${user?.username ?? ""} ${user?.email ?? ""}`.toLowerCase();
                  return searchableString.includes(normalizedQuery);
                })
              : users;

            set({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              availableUsers: filteredUsers,
            });
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      getLoggedInUserAssociatedChats: async () => {
        const { chatsLoading } = get();

        if (chatsLoading) return;

        try {
          set({ chatsLoading: true, error: null, success: null });

          const response = await getLoggedInUserAssociatedChatService();

          if (response.success) {
            set({
              error: null,
              chatsLoading: false,
              success: response?.message ?? "Success",
              loggedInChats: response?.data ?? [],
            });
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            chatsLoading: false,
          });
        }
      },

      initiateOneOnOneChat: async (receiver) => {
        const { loading } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await initiateOneOnOneChatService(receiver?._id);

          if (response.success) {
            set({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              selectedUser: response?.data ?? [],
              activeUser: receiver,
              selectedUserChats: [],
              lastOpenedChatId: response?.data?._id ?? null,
            });
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      getAllMessages: async () => {
        const { loading, selectedUser } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await getAllMessagesService(selectedUser?._id);

          if (response.success) {
            set({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              selectedUserChats: response?.data ?? [],
            });
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      sendMessage: async (payload) => {
        const { loading, selectedUser } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await sendMessageService(selectedUser?._id, payload);

          if (response.success) {
            const sentMessage = { ...response?.data, isRead: true };
            set((state) => ({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              selectedUserChats: [...state.selectedUserChats, sentMessage],
            }));
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      appendMessage: (message) =>
        set((state) => {
          if (!message?._id) return state;

          const alreadyPresent = state.selectedUserChats.some(
            (item) => item?._id === message._id
          );
          if (alreadyPresent) return state;

          const targetChatId = message?.chat || state.selectedUser?._id;
          const inboxKey = message?.sender?._id || message?.chat || state.selectedUser?._id;
          const isActiveChat = targetChatId && state.selectedUser?._id === targetChatId;

          return {
            selectedUserChats: isActiveChat
              ? [...state.selectedUserChats, message]
              : state.selectedUserChats,
            unreadCounts: isActiveChat
              ? state.unreadCounts
              : {
                  ...state.unreadCounts,
                  [inboxKey]: (state.unreadCounts[inboxKey] ?? 0) + 1,
                },
          };
        }),

      updateAvailableUsers: (user) => {
        const { availableUsers = [] } = get();
        if (!availableUsers.find((u) => u._id === user._id)) {
          set({ availableUsers: [user, ...availableUsers] });
        }
      },

      deleteMessage: async (messageId) => {
        const { loading, selectedUser } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await deleteMessageService(
            selectedUser?._id,
            messageId
          );

          if (response.success) {
            set((state) => ({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              selectedUserChats: state.selectedUserChats.filter(
                (chat) => chat?._id !== messageId
              ),
            }));
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      deleteOneOnOneChat: async () => {
        const { loading, selectedUser } = get();

        if (loading) return;

        try {
          set({ loading: true, error: null, success: null });

          const response = await deleteOneOnOneChatService(selectedUser?._id);

          if (response.success) {
            set(() => ({
              error: null,
              loading: false,
              success: response?.message ?? "Success",
              selectedUserChats: [],
            }));
          }
        } catch (error) {
          const errorMessage = getAxiosErrorMessage(error);
          set({
            error: errorMessage ?? "Something went wrong!!",
            loading: false,
          });
        }
      },

      resetSelectedUser: () => {
        set({
          selectedUser: null,
          selectedUserChats: [],
          activeUser: null,
          lastOpenedChatId: null,
        });
        useChatStore.persist.clearStorage();
      },
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        activeUser: state.activeUser,
        selectedUser: state.selectedUser,
        selectedUserChats: state.selectedUserChats,
      }),
    }
  )
);

export default useChatStore;
