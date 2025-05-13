import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("profile", "./routes/profile.tsx"), //:userId
  route("login", "./routes/login.tsx"),
] satisfies RouteConfig;

// @IMPROVE : Use custom routes to handle authentication status and group access
