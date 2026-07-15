import UserItem from "./UserItem";

import useChatStore from "../../store/useChatStore";

import useChatActions from "../../hooks/useChatActions";
import UserListHeader from "./UserListHeader";

const UserList = () => {
  const { availableUsers, activeUser } = useChatStore();
  const { startOneOnOneChat } = useChatActions();

  return (
    <section
      className={`w-full md:w-[25%] h-full flex flex-col min-h-0 ${
        activeUser ? "hidden md:flex" : "flex"
      }`}
    >
      <UserListHeader />
      <div className="flex-1 overflow-y-scroll scrollbar-custom">
        {availableUsers?.length ? (
          <ul className="flex flex-col gap-4 pr-1 md:pr-4">
            {availableUsers.map((user) => (
              <UserItem
                key={user._id}
                user={user}
                onClick={() => startOneOnOneChat(user)}
              />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 italic text-sm">No users available.</p>
        )}
      </div>
    </section>
  );
};

export default UserList;
