import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface PostWithProfile {
  id: string;
  content: string;
  code: string | null;
  media_url: string | null;
  tags: string[];
  created_at: string;
  user_id: string;
  profiles: {
    username: string;
    display_name: string;
    avatar_url: string | null;
  } | null;
  likes_count: number;
  user_liked: boolean;
  user_bookmarked: boolean;
  comments_count: number;
}

const PAGE_SIZE = 10;

export function usePosts() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const fetchPosts = async ({ pageParam = 0 }) => {
    const from = pageParam * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    const { data: postsData, error } = await supabase
      .from("posts")
      .select(`
        id, content, code, media_url, tags, created_at, user_id,
        profiles ( username, display_name, avatar_url )
      `)
      .gt("created_at", new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
      .order("created_at", { ascending: false })
      .range(from, to);

    if (error) throw error;
    if (!postsData) return [];

    const postIds = postsData.map(p => p.id);

    // Fetch likes counts
    const { data: likesData } = await supabase
      .from("likes")
      .select("post_id")
      .in("post_id", postIds);

    const likesCounts: Record<string, number> = {};
    (likesData || []).forEach((l: any) => {
      likesCounts[l.post_id] = (likesCounts[l.post_id] || 0) + 1;
    });

    // Fetch user's likes & bookmarks
    let userLikes = new Set<string>();
    let userBookmarks = new Set<string>();

    if (user) {
      const { data: myLikes } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);
      userLikes = new Set((myLikes || []).map(l => l.post_id));

      const { data: myBookmarks } = await supabase
        .from("bookmarks")
        .select("post_id")
        .eq("user_id", user.id)
        .in("post_id", postIds);
      userBookmarks = new Set((myBookmarks || []).map(b => b.post_id));
    }

    return postsData.map((p: any) => ({
      ...p,
      likes_count: likesCounts[p.id] || 0,
      user_liked: userLikes.has(p.id),
      user_bookmarked: userBookmarks.has(p.id),
      comments_count: 0,
    })) as PostWithProfile[];
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["posts", user?.id],
    queryFn: fetchPosts,
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length === PAGE_SIZE ? allPages.length : undefined;
    },
  });

  const posts = data?.pages.flat() ?? [];

  const createPostMutation = useMutation({
    mutationFn: async ({ content, code, tags, media_url }: { content: string, code: string, tags: string[], media_url?: string }) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("posts").insert({
        user_id: user.id,
        content,
        code: code || "",
        tags,
        media_url: media_url || "",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post shared!");
    },
    onError: (error) => {
      toast.error("Failed to post: " + error.message);
    }
  });

  const toggleLikeMutation = useMutation({
    mutationFn: async ({ postId, currentlyLiked }: { postId: string, currentlyLiked: boolean }) => {
      if (!user) throw new Error("Not authenticated");
      if (currentlyLiked) {
        await supabase.from("likes").delete().eq("user_id", user.id).eq("post_id", postId);
      } else {
        await supabase.from("likes").insert({ user_id: user.id, post_id: postId });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const deletePostMutation = useMutation({
    mutationFn: async (postId: string) => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId)
        .eq("user_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted");
    },
  });

  return {
    posts,
    loading: status === "pending",
    createPost: (content: string, code: string, tags: string[], media_url?: string) =>
      createPostMutation.mutateAsync({ content, code, tags, media_url }),
    toggleLike: (postId: string, currentlyLiked: boolean) =>
      toggleLikeMutation.mutate({ postId, currentlyLiked }),
    toggleBookmark: async (postId: string, currentlyBookmarked: boolean) => {
      if (!user) return;
      if (currentlyBookmarked) {
        await supabase.from("bookmarks").delete().eq("user_id", user.id).eq("post_id", postId);
      } else {
        await supabase.from("bookmarks").insert({ user_id: user.id, post_id: postId });
      }
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    deletePost: (postId: string) => deletePostMutation.mutate(postId),
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  };
}
