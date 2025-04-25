import type { Route } from "./+types/logout";

export function meta({}: Route.MetaArgs) {
  return [{ title: "logout" }, { name: "description", content: "Lorem ipsum" }];
}

export default function Logout() {
  return (
    <>
      <h1>Log-out</h1>
    </>
  );
}
