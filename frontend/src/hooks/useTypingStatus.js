import { useEffect, useRef, useState } from "react";
import {
  TYPING_EVENT,
  STOP_TYPING_EVENT,
  STOP_TYPING_TIMER,
} from "../utils/constants";
import useSocketStore from "../store/useSocketStore";

export default function useTypingStatus(selectedUserId) {
  const { socket } = useSocketStore();
  const [isTyping, setIsTyping] = useState(false);
  const [selfTyping, setSelfTyping] = useState(false);
  const typingTimeoutRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const handleTyping = (chatId) => {
      if (chatId === selectedUserId) setIsTyping(true);
    };

    const handleStopTyping = (chatId) => {
      if (chatId === selectedUserId) setIsTyping(false);
    };

    socket.on(TYPING_EVENT, handleTyping);
    socket.on(STOP_TYPING_EVENT, handleStopTyping);

    return () => {
      socket.off(TYPING_EVENT, handleTyping);
      socket.off(STOP_TYPING_EVENT, handleStopTyping);
    };
  }, [socket, selectedUserId]);

  const startTyping = () => {
    if (!selfTyping && selectedUserId) {
      setSelfTyping(true);
      socket.emit(TYPING_EVENT, selectedUserId);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, STOP_TYPING_TIMER);
  };

  const stopTyping = () => {
    if (selfTyping && selectedUserId) {
      socket.emit(STOP_TYPING_EVENT, selectedUserId);
      setSelfTyping(false);
    }
  };

  return { isTyping, startTyping, stopTyping };
}
