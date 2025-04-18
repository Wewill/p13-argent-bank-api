import type { Route } from "./+types/signout";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "signout" },
    { name: "description", content: "Lorem ipsum" },
  ];
}

export default function Signout() {
  return (
    <>
      <h1>Sign-out</h1>
    </>
  );
}
