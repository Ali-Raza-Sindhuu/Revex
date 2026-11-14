import { motion } from "framer-motion";
import ShowroomPanel from "@/features/account/components/ShowroomPanel";

const EASE = [0.22, 1, 0.36, 1];

// Asymmetric editorial split, locked to the viewport - no card, no blur,
// no scroll anywhere (page or form column). Content is sized to fit.
const AuthShell = ({ word, eyebrow, headline, title, subtitle, children, footer }) => (
  <main className="flex h-dvh flex-col overflow-hidden bg-neutral-950 lg:flex-row">
    <ShowroomPanel word={word} eyebrow={eyebrow} headline={headline} />

    <section className="flex min-h-0 flex-1 flex-col px-6 py-6 sm:px-12 sm:py-8 lg:px-16 lg:py-10">
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="hidden shrink-0 items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-white/30 uppercase lg:flex"
      >
        REVEX <span className="h-px w-8 bg-white/15" /> Driver account
      </motion.p>

      <div className="flex min-h-0 flex-1 flex-col justify-center overflow-hidden py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
          className="mx-auto w-full max-w-sm"
        >
          <p className="flex items-center gap-2 text-[10px] font-semibold tracking-[0.3em] text-[#f05a1a] uppercase">
            <span className="h-px w-5 bg-[#f05a1a]" />
            {eyebrow}
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            {title}
          </h1>
          {subtitle && <p className="mt-2 text-sm leading-relaxed text-white/45">{subtitle}</p>}
          <div className="mt-6">{children}</div>
        </motion.div>
      </div>

      {footer && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="shrink-0 pt-4 text-center text-xs text-white/40 lg:text-left"
        >
          {footer}
        </motion.p>
      )}
    </section>
  </main>
);

export default AuthShell;