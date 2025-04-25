import { NavLink, href } from "react-router";

export function Nav() {
  return (
    <nav className="main-nav">
      <NavLink to="/" end className="main-nav-item">
        Accueil
      </NavLink>
      <NavLink to={href("/profile")} className="main-nav-item">
        ##Username
      </NavLink>
      <NavLink to={href("/login")} className="main-nav-item">
        <i className="fa fa-user-circle"></i>
        Sign In
      </NavLink>
      <NavLink to={href("/logout")} className="main-nav-item">
        <i className="fa fa-user-circle"></i>
        Sign Out
      </NavLink>
    </nav>
  );
}
