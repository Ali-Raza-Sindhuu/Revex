import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CarFront, KeyRound, RefreshCw, Wallet, ClipboardCheck, Wrench, ShieldCheck, Truck } from "lucide-react";
import SectionHeading from "@/shared/SectionHeading";
import { Reveal } from "@/shared/motion";
import { focusRing } from "@/shared/styles";

const categories = ["All", "Buying", "Ownership", "Selling"];
const services = [
  { title: "Buy a car", category: "Buying", Icon: CarFront, text: "Find the car that fits your life. Compare your shortlist and arrange time behind the wheel.", enquiry: "buying" },
  { title: "Rent a car", category: "Buying", Icon: KeyRound, text: "A weekend away or a longer stay. Find a rental suited to your plans and the road ahead.", enquiry: "rental" },
  { title: "Sell or trade in", category: "Selling", Icon: RefreshCw, text: "Ready for a change? Discuss your car’s condition, its history and the next step towards a valuation.", enquiry: "selling" },
  { title: "Financing", category: "Buying", Icon: Wallet, text: "Explore payment options with the team. Understand the deposit, term and total cost before deciding.", enquiry: "financing" },
  { title: "Vehicle inspection", category: "Ownership", Icon: ClipboardCheck, text: "Look beyond the finish. Get a clearer picture of condition, documented checks and work to consider.", href: "#inspection" },
  { title: "Maintenance and service", category: "Ownership", Icon: Wrench, text: "Keep the everyday drive feeling right. Discuss routine servicing and the care your car needs next.", enquiry: "maintenance" },
  { title: "Insurance", category: "Ownership", Icon: ShieldCheck, text: "Ask about cover for the way you drive. Compare exclusions, excesses and policy details carefully.", enquiry: "insurance" },
  { title: "Home delivery", category: "Buying", Icon: Truck, text: "Plan a handover around your day. Ask about delivery coverage, timing and preparation for arrival.", enquiry: "delivery" },
];

const ServicesGrid = () => {
  const [category, setCategory] = useState("All");
  const visibleServices = services.filter((service) => category === "All" || service.category === category);
  const categoryCount = (item) => item === "All" ? services.length : services.filter((service) => service.category === item).length;

  return (
    <section aria-labelledby="services-title" className="relative overflow-hidden bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
      <div aria-hidden="true" className="pointer-events-none absolute -right-40 top-0 size-[28rem] rounded-full bg-[#f05a1a]/[0.04] blur-3xl" />
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-7 border-b border-neutral-200 pb-8 lg:grid-cols-[minmax(0,1fr)_minmax(260px,360px)] lg:items-end lg:pb-10">
          <SectionHeading id="services-title" eyebrow="Made for your next move" lead={["One destination."]} muted={["Every stage of the drive."]} />
          <div className="flex items-end justify-between gap-5 lg:pb-1">
            <p className="max-w-xs text-sm leading-relaxed text-neutral-600">From the first shortlist to your next set of keys, find the support that suits where you are today.</p>
            <span aria-hidden="true" className="hidden shrink-0 font-mono text-xs font-semibold tracking-widest text-neutral-400 sm:block">REVEX <span className="text-[#f05a1a]">/</span> 08</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label="Filter services by category" className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <button key={item} type="button" aria-pressed={category === item} aria-controls="service-grid" onClick={() => setCategory(item)} className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${focusRing} ${category === item ? "border-neutral-950 bg-neutral-950 text-white shadow-md shadow-black/10" : "border-neutral-200 bg-white text-neutral-600 hover:border-[#f05a1a]/40 hover:text-neutral-950"}`}>
              {item}<span className={`text-[10px] ${category === item ? "text-[#f05a1a]" : "text-neutral-400"}`}>{String(categoryCount(item)).padStart(2, "0")}</span>
            </button>
          ))}
          </div>
          <p role="status" aria-live="polite" className="text-xs text-neutral-500">Showing <span className="font-semibold text-neutral-900">{visibleServices.length}</span> {category === "All" ? "services" : `${category.toLowerCase()} services`}</p>
        </div>
        <div id="service-grid" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {visibleServices.map(({ title, category: serviceCategory, Icon, text, enquiry, href }, index) => (
            <Reveal key={title} y={20} delay={Math.min(index, 4) * 0.06}>
              <article className="group relative flex h-full min-h-[280px] flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#f05a1a]/40 hover:shadow-xl hover:shadow-neutral-950/[0.07]">
                <span aria-hidden="true" className="absolute right-5 top-4 font-mono text-[11px] font-medium tracking-widest text-neutral-300 transition-colors group-hover:text-[#f05a1a]/60">{String(index + 1).padStart(2, "0")}</span>
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-[#f05a1a]/[0.08] transition-colors group-hover:bg-[#f05a1a]/[0.14]"><Icon aria-hidden="true" strokeWidth={1.7} className="size-5 text-[#f05a1a]" /></span>
                  <span className="rounded-full border border-neutral-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-neutral-500">{serviceCategory}</span>
                </div>
                <h3 className="mt-7 text-lg font-bold tracking-tight text-neutral-950">{title}</h3>
                <p className="mt-2 mb-7 text-sm leading-relaxed text-neutral-600">{text}</p>
                {href ? (
                  <a href={href} className={`mt-auto inline-flex w-fit items-center gap-2 rounded text-xs font-semibold text-neutral-900 transition-colors hover:text-[#f05a1a] ${focusRing}`}>Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" /></a>
                ) : (
                  <Link to={`/contact?enquiry=${enquiry}`} className={`mt-auto inline-flex w-fit items-center gap-2 rounded text-xs font-semibold text-neutral-900 transition-colors hover:text-[#f05a1a] ${focusRing}`}>Learn more<span className="sr-only"> about {title.toLowerCase()}</span><ArrowRight aria-hidden="true" className="size-3.5 transition-transform group-hover:translate-x-1" /></Link>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
export default ServicesGrid;
