import { useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, ChevronRight, Play, Search, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import TalentCard from "../../components/talent/TalentCard";
import { getTalentImage, talentCategories, talentProfiles } from "../../data/talent";
import "./talent-marketplace.css";

const steps = [
  { number: "01", title: "Find your people", text: "Explore talented performers by style, location and the kind of event you're planning." },
  { number: "02", title: "Share your brief", text: "Tell your shortlisted talent about your date, venue and vision. No guesswork." },
  { number: "03", title: "Make it happen", text: "Compare responses, ask questions and choose the right fit for your event." },
];

function SearchPanel() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (event) => {
    event.preventDefault();
    const params = new URLSearchParams();
    if (search.trim()) params.set("q", search.trim());
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    navigate(`/explore${params.size ? `?${params}` : ""}`);
  };

  return (
    <form className="talent-search-panel" onSubmit={handleSearch}>
      <label className="talent-search-input">
        <Search size={19} aria-hidden="true" />
        <span className="sr-only">Talent name or keyword</span>
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search keynote speakers, hosts or event talent" />
      </label>
      <label className="talent-search-select">
        <span className="sr-only">Talent category</span>
        <select value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {talentCategories.map(({ name }) => <option key={name}>{name}</option>)}
        </select>
      </label>
      <label className="talent-search-select talent-location-select">
        <span className="sr-only">Event location</span>
        <select value={location} onChange={(event) => setLocation(event.target.value)}>
          <option value="">Any location</option>
          {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((city) => <option key={city}>{city}</option>)}
        </select>
      </label>
      <button className="talent-button talent-button-green" type="submit">Search talent <ArrowRight size={17} /></button>
    </form>
  );
}

export default function Home() {
  const featured = talentProfiles.filter((talent) => talent.featured).slice(0, 3);

  return (
    <TalentSiteShell>
      <main>
        <section className="talent-hero">
          <div className="talent-hero-glow" />
          <div className="talent-container talent-hero-layout">
            <div className="talent-hero-copy">
              <span className="talent-eyebrow"><Sparkles size={14} /> Built for tech events and beyond</span>
              <h1>Book the right <span>tech event talent.</span></h1>
              <p>Discover speakers, emcees, moderators, stream hosts and production talent for conferences, product launches, hackathons, webinars and high-impact live experiences.</p>
              <SearchPanel />
              <div className="talent-hero-proof">
                <span><Check size={15} /> Browse at your own pace</span>
                <span><Check size={15} /> Contact talent directly</span>
              </div>
            </div>
            <div className="talent-hero-visual">
              <img src={getTalentImage("photo-1516280440614-37939bbacd81", 1300)} alt="Singer performing on stage beneath warm lights" fetchPriority="high" />
              <div className="talent-hero-image-shade" />
              <div className="talent-hero-caption">
                <span className="talent-caption-dot" />
                <div><small>SET THE SCENE</small><strong>Find your event's main act.</strong></div>
                <span className="talent-caption-arrow"><ArrowUpRight size={18} /></span>
              </div>
              <span className="talent-hero-floating"><span><Play size={14} fill="currentColor" /></span> Real talent. Your kind of event.</span>
            </div>
          </div>
          <a className="talent-scroll-cue" href="#categories"><ArrowDown size={15} /> Explore the experience</a>
        </section>

        <section className="talent-category-section" id="categories">
          <div className="talent-container">
            <div className="talent-section-heading talent-section-heading-row">
              <div>                            <span className="talent-eyebrow">Plan with confidence</span><h2>Explore by tech event category</h2></div>              <Link className="talent-text-link" to="/explore">See all talent <ArrowUpRight size={16} /></Link>            </div>
            <div className="talent-category-grid">
              {talentCategories.map((category, index) => (
                <Link className={`talent-category-card ${index > 5 ? "talent-category-extra" : ""}`} key={category.name} to={`/explore?category=${encodeURIComponent(category.name)}`}>
                  <img src={getTalentImage(category.image, 500)} alt="" loading="lazy" />
                  <span className="talent-category-shade" />
                  <span className="talent-category-info"><strong>{category.name}</strong><small>{category.description}</small></span>
                  <span className="talent-category-arrow"><ChevronRight size={17} /></span>
                </Link>
              ))}
            </div>
            <Link className="talent-button talent-button-outline talent-category-mobile-more" to="/explore">Explore all categories <ArrowRight size={16} /></Link>
          </div>
        </section>

        <section className="talent-featured-section">
          <div className="talent-container">
            <div className="talent-section-heading talent-section-heading-row">
              <div><span className="talent-eyebrow">A few names to know</span><h2>Talent worth a closer look</h2><p>Demo listings to help you explore the Oma experience.</p></div>
              <Link className="talent-text-link" to="/explore">Browse all talent <ArrowUpRight size={16} /></Link>
            </div>
            <div className="talent-featured-grid">
              {featured.map((talent) => <TalentCard key={talent.id} talent={talent} />)}
            </div>
          </div>
        </section>

        <section className="talent-how-section" id="how-it-works">
          <div className="talent-container">
            <div className="talent-how-intro">
            <span className="talent-eyebrow">From first idea to final encore</span>
            <h2>Plan tech events that feel <br /><span>premium, polished and unforgettable.</span></h2>
            <p>Great events start with the right people and the right process. Oma brings discovery, planning and bookings together for conferences, launches, meetups, webinars and immersive community experiences.</p>
              <Link className="talent-button talent-button-light" to="/explore">Find your talent <ArrowRight size={16} /></Link>
            </div>
            <div className="talent-steps">
              {steps.map((step) => (
                <article className="talent-step" key={step.number}>
                  <span className="talent-step-number">{step.number}</span>
                  <div><h3>{step.title}</h3><p>{step.text}</p></div>
                  <span className="talent-step-check"><Check size={16} /></span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="talent-testimonial-section">
          <div className="talent-container talent-testimonial">
            <span className="talent-eyebrow">The feeling we're after</span>
            <blockquote>“The best part of a great event is being right there in the moment.”</blockquote>
            <p>Demo copy — replace with a verified customer story.</p>
            <span className="talent-testimonial-mark">“</span>
          </div>
        </section>

        <section className="talent-final-cta">
          <div className="talent-container talent-final-cta-inner">
            <div><span className="talent-eyebrow">Your next event starts here</span><h2>Let's find your<br />kind of magic.</h2></div>
            <div className="talent-final-cta-actions">
              <Link className="talent-button talent-button-dark" to="/explore">Explore talent <ArrowRight size={17} /></Link>
              <Link className="talent-text-link" to="/signup">I'm a performer <ArrowUpRight size={16} /></Link>
            </div>
          </div>
        </section>
      </main>
    </TalentSiteShell>
  );
}
