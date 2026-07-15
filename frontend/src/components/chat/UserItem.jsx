import clsx from "clsx";
import useChatStore from "../../store/useChatStore";
import { ucFirst } from "../../utils/string";
import { getRelativePresence } from "../../utils/chat";

const UserItem = ({ user = {}, onClick }) => {
  const { username = "Default Name", avatar } = user;
  const { presenceMap, unreadCounts } = useChatStore();

  const displayName = ucFirst(username);
  const displayAvatar = avatar?.url && "https://iili.io/HPz3fFn.png";
  const isOnline = presenceMap?.[user?._id] === "online";
  const unreadCount = unreadCounts?.[user?._id] ?? 0;

  return (
    <li>
      <button
        onClick={onClick}
        className="flex items-center gap-2 w-full text-left cursor-pointer bg-gray-200 hover:bg-gray-300 dark:bg-slate-900 dark:hover:bg-slate-950 p-3 rounded-xl transition-colors focus:outline-none focus:ring-0"
      >
        <div className="relative shrink-0">
          <img
            src={displayAvatar}
            alt={`${displayName}'s avatar`}
            className="size-10 rounded-full object-cover"
          />
          <span
            className={clsx(
              "absolute bottom-0 right-0 size-3 rounded-full border-2 border-background",
              isOnline ? "bg-green-500" : "bg-gray-400"
            )}
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xl truncate">{displayName}</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                {unreadCount}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {getRelativePresence(isOnline)}
          </p>
        </div>
      </button>
    </li>
  );
};

export default UserItem;
