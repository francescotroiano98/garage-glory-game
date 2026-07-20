import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

export default defineTool({
  name: "get_leaderboard",
  title: "Get leaderboard",
  description: "Return the top players ranked by total profit (public leaderboard).",
  inputSchema: {
    limit: z.number().int().min(1).max(50).optional().describe("Max entries to return (default 10)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx: ToolContext) => {
    const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
      global: ctx.isAuthenticated()
        ? { headers: { Authorization: `Bearer ${ctx.getToken()}` } }
        : undefined,
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.rpc("get_leaderboard");
    if (error) return { content: [{ type: "text", text: error.message }], isError: true };
    const rows = (data ?? []).slice(0, limit ?? 10);
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { leaderboard: rows },
    };
  },
});
