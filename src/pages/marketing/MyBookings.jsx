import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { ArrowUpRight, CalendarDays, CircleAlert } from "lucide-react";
import { Link } from "react-router-dom";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { talentProfiles } from "../../data/talent";

export default function MyBookings() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadRequests() {
      const customerId = user?.uid || "guest";
      const localRequests = (() => {
        if (typeof window === "undefined") return [];
        try {
          return JSON.parse(window.localStorage.getItem("oma-booking-requests") || "[]")
            .filter((request) => request.customerId === customerId)
            .map((request) => ({
              ...request,
              id: request.id || request.reference || `${request.talentId}-${request.date}`,
              createdAt: { toMillis: () => new Date(request.createdAt || Date.now()).getTime() },
              source: "local",
            }));
        } catch {
          return [];
        }
      })();

      try {
        if (user) {
          const requestQuery = query(collection(db, "bookingRequests"), where("customerId", "==", user.uid));
          const snapshot = await getDocs(requestQuery);
          const remoteItems = snapshot.docs
            .map((document) => ({ id: document.id, ...document.data() }))
            .sort((first, second) => (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0));
          if (active) {
            setRequests([...remoteItems, ...localRequests].sort((first, second) => (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0)));
          }
        } else if (active) {
          setRequests(localRequests.sort((first, second) => (second.createdAt?.toMillis?.() || 0) - (first.createdAt?.toMillis?.() || 0)));
        }
      } catch (loadError) {
        console.error("Could not load booking requests:", loadError);
        if (active) {
          setRequests(localRequests);
          setError("We couldn't load your live enquiries, but your saved local requests are still available.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadRequests();
    return () => { active = false; };
  }, [user]);

  return (
    <TalentSiteShell>
      <main className="talent-bookings-page talent-container">
        <div className="talent-breadcrumb"><Link to="/">Home</Link><span>/</span><span>My enquiries</span></div>
        <div className="talent-bookings-heading"><span className="talent-eyebrow">Your event, all in one place</span><h1>My enquiries</h1><p>Keep track of booking requests you've sent to performers.</p></div>
        {loading ? <div className="talent-bookings-loading" aria-live="polite">Loading your enquiries…</div> : error ? (
          <div className="talent-empty-state"><span><CircleAlert size={22} /></span><h2>Something went wrong</h2><p>{error}</p></div>
        ) : requests.length === 0 ? (
          <div className="talent-empty-state"><span><CalendarDays size={22} /></span><h2>No enquiries yet</h2><p>Once you find a performer you love, your booking enquiry will appear here.</p><Link className="talent-button talent-button-green" to="/explore">Explore talent <ArrowUpRight size={16} /></Link></div>
        ) : (
          <div className="talent-bookings-list">
            {requests.map((request) => {
              const talent = talentProfiles.find((item) => item.id === request.talentId);
              return (
                <article className="talent-booking-row" key={request.id}>
                  <div className="talent-booking-row-date"><CalendarDays size={18} /><span>{request.date}</span></div>
                  <div className="talent-booking-row-info"><strong>{request.talentName}</strong><span>{request.eventType} · {request.location}</span><small>Ref. {request.reference || request.id}</small></div>
                  <span className={`talent-request-status status-${request.status || "pending"}`}>{request.status || "pending"}</span>
                  {talent && <Link className="talent-booking-row-link" to={`/talent/${talent.id}`} aria-label={`View ${talent.name}'s profile`}><ArrowUpRight size={18} /></Link>}
                </article>
              );
            })}
          </div>
        )}
      </main>
    </TalentSiteShell>
  );
}
