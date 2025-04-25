import type { Route } from "./+types/home";

import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "../store/store";
import type { UserState } from "../types/User";

import Hero from "../components/hero/hero";
import Features from "../components/features/features";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Argent Bank" },
    { name: "description", content: "Welcome to Argent Bank!" },
  ];
}

// Loader is run on the server and the client
// export async function loader({ params }: Route.LoaderArgs) {
//   const cards = await getLogements();
//   return cards;
// }
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  // console.log("clientLoader", params);
  // const cards = await getLogements();
  // return cards;
  return {};
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return (
    <div className="d-flex justify-content-center">
      <div className="spinner-border" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  //const data = loaderData;

  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
  let navigate = useNavigate();

  let user = useSelector((state: { user: UserState }) => state.user);
  console.log("user::", user);

  useEffect(() => {
    if (!user || !user.token) {
      navigate("/login");
    }
  }, [user, navigate]);

  return (
    <>
      <h1>Home</h1>
      <p>Welcome to Argent Bank!</p>
      <Hero />
      <Features />
    </>
  );
}
