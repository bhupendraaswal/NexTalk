import { useEffect } from "react";
import useChatStore from "../store/useChatStore";

export default function useAvailableUsers() {
  const { getAvailableUsers, searchQuery } = useChatStore();

  useEffect(() => {
    getAvailableUsers(searchQuery);
  }, [getAvailableUsers, searchQuery]);
}
