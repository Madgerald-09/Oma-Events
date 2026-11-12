import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const links = [
  { label: "Explore talent", to: "/explore" },
  { label: "Categories", to: "/#categories" },
  { label: "How it works", to: "/#how-it-works" },
  { label: "About", to: "/about" },
];

export function TalentHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, onboardingCompleted } = useAuth();
  const accountLink = user ? (onboardingCompleted ? "/dashboard" : "/onboarding") : "/login";

  return (
    <header className="talent-header">
      <div className="talent-nav-wrap">
        <Link className="talent-brand" to="/" aria-label="Oma home">
          <img className="talent-brand-logo" src="/oma-logo.jpeg" alt="OMA Events logo" />
        </Link>
        <nav id="talent-primary-nav" className={`talent-nav ${menuOpen ? "is-open" : ""}`} aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.label} to={link.to} onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          <Link className="talent-mobile-account" to={accountLink} onClick={() => setMenuOpen(false)}>
            {user ? "My account" : "Sign in"}
          </Link>
        </nav>
        <div className="talent-nav-actions">
          <Link className="talent-signin" to={accountLink}>{user ? "My account" : "Sign in"}</Link>
          <Link className="talent-button talent-button-dark talent-nav-cta" to={user ? accountLink : "/signup"}>
            {user ? "Dashboard" : "Get started"} <ArrowUpRight size={16} />
          </Link>
        </div>
        <button
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="talent-primary-nav"
          className="talent-menu-toggle"
          onClick={() => setMenuOpen((open) => !open)}
          type="button"
        >
          {menuOpen ? <X size={21} /> : <Menu size={21} />}
        </button>
      </div>
    </header>
  );
}

export function TalentFooter() {
  return (
    <footer className="talent-footer">
      <div className="talent-footer-main">
        <div className="talent-footer-brand">
          <Link className="talent-brand talent-brand-light" to="/">
            <img className="talent-brand-logo" src="/oma-logo.jpeg" alt="OMA Events logo" />
          </Link>
          <p>Good people. Great performances. Unforgettable gatherings — from hybrid launches to weddings and everything in between.</p>
        </div>
        <div className="talent-footer-column">
          <h2>Discover</h2>
          <Link to="/explore">Explore talent</Link>
          <Link to="/#categories">Categories</Link>
          <Link to="/#how-it-works">How it works</Link>
        </div>
        <div className="talent-footer-column">
          <h2>Company</h2>
          <Link to="/about">About us</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/faqs">Help centre</Link>
        </div>
        <div className="talent-footer-cta">
          <span className="talent-eyebrow">YOUR NEXT GREAT EVENT</span>
          <p>Find the right talent for your next big moment.</p>
          <Link className="talent-footer-link" to="/explore">Start exploring <ArrowUpRight size={16} /></Link>
        </div>
      </div>
      <div className="talent-footer-bottom">
        <span>© {new Date().getFullYear()} Oma Events. Demo marketplace experience.</span>
        <span>Made for moments that matter.</span>
      </div>
    </footer>
  );
}

export default function TalentSiteShell({ children }) {
  const { user } = useAuth();

  return (
    <div className="talent-site">
      <TalentHeader />
      {children}
      <div className="talent-mobile-cta-bar">
        <Link to="/explore">Explore talent</Link>
        <Link className="talent-button talent-button-green" to={user ? "/my-bookings" : "/login"}>
          {user ? "My enquiries" : "Book now"}
        </Link>
      </div>
      <TalentFooter />
    </div>
  );
}
