import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import carImage from "@/assets/Hero_image.png";

const EASE = [0.22, 1, 0.36, 1];

// Editorial image panel - full-bleed photography with a duotone/gradient
// treatment (Bentley/Aston Martin style) instead of a boxed hero graphic.
const ShowroomPanel = ({ word, eyebrow, headline }) => (
  <aside className="relative h-[34vh] w-full shrink-0 overflow-hidden bg-neutral-950 lg:h-full lg:w-[56%]">
    <motion.img
      src={carImage}
      alt=""
      initial={{ scale: 1.08, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 1.3, ease: EASE }}
      className="absolute inset-0 size-full object-cover object-center"
    />

    {/* Duotone + legibility gradients - no blobs, no grid, just tone */}
    <div className="absolute inset-0 bg-neutral-950/50 mix-blend-multiply" />
    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent" />
    <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/70 via-transparent to-transparent lg:to-neutral-950/10" />
    <div className="pointer-events-none absolute -bottom-20 -left-20 size-64 rounded-full bg-[#f05a1a]/20 blur-[100px]" />

    {/* Logo */}
    <Link
      to="/"
      aria-label="REVEX home"
      className="absolute top-6 left-6 z-10 text-xs font-bold tracking-[0.35em] text-white sm:top-8 sm:left-10"
    >
      REVEX
    </Link>

    {/* Vertical placard label - the one playful detail, borrowed from museum/
        gallery-style automotive sites rather than a SaaS "HUD" widget */}
    <p
      aria-hidden="true"
      className="absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 text-[11px] font-semibold tracking-[0.5em] text-white/30 uppercase lg:block"
      style={{ writingMode: "vertical-rl" }}
    >
      {word}
    </p>

    {/* Headline, bottom-anchored, serif for contrast against the sans UI */}
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.15 }}
      className="absolute inset-x-0 bottom-0 z-10 p-6 sm:p-10 lg:p-14"
    >
      <p className="mb-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-white/55 uppercase">
        <span className="h-px w-6 bg-[#f05a1a]" />
        {eyebrow}
      </p>
      <p className="max-w-md font-serif text-3xl leading-[1.05] text-white sm:text-4xl lg:text-5xl">
        {headline}
      </p>
    </motion.div>
  </aside>
);

export default ShowroomPanel;