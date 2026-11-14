import { ArrowDownRight, ArrowUpRight, MoveRight } from "lucide-react";
import SectionHeading from "@/shared/SectionHeading";
import { Reveal } from "@/shared/motion";

const milestones = [
  ["2012", "The first keys", "One showroom, one promise: honest cars and clear prices."],
  ["2015", "Care you can see", "Certified pre-owned vehicles with documented inspections."],
  ["2018", "A wider road", "Our second location opens and the online collection takes shape."],
  ["2021", "Your way to go", "Rentals join the collection, with a simpler path from browse to drive."],
  ["2024", "Built on trust", "A growing community of returning drivers and recommendations."],
  ["2026", "The next chapter", "A new airport location and more electric vehicles in the line-up."],
];

const JourneySection = () => (
  <section aria-labelledby="journey-title" className="bg-white px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading id="journey-title" eyebrow="The road so far" lead={["Every mile"]} muted={["moves us forward."]} body="A few markers along the way. The best part is still ahead." className="max-w-2xl" />
        <div className="flex items-center gap-3 pb-2 text-xs font-semibold text-neutral-500"><span className="grid size-9 place-items-center rounded-full bg-[#f4f3f0]"><ArrowDownRight aria-hidden="true" className="size-4 text-[#f05a1a] md:hidden" /><ArrowUpRight aria-hidden="true" className="hidden size-4 text-[#f05a1a] md:block" /></span><span>Scroll through our milestones</span></div>
      </div>

      <ol className="relative mt-12 grid gap-3 before:absolute before:left-5 before:top-5 before:hidden before:h-px before:w-[calc(100%-2.5rem)] before:bg-neutral-200 before:content-[''] lg:grid-cols-3 lg:before:block sm:grid-cols-2">
        {milestones.map(([year, title, description], index) => (
          <Reveal key={year} as="li" y={20} delay={(index % 3) * 0.06} className="group relative min-h-[220px] rounded-[1.5rem] border border-neutral-200 bg-[#faf9f7] p-6 transition duration-300 hover:-translate-y-1 hover:border-neutral-300 hover:bg-white hover:shadow-xl hover:shadow-neutral-900/5 md:p-7">
            <div className="relative z-10 flex items-center justify-between">
              <span className={`grid size-10 place-items-center rounded-full border-4 border-white text-[9px] font-bold ${index === milestones.length - 1 ? "bg-[#f05a1a] text-white" : "bg-neutral-900 text-white"}`}>{String(index + 1).padStart(2, "0")}</span>
              <span className="rounded-full bg-white px-3 py-1.5 text-[11px] font-bold tracking-wide text-[#f05a1a] shadow-sm">{year}</span>
            </div>
            <div className="mt-8"><h3 className="text-xl font-semibold tracking-tight text-neutral-950">{title}</h3><p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-600">{description}</p></div>
            <MoveRight aria-hidden="true" className="absolute bottom-6 right-6 size-4 text-neutral-300 transition group-hover:translate-x-1 group-hover:text-[#f05a1a]" />
          </Reveal>
        ))}
      </ol>
    </div>
  </section>
);

export default JourneySection;
