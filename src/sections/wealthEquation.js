// The synthesis climax — Wealth = Specific Knowledge × Accountability × Leverage.
// Guided reveal lands each magnitude bar; then the sliders make the product live.
// Any factor near zero collapses the whole thing — the difference between × and +.
import { clamp } from '../lib/motion.js'

const NAMES = { k: 'Specific knowledge', a: 'Accountability', l: 'Leverage' }

export function init(root, { reduced, gsap } = {}) {
  const num = root.querySelector('#eqNum')
  const hint = root.querySelector('#eqHint')
  const readout = root.querySelector('#eqReadout')
  const barResult = root.querySelector('#barResult')
  const factors = [...root.querySelectorAll('.eq-term[data-factor]')].map((el) => ({
    key: el.dataset.factor,
    el,
    input: el.querySelector('.eq-slider'),
    bar: el.querySelector('.eq-term__bar i'),
    val: +el.querySelector('.eq-slider').value,
  }))

  const setBar = (bar, ratio) => { if (bar) bar.style.width = clamp(ratio) * 100 + '%' }

  function render(product) {
    if (num) num.textContent = Math.round(product).toLocaleString()
    setBar(barResult, product / 1000)
    const weak = factors.filter((f) => f.val < 1)
    factors.forEach((f) => f.el.classList.toggle('is-low', f.val < 1))
    readout && readout.classList.toggle('is-collapsed', weak.length > 0)
    if (hint) {
      if (weak.length) hint.textContent = `${NAMES[weak[0].key]} is near zero — and × drags the whole product down with it.`
      else if (product > 550) hint.textContent = 'Compounding on every axis. This is the whole thread in one number.'
      else if (product > 220) hint.textContent = 'Strong — but the lowest factor is where the next gain hides.'
      else hint.textContent = 'Multiply, don’t add. Raise the lowest factor first.'
    }
  }

  function compute() {
    let product = 1
    factors.forEach((f) => { f.val = +f.input.value; product *= f.val; setBar(f.bar, f.val / 10) })
    render(product)
    return product
  }

  factors.forEach((f) => f.input.addEventListener('input', compute))

  // Guided landing on first view, then hand control to the sliders
  let played = false
  const play = () => {
    if (played) return
    played = true
    if (reduced || !gsap) { compute(); return }
    const target = factors.reduce((p, f) => p * (+f.input.value), 1)
    factors.forEach((f, i) =>
      gsap.fromTo(f.bar, { width: '0%' }, { width: clamp(f.val / 10) * 100 + '%', duration: 0.7, delay: i * 0.12, ease: 'power3.out' })
    )
    const o = { v: 0 }
    gsap.to(o, {
      v: target, duration: 1.3, delay: 0.2, ease: 'power2.out',
      onUpdate: () => { if (num) num.textContent = Math.round(o.v).toLocaleString() },
      onComplete: compute,
    })
    gsap.fromTo(barResult, { width: '0%' }, { width: clamp(target / 1000) * 100 + '%', duration: 1.2, delay: 0.2, ease: 'power3.out' })
  }

  if (typeof IntersectionObserver !== 'undefined') {
    const io = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { play(); io.disconnect() } },
      { threshold: 0.25, rootMargin: '0px 0px -15% 0px' }
    )
    io.observe(root.querySelector('#eqLine') || root)
  } else { play() }

  // initialise bars without animation as a baseline (so it's correct before reveal)
  factors.forEach((f) => setBar(f.bar, f.val / 10))
  setBar(barResult, factors.reduce((p, f) => p * f.val, 1) / 1000)
}
