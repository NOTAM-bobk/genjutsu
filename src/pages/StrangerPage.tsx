import { StrangerChat } from "@/components/stranger/StrangerChat";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { UsersRound } from "lucide-react";

const StrangerPage = () => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const screenName = profile?.display_name || "Anonymous Developer";

  return (
    <div className="max-w-4xl mx-auto p-4 py-8 md:py-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 pl-2">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-3 flex items-center gap-3 w-fit border-b-[4px] border-primary pb-2">
          <UsersRound className="text-primary" size={36} />
          Stranger 
          <span className="bg-primary text-primary-foreground text-[10px] sm:text-xs px-2 py-1 rounded-[3px] tracking-widest uppercase align-middle gum-border ml-2 -rotate-3 hover:rotate-3 transition-transform">Beta</span>
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-4 max-w-xl pl-1 border-l-2 border-border/50">
          Meet developers entirely anonymously. Ably Realtime WebSockets power instant sub-millisecond matchmaking.
        </p>
      </div>

      <StrangerChat currentUserName={screenName} />
    </div>
  );
};

export default StrangerPage;
