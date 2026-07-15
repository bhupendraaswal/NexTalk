import { Card, CardContent } from "@/components/ui/card";
import { File, X } from "lucide-react";
import { formatFileSize, getFileExtension } from "@/utils/file";

const AttachmentItem = ({ file, onRemove }) => {
  return (
    <Card className="min-w-[250px] w-auto shrink-0 whitespace-nowrap px-4 py-2 rounded-sm">
      <CardContent className="p-0 flex justify-between items-center">
        <div className="flex items-center gap-3 pr-4">
          <File />
          <div className="flex flex-col">
            <p className="truncate max-w-[150px]" title={file?.name}>
              {file?.name}
            </p>
            <small className="dark:text-gray-300">
              {getFileExtension(file?.name ?? "")}
            </small>
            <small className="dark:text-gray-300">
              {formatFileSize(file?.size ?? 0)}
            </small>
          </div>
        </div>
        <X className="cursor-pointer" onClick={onRemove} />
      </CardContent>
    </Card>
  );
};

export default AttachmentItem;
