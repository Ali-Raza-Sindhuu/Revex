import { ArrowRight, Compass } from "lucide-react";
import { Link } from "react-router-dom";
import firstImage from "@/assets/about_01.png";
import secondImage from "@/assets/about_02.png";
import { Reveal } from "@/shared/motion";
import SectionHeading from "@/shared/SectionHeading";

const AboutSection = () => (
  <section
    id="about"
    aria-labelledby="about-title"
    className="bg-neutral-50 px-4 py-16 md:px-12 md:py-24"
  >
    <div className="mx-auto max-w-[1400px]">
      <SectionHeading
        id="about-title"
        align="center"
        eyebrow="About Revex"
        lead={["Your next move,"]}
        muted={["made simpler."]}
        body="Explore vehicles to buy or rent, compare the details that matter, and choose a next step that fits your plans."
        className="max-w-2xl"
      />

      {/* Bento grid */}
      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-[1fr_auto]">
        <Reveal
          y={32}
          className="min-h-[240px] overflow-hidden rounded-2xl lg:min-h-[300px]"
        >
          <img
            src={firstImage}
            loading="lazy"
            alt="Grey sports car parked outside a modern building"
            className="size-full object-cover"
          />
        </Reveal>

        <Reveal
          y={32}
          delay={0.1}
          className="flex min-h-[360px] flex-col justify-between rounded-2xl bg-neutral-900 p-6 text-white lg:row-span-2"
        >
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#f05a1a]">The REVEX approach</p>
            <h3 className="mt-3 text-2xl font-bold tracking-tight">Built around your next move.</h3>
          </div>

          <div className="flex items-center justify-between border-y border-white/10 py-4 text-[10px] font-semibold uppercase tracking-widest text-white/60">
            <span>Discover</span><span aria-hidden="true" className="text-[#f05a1a]">/</span><span>Compare</span><span aria-hidden="true" className="text-[#f05a1a]">/</span><span>Go</span>
          </div>

          <div>
            <p className="text-sm leading-relaxed text-white/65">A clear place to browse vehicles, learn about your options, and get in touch when you’re ready.</p>
            <Link to="/services" className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-white transition-colors hover:text-[#f05a1a]">Explore our services<ArrowRight aria-hidden="true" className="size-3.5" /></Link>
          </div>
        </Reveal>

        <Reveal
          y={32}
          delay={0.2}
          className="relative min-h-[360px] overflow-hidden rounded-2xl md:col-span-2 lg:col-span-1 lg:row-span-2"
        >
          <img
            src={secondImage}
            loading="lazy"
            alt="Driver at the open trunk of an SUV"
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent" />
          <p className="absolute bottom-6 left-6 max-w-[180px] text-xl font-bold leading-snug tracking-tight text-white">
            Take the road that feels like yours.
          </p>
        </Reveal>

        <Reveal y={32} delay={0.3} className="flex min-h-[160px] flex-col justify-between rounded-2xl bg-[#f05a1a] p-6 text-white">
          <div className="flex items-center justify-between gap-4">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/75">Your next move starts here</p><p className="mt-2 text-xl font-bold tracking-tight">Find the drive that fits.</p></div>
            <Compass aria-hidden="true" className="size-9 shrink-0 text-white/75" strokeWidth={1.4} />
          </div>
          <Link to="/inventory" className="mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold hover:underline">Explore inventory<ArrowRight aria-hidden="true" className="size-4" /></Link>
        </Reveal>
      </div>
    </div>
  </section>
);

export default AboutSection;
