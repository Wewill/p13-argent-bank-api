import type { Route } from "./+types/signin";

export function meta({}: Route.MetaArgs) {
  return [{ title: "signin" }, { name: "description", content: "Lorem ipsum" }];
}

export default function Signin() {
  return (
    <>
      <h1>Sign-in</h1>
    </>
  );
}
