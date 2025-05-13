import { useEffect, useState } from "react";
import {
  isRouteErrorResponse,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
  useNavigate,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "./css/main.css";

import Footer from "./components/footer";
import Header from "./components/header";
import Modal from "./components/modal/modal";
import Spinner from "./components/spinner";

import { Provider, useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "./store/store";
import { getUser, logout, updateError } from "./store/userReducer";

import type { RootState } from "./store/store";
import store from "./store/store";

import { isTokenValid } from "./helpers/jwt";

export const links: Route.LinksFunction = () => [
  {
    rel: "stylesheet",
    href: "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Provider store={store}>{children}</Provider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function AppInit() {
  // Init
  let location = useLocation(); // Get the current location object
  let navigate = useNavigate(); // Get the navigate function
  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch

  const { token, status, error } = useSelector(
    (store: RootState) => store.user
  );
  const { user } = useSelector((store: RootState) => store);

  useEffect(() => {
    console.log("AppInit::", token, status, user, error);

    if (!token) {
      // pas de token = on clear et redirige
      dispatch(logout());
      navigate("/login");
    } else if (token && !isTokenValid(token)) {
      // token dispo mais pas valide = on clear et redirige
      dispatch(logout());
      navigate("/login");
    } else if (token && isTokenValid(token) && !user.user?.id) {
      // token dispo mais pas de user = on fetch
      dispatch(getUser());
      navigate("/profile");
    } else if (
      token &&
      isTokenValid(token) &&
      user.user?.id &&
      location.pathname !== "/profile"
    ) {
      // token & user = on redirige vers profile
      navigate("/profile");
    }
    // Handle more statuses...
  }, [token, status, error]);

  // Showing errors
  if (error) return <AppError />;

  // Loading status
  if (status === "loading") return <Spinner />;

  // Debug
  return null;
  return (
    <div className="text-blue-400">
      Token : {token ? "√" : "Ø"} Status : {status}
    </div>
  );
}

export default function App() {
  let location = useLocation(); // Get the current location object

  return (
    <>
      <Header />
      <main className={`main ${location.pathname !== "/" ? "bg-dark" : ""}`}>
        <AppInit />
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

const AppError = ({}) => {
  const { error } = useSelector((store: RootState) => store.user);
  const dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
  const onClose = () => {
    dispatch(updateError(null));
  };

  if (!error) {
    return null; // Don't render the modal if there's no error
  }

  return (
    <Modal onClose={onClose} title="Damned, an error occurred !">
      <p>{error ?? "Unknow error"}</p>
    </Modal>
  );
};

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <>
      <Header />
      <main className="p-10 pt-0 flex flex-center flex-col items-center justify-between pt-20 pb-20">
        <h1 className="text-8xl md:text-[288px] font-bold">{message}</h1>
        <p className="text-2xl">{details}</p>
        {stack && (
          <pre className="w-full p-4 overflow-x-auto">
            <code>{stack}</code>
          </pre>
        )}
        <Link to="/" className="btn btn-primary mt-4 underline">
          Retourner sur la page d'acceuil
        </Link>
      </main>
      <Footer />
    </>
  );
}
