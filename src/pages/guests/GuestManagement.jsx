import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { Users, UserPlus, Trash2, CheckCircle, XCircle, Edit3, Search, Calendar, Plus } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { auth, db } from "../../firebase/firebase";
import { Link } from "react-router-dom";
import "./GuestManagement.css";

const rsvpOptions = ["invited", "confirmed", "declined", "pending"];

const createEmptyGuestForm = () => ({
  name: "",
  email: "",
  phone: "",
  group: "General",
  rsvp: "invited",
  plusOne: false,
  notes: "",
});

export default function GuestManagement() {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [guests, setGuests] = useState([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [form, setForm] = useState(createEmptyGuestForm);

  const openAddForm = () => {
    setEditingGuest(null);
    setForm(createEmptyGuestForm());
    setShowAdd(true);
  };

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(collection(db, "events"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setEvents(list);
      setSelectedEvent((current) => current ?? list[0]?.id ?? null);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!selectedEvent) return;
    const q = query(collection(db, "guests"), where("eventId", "==", selectedEvent));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setGuests(list);
    });
    return unsub;
  }, [selectedEvent]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !selectedEvent) return;
    if (editingGuest) {
      await updateDoc(doc(db, "guests", editingGuest.id), {
        ...form,
        updatedAt: serverTimestamp(),
      });
      setEditingGuest(null);
    } else {
      await addDoc(collection(db, "guests"), {
        ...form,
        eventId: selectedEvent,
        userId: auth.currentUser.uid,
        createdAt: serverTimestamp(),
      });
    }
    setForm({ name: "", email: "", phone: "", group: "General", rsvp: "invited", plusOne: false, notes: "" });
    setShowAdd(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Remove this guest?")) return;
    await deleteDoc(doc(db, "guests", id));
  };

  const handleRsvpChange = async (guestId, newRsvp) => {
    await updateDoc(doc(db, "guests", guestId), { rsvp: newRsvp, updatedAt: serverTimestamp() });
  };

  const handleEdit = (guest) => {
    setEditingGuest(guest);
    setForm({
      name: guest.name,
      email: guest.email || "",
      phone: guest.phone || "",
      group: guest.group || "General",
      rsvp: guest.rsvp || "invited",
      plusOne: guest.plusOne || false,
      notes: guest.notes || "",
    });
    setShowAdd(true);
  };

  const filtered = guests.filter((g) => {
    const q = search.toLowerCase();
    return (
      g.name?.toLowerCase().includes(q) ||
      g.email?.toLowerCase().includes(q) ||
      g.group?.toLowerCase().includes(q)
    );
  });

  const rsvpCounts = {
    invited: guests.filter((g) => g.rsvp === "invited").length,
    confirmed: guests.filter((g) => g.rsvp === "confirmed").length,
    declined: guests.filter((g) => g.rsvp === "declined").length,
    pending: guests.filter((g) => g.rsvp === "pending").length,
  };

  const groups = [...new Set(guests.map((g) => g.group || "General"))];

  return (
    <DashboardLayout>
      <div className="dashboard-page guests-page">
        <header className="guests-page-header">
          <div className="dashboard-header">
            <div className="dashboard-badge">Guest Management</div>
            <h1>Guest List</h1>
            <p>Manage invitations, RSVPs, and seating for your events.</p>
          </div>
          {selectedEvent && (
            <button
              type="button"
              onClick={openAddForm}
              className="auth-submit guests-add-button"
            >
              <UserPlus size={18} /> Add Guest
            </button>
          )}
        </header>

        {events.length > 0 ? (
          <div className="guest-event-select-wrap">
            <label htmlFor="guest-event-select">Event</label>
            <select
              id="guest-event-select"
              value={selectedEvent || ""}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="auth-input guest-event-select"
            >
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>{ev.title}</option>
              ))}
            </select>
          </div>
        ) : (
          <section className="guests-empty-state">
            <span className="guests-empty-icon"><Calendar size={24} aria-hidden="true" /></span>
            <h2>Start with an event</h2>
            <p>Create an event before building its guest list. Your invitations and RSVP updates will live here.</p>
            <Link to="/events" className="guests-empty-link">
              <Plus size={17} aria-hidden="true" />
              Create an event
            </Link>
          </section>
        )}

        {selectedEvent && (
          <>
            <div className="guests-stats-grid">
              {rsvpOptions.map((r) => (
                <div key={r} className={`guest-stat-card status-${r}`}>
                  <p>{r}</p>
                  <h3>{rsvpCounts[r]}</h3>
                </div>
              ))}
            </div>

            <div className="guest-groups">
              {groups.map((g) => (
                <span key={g} className="guest-group-chip">
                  {g} ({guests.filter((x) => x.group === g).length})
                </span>
              ))}
            </div>

            <div className="guest-search-wrap">
              <Search size={17} className="guest-search-icon" aria-hidden="true" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search guests by name, email, or group..."
                className="auth-input"
                aria-label="Search guests by name, email, or group"
              />
            </div>

            {filtered.length === 0 ? (
              <div className="guest-list-empty">
                <span className="guest-list-empty-icon"><Users size={23} aria-hidden="true" /></span>
                <div>
                  <h2>{search ? "No guests match that search" : "No guests added yet"}</h2>
                  <p>{search ? "Try a different name, email, or group." : "Add your first guest to start tracking invitations and RSVPs."}</p>
                </div>
                {!search && (
                  <button type="button" className="guest-list-empty-action" onClick={openAddForm}>
                    <UserPlus size={16} aria-hidden="true" />
                    Add guest
                  </button>
                )}
              </div>
            ) : (
              <div className="guests-table-wrap">
                <table className="guests-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Group</th>
                      <th>RSVP</th>
                      <th>+1</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((guest) => (
                      <tr key={guest.id}>
                        <td data-label="Name" className="guest-name-cell">{guest.name}</td>
                        <td data-label="Email">{guest.email || "—"}</td>
                        <td data-label="Phone">{guest.phone || "—"}</td>
                        <td data-label="Group">
                          <span className="guest-group-tag">
                            {guest.group || "General"}
                          </span>
                        </td>
                        <td data-label="RSVP">
                          <select
                            className={`guest-rsvp-select status-${guest.rsvp || "invited"}`}
                            value={guest.rsvp || "invited"}
                            onChange={(e) => handleRsvpChange(guest.id, e.target.value)}
                            aria-label={`RSVP status for ${guest.name}`}
                          >
                            {rsvpOptions.map((r) => (
                              <option key={r} value={r}>{r}</option>
                            ))}
                          </select>
                        </td>
                        <td data-label="+1" className={guest.plusOne ? "guest-plus-one yes" : "guest-plus-one"}>
                          {guest.plusOne ? <CheckCircle size={16} /> : <XCircle size={16} />}
                        </td>
                        <td data-label="Actions" className="guest-actions-cell">
                          <div className="guest-row-actions">
                            <button type="button" className="guest-row-action edit" onClick={() => handleEdit(guest)} aria-label={`Edit ${guest.name}`}>
                              <Edit3 size={14} />
                            </button>
                            <button type="button" className="guest-row-action delete" onClick={() => handleDelete(guest.id)} aria-label={`Remove ${guest.name}`}>
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {showAdd && (
          <div className="guest-modal-backdrop">
            <form onSubmit={handleSubmit} className="glass guest-modal" role="dialog" aria-modal="true" aria-labelledby="guest-modal-title">
              <h2 id="guest-modal-title">{editingGuest ? "Edit Guest" : "Add Guest"}</h2>
              <div className="guest-modal-fields">
                <input className="auth-input" placeholder="Full Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                <div className="guest-form-row">
                  <input className="auth-input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  <input className="auth-input" type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="guest-form-row">
                  <input className="auth-input" placeholder="Group (e.g. Family, VIP)" value={form.group} onChange={(e) => setForm({ ...form, group: e.target.value })} />
                  <select className="auth-input" value={form.rsvp} onChange={(e) => setForm({ ...form, rsvp: e.target.value })}>
                    {rsvpOptions.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
                <label className="guest-plus-one-field">
                  <input type="checkbox" checked={form.plusOne} onChange={(e) => setForm({ ...form, plusOne: e.target.checked })} />
                  Allow +1
                </label>
                <textarea className="auth-input auth-textarea" placeholder="Notes (dietary, seating, etc.)" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows="2" />
              </div>
              <div className="guest-modal-actions">
                <button type="submit" className="auth-submit">{editingGuest ? "Update" : "Add Guest"}</button>
                <button type="button" className="guest-modal-cancel" onClick={() => { setShowAdd(false); setEditingGuest(null); }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
