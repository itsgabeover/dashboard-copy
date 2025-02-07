import type { Variants } from "framer-motion"

export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: { scale: [1, 1.05, 1], transition: { duration: 2, repeat: Number.POSITIVE_INFINITY } },
}

export const drawLine: Variants = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: {
    pathLength: 1,
    opacity: 1,
    transition: { duration: 2, ease: "easeInOut" },
  },
}

