import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("./routes/home.tsx"),
  route("user", "./routes/user.tsx"), //:userId
  route("signin", "./routes/signin.tsx"),
  route("signout", "./routes/signout.tsx"),
] satisfies RouteConfig;
