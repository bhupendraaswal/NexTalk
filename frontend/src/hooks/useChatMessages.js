import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

export default function useChatMessages() {
  const { getAllMessages, selectedUser, markChatAsRead, activeUser } = useChatStore();

  useEffect(() => {
    if (selectedUser?._id) {
      getAllMessages();
      markChatAsRead(selectedUser._id, activeUser?._id);
    }
  }, [getAllMessages, selectedUser, activeUser, markChatAsRead]);
}
