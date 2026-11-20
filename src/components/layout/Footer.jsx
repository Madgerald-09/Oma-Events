import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <div>
          <h3 style={{ marginBottom: "0.5rem" }}>OMA Events</h3>
          <p style={{ opacity: 0.7 }}>Africa's Event Operating System — plan, book, and pay with confidence.</p>
        </div>

        <div className="site-footer-links">
          <Link to="/planners" style={{ color: "#fbbf24" }}>Planners</Link>
          <Link to="/vendors" style={{ color: "#fbbf24" }}>Vendors</Link>
          <Link to="/venues" style={{ color: "#fbbf24" }}>Venues</Link>
          <Link to="/clients" style={{ color: "#fbbf24" }}>Clients</Link>
          <Link to="/enterprise" style={{ color: "#fbbf24" }}>OmaPro</Link>
        </div>
      </div>
    </footer>
  );
}
