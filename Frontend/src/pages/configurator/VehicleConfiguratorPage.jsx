import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import { apiRequest } from "@/lib/api";
import { mapCar } from "@/features/inventory/data/apiCars";
import VehicleImage from "@/components/shared/VehicleImage";

const exteriorColors = [
  { name: "Obsidian", hex: "#171717" },
  { name: "Silver", hex: "#b8bcc2" },
  { name: "Arctic white", hex: "#f4f4f2" },
  { name: "Deep blue", hex: "#243b63" },
  { name: "Performance red", hex: "#a9252c" },
];
const interiors = ["Black", "Ivory", "Charcoal"];
const selectClass = "h-12 w-full appearance-none rounded-xl border border-neutral-200 bg-white px-4 text-sm text-neutral-900 shadow-sm outline-none transition focus:border-[#f05a1a] focus:ring-2 focus:ring-[#f05a1a]/15";

const VehicleConfiguratorPage = () => {
  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState("");
  const [color, setColor] = useState(exteriorColors[0]);
  const [interior, setInterior] = useState(interiors[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    apiRequest("/api/cars?page=1&pageSize=100&sort=newest", { signal: controller.signal })
      .then(({ items }) => {
        const available = items.map(mapCar);
        setCars(available);
        setCarId(available[0]?.id || "");
      })
      .catch((requestError) => { if (requestError.name !== "AbortError") setError(requestError.message); })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, []);

  const selectedCar = useMemo(() => cars.find((car) => car.id === carId), [cars, carId]);
  const reset = () => { setCarId(cars[0]?.id || ""); setColor(exteriorColors[0]); setInterior(interiors[0]); };

  return (
    <>
      <PageHeader title="Vehicle configurator" breadcrumb="Vehicle configurator" eyebrow="Make it yours" description="Choose a vehicle and preview a few finishing options before you explore its full listing." />
      <section className="bg-neutral-50 px-4 py-12 md:px-12 md:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-3xl border border-neutral-200 bg-white">
            <div className="relative grid min-h-[300px] place-items-center bg-[#f3f4f5] p-6 md:min-h-[500px] md:p-10">
              {selectedCar ? <VehicleImage src={selectedCar.image} alt={`${selectedCar.make} ${selectedCar.model}`} className="max-h-[390px] w-full object-contain transition-transform duration-500" /> : <div className="text-center text-sm text-neutral-500">{loading ? "Loading available vehicles…" : "Choose a vehicle to begin."}</div>}
              {selectedCar && <div className="absolute bottom-5 left-5 rounded-full border border-neutral-200 bg-white/90 px-3 py-1.5 text-[11px] font-medium text-neutral-700 backdrop-blur">Exterior preview · {color.name}</div>}
            </div>
            {selectedCar && <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-100 px-5 py-4 md:px-7"><div><p className="text-sm font-semibold text-neutral-950">{selectedCar.year} {selectedCar.make} {selectedCar.model}</p><p className="mt-1 text-xs text-neutral-500">{color.name} exterior · {interior} interior</p></div><p className="text-sm font-semibold text-neutral-700">{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: selectedCar.listingType === "rent" ? 2 : 0 }).format(selectedCar.price)}{selectedCar.listingType === "rent" ? " / day" : ""}</p></div>}
          </div>

          <div className="rounded-3xl border border-neutral-200 bg-white p-5 shadow-sm md:p-8">
            <div className="flex items-start justify-between gap-3"><div><p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#f05a1a]">Build your preview</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-neutral-950">Choose your details</h2></div><button type="button" onClick={reset} disabled={!cars.length} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 disabled:opacity-50"><RotateCcw className="size-3.5" />Reset</button></div>
            {error && <p role="alert" className="mt-5 rounded-xl bg-red-50 p-3 text-sm text-red-700">Unable to load vehicles: {error}</p>}
            <div className="mt-7 space-y-6">
              <div><label htmlFor="config-model" className="mb-2 block text-xs font-semibold text-neutral-700">Vehicle</label><select id="config-model" value={carId} onChange={(event) => setCarId(event.target.value)} disabled={loading || !cars.length} className={selectClass} style={{ colorScheme: "light", accentColor: "#f05a1a" }}><option value="" disabled>Select a vehicle</option>{cars.map((car) => <option key={car.id} value={car.id} style={{ backgroundColor: "#fff", color: "#171717" }}>{car.year} {car.make} {car.model}</option>)}</select></div>
              <fieldset><legend className="text-xs font-semibold text-neutral-700">Exterior color <span className="font-normal text-neutral-500">· {color.name}</span></legend><div className="mt-3 flex flex-wrap gap-3">{exteriorColors.map((option) => <button key={option.name} type="button" onClick={() => setColor(option)} aria-label={option.name} aria-pressed={color.name === option.name} title={option.name} className={`grid size-10 place-items-center rounded-full border border-neutral-200 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a] ${color.name === option.name ? "ring-2 ring-[#f05a1a] ring-offset-2" : "hover:scale-105"}`} style={{ backgroundColor: option.hex }}>{color.name === option.name && <Check className={`size-4 ${["Arctic white", "Silver"].includes(option.name) ? "text-neutral-900" : "text-white"}`} />}</button>)}</div></fieldset>
              <div><label htmlFor="config-interior" className="mb-2 block text-xs font-semibold text-neutral-700">Interior finish</label><select id="config-interior" value={interior} onChange={(event) => setInterior(event.target.value)} className={selectClass} style={{ colorScheme: "light", accentColor: "#f05a1a" }}>{interiors.map((value) => <option key={value} style={{ backgroundColor: "#fff", color: "#171717" }}>{value}</option>)}</select></div>
            </div>
            <p className="mt-6 text-[11px] leading-relaxed text-neutral-500">Color and interior choices are a preview only; confirm available options with the seller.</p>
            <div className="mt-7 grid gap-3 sm:grid-cols-2"><Link to={selectedCar ? `/inventory/${encodeURIComponent(selectedCar.id)}` : "/inventory"} className="inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-neutral-950 px-4 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-neutral-800">View vehicle<ArrowRight className="size-4" /></Link><Link to="/contact?enquiry=buying" className="inline-flex h-12 items-center justify-center rounded-xl border border-neutral-200 px-4 text-xs font-semibold uppercase tracking-wide text-neutral-800 transition hover:bg-neutral-50">Ask about this build</Link></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default VehicleConfiguratorPage;
