import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useChatStore from "../../store/useChatStore";
import { ucFirst } from "../../utils/string";
import TypingIndicator from "./TypingIndicator";
import { Button } from "@/components/ui/button";
import { ArrowLeft, EllipsisVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useAuthStore from "../../store/useAuthStore";

const ChatHeader = ({ isTyping }) => {
  const {
    activeUser,
    deleteOneOnOneChat,
    resetSelectedUser,
    initiateOneOnOneChat,
    presenceMap,
  } = useChatStore();
  const { user } = useAuthStore();

  const handleDeleteOneOnOneChat = async () => {
    await deleteOneOnOneChat();

    await initiateOneOnOneChat(activeUser);
  };
  const isActiveUserOnline = presenceMap?.[activeUser?._id] === "online";
  const selectedUserProfile = activeUser || user;
  const selectedUserAvatar = selectedUserProfile?.avatar?.url || "/images/user.png";
  const selectedUserName = ucFirst(
    selectedUserProfile?.fullName || selectedUserProfile?.username || "Unknown"
  );

  return (
    <div className="pb-2 flex items-center gap-4 border-b mb-4">
      <ArrowLeft className="block md:hidden" onClick={resetSelectedUser} />

      <div className="relative">
        <Avatar className="size-10 md:size-12">
          <AvatarImage src={selectedUserAvatar} />
          <AvatarFallback>{selectedUserName.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <span
          className={`absolute bottom-0 right-0 size-3 rounded-full border-2 border-background ${
            isActiveUserOnline ? "bg-emerald-500" : "bg-slate-400"
          }`}
        />
      </div>

      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-medium truncate max-w-[150px] md:max-w-[250px]">
          {selectedUserName}
        </span>
        <span className="text-sm text-muted-foreground truncate max-w-[150px] md:max-w-[250px]">
          {selectedUserProfile?.bio || (isActiveUserOnline ? "Online" : "Offline")}
        </span>
        <TypingIndicator isTyping={isTyping} />
      </div>

      <Button
        className="text-end w-fit ml-auto hidden md:block"
        onClick={handleDeleteOneOnOneChat}
      >
        Clear Chat
      </Button>

      <div className="ml-auto block md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleDeleteOneOnOneChat}>
              Clear Chat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ChatHeader;
