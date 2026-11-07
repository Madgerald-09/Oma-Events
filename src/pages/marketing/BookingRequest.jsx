import { useState } from "react";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ArrowLeft, ArrowRight, Check, CheckCircle2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import { useAuth } from "../../context/AuthContext";
import { db } from "../../firebase/firebase";
import { formatNaira, getTalentImage, talentProfiles } from "../../data/talent";

const initialForm = {
  eventType: "",
  date: "",
  startTime: "",
  duration: "",
  location: "",
  attendees: "",
  ageGroup: "",
  budget: "",
  description: "",
  requirements: "",
  customerName: "",
  email: "",
  phone: "",
};

const BOOKING_STORAGE_KEY = "oma-booking-requests";

function persistBookingRequest(request) {
  if (typeof window === "undefined") return request.reference;
  const existing = JSON.parse(window.localStorage.getItem(BOOKING_STORAGE_KEY) || "[]");
  const next = [{ ...request, createdAt: request.createdAt || new Date().toISOString(), source: "local" }, ...existing].slice(0, 25);
  window.localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(next));
  return request.reference;
}

function localDateString() {
  const date = new Date();
  const offset = date.getTimezoneOffset();
  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export default function BookingRequest() {
  const { talentId } = useParams();
  const talent = talentProfiles.find((profile) => profile.id === talentId);
  const { user, profile } = useAuth();
  const [form, setForm] = useState(() => ({
    ...initialForm,
    customerName: profile?.fullName || user?.displayName || "",
    email: user?.email || "",
  }));
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState("");

  const updateForm = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validateStep = () => {
    const nextErrors = {};
    if (step === 1) {
      if (!form.eventType) nextErrors.eventType = "Choose an event type.";
      if (!form.date) nextErrors.date = "Choose your event date.";
      else if (form.date < localDateString()) nextErrors.date = "Your event date must be today or later.";
      if (!form.startTime) nextErrors.startTime = "Add a start time.";
      if (!form.duration) nextErrors.duration = "Choose an event duration.";
      if (!form.location.trim()) nextErrors.location = "Add your event location.";
      if (!form.attendees || !Number.isInteger(Number(form.attendees)) || Number(form.attendees) < 1) nextErrors.attendees = "Enter a whole number of guests.";
      if (!form.budget) nextErrors.budget = "Choose a budget range.";
      if (form.description.trim().length < 20) nextErrors.description = "Please share at least 20 characters about your event.";
    } else if (step === 2) {
      if (form.customerName.trim().length < 2) nextErrors.customerName = "Enter your name.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
      if (form.phone.trim().length < 7) nextErrors.phone = "Enter a valid phone number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (step < 3) {
      if (validateStep()) setStep((current) => current + 1);
      return;
    }
    if (!talent) return;

    setSubmitting(true);
    setErrors({});

    const requestReference = `OMA-${Math.random().toString(36).slice(2, 9).toUpperCase()}`;
    const baseRequest = {
      customerId: user?.uid || "guest",
      customerName: form.customerName.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      talentId: talent.id,
      talentName: talent.name,
      talentCategory: talent.category,
      eventType: form.eventType,
      date: form.date,
      startTime: form.startTime,
      duration: form.duration,
      location: form.location.trim(),
      attendees: Number(form.attendees),
      ageGroup: form.ageGroup,
      budget: form.budget,
      description: form.description.trim(),
      requirements: form.requirements.trim(),
      reference: requestReference,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    try {
      if (user) {
        const requestRef = doc(collection(db, "bookingRequests"));
        const liveReference = `OMA-${requestRef.id.toUpperCase()}`;
        await setDoc(requestRef, {
          ...baseRequest,
          customerId: user.uid,
          reference: liveReference,
          createdAt: serverTimestamp(),
        });
        persistBookingRequest({
          ...baseRequest,
          customerId: user.uid,
          reference: liveReference,
        });
        setReference(liveReference);
        return;
      }

      persistBookingRequest(baseRequest);
      setReference(requestReference);
    } catch (error) {
      console.error("Could not save booking request:", error);
      const localReference = persistBookingRequest(baseRequest);
      setReference(localReference);
      setErrors({ submit: "We saved your enquiry locally and can keep it on hand while we sync your booking details." });
    } finally {
      setSubmitting(false);
    }
  };

  if (!talent) {
    return (
      <TalentSiteShell>
        <main className="talent-not-found talent-container">
          <span className="talent-eyebrow">Performer not found</span>
          <h1>We couldn't start that booking.</h1>
          <Link className="talent-button talent-button-green" to="/explore">Explore talent</Link>
        </main>
      </TalentSiteShell>
    );
  }

  return (
    <TalentSiteShell>
      <main className="talent-booking-page talent-container">
        <div className="talent-breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/explore">Explore</Link><span>/</span><Link to={`/talent/${talent.id}`}>{talent.name}</Link><span>/</span><span>Enquiry</span></div>
        {reference ? (
          <section className="talent-booking-success">
            <span className="talent-success-icon"><CheckCircle2 size={29} /></span>
            <span className="talent-eyebrow">Request received</span>
            <h1>That's the first step to something great.</h1>
            <p>Your enquiry for <strong>{talent.name}</strong> has been saved. Keep this reference for your records.</p>
            <span className="talent-booking-reference">{reference}</span>
            <div className="talent-success-actions">
              <Link className="talent-button talent-button-green" to="/my-bookings">View my enquiries <ArrowRight size={16} /></Link>
              <Link className="talent-text-link" to="/explore">Keep exploring</Link>
            </div>
          </section>
        ) : (
          <div className="talent-booking-layout">
            <section className="talent-booking-form-card">
              <Link className="talent-back-link talent-booking-back" to={`/talent/${talent.id}`}><ArrowLeft size={15} /> Back to profile</Link>
              <div className="talent-booking-heading">
                <span className="talent-eyebrow">Request a quote</span>
                <h1>Tell us about your event.</h1>
                <p>Share a few details so {talent.name} can come back with the right information.</p>
              </div>
              <div className="talent-booking-progress" aria-label={`Step ${step} of 3`}>
                {["Event details", "Your contact", "Review"].map((label, index) => (
                  <div className={index + 1 <= step ? "is-current" : ""} key={label}>
                    <span>{index + 1 < step ? <Check size={14} /> : index + 1}</span>{label}
                  </div>
                ))}
              </div>
              <form className="talent-form" onSubmit={handleSubmit} noValidate>
                {step === 1 && (
                  <div className="talent-form-grid">
                    <label className="talent-form-field">
                      <span>What are you celebrating? <b>*</b></span>
                      <select name="eventType" value={form.eventType} onChange={updateForm}>
                        <option value="">Select an event type</option>
                        {["Wedding", "Birthday", "Corporate event", "Festival", "Private party", "Family event", "Other"].map((type) => <option key={type}>{type}</option>)}
                      </select>
                      {errors.eventType && <small>{errors.eventType}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Event date <b>*</b></span>
                      <input name="date" type="date" min={localDateString()} value={form.date} onChange={updateForm} />
                      {errors.date && <small>{errors.date}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Start time <b>*</b></span>
                      <input name="startTime" type="time" value={form.startTime} onChange={updateForm} />
                      {errors.startTime && <small>{errors.startTime}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>How long do you need them? <b>*</b></span>
                      <select name="duration" value={form.duration} onChange={updateForm}>
                        <option value="">Choose a duration</option>
                        {["Under 1 hour", "1–2 hours", "2–4 hours", "More than 4 hours"].map((duration) => <option key={duration}>{duration}</option>)}
                      </select>
                      {errors.duration && <small>{errors.duration}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Event location <b>*</b></span>
                      <input name="location" value={form.location} onChange={updateForm} placeholder="City, venue or area" maxLength={140} />
                      {errors.location && <small>{errors.location}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Expected guests <b>*</b></span>
                      <input name="attendees" type="number" min="1" max="100000" step="1" value={form.attendees} onChange={updateForm} placeholder="e.g. 120" />
                      {errors.attendees && <small>{errors.attendees}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Budget range <b>*</b></span>
                      <select name="budget" value={form.budget} onChange={updateForm}>
                        <option value="">Choose a range</option>
                        {["Under ₦250,000", "₦250,000–₦500,000", "₦500,000–₦1,000,000", "₦1,000,000+", "Let's discuss"].map((budget) => <option key={budget}>{budget}</option>)}
                      </select>
                      {errors.budget && <small>{errors.budget}</small>}
                    </label>
                    <label className="talent-form-field">
                      <span>Age group <small>(optional)</small></span>
                      <select name="ageGroup" value={form.ageGroup} onChange={updateForm}>
                        <option value="">Not applicable / mixed ages</option>
                        {["Children", "Teens", "Adults", "All ages"].map((age) => <option key={age}>{age}</option>)}
                      </select>
                    </label>
                    <label className="talent-form-field talent-form-field-wide">
                      <span>Tell us about your event <b>*</b></span>
                      <textarea name="description" rows="4" maxLength={1200} value={form.description} onChange={updateForm} placeholder="The vibe, schedule or anything that would help shape the performance…" />
                      <div className="talent-form-hint">{errors.description || `${form.description.length}/1200 characters`}</div>
                    </label>
                    <label className="talent-form-field talent-form-field-wide">
                      <span>Special requests <small>(optional)</small></span>
                      <textarea name="requirements" rows="3" maxLength={800} value={form.requirements} onChange={updateForm} placeholder="Equipment, access, set-up or other details…" />
                    </label>
                  </div>
                )}
                {step === 2 && (
                  <div className="talent-form-grid">
                    <label className="talent-form-field talent-form-field-wide">
                      <span>Your name <b>*</b></span>
                      <input name="customerName" autoComplete="name" maxLength={100} value={form.customerName} onChange={updateForm} placeholder="Full name" />
                      {errors.customerName && <small>{errors.customerName}</small>}
                    </label>
                    <label className="talent-form-field talent-form-field-wide">
                      <span>Email address <b>*</b></span>
                      <input name="email" type="email" autoComplete="email" maxLength={254} value={form.email} onChange={updateForm} placeholder="you@example.com" />
                      {errors.email && <small>{errors.email}</small>}
                    </label>
                    <label className="talent-form-field talent-form-field-wide">
                      <span>Phone number <b>*</b></span>
                      <input name="phone" type="tel" autoComplete="tel" maxLength={32} value={form.phone} onChange={updateForm} placeholder="+234 800 000 0000" />
                      {errors.phone && <small>{errors.phone}</small>}
                    </label>
                    <p className="talent-form-privacy">Your contact details are only shared to help coordinate this enquiry.</p>
                  </div>
                )}
                {step === 3 && (
                  <div className="talent-review-summary">
                    <div><h2>Event details</h2><button type="button" onClick={() => setStep(1)}>Edit</button></div>
                    <dl>
                      <dt>Event</dt><dd>{form.eventType} · {form.date} at {form.startTime}</dd>
                      <dt>Duration & guests</dt><dd>{form.duration} · {form.attendees} guests</dd>
                      <dt>Location</dt><dd>{form.location}</dd>
                      <dt>Budget</dt><dd>{form.budget}</dd>
                      <dt>Your brief</dt><dd>{form.description}</dd>
                      {form.requirements && <><dt>Special requests</dt><dd>{form.requirements}</dd></>}
                    </dl>
                    <div><h2>Contact</h2><button type="button" onClick={() => setStep(2)}>Edit</button></div>
                    <p>{form.customerName} · {form.email} · {form.phone}</p>
                    <p className="talent-form-privacy">Demo profile: this request will be saved to your Oma account. Talent notifications are not configured in this phase.</p>
                  </div>
                )}
                {errors.submit && <p className="talent-form-error" role="alert">{errors.submit}</p>}
                <div className="talent-form-actions">
                  {step > 1 && <button className="talent-button talent-button-outline" type="button" onClick={() => { setStep((current) => current - 1); setErrors({}); }}><ArrowLeft size={16} /> Back</button>}
                  <button className="talent-button talent-button-green" type="submit" disabled={submitting}>
                    {submitting ? "Sending request…" : step === 3 ? "Send booking request" : "Continue"} {!submitting && <ArrowRight size={16} />}
                  </button>
                </div>
              </form>
            </section>
            <aside className="talent-request-summary">
              <img src={getTalentImage(talent.image, 700)} alt={`${talent.name} performing`} />
              <div><span className="talent-eyebrow">{talent.category}</span><h2>{talent.name}</h2><p>{talent.location}</p></div>
              <div className="talent-request-starting-price"><span>Starting from</span><strong>{formatNaira(talent.price)}</strong></div>
              <p className="talent-demo-note">Sample performer profile and indicative price. No payment is taken when you enquire.</p>
            </aside>
          </div>
        )}
      </main>
    </TalentSiteShell>
  );
}
