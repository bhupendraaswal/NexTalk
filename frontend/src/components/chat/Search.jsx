import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";
import useChatStore from "../../store/useChatStore";

const Search = ({ ...props }) => {
  const { searchQuery, setSearchQuery, getAvailableUsers } = useChatStore();

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    getAvailableUsers(value);
  };

  return (
    <div className="flex items-center bg-transparent dark:bg-input/30 border-b-2 focus-within:border-green-500 rounded-[2px] px-2 transition-colors">
      <SearchIcon className="text-muted-foreground mr-2" size={20} />
      <Input
        className="border-none rounded-none bg-transparent shadow-none px-0 dark:bg-transparent"
        placeholder={props.placeholder || "Search users..."}
        value={searchQuery}
        onChange={handleSearch}
      />
    </div>
  );
};

export default Search;
