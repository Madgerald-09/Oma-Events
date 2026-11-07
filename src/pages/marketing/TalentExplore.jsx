import { useMemo, useState } from "react";
import { LayoutGrid, List, Search, SlidersHorizontal, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import TalentCard from "../../components/talent/TalentCard";
import TalentSiteShell from "../../components/talent/TalentSiteShell";
import { talentCategories, talentProfiles } from "../../data/talent";

export default function TalentExplore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [eventType, setEventType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [sort, setSort] = useState("popular");
  const [layout, setLayout] = useState("grid");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const filteredTalent = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const results = talentProfiles.filter((talent) => {
      const matchesQuery = !normalizedQuery || `${talent.name} ${talent.category} ${talent.description}`.toLowerCase().includes(normalizedQuery);
      const matchesCategory = !category || talent.category === category;
      const matchesLocation = !location || talent.location.toLowerCase().includes(location.toLowerCase());
      const matchesEvent = !eventType || talent.events.includes(eventType);
      const matchesPrice = !maxPrice || talent.price <= Number(maxPrice);
      const matchesAvailability = !availableOnly || talent.available;
      return matchesQuery && matchesCategory && matchesLocation && matchesEvent && matchesPrice && matchesAvailability;
    });

    return results.sort((first, second) => {
      if (sort === "price-low") return first.price - second.price;
      if (sort === "price-high") return second.price - first.price;
      if (sort === "newest") return second.id.localeCompare(first.id);
      return second.rating - first.rating || second.reviews - first.reviews;
    });
  }, [availableOnly, category, eventType, location, maxPrice, query, sort]);

  const clearFilters = () => {
    setQuery("");
    setCategory("");
    setLocation("");
    setEventType("");
    setMaxPrice("");
    setAvailableOnly(false);
    setSearchParams({});
  };

  const syncSearch = (event) => {
    event.preventDefault();
    const next = new URLSearchParams();
    if (query.trim()) next.set("q", query.trim());
    if (category) next.set("category", category);
    if (location) next.set("location", location);
    setSearchParams(next);
  };

  const filters = (
    <div className="talent-filters">
      <div className="talent-filter-heading">
        <h2>Filters</h2>
        <button type="button" className="talent-clear-button" onClick={clearFilters}>Clear all</button>
      </div>
      <label className="talent-filter-label" htmlFor="filter-category">Category</label>
      <select id="filter-category" className="talent-filter-control" value={category} onChange={(event) => setCategory(event.target.value)}>
        <option value="">All categories</option>
        {talentCategories.map(({ name }) => <option key={name}>{name}</option>)}
      </select>

      <label className="talent-filter-label" htmlFor="filter-location">Location</label>
      <select id="filter-location" className="talent-filter-control" value={location} onChange={(event) => setLocation(event.target.value)}>
        <option value="">Any location</option>
        {["Lagos", "Abuja", "Port Harcourt", "Ibadan"].map((city) => <option key={city}>{city}</option>)}
      </select>

      <label className="talent-filter-label" htmlFor="filter-event">Event type</label>
      <select id="filter-event" className="talent-filter-control" value={eventType} onChange={(event) => setEventType(event.target.value)}>
        <option value="">Any event</option>
        {["Weddings", "Private parties", "Corporate", "Festivals", "Children's events"].map((type) => <option key={type}>{type}</option>)}
      </select>

      <label className="talent-filter-label" htmlFor="filter-price">Maximum starting price</label>
      <select id="filter-price" className="talent-filter-control" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
        <option value="">Any price</option>
        <option value="250000">Up to ₦250,000</option>
        <option value="500000">Up to ₦500,000</option>
        <option value="1000000">Up to ₦1,000,000</option>
        <option value="2000000">Up to ₦2,000,000</option>
      </select>

      <label className="talent-availability-toggle">
        <input type="checkbox" checked={availableOnly} onChange={(event) => setAvailableOnly(event.target.checked)} />
        <span>Show currently available talent</span>
      </label>
      <p className="talent-demo-note">Availability and listings are sample demo data.</p>
    </div>
  );

  return (
    <TalentSiteShell>
      <main className="talent-explore-page">
        <div className="talent-container">
          <div className="talent-breadcrumb"><Link to="/">Home</Link><span>/</span><span>Explore talent</span></div>
          <div className="talent-explore-heading">
            <div><span className="talent-eyebrow">Good things happen together</span><h1>Find your kind of talent.</h1><p>Explore sample performer profiles. Search by name, location or the event you have in mind.</p></div>
            <span className="talent-demo-pill">DEMO LISTINGS</span>
          </div>

          <form className="talent-explore-search" onSubmit={syncSearch}>
            <Search size={19} />
            <label className="sr-only" htmlFor="talent-query">Search performers</label>
            <input id="talent-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search talent, styles or categories" />
            <button type="submit" className="talent-button talent-button-green">Search</button>
          </form>

          <div className="talent-explore-controls">
            <button className="talent-button talent-button-outline talent-mobile-filter" type="button" onClick={() => setFiltersOpen(true)}><SlidersHorizontal size={16} /> Filters</button>
            <span className="talent-results-count"><strong>{filteredTalent.length}</strong> sample {filteredTalent.length === 1 ? "performer" : "performers"}</span>
            <div className="talent-explore-sort">
              <label htmlFor="talent-sort">Sort by</label>
              <select id="talent-sort" value={sort} onChange={(event) => setSort(event.target.value)}>
                <option value="popular">Popularity</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
              </select>
              <span className="talent-view-toggle" aria-label="View mode">
                <button className={layout === "grid" ? "active" : ""} type="button" aria-label="Grid view" aria-pressed={layout === "grid"} onClick={() => setLayout("grid")}><LayoutGrid size={17} /></button>
                <button className={layout === "list" ? "active" : ""} type="button" aria-label="List view" aria-pressed={layout === "list"} onClick={() => setLayout("list")}><List size={17} /></button>
              </span>
            </div>
          </div>

          <div className="talent-explore-layout">
            <aside className="talent-filter-sidebar">{filters}</aside>
            <section className={`talent-results ${layout === "list" ? "talent-results-list" : ""}`} aria-live="polite">
              {filteredTalent.length ? filteredTalent.map((talent) => <TalentCard key={talent.id} talent={talent} layout={layout} />) : (
                <div className="talent-empty-state">
                  <span><Search size={22} /></span>
                  <h2>No talent found just yet</h2>
                  <p>Try a different search or remove a few filters to see more profiles.</p>
                  <button className="talent-button talent-button-outline" type="button" onClick={clearFilters}>Clear filters</button>
                </div>
              )}
            </section>
          </div>
        </div>
        {filtersOpen && (
          <div className="talent-filter-backdrop" role="presentation" onClick={() => setFiltersOpen(false)}>
            <section className="talent-filter-drawer" role="dialog" aria-modal="true" aria-label="Talent filters" onClick={(event) => event.stopPropagation()}>
              <button type="button" className="talent-filter-close" aria-label="Close filters" onClick={() => setFiltersOpen(false)}><X size={20} /></button>
              {filters}
              <button type="button" className="talent-button talent-button-green talent-apply-filters" onClick={() => setFiltersOpen(false)}>Show {filteredTalent.length} results</button>
            </section>
          </div>
        )}
      </main>
    </TalentSiteShell>
  );
}
