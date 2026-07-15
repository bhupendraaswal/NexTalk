import { toast } from "sonner";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import { JOIN_CHAT_EVENT } from "../utils/constants";

export default function useChatActions() {
  const { initiateOneOnOneChat, selectedUser, deleteMessage } = useChatStore();
  const { socket } = useSocketStore();

  const startOneOnOneChat = async (receiver) => {
    await initiateOneOnOneChat(receiver);

    const { success, error } = useChatStore.getState();
    const latestSelectedUser = useChatStore.getState().selectedUser;

    if (socket && latestSelectedUser?._id) {
      socket.emit(JOIN_CHAT_EVENT, latestSelectedUser._id);
      socket.emit("joinChat", latestSelectedUser._id);
    }

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }
  };

  const handleDeleteChatMessage = async (messageId) => {
    if (!messageId) return;

    await deleteMessage(messageId);
    
    const { success, error } = useChatStore.getState();

    if (success) {
      toast.success(success);
    }

    if (error) {
      toast.error(error);
    }
  };

  return { startOneOnOneChat, handleDeleteChatMessage };
}
