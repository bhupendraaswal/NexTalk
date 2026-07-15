import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Paperclip, SendHorizonal } from "lucide-react";

const MessageArea = ({
  handleAttachmentsChange,
  message,
  handleMessageChange,
  handleSendMessage,
}) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="pt-4 flex gap-2 md:gap-3 items-center">
      <Label htmlFor="send-attachments" className="cursor-pointer">
        <Paperclip />
        <Input
          id="send-attachments"
          className="hidden"
          type="file"
          multiple
          accept="image/*"
          onChange={handleAttachmentsChange}
        />
      </Label>

      <Textarea
        className="focus:outline-none focus:ring-0 focus:shadow-none max-h-[100px] resize-none scrollbar-custom"
        placeholder="Type your message..."
        value={message}
        onChange={handleMessageChange}
        onKeyDown={handleKeyDown}
      />

      <button
        className={`flex justify-center items-center p-3 rounded-full transition bg-black hover:bg-gray-800 w-[43px] h-[43px] cursor-pointer `}
        onClick={handleSendMessage}
        aria-label="Send message"
      >
        <SendHorizonal className="text-white" />
      </button>
    </div>
  );
};

export default MessageArea;
