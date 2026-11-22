import { useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  Code2,
  Lightbulb,
  MonitorPlay,
  Play,
  Radio,
  Rocket,
  Search,
  Sparkles,
  Users,
  UsersRound,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import { getTalentImage, talentCategories } from "../../data/talent";
import "./talent-marketplace.css";
import "./oma-landing.css";

const steps = [
  { number: "01", title: "Find your people", text: "Search speakers, hosts and production specialists by category and city." },
  { number: "02", title: "Share your brief", text: "Tell your shortlist about your date, audience, format and goals." },
  { number: "03", title: "Make it happen", text: "Ask questions, confirm your fit and work directly with your chosen talent." },
];

const eventVibes = [
  { label: "Big ideas", category: "Tech Speakers", icon: Lightbulb },
  { label: "Launch day", category: "Product Launch MCs", icon: Rocket },
  { label: "Community", category: "Community Hosts", icon: UsersRound },
  { label: "Hybrid-first", category: "Hybrid Event Producers", icon: MonitorPlay },
];

const eventFormats = [
  {
    number: "01",
    title: "Conferences & summits",
    description: "Book standout keynote speakers, thoughtful moderators and confident hosts who keep sessions sharp and audiences engaged.",
    category: "Tech Speakers",
    icon: Code2,
  },
  {
    number: "02",
    title: "Product launches",
    description: "Set up a polished product reveal with a launch MC, demo host or brand voice that makes your story land.",
    category: "Product Launch MCs",
    icon: Rocket,
  },
  {
    number: "03",
    title: "Hackathons & meetups",
    description: "Bring builders together with welcoming community hosts, founder voices and facilitators who keep the energy moving.",
    category: "Community Hosts",
    icon: Users,
  },
  {
    number: "04",
    title: "Hybrid & online",
    description: "Connect the room and the remote audience with experienced producers, stream hosts and virtual facilitators.",
    category: "Hybrid Event Producers",
    icon: Radio,
  },
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
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search speakers, hosts or event talent" />
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
  const [selectedVibe, setSelectedVibe] = useState(eventVibes[0]);

  return (
    <div className="talent-home">
      <TalentSiteShell>
        <main>
          <section className="talent-hero">
            <div className="talent-hero-glow" />
            <div className="talent-container talent-hero-layout">
              <div className="talent-hero-copy">
                <span className="talent-eyebrow"><Sparkles size={14} /> The people behind the next big idea</span>
                <h1>Make your next <span>tech event</span> a moment.</h1>
                <p>From keynote speakers and moderators to launch hosts and hybrid producers, discover event specialists for conferences, product launches, hackathons and community meetups. Find people who fit your format, then connect directly to shape a memorable experience.</p>
                <SearchPanel />
                <div className="talent-hero-proof">
                  <span><Check size={15} /> Search by role and location</span>
                  <span><Check size={15} /> Connect with talent directly</span>
                </div>
              </div>
              <div className="talent-hero-visual">
                <img src={getTalentImage("photo-1540575467063-178a50c2df87", 1300)} alt="A packed technology conference audience watching the stage" fetchPriority="high" />
                <div className="talent-hero-image-shade" />
                <div className="talent-hero-image-meta"><span>OMA / LIVE</span><span>TECH · PEOPLE · PROGRESS</span></div>
                <div className="talent-hero-caption">
                  <span className="talent-caption-dot" />
                  <div><small>MAKE ROOM FOR WHAT'S NEXT</small><strong>Find the people to bring it to life.</strong></div>
                  <span className="talent-caption-arrow"><ArrowUpRight size={18} /></span>
                </div>
                <span className="talent-hero-floating"><span><Play size={14} fill="currentColor" /></span> Big ideas deserve a stage.</span>
              </div>
            </div>
            <a className="talent-scroll-cue" href="#categories"><ArrowDown size={15} /> Find your event people</a>
          </section>

          <section className="talent-vibe-section" aria-labelledby="event-vibe-title">
            <div className="talent-container talent-vibe-layout">
              <div className="talent-vibe-copy">
                <span className="talent-eyebrow"><Sparkles size={14} /> Start with the big picture</span>
                <h2 id="event-vibe-title">What are you <span>bringing to life?</span></h2>
                <p>Whether you're gathering a room of builders or launching something new, choose a starting point and we'll help narrow in on the roles your event needs.</p>
              </div>
              <div className="talent-vibe-picker">
                <div className="talent-vibe-options" role="group" aria-label="Choose your event format">
                  {eventVibes.map(({ label, category, icon: Icon }) => (
                    <button
                      className={`talent-vibe-option ${selectedVibe.label === label ? "is-selected" : ""}`}
                      key={label}
                      type="button"
                      aria-pressed={selectedVibe.label === label}
                      onClick={() => setSelectedVibe({ label, category })}
                    >
                      <Icon size={18} aria-hidden="true" />
                      <span>{label}</span>
                    </button>
                  ))}
                </div>
                <Link
                  className="talent-button talent-button-green talent-vibe-cta"
                  to={`/explore?category=${encodeURIComponent(selectedVibe.category)}`}
                  aria-live="polite"
                >
                  Find {selectedVibe.category.toLowerCase()} <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </section>

          <section className="talent-category-section" id="categories">
            <div className="talent-container">
              <div className="talent-section-heading talent-section-heading-row">
                <div>
                  <span className="talent-eyebrow">Your event, your lineup</span>
                  <h2>Talent for every part of the programme.</h2>
                  <p>Browse specialists for conferences, launches, hackathons and hybrid experiences. Each category is a faster starting point for the team you're building.</p>
                </div>
                <Link className="talent-text-link" to="/explore">Explore all talent <ArrowUpRight size={16} /></Link>
              </div>
              <div className="talent-category-grid">
                {talentCategories.filter(({ name }) => name !== "Event DJs" && name !== "Special Event Acts").map((category, index) => (
                  <Link className={`talent-category-card ${index > 5 ? "talent-category-extra" : ""}`} key={category.name} to={`/explore?category=${encodeURIComponent(category.name)}`}>
                    <img src={getTalentImage(category.image, 500)} alt="" loading="lazy" />
                    <span className="talent-category-shade" />
                    <span className="talent-category-info"><strong>{category.name}</strong><small>{category.description}</small></span>
                    <span className="talent-category-arrow"><ChevronRight size={17} /></span>
                  </Link>
                ))}
              </div>
              <Link className="talent-button talent-button-outline talent-category-mobile-more" to="/explore">Explore all talent <ArrowRight size={16} /></Link>
            </div>
          </section>

          <section className="talent-featured-section talent-format-section">
            <div className="talent-container">
              <div className="talent-section-heading">
                <span className="talent-eyebrow">Made for the moments that move tech forward</span>
                <h2>Whatever you're building, start here.</h2>
                <p>From the first speaker brief to the final stream check, find the right people for the room.</p>
              </div>
              <div className="talent-formats-grid">
                {eventFormats.map(({ number, title, description, category, icon: Icon }) => (
                  <Link className="talent-format-card" key={title} to={`/explore?category=${encodeURIComponent(category)}`}>
                    <span className="talent-format-topline"><span>{number}</span><Icon size={20} aria-hidden="true" /></span>
                    <h3>{title}</h3>
                    <p>{description}</p>
                    <span className="talent-format-link">Find your people <ArrowUpRight size={16} /></span>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          <section className="talent-approach-section">
            <div className="talent-container">
              <div className="talent-approach-heading">
                <div>
                  <span className="talent-eyebrow">The OMA difference</span>
                  <h2>Built around the way tech events happen.</h2>
                </div>
                <p>Finding event talent shouldn't become another project. Start with the experience you're creating, explore a focused set of specialists and reach out with a clear brief.</p>
              </div>
              <div className="talent-approach-grid">
                <article className="talent-approach-card">
                  <span className="talent-approach-index">01 / SPECIALISTS</span>
                  <Code2 size={21} aria-hidden="true" />
                  <h3>Made for live tech</h3>
                  <p>Explore speakers, moderators, launch hosts and production talent chosen for the pace and format of technology events.</p>
                </article>
                <article className="talent-approach-card">
                  <span className="talent-approach-index">02 / DISCOVERY</span>
                  <UsersRound size={21} aria-hidden="true" />
                  <h3>Search with context</h3>
                  <p>Browse by specialist role and city, then review profiles to compare experience, event fit and starting prices.</p>
                </article>
                <article className="talent-approach-card">
                  <span className="talent-approach-index">03 / CONNECTION</span>
                  <Radio size={21} aria-hidden="true" />
                  <h3>Go from brief to conversation</h3>
                  <p>Share your date, audience and event format up front, then connect directly with the people you want to work with.</p>
                </article>
              </div>
            </div>
          </section>

          <section className="talent-how-section" id="how-it-works">
            <div className="talent-container">
              <div className="talent-how-intro">
                <span className="talent-eyebrow">From first idea to doors open</span>
                <h2>Build the right team.<br /><span>Then make it happen.</span></h2>
                <p>Discover event talent, share the details that matter and connect directly. Your next great tech event starts with one good introduction.</p>
                <Link className="talent-button talent-button-light" to="/explore">Explore talent <ArrowRight size={16} /></Link>
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
              <span className="talent-eyebrow">For the people moving technology forward</span>
              <blockquote>“Every big idea deserves a stage built to match.”</blockquote>
              <p>Find the talent that turns your next event into a shared moment.</p>
              <span className="talent-testimonial-mark">“</span>
            </div>
          </section>

          <section className="talent-final-cta">
            <div className="talent-container talent-final-cta-inner">
              <div><span className="talent-eyebrow">Your next event starts here</span><h2>Give your big idea<br />the stage it deserves.</h2></div>
              <div className="talent-final-cta-actions">
                <Link className="talent-button talent-button-dark" to="/explore">Explore talent <ArrowRight size={17} /></Link>
                <Link className="talent-text-link" to="/signup">I'm talent <ArrowUpRight size={16} /></Link>
              </div>
            </div>
          </section>
        </main>
      </TalentSiteShell>
    </div>
  );
}
