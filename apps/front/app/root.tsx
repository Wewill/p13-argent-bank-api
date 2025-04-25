import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import "./css/main.css";

import Header from "./components/header";
import Footer from "./components/footer";
import { Link, useLocation } from "react-router";

import { Provider } from "react-redux";
import store from "./store/store";

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

export default function App() {
  let location = useLocation(); // Get the current location object

  return (
    <>
      <Header />
      <main className={`main ${location.pathname !== "/" ? "bg-dark" : ""}`}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

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
