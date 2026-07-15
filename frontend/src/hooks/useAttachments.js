import { toast } from "sonner";
import { useState } from "react";

const MAX_FILES = 5;

export default function useAttachments() {
  const [files, setFiles] = useState([]);

  const handleAttachmentsChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > MAX_FILES) {
      toast.error(`You can only upload up to ${MAX_FILES} files.`);
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);
    e.target.value = "";
  };

  return { files, setFiles, handleAttachmentsChange };
}
