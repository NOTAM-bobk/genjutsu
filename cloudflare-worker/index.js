export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: corsHeaders,
      });
    }

    const url = new URL(request.url);

    if (url.pathname === "/config" && request.method === "GET") {
      const config = {
        VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
        VITE_SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY,
        VITE_GROQ_API_KEY: env.VITE_GROQ_API_KEY,
        VITE_ABLY_KEY: env.VITE_ABLY_KEY,
        VITE_ADMIN_EMAILS: env.VITE_ADMIN_EMAILS,
        VITE_LANG_SERVICE: env.VITE_LANG_SERVICE,
        VITE_SENTRY_DSN: env.VITE_SENTRY_DSN,
      };

      return new Response(JSON.stringify(config), {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      });
    }

    return new Response("Not Found", { status: 404 });
  },
};
