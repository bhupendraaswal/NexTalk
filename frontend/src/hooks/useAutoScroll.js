import { useEffect, useRef } from "react";

const useAutoScroll = (deps, shouldReset = true) => {
  const endOfMessagesRef = useRef(null);
  const initialScrollDone = useRef(false);

  useEffect(() => {
    if (shouldReset) {
      initialScrollDone.current = false;
    }
  }, [shouldReset]);

  useEffect(() => {
    if (!endOfMessagesRef.current) return;

    if (!initialScrollDone.current) {
      endOfMessagesRef.current.scrollIntoView({ behavior: "auto" });
      initialScrollDone.current = true;
    } else {
      endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [deps]);

  return endOfMessagesRef;
};

export default useAutoScroll;
