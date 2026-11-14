import { ArrowUpRight, Compass, MoveRight } from "lucide-react";
import firstImage from "@/assets/about_01.png";
import secondImage from "@/assets/about_02.png";
import SectionHeading from "@/shared/SectionHeading";
import { Reveal } from "@/shared/motion";

const StorySection = () => (
  <section aria-labelledby="story-title" className="overflow-hidden bg-[#f4f3f0] px-4 py-16 md:px-12 md:py-24">
    <div className="mx-auto max-w-[1400px]">
      <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
        <SectionHeading id="story-title" eyebrow="Our story · Est. 2012" lead={["For the love"]} muted={["of the drive."]} body="Finding a car should feel like the start of something, never a maze of fine print." className="max-w-2xl" />
        <p className="hidden max-w-[230px] pb-2 text-xs leading-relaxed text-neutral-500 md:block">Thoughtful choices. Straight answers. A little more joy in every mile.</p>
      </div>

      <div className="mt-12 grid gap-4 lg:grid-cols-12 lg:grid-rows-[250px_220px]">
        <Reveal y={24} className="relative overflow-hidden rounded-[1.75rem] bg-neutral-200 lg:col-span-7 lg:row-span-2">
          <img src={firstImage} alt="A performance car outside a contemporary showroom" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 hover:scale-[1.025]" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/75 via-transparent to-neutral-950/10" />
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-5 p-6 text-white md:p-9">
            <div className="max-w-lg"><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">The REVEX point of view</p><h3 className="mt-3 text-2xl font-semibold tracking-tight md:text-4xl">Good journeys begin with good choices.</h3></div>
            <span aria-hidden="true" className="grid size-12 shrink-0 place-items-center rounded-full border border-white/40"><ArrowUpRight className="size-5" /></span>
          </div>
        </Reveal>

        <Reveal y={24} delay={0.08} className="flex min-h-[250px] flex-col justify-between rounded-[1.75rem] bg-neutral-950 p-6 text-white md:p-8 lg:col-span-5">
          <div className="flex items-start justify-between"><span className="grid size-11 place-items-center rounded-full bg-white/10"><Compass aria-hidden="true" className="size-5 text-[#f05a1a]" strokeWidth={1.5} /></span><span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45">Our promise</span></div>
          <div><h3 className="text-2xl font-semibold tracking-tight">The details make the difference.</h3><p className="mt-3 max-w-md text-sm leading-relaxed text-white/60">From a clear daily rate to a carefully prepared handover, we make the next step easier to understand and easier to enjoy.</p></div>
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80"><span>People first. Always.</span><MoveRight aria-hidden="true" className="size-4 text-[#f05a1a]" /></div>
        </Reveal>

        <Reveal y={24} delay={0.16} className="group relative min-h-[220px] overflow-hidden rounded-[1.75rem] bg-neutral-200 lg:col-span-3">
          <img src={secondImage} alt="A driver beside the open trunk of an SUV" loading="lazy" className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/70 to-transparent" />
          <p className="absolute bottom-5 left-5 text-sm font-semibold text-white">Made for the moments ahead.</p>
        </Reveal>

        <Reveal y={24} delay={0.24} className="flex min-h-[220px] flex-col justify-between rounded-[1.75rem] bg-[#f05a1a] p-6 text-white md:p-7 lg:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Since</p>
          <div><p className="text-5xl font-semibold tracking-[-0.07em]">2012</p><p className="mt-2 text-xs leading-relaxed text-white/80">A dozen years and counting, with the driver at the heart of every decision.</p></div>
        </Reveal>
      </div>
    </div>
  </section>
);

export default StorySection;
