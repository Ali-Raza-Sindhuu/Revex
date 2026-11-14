import { ArrowUpRight, MapPin } from "lucide-react";

const address = "Mercedes-Benz Group AG, Mercedesstraße 120, 70372 Stuttgart, Germany";
const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}&output=embed`;
const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

const ContactMap = () => (
  <section aria-label="Mercedes-Benz Group headquarters location" className="mt-8 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
    <div className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[#f05a1a]/10 text-[#f05a1a]"><MapPin className="size-4" aria-hidden="true" /></span>
        <div><h3 className="text-sm font-semibold text-neutral-950">Mercedes-Benz Group headquarters</h3><p className="mt-1 text-xs leading-relaxed text-neutral-600">Mercedesstraße 120, 70372 Stuttgart, Germany</p></div>
      </div>
      <a href={directionsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex w-fit items-center gap-1 rounded-lg px-3 py-2 text-xs font-semibold text-neutral-700 transition-colors hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f05a1a]">Directions<ArrowUpRight className="size-3.5" aria-hidden="true" /></a>
    </div>
    <iframe title="Map showing Mercedes-Benz Group headquarters in Stuttgart" src={mapUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen className="h-[300px] w-full border-0 md:h-[380px]" />
  </section>
);

export default ContactMap;
