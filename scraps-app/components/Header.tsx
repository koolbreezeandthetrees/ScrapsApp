import { SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header>
      <nav className="navbar">
          <div id="navbar" className="navbar-content">
            {/* LOGO */}
            <ul className="logo-container">
              <Image
                src="/icons/logo.svg"
                alt="Peanut logo"
                className="logo"
                width={40}
                height={40}
              />
              <p className="nav-title"> SCRAPS </p>
            </ul>

            {/* NAVIGATION (logged in)*/}
            <SignedIn>
              <ul className="nav-list nav-list-right">
                <li className="nav-item">
                  <Link className="nav-link" href="/inventory">
                    <Image
                      src="/icons/inventory.svg"
                      alt="Inventory Icon"
                      width={40}
                      height={40}
                    />{" "}
                    inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/recipes">
                    <Image
                      src="/icons/recipe.svg"
                      alt="Recipes Icon"
                      width={40}
                      height={40}
                    />{" "}
                    recipes
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/calculate">
                    <Image
                      src="/icons/calculate.svg"
                      alt="Calculate Icon"
                      width={40}
                      height={40}
                    />{" "}
                    calculate
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="/logout">
                    <Image
                      src="/icons/profile.svg"
                      alt="Log Out Icon"
                      width={40}
                      height={40}
                    />{" "}
                    <SignOutButton />
                  </Link>
                </li>
              </ul>
            <UserButton />
            
            </SignedIn>

            {/* NAVIGATION (logged out) */}
            <SignedOut>
              <ul className="nav-list nav-list-right">
                <li className="nav-item">
                  <SignInButton />
                </li>
              </ul>
            </SignedOut>
        </div>
      </nav>
    </header>
  );
}
