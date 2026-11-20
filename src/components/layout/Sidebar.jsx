import {
  LayoutDashboard,
  Calendar,
  MessageCircle,
  Bell,
  Store,
  CreditCard,
  House,
  Users,
  DollarSign,
  MapPin,
  Clock,
  BarChart3,
  Cloud,
  Globe,
  Heart,
  Crown,
  Shield,
  Menu,
  X,
} from "lucide-react";

import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import ThemeToggle from "../ui/ThemeToggle";

export default function Sidebar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, onboardingCompleted, role } = useAuth();
  const homePath = user
    ? onboardingCompleted
      ? "/dashboard"
      : "/onboarding"
    : "/";

  const mainLinks = [
    { title: "Dashboard", icon: <LayoutDashboard size={20} />, path: "/dashboard" },
    { title: "Events", icon: <Calendar size={20} />, path: "/event-list" },
    { title: "Create Event", icon: <Calendar size={20} />, path: "/events" },
    { title: "Calendar", icon: <Clock size={20} />, path: "/calendar" },
    { title: "Guests", icon: <Users size={20} />, path: "/guests" },
    { title: "Budget", icon: <DollarSign size={20} />, path: "/budget" },
  ];

  const mobileLinks = [mainLinks[0], mainLinks[1], mainLinks[3], mainLinks[4]];

  const marketplaceLinks = [
    { title: "Vendor Marketplace", icon: <Store size={20} />, path: "/marketplace" },
    { title: "Venue Marketplace", icon: <MapPin size={20} />, path: "/venue-marketplace" },
  ];

  const communicationLinks = [
    { title: "Messages", icon: <MessageCircle size={20} />, path: "/messages" },
    { title: "Notifications", icon: <Bell size={20} />, path: "/notifications" },
  ];

  const financeLinks = [
    { title: "OmaPay", icon: <CreditCard size={20} />, path: "/payments" },
    { title: "Analytics", icon: <BarChart3 size={20} />, path: "/analytics" },
  ];

  const platformLinks = [
    { title: "Oma AI", icon: <Crown size={20} />, path: "/oma-ai" },
    { title: "Oma Cloud", icon: <Cloud size={20} />, path: "/cloud" },
    { title: "Community", icon: <Globe size={20} />, path: "/community" },
    { title: "Social", icon: <Heart size={20} />, path: "/social" },
  ];

  const adminLinks = role === "admin" ? [
    { title: "Admin Panel", icon: <Shield size={20} />, path: "/admin" },
  ] : [];

  const enterpriseLinks = role === "organization" || role === "enterprise" ? [
    { title: "Enterprise", icon: <Crown size={20} />, path: "/enterprise-dashboard" },
  ] : [];

  const renderLinkGroup = (links) =>
    links.map((link) => (
      <NavLink
        key={link.path}
        to={link.path}
        className={({ isActive }) =>
          `sidebar-link${isActive ? " active" : ""}`
        }
        onClick={() => setMobileMenuOpen(false)}
      >
        {link.icon}
        <span>{link.title}</span>
      </NavLink>
    ));

  return (
    <>
      <header className="dashboard-mobile-topbar">
        <NavLink to={homePath} className="dashboard-mobile-brand">OMA</NavLink>
        <div className="dashboard-mobile-tools">
          <ThemeToggle className="mobile-dashboard-theme-toggle" />
          <button
            className="dashboard-mobile-menu-button"
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="dashboard-sidebar"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {mobileMenuOpen && (
        <button
          className="dashboard-sidebar-backdrop"
          type="button"
          onClick={() => setMobileMenuOpen(false)}
          aria-label="Close navigation"
        />
      )}

      <aside className={`sidebar${mobileMenuOpen ? " mobile-open" : ""}`} id="dashboard-sidebar">
        <div className="sidebar-mobile-header">
          <NavLink to={homePath} className="sidebar-logo" onClick={() => setMobileMenuOpen(false)}>
            OMA
          </NavLink>
          <button
            className="sidebar-close-button"
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close navigation"
          >
            <X size={19} />
          </button>
        </div>
        <ThemeToggle className="sidebar-theme-toggle" />

        <div className="sidebar-links">
          {renderLinkGroup(mainLinks)}

          <div className="sidebar-section-label">Marketplace</div>
          {renderLinkGroup(marketplaceLinks)}

          <div className="sidebar-section-label">Communication</div>
          {renderLinkGroup(communicationLinks)}

          <div className="sidebar-section-label">Finance</div>
          {renderLinkGroup(financeLinks)}

          <div className="sidebar-section-label">Platform</div>
          {renderLinkGroup(platformLinks)}

          {adminLinks.length > 0 && (
            <>
              <div className="sidebar-section-label">Admin</div>
              {renderLinkGroup(adminLinks)}
            </>
          )}

          {enterpriseLinks.length > 0 && (
            <>
              <div className="sidebar-section-label">Enterprise</div>
              {renderLinkGroup(enterpriseLinks)}
            </>
          )}
        </div>

        <div className="sidebar-footer">
          <NavLink to={homePath} className="sidebar-link sidebar-home-link" onClick={() => setMobileMenuOpen(false)}>
            <House size={20} />
            <span>Back Home</span>
          </NavLink>
        </div>
      </aside>

      <nav className="dashboard-mobile-nav" aria-label="Dashboard navigation">
        {mobileLinks.map((link, index) => (
          <NavLink
            key={link.path}
            to={link.path}
            end={index === 0}
            className={({ isActive }) => `dashboard-mobile-nav-link${isActive ? " active" : ""}`}
          >
            {link.icon}
            <span>{index === 0 ? "Home" : link.title}</span>
          </NavLink>
        ))}
        <button
          className={`dashboard-mobile-nav-link${mobileMenuOpen ? " active" : ""}`}
          type="button"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-expanded={mobileMenuOpen}
          aria-controls="dashboard-sidebar"
        >
          {mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}
          <span>More</span>
        </button>
      </nav>
    </>
  );
}
