import { useEffect } from "react";
import useChatStore from "../store/useChatStore";
import useSocketStore from "../store/useSocketStore";
import {
  MESSAGE_RECEIVED_EVENT,
  PRESENCE_CHANGED_EVENT,
} from "../utils/constants";

export default function useSocketEvents() {
  const { socket } = useSocketStore();
  const { appendMessage, updateAvailableUsers, setPresence } = useChatStore();

  useEffect(() => {
    if (!socket) return;

    const handleMessageReceived = (message) => {
      appendMessage(message);

      if (message?.sender) {
        updateAvailableUsers(message.sender);
      }
    };

    const handlePresenceChanged = ({ userId, status }) => {
      if (!userId) return;
      setPresence({ userId, status });
    };

    socket.on(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
    socket.on(PRESENCE_CHANGED_EVENT, handlePresenceChanged);
    socket.on("connect", () => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        socket.emit("authenticate", { token });
      }
    });

    return () => {
      socket.off(MESSAGE_RECEIVED_EVENT, handleMessageReceived);
      socket.off(PRESENCE_CHANGED_EVENT, handlePresenceChanged);
      socket.off("connect");
    };
  }, [socket, appendMessage, updateAvailableUsers, setPresence]);
}
