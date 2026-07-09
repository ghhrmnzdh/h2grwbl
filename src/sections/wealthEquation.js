// The synthesis climax — Wealth = Specific Knowledge × Accountability × Leverage.
// Guided reveal lands each magnitude bar; then the sliders make the product live.
// Any factor near zero collapses the whole thing — the difference between × and +.
import { clamp } from '../lib/motion.js'
import { formatNumber, getEquationCopy } from '../data/i18n.js'

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
    const copy = getEquationCopy()
    if (num) num.textContent = formatNumber(Math.round(product))
    setBar(barResult, product / 1000)
    const weak = factors.filter((f) => f.val < 1)
    factors.forEach((f) => f.el.classList.toggle('is-low', f.val < 1))
    readout && readout.classList.toggle('is-collapsed', weak.length > 0)
    if (hint) {
      if (weak.length) hint.textContent = copy.weak(copy.names[weak[0].key])
      else if (product > 550) hint.textContent = copy.high
      else if (product > 220) hint.textContent = copy.medium
      else hint.textContent = copy.low
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
      onUpdate: () => { if (num) num.textContent = formatNumber(Math.round(o.v)) },
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

  window.addEventListener('languagechange', compute)
}
