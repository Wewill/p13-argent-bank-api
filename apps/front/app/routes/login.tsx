import type { Route } from "./+types/login";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../store/userReducer";
import { useNavigate } from "react-router";

export function meta({}: Route.MetaArgs) {
  return [{ title: "login" }, { name: "description", content: "Lorem ipsum" }];
}

export default function Login() {
  const [email, setEmail] = useState("tony@stark.com");
  const [password, setPassword] = useState("password123");
  let dispatch = useDispatch();
  let navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log("handleLogin::", e);

    e.preventDefault();
    const resultAction = await dispatch(loginUser({ email, password }));
    // console.log("resultAction", resultAction);
    // Ici set le token dans le store

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/profile"); // redirection après succès
    } else {
      alert("Login échoué");
    }
  };

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
              defaultValue="tony@stark.com"
            />
          </div>
          <div className="input-wrapper">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              defaultValue="password123"
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
