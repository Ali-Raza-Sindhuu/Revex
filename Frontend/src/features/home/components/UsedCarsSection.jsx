import { useEffect, useRef, useState } from "react";
import { Link, createSearchParams, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  Search,
} from "lucide-react";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";
import { btn, focusRing } from "@/shared/styles";
import { apiRequest } from "@/lib/api";

const perks = ["Compare vehicle details", "Choose buy or rent", "Reserve online"];

const SearchCard = () => {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [locations, setLocations] = useState([]);
  const matchingLocations = locations.filter((location) => location.toLowerCase().includes(query.trim().toLowerCase())).slice(0, 6);

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/cars?page=1&pageSize=100&sort=newest", { signal: controller.signal })
      .then(({ items }) => setLocations([...new Set(items.map((car) => car.details?.dealer?.city).filter(Boolean))].sort()))
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const location = query.trim();
    if (!location) {
      inputRef.current?.focus();
      return;
    }
    const city = location.includes(",") ? location.split(",").at(-1).trim() : location;
    navigate({
      pathname: "/inventory",
      search: `?${createSearchParams({ condition: "used", location: city })}`,
    });
  };

  const pickRecent = (place) => {
    setQuery(place);
    inputRef.current?.focus();
  };

  return (
    <div className="rounded-2xl bg-white p-4 shadow-xl shadow-black/30 md:p-5">
      <form
        onSubmit={handleSubmit}
        role="search"
        className="flex items-stretch rounded-lg border border-[#f05a1a]/30 p-0.5 transition-colors focus-within:border-[#f05a1a]"
      >
        <label htmlFor="used-car-search" className="sr-only">
          Search used cars by city or area
        </label>
        <div className="flex min-w-0 flex-1 items-center gap-2 pl-3">
          <Search aria-hidden="true" className="size-4 shrink-0 text-neutral-500" />
          <input
            id="used-car-search"
            ref={inputRef}
            type="text"
            maxLength={120}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by city or area"
            autoComplete="off"
            className="h-10 min-w-0 flex-1 bg-transparent text-xs text-neutral-950 outline-none placeholder:text-neutral-400"
          />
        </div>
        <button
          type="submit"
          className={`rounded-md bg-[#f05a1a] px-4 text-xs font-semibold text-white transition-colors duration-300 hover:bg-[#d94e14] ${focusRing}`}
        >
          Search
        </button>
      </form>

      <p className="mt-5 text-center text-xs font-semibold text-neutral-950">{query ? "Matching locations" : "Browse available locations"}</p>
      <ul className="mt-3 flex flex-wrap justify-center gap-2">
        {matchingLocations.map((place) => (
          <li key={place}>
            <button
              type="button"
              onClick={() => pickRecent(place)}
              className={`rounded-md bg-neutral-100 px-3 py-1.5 text-[11px] text-neutral-700 transition-colors duration-300 hover:bg-neutral-200 ${focusRing}`}
            >
              {place}
            </button>
          </li>
        ))}
      </ul>

      {locations.length === 0 && <p className="mt-3 text-center text-xs text-neutral-500">Search inventory by city or area.</p>}
      {locations.length > 0 && query && matchingLocations.length === 0 && <p className="mt-3 text-center text-xs text-neutral-500">No matching locations. You can still search this area.</p>}
    </div>
  );
};

const UsedCarsSection = () => (
  <section
    id="used-cars"
    aria-labelledby="used-cars-title"
    className="bg-white px-4 py-16 md:px-12 md:py-24"
  >
    <div className="mx-auto grid max-w-[1400px] items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div>
        <SectionHeading
          id="used-cars-title"
          eyebrow="Browse by search"
          lead={["Find your next"]}
          muted={["pre-owned drive"]}
          body="Browse pre-owned listings, compare vehicle details, and narrow your search by location."
        />

        <Reveal delay={0.6}>
          <Link
            to="/inventory?condition=used"
            className={`group mt-7 ${btn.dark}`}
          >
            Browse used cars
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Reveal>

        <Reveal
          delay={0.7}
          className="mt-16 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between md:mt-24 lg:pr-16"
        >
          <ul className="flex flex-col gap-3">
            {perks.map((label) => (
              <li key={label} className="flex items-center gap-3 text-xs text-neutral-700">
                <Check strokeWidth={1.5} aria-hidden="true" className="size-4 text-[#f05a1a]" />
                {label}
              </li>
            ))}
          </ul>
          <p className="max-w-xs text-xs leading-relaxed text-neutral-500">Use the inventory filters to find vehicles that match your plans.</p>
        </Reveal>
      </div>

      <Reveal y={32} delay={0.15}>
        <div
          className="mx-auto w-full max-w-[560px] rounded-2xl bg-neutral-900 p-5 md:p-8 lg:ml-auto lg:mr-0"
        >
          <SearchCard />
        </div>
      </Reveal>
    </div>
  </section>
);

export default UsedCarsSection;
