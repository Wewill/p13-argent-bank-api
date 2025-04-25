import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("profile", "./routes/profile.tsx"), //:userId
  route("login", "./routes/login.tsx"),
  route("logout", "./routes/logout.tsx"),
] satisfies RouteConfig;
