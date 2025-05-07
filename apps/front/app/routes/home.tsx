import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useDispatch } from "react-redux";

import type { AppDispatch } from "../store/store";
// import type { UserState } from "../types/User";
import { initProfile } from "../store/userReducer";

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
//   return {};
// }
export async function clientLoader({ params }: Route.ClientLoaderArgs) {
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

export default function Home({}: Route.ComponentProps) {
  // Init
  let location = useLocation(); // Get the current location object
  let navigate = useNavigate(); // Get the navigate function
  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch

  useEffect(() => {
    // On first load, init app
    dispatch(initProfile({ location }));
  }, []);

  return (
    <>
      <Hero />
      <Features />
    </>
  );
}
