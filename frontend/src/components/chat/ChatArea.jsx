import useAuthStore from "../../store/useAuthStore";
import useFileDownloader from "../../hooks/useFileDownloader";
import ChatAttachment from "./ChatAttachment";
import ChatItem from "./ChatItem";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import clsx from "clsx";
import { CheckCheck, Check } from "lucide-react";
import { formatMessageTime } from "../../utils/chat";

const ChatArea = ({ chat, onDelete }) => {
  const { user } = useAuthStore();
  const { downloadFile } = useFileDownloader();

  const isCurrentUser = user?._id === chat?.sender?._id;
  const timestamp = formatMessageTime(chat?.createdAt);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div className="flex flex-col gap-2">
          {chat?.attachments?.map((attachment) => {
            const filename = attachment?.localPath?.split("/").pop() || "file";

            return (
              <div key={attachment?.url || filename} className={clsx("flex flex-col", isCurrentUser ? "items-end" : "items-start")}>
                <ChatAttachment
                  className={isCurrentUser ? "ml-auto" : ""}
                  attachment={attachment}
                  onClick={() =>
                    downloadFile(
                      attachment?.url?.replace(/^http:\/\//i, "https://") || "",
                      filename
                    )
                  }
                />
                <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                  <span>{timestamp}</span>
                  {isCurrentUser && (
                    chat?.isRead ? <CheckCheck size={12} /> : <Check size={12} />
                  )}
                </div>
              </div>
            );
          })}

          {chat?.content && (
            <div className={clsx("flex flex-col", isCurrentUser ? "items-end" : "items-start")}>
              <ChatItem
                className={clsx(
                  isCurrentUser
                    ? "bg-background text-foreground ml-auto"
                    : "bg-foreground text-background"
                )}
                content={chat.content}
              />
              <div className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
                <span>{timestamp}</span>
                {isCurrentUser && (
                  chat?.isRead ? <CheckCheck size={12} /> : <Check size={12} />
                )}
              </div>
            </div>
          )}
        </div>
      </ContextMenuTrigger>
      {isCurrentUser && (
        <ContextMenuContent>
          <ContextMenuItem
            className="cursor-pointer"
            onClick={() => onDelete(chat?._id)}
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
};

export default ChatArea;
