import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  arrayUnion,
} from "firebase/firestore";
import { Link } from "react-router-dom";
import { Plus, Calendar, MapPin, Trash2, Edit3, Eye, CheckCircle, Clock, XCircle, Copy } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { auth, db } from "../../firebase/firebase";
import "./EventList.css";

const statusColors = {
  planning: "#fbbf24",
  "in-progress": "#3b82f6",
  completed: "#22c55e",
  cancelled: "#ef4444",
};

const statusIcons = {
  planning: <Clock size={14} />,
  "in-progress": <Eye size={14} />,
  completed: <CheckCircle size={14} />,
  cancelled: <XCircle size={14} />,
};

export default function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [editingEvent, setEditingEvent] = useState(null);
  const [showChecklist, setShowChecklist] = useState(null);
  const [newCheckItem, setNewCheckItem] = useState("");
  const [newTask, setNewTask] = useState("");

  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    const q = query(collection(db, "events"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      list.sort((a, b) => {
        const da = a.createdAt?.toDate?.() || new Date(0);
        const db = b.createdAt?.toDate?.() || new Date(0);
        return db - da;
      });
      setEvents(list);
      setLoading(false);
    });

    return unsub;
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Delete this event?")) return;
    await deleteDoc(doc(db, "events", eventId));
  };

  const handleStatusChange = async (eventId, newStatus) => {
    await updateDoc(doc(db, "events", eventId), {
      status: newStatus,
      updatedAt: serverTimestamp(),
    });
  };

  const handleDuplicate = async (event) => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const { id, createdAt, updatedAt, ...rest } = event;
    await addDoc(collection(db, "events"), {
      ...rest,
      title: `${rest.title} (Copy)`,
      status: "planning",
      userId: uid,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    if (!editingEvent) return;
    await updateDoc(doc(db, "events", editingEvent.id), {
      title: editingEvent.title,
      date: editingEvent.date,
      location: editingEvent.location,
      budget: Number(editingEvent.budget) || 0,
      description: editingEvent.description,
      eventType: editingEvent.eventType,
      updatedAt: serverTimestamp(),
    });
    setEditingEvent(null);
  };

  const handleAddCheckItem = async (eventId) => {
    if (!newCheckItem.trim()) return;
    await updateDoc(doc(db, "events", eventId), {
      checklist: arrayUnion({ text: newCheckItem.trim(), done: false, id: Date.now().toString() }),
      updatedAt: serverTimestamp(),
    });
    setNewCheckItem("");
  };

  const handleToggleCheckItem = async (eventId, item) => {
    const ev = events.find((e) => e.id === eventId);
    if (!ev) return;
    const updated = (ev.checklist || []).map((c) =>
      c.id === item.id ? { ...c, done: !c.done } : c
    );
    await updateDoc(doc(db, "events", eventId), {
      checklist: updated,
      updatedAt: serverTimestamp(),
    });
  };

  const handleAddTask = async (eventId) => {
    if (!newTask.trim()) return;
    await updateDoc(doc(db, "events", eventId), {
      tasks: arrayUnion({ text: newTask.trim(), done: false, id: Date.now().toString() }),
      updatedAt: serverTimestamp(),
    });
    setNewTask("");
  };

  const filtered = events.filter((e) => filter === "all" || e.status === filter);

  return (
    <DashboardLayout>
      <div className="dashboard-page events-page">
        <header className="events-page-header">
          <div className="dashboard-header">
            <div className="dashboard-badge">Events</div>
            <h1>Your Events</h1>
            <p>Manage, track, and execute all your events from one place.</p>
          </div>
          <Link to="/events" className="auth-submit events-create-button">
            <Plus size={18} /> New Event
          </Link>
        </header>

        <div className="events-filters" aria-label="Filter events by status">
          {["all", "planning", "in-progress", "completed", "cancelled"].map((s) => (
            <button
              key={s}
              type="button"
              className={`events-filter-button${filter === s ? " active" : ""}`}
              onClick={() => setFilter(s)}
              aria-pressed={filter === s}
            >
              {s === "all" ? "All" : s.replace("-", " ")}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="events-loading-message">Loading events...</p>
        ) : filtered.length === 0 ? (
          <div className="events-empty-state">
            <span className="events-empty-icon"><Calendar size={25} aria-hidden="true" /></span>
            <h2>{filter === "all" ? "No events yet" : `No ${filter.replace("-", " ")} events`}</h2>
            <p>
              {filter === "all"
                ? "Your event plans will appear here once you create one."
                : "Try another status filter or create an event to get started."}
            </p>
            <Link to="/events" className="events-empty-link">
              <Plus size={16} aria-hidden="true" />
              Create your first event
            </Link>
          </div>
        ) : (
          <div className="events-list">
            {filtered.map((event) => (
              <article
                key={event.id}
                className="events-card"
                style={{ "--status-color": statusColors[event.status] || "#fbbf24" }}
              >
                <div className="event-card-header">
                  <div className="event-card-main">
                    <div className="event-card-title-row">
                      <h2 className="event-card-title">{event.title}</h2>
                      <span className="event-status-badge">
                        {statusIcons[event.status]} {event.status?.replace("-", " ")}
                      </span>
                    </div>
                    <div className="event-meta-list">
                      {event.date && <span><Calendar size={14} aria-hidden="true" /> {event.date}</span>}
                      {event.location && <span><MapPin size={14} aria-hidden="true" /> {event.location}</span>}
                      {event.budget > 0 && <span>₦{Number(event.budget).toLocaleString()}</span>}
                    </div>
                    {event.description && (
                      <p className="event-description">
                        {event.description.slice(0, 120)}{event.description.length > 120 ? "..." : ""}
                      </p>
                    )}
                  </div>

                  <div className="event-card-actions">
                    <select
                      className="event-status-select"
                      value={event.status || "planning"}
                      onChange={(e) => handleStatusChange(event.id, e.target.value)}
                      aria-label={`Change status for ${event.title}`}
                    >
                      <option value="planning">Planning</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>

                    <button className="event-action-button edit" onClick={() => setEditingEvent(event)} title="Edit" aria-label={`Edit ${event.title}`}>
                      <Edit3 size={16} />
                    </button>
                    <button className="event-action-button duplicate" onClick={() => handleDuplicate(event)} title="Duplicate" aria-label={`Duplicate ${event.title}`}>
                      <Copy size={16} />
                    </button>
                    <button className="event-action-button checklist" onClick={() => setShowChecklist(showChecklist === event.id ? null : event.id)} title="Checklist" aria-label={`Toggle checklist for ${event.title}`}>
                      <CheckCircle size={16} />
                    </button>
                    <button className="event-action-button delete" onClick={() => handleDelete(event.id)} title="Delete" aria-label={`Delete ${event.title}`}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {showChecklist === event.id && (
                  <div className="event-checklist-panel">
                    <div className="event-checklist-grid">
                      <div className="event-checklist-section">
                        <h3>Checklist</h3>
                        {(event.checklist || []).map((item, idx) => (
                          <label className="event-check-row" key={idx}>
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={() => handleToggleCheckItem(event.id, item)}
                            />
                            <span className={item.done ? "done" : ""}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                        <div className="event-add-row">
                          <input
                            className="event-add-input"
                            value={newCheckItem}
                            onChange={(e) => setNewCheckItem(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddCheckItem(event.id)}
                            placeholder="Add item..."
                            aria-label="New checklist item"
                          />
                          <button type="button" onClick={() => handleAddCheckItem(event.id)} aria-label="Add checklist item">+</button>
                        </div>
                      </div>

                      <div className="event-checklist-section">
                        <h3>Tasks</h3>
                        {(event.tasks || []).map((item, idx) => (
                          <label className="event-check-row" key={idx}>
                            <input
                              type="checkbox"
                              checked={item.done}
                              onChange={async () => {
                                const updated = (event.tasks || []).map((t) => t.id === item.id ? { ...t, done: !t.done } : t);
                                await updateDoc(doc(db, "events", event.id), { tasks: updated, updatedAt: serverTimestamp() });
                              }}
                            />
                            <span className={item.done ? "done" : ""}>
                              {item.text}
                            </span>
                          </label>
                        ))}
                        <div className="event-add-row">
                          <input
                            className="event-add-input"
                            value={newTask}
                            onChange={(e) => setNewTask(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleAddTask(event.id)}
                            placeholder="Add task..."
                            aria-label="New task"
                          />
                          <button type="button" onClick={() => handleAddTask(event.id)} aria-label="Add task">+</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}

        {editingEvent && (
          <div className="event-edit-backdrop">
            <form onSubmit={handleUpdateEvent} className="glass event-edit-form">
              <h3 style={{ color: "#fbbf24", marginBottom: "1rem" }}>Edit Event</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <input className="auth-input" placeholder="Title" value={editingEvent.title} onChange={(e) => setEditingEvent({ ...editingEvent, title: e.target.value })} />
                <input className="auth-input" type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({ ...editingEvent, date: e.target.value })} />
                <input className="auth-input" type="number" placeholder="Budget" value={editingEvent.budget} onChange={(e) => setEditingEvent({ ...editingEvent, budget: e.target.value })} />
                <input className="auth-input" placeholder="Location" value={editingEvent.location} onChange={(e) => setEditingEvent({ ...editingEvent, location: e.target.value })} />
                <select className="auth-input" value={editingEvent.eventType} onChange={(e) => setEditingEvent({ ...editingEvent, eventType: e.target.value })}>
                  <option value="wedding">Wedding</option>
                  <option value="birthday">Birthday</option>
                  <option value="corporate">Corporate</option>
                  <option value="baby-shower">Baby Shower</option>
                  <option value="bridal-shower">Bridal Shower</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
                <textarea className="auth-input auth-textarea" placeholder="Description" value={editingEvent.description} onChange={(e) => setEditingEvent({ ...editingEvent, description: e.target.value })} rows="3" />
              </div>
              <div style={{ display: "flex", gap: "10px", marginTop: "1rem" }}>
                <button type="submit" className="auth-submit" style={{ flex: 1 }}>Save Changes</button>
                <button type="button" className="event-edit-cancel" onClick={() => setEditingEvent(null)}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
