import { useState } from "react";
import { useStrangerMatch } from "./useStrangerMatch";
import { MessageList } from "./MessageList";
import { Send, UserRoundX, Orbit } from "lucide-react";

export const StrangerChat = ({ currentUserName }: { currentUserName: string }) => {
  const { status, messages, sendMessage, startSearch, stopSearch, strangerName } = useStrangerMatch(currentUserName);
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim() || status !== 'matched') return;
    sendMessage(text.trim());
    setText("");
  };

  return (
    <div className="flex border-2 border-border flex-col h-[65vh] min-h-[500px] w-full max-w-2xl mx-auto bg-background gum-card overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b-2 border-border bg-secondary/30">
        <div className="flex items-center gap-3">
           <div className={`w-3 h-3 rounded-full border-2 border-background shadow-sm ${status === 'matched' ? 'bg-green-500 animate-pulse' : status === 'searching' ? 'bg-yellow-500 animate-pulse' : 'bg-red-500'}`} />
           <h2 className="font-bold tracking-tighter">
              {status === 'idle' ? 'Stranger Lobby' : status === 'searching' ? 'Searching for a stranger...' : `Chatting with ${strangerName}`}
           </h2>
        </div>
        
        {status !== 'idle' && (
           <button 
             onClick={stopSearch}
             className="text-xs font-bold text-destructive hover:underline"
           >
             Disconnect
           </button>
        )}
      </div>

      {/* Body */}
      {status === 'idle' ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-6 text-center">
            <div className="w-20 h-20 rounded-[3px] gum-border bg-primary/10 flex items-center justify-center text-primary shadow-[4px_4px_0px_#000] dark:shadow-[4px_4px_0px_theme(colors.primary.DEFAULT)]">
               <Orbit size={40} />
            </div>
            <div>
               <h3 className="text-2xl font-bold tracking-tight mb-3">Talk to Strangers</h3>
               <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mx-auto">
                  You will be instantly matched with another random developer. Chats are completely anonymous, ephemeral, and vanish instantly when you disconnect.
               </p>
            </div>
            <button
               onClick={startSearch}
               className="gum-btn bg-primary text-primary-foreground font-extrabold px-8 py-3.5 w-full max-w-xs transition-transform hover:translate-x-1 hover:-translate-y-1 shadow-[4px_4px_0px_theme(colors.primary.DEFAULT)]"
            >
               Start Searching
            </button>
        </div>
      ) : (
        <div className="flex-1 flex flex-col h-full bg-secondary/5">
            {status === 'searching' ? (
               <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
                  <Orbit className="animate-spin mb-4 text-primary opacity-50" size={48} />
                  <p className="font-bold tracking-widest uppercase text-xs">Waiting in lobby...</p>
               </div>
            ) : (
               <MessageList messages={messages} />
            )}
            
            {/* Input Area */}
            <div className={`p-4 bg-background border-t-2 border-border ${status !== 'matched' && 'opacity-50 pointer-events-none'}`}>
               <div className="flex gap-2 relative">
                  <button 
                    onClick={() => { stopSearch(); startSearch(); }}
                    className="flex items-center gap-1 bg-destructive text-destructive-foreground px-4 py-2 rounded-[3px] font-bold text-sm gum-btn hover:bg-red-600 transition-colors"
                  >
                    <UserRoundX size={16} />
                    <span className="hidden sm:inline">Skip</span>
                  </button>

                  <input
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 bg-background border-2 border-border rounded-[3px] px-4 py-2 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 placeholder:text-muted-foreground/50 transition-all font-mono"
                    disabled={status !== 'matched'}
                  />
                  
                  <button 
                    onClick={handleSend}
                    disabled={status !== 'matched' || !text.trim()}
                    className="bg-primary text-primary-foreground p-2 px-6 rounded-[3px] gum-btn disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 active:scale-95 transition-transform"
                  >
                    <Send size={18} />
                  </button>
               </div>
            </div>
        </div>
      )}
    </div>
  );
};
