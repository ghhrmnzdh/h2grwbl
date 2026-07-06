// Shared motion primitives — one GSAP registration, one reveal observer.
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import SplitText from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }

export const EASE = 'power3.out'
export const STAMP = 'back.out(1.5)' // slight overshoot — ink meeting paper

export const reduceMQ =
  typeof matchMedia !== 'undefined'
    ? matchMedia('(prefers-reduced-motion: reduce)')
    : { matches: false, addEventListener() {} }

export function prefersReducedMotion() {
  return reduceMQ.matches
}

export const clamp = (v, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v))
export const lerp = (a, b, t) => a + (b - a) * t
export const smoothstep = (t) => t * t * (3 - 2 * t)

/** One-shot reveal observer — adds `is-in` when an element scrolls into view. */
export function createRevealObserver(cb, { threshold = 0.18, rootMargin = '0px 0px -8% 0px' } = {}) {
  if (typeof IntersectionObserver === 'undefined') {
    return { observe: (el) => { el.classList.add('is-in'); cb && cb(el) } }
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        e.target.classList.add('is-in')
        cb && cb(e.target)
        io.unobserve(e.target)
      }
    },
    { threshold, rootMargin }
  )
  return io
}
