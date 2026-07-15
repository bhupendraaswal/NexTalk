import clsx from "clsx";
import MarkdownRenderer from "../MarkdownRenderer";

const ChatItem = ({ className, content }) => {
  return (
    <div
      className={clsx(
        "max-w-[300px] break-words rounded-md p-3 mt-3 whitespace-pre-line",
        className
      )}
    >
      <MarkdownRenderer content={content} />
    </div>
  );
};

export default ChatItem;
