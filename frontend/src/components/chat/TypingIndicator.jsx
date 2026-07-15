const TypingIndicator = ({ isTyping }) => {
  return (
    <span className="text-sm text-muted-foreground min-h-[1.25rem]">
      {isTyping ? "typing..." : ""}
    </span>
  );
};

export default TypingIndicator;
