import { useState } from "react";
import { ArrowUpRight, Heart, MapPin, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { formatNaira, getTalentImage } from "../../data/talent";

const FAVORITES_KEY = "oma-talent-favorites";

function readFavorites() {
  try {
    const stored = JSON.parse(localStorage.getItem(FAVORITES_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    console.error("Could not read saved talent:", error);
    return [];
  }
}

export default function TalentCard({ talent, layout = "grid" }) {
  const [saved, setSaved] = useState(() => readFavorites().includes(talent.id));

  const toggleSaved = () => {
    const current = readFavorites();
    const next = saved
      ? current.filter((id) => id !== talent.id)
      : [...current, talent.id];
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    setSaved(!saved);
  };

  return (
    <article className={`talent-card ${layout === "list" ? "talent-card-list" : ""}`}>
      <div className="talent-card-image">
        <Link to={`/talent/${talent.id}`} aria-label={`View ${talent.name}'s profile`}>
          <img src={getTalentImage(talent.image, 780)} alt={`${talent.name} performing`} loading="lazy" />
        </Link>
        {talent.featured && <span className="talent-featured-badge">OMA showcase</span>}
        <button
          className={`talent-favorite ${saved ? "is-saved" : ""}`}
          type="button"
          onClick={toggleSaved}
          aria-label={saved ? `Remove ${talent.name} from saved talent` : `Save ${talent.name}`}
          aria-pressed={saved}
        >
          <Heart size={17} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="talent-card-content">
        <div className="talent-card-meta">
          <span>{talent.category}</span>
          <span className="talent-rating"><Star size={14} fill="currentColor" /> {talent.rating.toFixed(1)} <small>({talent.reviews})</small></span>
        </div>
        <Link className="talent-card-name" to={`/talent/${talent.id}`}>{talent.name}</Link>
        <p className="talent-card-location"><MapPin size={14} /> {talent.location}</p>
        <p className="talent-card-description">{talent.description}</p>
        <div className="talent-card-bottom">
          <span className="talent-card-price">From <strong>{formatNaira(talent.price)}</strong></span>
          <Link className="talent-card-action" to={`/talent/${talent.id}`} aria-label={`View ${talent.name}'s profile`}>
            <ArrowUpRight size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
