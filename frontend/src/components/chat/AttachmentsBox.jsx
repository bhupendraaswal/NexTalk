import AttachmentItem from "./AttachmentItem";

const AttachmentsBox = ({ files, setFiles }) => {
  const handleRemoveFile = (fileIndex) => {
    setFiles((prev) => prev.filter((_, index) => index !== fileIndex));
  };

  return (
    <div className="flex gap-3 overflow-x-auto scrollbar-custom pb-1">
      {files?.map((file, index) => (
        <AttachmentItem
          key={file.name ?? index}
          file={file}
          onRemove={() => handleRemoveFile(index)}
        />
      ))}
    </div>
  );
};

export default AttachmentsBox;
