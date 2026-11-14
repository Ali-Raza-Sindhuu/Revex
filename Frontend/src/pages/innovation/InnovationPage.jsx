import { ArrowRight, BadgeCheck, Search, SlidersHorizontal } from "lucide-react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/shared/PageHeader";
import CtaBanner from "@/components/shared/CtaBanner";
import { Reveal } from "@/shared/motion";

const features = [
  { icon: Search, number: "01", title: "A clearer search", body: "Search by location, make, model, year, price, and the details that help narrow a large choice into a useful shortlist." },
  { icon: BadgeCheck, number: "02", title: "Details in one place", body: "Review specifications, vehicle imagery, seller information, and availability without losing the vehicle you are considering." },
  { icon: SlidersHorizontal, number: "03", title: "A journey that adapts", body: "Save vehicles, compare options, and build a garage that is ready when you are." },
];

const InnovationPage = () => (
  <>
    <PageHeader title="Innovation, made useful" breadcrumb="Innovation" eyebrow="Thoughtful by design" description="Technology should make choosing and caring for a car feel simpler. REVEX brings the tools for your next step into one clear experience." />
    <section className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24">
      <div className="mx-auto max-w-[1400px]">
        <div className="max-w-2xl"><p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#f05a1a]">The experience</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-neutral-950 md:text-5xl">Less friction. More focus on the drive.</h2></div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {features.map(({ icon: Icon, number, title, body }, index) => (
            <Reveal key={number} y={20} delay={index * 0.08}>
              <article className="h-full rounded-2xl border border-neutral-200 bg-white p-6 md:p-8"><div className="flex items-center justify-between"><Icon className="size-6 text-[#f05a1a]" /><span className="text-xs font-medium text-neutral-400">{number}</span></div><h3 className="mt-8 text-xl font-bold tracking-tight text-neutral-950">{title}</h3><p className="mt-3 text-sm leading-relaxed text-neutral-600">{body}</p></article>
            </Reveal>
          ))}
        </div>
        <Link to="/configurator" className="mt-8 inline-flex items-center gap-2 rounded-lg bg-neutral-950 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-white hover:bg-neutral-800">Try the vehicle configurator<ArrowRight className="size-4" /></Link>
      </div>
    </section>
    <CtaBanner heading="See what moves you." text="Explore the current collection and get to know the vehicles in detail." buttonLabel="Explore inventory" href="/inventory" />
  </>
);

export default InnovationPage;
