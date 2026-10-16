"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "./Logo";
import { useNexa } from "./NexaProvider";

export default function Header() {
  const { user, authReady, logout } = useNexa();
  const router = useRouter();
  return (
    <header className="top">
      <div className="wrap">
        <Logo />
        <nav className="links" aria-label="Main">
          <Link href="/#market">Shop</Link>
          <Link href="/#track">Track a deal</Link>
          <Link href="/#how">How it works</Link>
          <Link href="/#safety">Safety</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        {authReady && (
          <Link className="btn btn-ghost btn-sm sell-btn" href={user ? "/dashboard" : "/login"}>
            {user ? "Dashboard" : "Log in"}
          </Link>
        )}
        <Link className="btn btn-primary btn-sm" href="/sell">Sell an item</Link>
        {user && (
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            Log out
          </button>
        )}
      </div>
    </header>
  );
}
