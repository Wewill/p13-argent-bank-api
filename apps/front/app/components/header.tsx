import { Nav } from "./nav/nav";
import { Link } from "react-router";

export default function Header() {
  return (
    <header className="main-nav">
      <Link to={"/"} className="main-nav-logo">
        <img
          className="main-nav-logo-image"
          src="./argentBankLogo.png"
          alt="Argent Bank Logo"
        />
        <h1 className="sr-only">Argent Bank</h1>
      </Link>
      <Nav />
    </header>
  );
}
