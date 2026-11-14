export const EASE = [0.22, 1, 0.36, 1];

// Stagger container for a form: children fade/rise in one after another
// instead of popping in all at once.
export const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

export const staggerItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: EASE } },
};

// Used by SignUpPage to slide between step 1 / step 2 instead of an abrupt swap.
export const stepVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 24 : -24 }),
  center: { opacity: 1, x: 0, transition: { duration: 0.35, ease: EASE } },
  exit: (direction) => ({
    opacity: 0,
    x: direction > 0 ? -24 : 24,
    transition: { duration: 0.25, ease: EASE },
  }),
};