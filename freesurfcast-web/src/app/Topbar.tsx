"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "./AuthProvider";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/forecast", label: "Forecast" },
  { href: "/insights", label: "Insights" },
  { href: "/profile", label: "Profile" },
];

export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <header className="topbar-wrap">
      <div className="topbar">
        <div className="brand-block">
          <div className="logo-circle" aria-hidden>
            FS
          </div>
          <div>
            <p className="brand-title">FreeSurfCast</p>
            <p className="brand-subtitle">Coastal forecast intelligence</p>
          </div>
        </div>

        <nav className="nav-links" aria-label="Main navigation">
          {NAV_ITEMS.map((item) => {
            const isActive = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href} className={isActive ? "nav-link active" : "nav-link"}>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="auth-indicator">
          {!user ? (
            <Link href="/login" className="btn btn-ghost">
              Login
            </Link>
          ) : (
            <>
              <span className="user-pill">Logged in as {user.email}</span>
              <button type="button" className="btn btn-ghost" onClick={logout}>
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
