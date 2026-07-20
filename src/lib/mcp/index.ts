import { auth, defineMcp } from "@lovable.dev/mcp-js";
import getMyProfileTool from "./tools/get-my-profile";
import getLeaderboardTool from "./tools/get-leaderboard";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "car-mechanic-tycoon-mcp",
  title: "Car Mechanic Tycoon",
  version: "0.1.0",
  instructions:
    "Tools for the Car Mechanic Tycoon Simulator. Use `get_my_profile` to read the signed-in player's stats, and `get_leaderboard` to read the public top players.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [getMyProfileTool, getLeaderboardTool],
});
