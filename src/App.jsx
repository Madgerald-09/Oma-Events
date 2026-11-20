import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Signup from "./pages/auth/Signup";
import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Onboarding from "./pages/auth/Onboarding";
import Dashboard from "./pages/dashboard/Dashboard";
import WorkspacePage from "./pages/dashboard/WorkspacePage";
import CreateEvent from "./pages/events/CreateEvent";
import EventList from "./pages/events/EventList";
import Marketplace from "./pages/marketplace/Marketplace";
import OmaAI from "./pages/marketplace/OmaAi";
import GuestManagement from "./pages/guests/GuestManagement";
import BudgetManagement from "./pages/budget/BudgetManagement";
import Messaging from "./pages/messages/Messaging";
import VenueMarketplace from "./pages/venues/VenueMarketplace";
import CalendarView from "./pages/calendar/CalendarView";
import OmaPay from "./pages/payments/OmaPay";
import AdminPanel from "./pages/admin/AdminPanel";
import Analytics from "./pages/analytics/Analytics";
import OmaCloud from "./pages/cloud/OmaCloud";
import Community from "./pages/community/Community";
import SocialFeed from "./pages/social/SocialFeed";
import EnterpriseDashboard from "./pages/enterprise/EnterpriseDashboard";
import Notifications from "./pages/notifications/Notifications";
import About from "./pages/marketing/About";
import Pricing from "./pages/marketing/Pricing";
import Contact from "./pages/marketing/Contact";
import FAQs from "./pages/marketing/FAQs";
import Blog from "./pages/marketing/Blog";
import Careers from "./pages/marketing/Careers";
import Home from "./pages/marketing/Home";
import TalentExplore from "./pages/marketing/TalentExplore";
import TalentProfile from "./pages/marketing/TalentProfile";
import BookingRequest from "./pages/marketing/BookingRequest";
import MyBookings from "./pages/marketing/MyBookings";
import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import Planners from "./pages/planners";
import Vendors from "./pages/vendors";
import Venues from "./pages/venues";
import Clients from "./pages/clients";
import Enterprise from "./pages/enterprise";
import FloatingOmaAi from "./components/ui/FloatingOmaAi";
import ThemeToggle from "./components/ui/ThemeToggle";

function App() {
  const { onboardingCompleted, user } = useAuth();
  const { pathname } = useLocation();
  const authenticatedHome = user && !onboardingCompleted ? "/onboarding" : "/dashboard";
  const standaloneMarketingPages = ["/about", "/pricing", "/contact", "/faqs", "/blog", "/careers"];

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/signup" element={user ? <Navigate to={authenticatedHome} replace /> : <Signup />} />
      <Route path="/login" element={user ? <Navigate to={authenticatedHome} replace /> : <Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/onboarding" element={!user ? <Navigate to="/signup" replace /> : onboardingCompleted ? <Navigate to="/dashboard" replace /> : <Onboarding />} />

      <Route path="/explore" element={<TalentExplore />} />
      <Route path="/talent/:talentId" element={<TalentProfile />} />
      <Route path="/booking/:talentId" element={<BookingRequest />} />
      <Route path="/my-bookings" element={<ProtectedRoute><MyBookings /></ProtectedRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/workspace" element={<ProtectedRoute><WorkspacePage /></ProtectedRoute>} />
      <Route path="/events" element={<ProtectedRoute><CreateEvent /></ProtectedRoute>} />
      <Route path="/event-list" element={<ProtectedRoute><EventList /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><Marketplace /></ProtectedRoute>} />
      <Route path="/venue-marketplace" element={<ProtectedRoute><VenueMarketplace /></ProtectedRoute>} />
      <Route path="/guests" element={<ProtectedRoute><GuestManagement /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetManagement /></ProtectedRoute>} />
      <Route path="/messages" element={<ProtectedRoute><Messaging /></ProtectedRoute>} />
      <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
      <Route path="/payments" element={<ProtectedRoute><OmaPay /></ProtectedRoute>} />
      <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
      <Route path="/oma-ai" element={<ProtectedRoute><OmaAI /></ProtectedRoute>} />
      <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
      <Route path="/cloud" element={<ProtectedRoute><OmaCloud /></ProtectedRoute>} />
      <Route path="/community" element={<ProtectedRoute><Community /></ProtectedRoute>} />
      <Route path="/social" element={<ProtectedRoute><SocialFeed /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute><AdminPanel /></ProtectedRoute>} />
      <Route path="/enterprise-dashboard" element={<ProtectedRoute><EnterpriseDashboard /></ProtectedRoute>} />

      <Route path="/about" element={<About />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/faqs" element={<FAQs />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/careers" element={<Careers />} />
      <Route path="/planners" element={<Planners />} />
      <Route path="/vendors" element={<Vendors />} />
      <Route path="/venues" element={<Venues />} />
      <Route path="/clients" element={<Clients />} />
      <Route path="/enterprise" element={<Enterprise />} />

        <Route path="*" element={<Navigate to={user ? authenticatedHome : "/"} replace />} />
      </Routes>
      {standaloneMarketingPages.includes(pathname) && (
        <ThemeToggle className="standalone-theme-toggle" />
      )}
      <FloatingOmaAi />
    </>
  );
}

export default App;
