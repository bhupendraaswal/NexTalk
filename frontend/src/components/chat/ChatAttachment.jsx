import { Card, CardContent } from "@/components/ui/card";
import { ArrowDownToLine, File } from "lucide-react";
import { getFileExtension } from "../../utils/file";

const ChatAttachment = ({ attachment, className, onClick }) => {
  return (
    <Card
      className={`min-w-[250px] w-fit max-w-[100%] shrink-0 whitespace-nowrap px-4 py-2 rounded-sm mt-3 ${className}`}
    >
      <CardContent className="p-0 flex justify-between items-center">
        <div className="flex items-center gap-3 pr-4 min-w-0 flex-1">
          <File className="flex-shrink-0 w-6 h-6" />{" "}
          <div className="flex flex-col min-w-0">
            <p className="truncate">
              {attachment?.localPath?.split("/").pop() || "file"}
            </p>
            <small className="dark:text-gray-300 truncate">
              {getFileExtension(attachment?.localPath?.split("/").pop() ?? "")}
            </small>
          </div>
        </div>
        <ArrowDownToLine
          className="cursor-pointer flex-shrink-0 w-5 h-5"
          onClick={onClick}
        />
      </CardContent>
    </Card>
  );
};

export default ChatAttachment;
