import type { Route } from "./+types/login";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../store/userReducer";

import type { AppDispatch } from "../store/store";
import type { UserState } from "../types/User";

export function meta({}: Route.MetaArgs) {
  return [{ title: "login" }, { name: "description", content: "Lorem ipsum" }];
}

export default function Login() {
  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
  let user = useSelector((state: { user: UserState }) => state.user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    dispatch(authUser({ email, password }));
  };

  return (
    <>
      <section className="sign-in-content rounded-sm">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="email"
              name="email"
              className="border-1 border-gray-300 rounded-sm"
              defaultValue="tony@stark.com"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-1 border-gray-300 rounded-sm"
              defaultValue="password123"
            />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className="sign-in-button rounded-sm">
            Sign In
          </button>
        </form>
      </section>
    </>
  );
}
