import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";

// Flat, sharp-edged, high-contrast - the editorial-luxury counterpart to the
// rounded glassy button from the earlier pass.
const primaryClass =
  "group inline-flex h-12 w-full items-center justify-center gap-2 bg-[#f05a1a] text-xs font-bold tracking-[0.2em] text-neutral-950 uppercase transition-colors hover:bg-white focus-visible:ring-2 focus-visible:ring-[#f05a1a]/50 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60";

const PrimaryButton = ({ children, icon: Icon = ArrowRight, loading = false, disabled, ...props }) => (
  <motion.button
    whileTap={disabled || loading ? undefined : { scale: 0.98 }}
    className={primaryClass}
    disabled={disabled || loading}
    {...props}
  >
    <span>{children}</span>
    {loading ? (
      <Loader2 className="size-4 animate-spin" aria-hidden="true" />
    ) : (
      <Icon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    )}
  </motion.button>
);

const PrimaryLink = ({ children, to }) => (
  <Link to={to} className={primaryClass}>
    <span>{children}</span>
    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
  </Link>
);

const SecondaryButton = ({ children, disabled, ...props }) => (
  <motion.button
    whileTap={disabled ? undefined : { scale: 0.98 }}
    disabled={disabled}
    className="inline-flex h-12 w-full items-center justify-center gap-2 border border-white/20 text-xs font-bold tracking-[0.2em] text-white uppercase transition hover:border-white/40 hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-white/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60"
    {...props}
  >
    {children}
  </motion.button>
);

const IconBadge = ({ icon: Icon }) => (
  <span className="mb-5 flex size-14 items-center justify-center rounded-full border border-[#f05a1a]/40 text-[#f05a1a]">
    <Icon className="size-6" />
  </span>
);

export { PrimaryButton, PrimaryLink, SecondaryButton, IconBadge };