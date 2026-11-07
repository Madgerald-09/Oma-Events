import { ArrowLeft, ArrowUpRight, CalendarCheck, Check, Clock3, MapPin, Star } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import { formatNaira, getTalentImage, talentProfiles } from "../../data/talent";

export default function TalentProfile() {
  const { talentId } = useParams();
  const talent = talentProfiles.find((profile) => profile.id === talentId);

  if (!talent) {
    return (
      <TalentSiteShell>
        <main className="talent-not-found talent-container">
          <span className="talent-eyebrow">Profile not found</span>
          <h1>We couldn't find that performer.</h1>
          <Link className="talent-button talent-button-green" to="/explore"><ArrowLeft size={16} /> Back to talent</Link>
        </main>
      </TalentSiteShell>
    );
  }

  return (
    <TalentSiteShell>
      <main className="talent-profile-page">
        <div className="talent-profile-cover">
          <img src={getTalentImage(talent.cover, 1800)} alt="" />
          <div className="talent-profile-cover-shade" />
          <div className="talent-container talent-profile-cover-content">
            <Link to="/explore" className="talent-back-link"><ArrowLeft size={16} /> Back to talent</Link>
            <span className="talent-demo-pill talent-demo-pill-light">SAMPLE PROFILE</span>
          </div>
        </div>
        <div className="talent-container talent-profile-layout">
          <div className="talent-profile-main">
            <div className="talent-profile-title-row">
              <img className="talent-profile-avatar" src={getTalentImage(talent.image, 400)} alt={`${talent.name}`} />
              <div>
                <span className="talent-profile-category">{talent.category}</span>
                <h1>{talent.name}</h1>
                <p className="talent-card-location"><MapPin size={15} /> {talent.location}</p>
              </div>
            </div>
            <div className="talent-profile-rating"><Star size={16} fill="currentColor" /> {talent.rating.toFixed(1)} <span>·</span> {talent.reviews} demo reviews <span>·</span> {talent.experience} experience</div>

            <section className="talent-profile-section">
              <span className="talent-eyebrow">A little about the act</span>
              <h2>Bring your event to life with {talent.name}.</h2>
              <p>{talent.bio}</p>
            </section>

            <section className="talent-profile-section">
              <span className="talent-eyebrow">Made for moments like</span>
              <div className="talent-event-chips">{talent.events.map((event) => <span key={event}><Check size={14} /> {event}</span>)}</div>
            </section>

            <section className="talent-profile-section">
              <div className="talent-profile-section-heading"><div><span className="talent-eyebrow">A glimpse of the vibe</span><h2>On stage & in the moment</h2></div><span>Demo gallery</span></div>
              <div className="talent-profile-gallery">
                {[talent.image, talent.cover, talent.image].map((image, index) => <img key={`${image}-${index}`} src={getTalentImage(image, 720)} alt={`${talent.name} performance gallery image ${index + 1}`} loading="lazy" />)}
              </div>
              <p className="talent-demo-note">Portfolio images are placeholders for this demo experience.</p>
            </section>
          </div>

          <aside className="talent-booking-card">
            <span className="talent-eyebrow">Start a conversation</span>
            <p className="talent-booking-price">From <strong>{formatNaira(talent.price)}</strong></p>
            <p className="talent-booking-caption">Final fees depend on your event date, location and set details.</p>
            <div className="talent-booking-availability"><span className={talent.available ? "is-available" : "is-unavailable"} />{talent.available ? "Currently open to enquiries" : "Availability needs confirming"}</div>
            <Link className="talent-button talent-button-green talent-booking-cta" to={`/booking/${talent.id}`}>Request a quote <ArrowUpRight size={17} /></Link>
            <Link className="talent-button talent-button-outline talent-booking-cta" to={`/booking/${talent.id}`}><CalendarCheck size={16} /> Check availability</Link>
            <div className="talent-booking-trust"><Clock3 size={15} /> No payment required to enquire</div>
          </aside>
        </div>
      </main>
    </TalentSiteShell>
  );
}
