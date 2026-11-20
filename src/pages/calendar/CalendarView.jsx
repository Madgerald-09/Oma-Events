import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { auth, db } from "../../firebase/firebase";
import "./CalendarView.css";

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

const eventTypeColors = {
  wedding: "#fbbf24",
  birthday: "#ec4899",
  corporate: "#3b82f6",
  "baby-shower": "#8b5cf6",
  "bridal-shower": "#f472b6",
  conference: "#06b6d4",
  concert: "#ef4444",
  other: "#6b7280",
};

export default function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  useEffect(() => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;
    const q = query(collection(db, "events"), where("userId", "==", uid));
    const unsub = onSnapshot(q, (snap) => {
      setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const changeMonth = (amount) => {
    setCurrentDate(new Date(year, month + amount, 1));
    setSelectedDay(null);
  };
  const goToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDay(now.getDate());
  };

  const eventsOnDay = (day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : [];
  const today = new Date();
  const isToday = (day) => today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;

  const upcomingEvents = events
    .filter((e) => {
      if (!e.date) return false;
      const d = new Date(e.date);
      return d >= today;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 5);

  return (
    <DashboardLayout>
      <div className="dashboard-page calendar-page">
        <header className="calendar-page-header">
          <div className="calendar-intro">
            <span className="calendar-eyebrow">
              <CalendarIcon size={14} aria-hidden="true" />
              Calendar
            </span>
            <h1>Event Calendar</h1>
            <p>View and manage your event schedule at a glance.</p>
          </div>
          <button className="calendar-today-button" type="button" onClick={goToday}>
            <CalendarIcon size={16} aria-hidden="true" />
            Today
          </button>
        </header>

        <div className="calendar-content-grid">
          <section className="calendar-card" aria-label="Monthly calendar">
            <div className="calendar-month-header">
              <button
                className="calendar-month-button"
                type="button"
                onClick={() => changeMonth(-1)}
                aria-label="Previous month"
              >
                <ChevronLeft size={19} aria-hidden="true" />
              </button>
              <h2>{MONTHS[month]} {year}</h2>
              <button
                className="calendar-month-button"
                type="button"
                onClick={() => changeMonth(1)}
                aria-label="Next month"
              >
                <ChevronRight size={19} aria-hidden="true" />
              </button>
            </div>

            <div className="calendar-weekdays" aria-hidden="true">
              {DAYS.map((day) => <span key={day}>{day}</span>)}
            </div>

            <div className="calendar-days-grid">
              {Array.from({ length: firstDay }).map((_, index) => (
                <span className="calendar-day-empty" key={`empty-${index}`} aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, index) => {
                const day = index + 1;
                const dayEvents = eventsOnDay(day);
                const selected = selectedDay === day;
                const dayIsToday = isToday(day);
                const eventCount = dayEvents.length;

                return (
                  <button
                    className={`calendar-day${dayIsToday ? " is-today" : ""}${selected ? " is-selected" : ""}${eventCount ? " has-events" : ""}`}
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(selected ? null : day)}
                    aria-label={`${MONTHS[month]} ${day}, ${year}${dayIsToday ? ", today" : ""}${eventCount ? `, ${eventCount} event${eventCount === 1 ? "" : "s"}` : ""}`}
                    aria-pressed={selected}
                    aria-current={dayIsToday ? "date" : undefined}
                  >
                    <span className="calendar-day-number">{day}</span>
                    {eventCount > 0 && (
                      <span className="calendar-event-dots" aria-hidden="true">
                        {dayEvents.slice(0, 3).map((event) => (
                          <span
                            className="calendar-event-dot"
                            key={event.id}
                            style={{ "--event-color": eventTypeColors[event.eventType] || "#fbbf24" }}
                          />
                        ))}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <aside className="calendar-side-panel">
            {selectedDay && (
              <section className="calendar-card calendar-side-card">
                <h2 className="calendar-card-title">{MONTHS[month]} {selectedDay}</h2>
                {selectedDayEvents.length === 0 ? (
                  <p className="calendar-empty-message">No events scheduled for this day.</p>
                ) : (
                  <div className="calendar-event-list">
                    {selectedDayEvents.map((event) => (
                      <article
                        className="calendar-event-card"
                        key={event.id}
                        style={{ "--event-color": eventTypeColors[event.eventType] || "#fbbf24" }}
                      >
                        <h3>{event.title}</h3>
                        {event.location && (
                          <p><MapPin size={13} aria-hidden="true" />{event.location}</p>
                        )}
                        <span>{event.eventType || "Event"}</span>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            <section className="calendar-card calendar-side-card">
              <h2 className="calendar-card-title">Upcoming Events</h2>
              {upcomingEvents.length === 0 ? (
                <p className="calendar-empty-message">No upcoming events. Your schedule will appear here.</p>
              ) : (
                <div className="calendar-event-list">
                  {upcomingEvents.map((event) => (
                    <article
                      className="calendar-upcoming-event"
                      key={event.id}
                      style={{ "--event-color": eventTypeColors[event.eventType] || "#fbbf24" }}
                    >
                      <span className="calendar-upcoming-marker" aria-hidden="true" />
                      <div>
                        <h3>{event.title}</h3>
                        <p><CalendarIcon size={13} aria-hidden="true" />{event.date}</p>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="calendar-card calendar-side-card">
              <h2 className="calendar-card-title">Event types</h2>
              <div className="calendar-legend-list">
                {Object.entries(eventTypeColors).map(([type, color]) => (
                  <div className="calendar-legend-item" key={type}>
                    <span style={{ "--event-color": color }} aria-hidden="true" />
                    <span>{type.replace("-", " ")}</span>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  );
}
