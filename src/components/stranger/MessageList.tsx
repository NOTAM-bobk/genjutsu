import { Message } from "./useStrangerMatch";
import { useEffect, useRef } from "react";
import { format } from "date-fns";

export const MessageList = ({ messages }: { messages: Message[] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center bg-background/50 rounded-[3px] gum-border mx-4">
        <p className="font-bold mb-2">You are now chatting with a random stranger.</p>
        <p className="text-sm">Say hi!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((msg) => {
        if (msg.sender === "system") {
          return (
            <div key={msg.id} className="flex justify-center">
              <span className="bg-secondary/80 text-secondary-foreground text-xs px-3 py-1 rounded-[3px] font-bold">
                {msg.text}
              </span>
            </div>
          );
        }

        const isMe = msg.sender === "me";
        return (
          <div key={msg.id} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
            <div className="flex items-end gap-2 max-w-[85%]">
              <div
                className={`p-3 rounded-[3px] text-sm leading-relaxed whitespace-pre-wrap ${
                  isMe
                    ? "bg-primary text-primary-foreground gum-border-dark shadow-[2px_2px_0px_#000]"
                    : "bg-background gum-border text-foreground shadow-[2px_2px_0px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_0px_rgba(255,255,255,0.1)]"
                }`}
              >
                {msg.text}
              </div>
            </div>
            <span className="text-[10px] text-muted-foreground mt-1 mx-1 font-mono">
              {format(msg.timestamp, "HH:mm")}
            </span>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};
