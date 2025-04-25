import type { Route } from "./+types/login";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { authUser } from "../store/userReducer";

import type { AppDispatch } from "../store/store";
import type { UserState } from "../types/User";

export function meta({}: Route.MetaArgs) {
  return [{ title: "login" }, { name: "description", content: "Lorem ipsum" }];
}

export default function Login() {
  const [email, setEmail] = useState("tony@stark.com");
  const [password, setPassword] = useState("password123");

  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
  let navigate = useNavigate();

  let user = useSelector((state: { user: UserState }) => state.user);
  console.log("user::", user);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    dispatch(authUser({ email, password }));
  };

  useEffect(() => {
    if (user && user.token) {
      navigate("/profile");
    }
  }, [user, navigate]);

  return (
    <>
      <section className="sign-in-content">
        <i className="fa fa-user-circle sign-in-icon"></i>
        <h1>Sign In</h1>
        <form onSubmit={handleLogin}>
          <div className="input-wrapper">
            <label htmlFor="email">Username</label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="input-remember">
            <input type="checkbox" id="remember-me" />
            <label htmlFor="remember-me">Remember me</label>
          </div>
          <button type="submit" className="sign-in-button">
            Sign In
          </button>
        </form>
      </section>
    </>
  );
}
