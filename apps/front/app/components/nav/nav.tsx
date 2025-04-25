import { useEffect } from "react";
import { useNavigate, NavLink, href } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/userReducer";

import type { AppDispatch } from "../../store/store";
import type { UserState } from "../../types/User";

export function Nav() {
  let dispatch: AppDispatch = useDispatch(); // Correctly typed dispatch
  let navigate = useNavigate();

  let user = useSelector((state: { user: UserState }) => state.user);

  const handleLogOut = () => {
    dispatch(logout());
  };

  return (
    <nav className="main-nav">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `main-nav-item ${isActive ? "router-link-exact-active" : ""}`
        }
      >
        Home
      </NavLink>
      <NavLink
        to={href("/profile")}
        className={({ isActive }) =>
          `main-nav-item ${isActive ? "router-link-exact-active" : ""}`
        }
      >
        {user.user?.firstName || "Account"}
      </NavLink>
      {!user.user && (
        <NavLink
          to={href("/login")}
          className={({ isActive }) =>
            `main-nav-item ${isActive ? "router-link-exact-active" : ""}`
          }
        >
          <i className="fa fa-user-circle"></i>
          Sign In
        </NavLink>
      )}
      {user.user && (
        <button className="main-nav-item" onClick={handleLogOut}>
          <i className="fa fa-user-circle"></i>Sign Out
        </button>
      )}
    </nav>
  );
}
