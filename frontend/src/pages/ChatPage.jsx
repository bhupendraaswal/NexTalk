import useAvailableUsers from "@/hooks/useAvailableUsers";
import useChatMessages from "@/hooks/useChatMessages";
import useSocketEvents from "@/hooks/useSocketEvents";

import UserList from "@/components/chat/UserList";
import ChatPanel from "@/components/chat/ChatPanel";

const ChatPage = () => {
  useAvailableUsers();
  useChatMessages();
  useSocketEvents();

  return (
    <section className="w-full h-full flex items-center">
      <div className="w-full h-[90%] flex glass p-2 md:p-4 min-h-0">
        <UserList />
        <ChatPanel />
      </div>
    </section>
  );
};

export default ChatPage;
