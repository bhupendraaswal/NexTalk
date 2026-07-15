import { useMemo } from "react";
import useChatStore from "../../store/useChatStore";
import ChatArea from "./ChatArea";
import useChatActions from "../../hooks/useChatActions";
import useAutoScroll from "../../hooks/useAutoScroll";

const ChatList = () => {
  const { selectedUserChats, selectedUser } = useChatStore();

  const sortedChats = useMemo(() => {
    if (!selectedUserChats) return [];
    return [...selectedUserChats].sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  }, [selectedUserChats]);

  const endOfMessagesRef = useAutoScroll(sortedChats, selectedUser?.admin);

  const { handleDeleteChatMessage } = useChatActions();

  return (
    <div className="flex-1 overflow-y-scroll scrollbar-custom">
      <ul role="list" className="pr-3">
        {sortedChats.map((chat) => (
          <li key={chat._id} role="listitem">
            <ChatArea chat={chat} onDelete={handleDeleteChatMessage} />
          </li>
        ))}
        <div ref={endOfMessagesRef} />
      </ul>
    </div>
  );
};

export default ChatList;
