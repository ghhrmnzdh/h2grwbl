/* ============================================================
   RICH — a printed reading of Naval's thread. Bootstrap.
   ============================================================ */
import '@fontsource-variable/fraunces/full.css'
import '@fontsource-variable/fraunces/wght-italic.css'
import '@fontsource-variable/space-grotesk/index.css'
import '@fontsource/space-mono/400.css'
import '@fontsource/space-mono/700.css'
/* Persian edition — Markazi Text (editorial display, the Fraunces analog)
   + Vazirmatn (clean sans/UI, the Space Grotesk analog). */
import '@fontsource-variable/markazi-text/index.css'
import '@fontsource-variable/vazirmatn/index.css'

import './styles/tokens.css'
import './styles/base.css'
import './styles/sections.css'

import Lenis from 'lenis'
import {
  gsap, ScrollTrigger, SplitText, EASE, STAMP,
  prefersReducedMotion, reduceMQ, createRevealObserver,
} from './lib/motion.js'
import {
  alternateLanguage,
  applyLanguage,
  currentCopy,
  currentLanguage,
  formatMoney,
  formatNumber,
  getInitialLanguage,
} from './data/i18n.js'

const root = document.documentElement
const reduced = () => prefersReducedMotion()
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches
if (reduced()) root.classList.add('reduce-motion')

/* ---------- data-driven content ---------- */
function buildLedger() {
  const { acts, principles, luckLadder, ui } = currentCopy()
  const rowCode = (n) => ui.principleCode ? ui.principleCode(n) : `N${String(n).padStart(2, '0')}`
  const ol = document.getElementById('ledgerIndex')
  if (ol) {
    ol.innerHTML = acts
      .map((act) => {
        const title = act.title.replace(/\n/g, ' ')
        const rows = principles
          .filter((p) => p.n >= act.range[0] && p.n <= act.range[1])
          .map((p) => `<li class="pr reveal"><span class="pr__n mono">${rowCode(p.n)}</span><span class="pr__t">${p.text}</span></li>`)
          .join('')
        return `<li class="pr-head reveal"><span class="pr-head__num">${act.numeral}</span><span class="pr-head__title">${title}</span><span class="pr-head__kicker mono">${act.kicker}</span></li>${rows}`
      })
      .join('')
  }
  const ladder = document.getElementById('luckLadder')
  if (ladder) {
    ladder.innerHTML = luckLadder
      .map((r) => `<li class="rung reveal"><span class="rung__n mono">${formatNumber(r.rung).padStart(2, currentLanguage() === 'fa' ? '۰' : '0')}</span><span><span class="rung__name">${r.name}</span><span class="rung__note">${r.note}</span></span></li>`)
      .join('')
  }

  document.querySelectorAll('#ledgerIndex .pr__n').forEach((el, i) => {
    el.textContent = rowCode(i + 1)
  })

  if (root.classList.contains('has-booted')) {
    document.querySelectorAll('#ledgerIndex .reveal, #luckLadder .reveal').forEach((el) => el.classList.add('is-in'))
  }
}

/* ---------- smooth scroll ---------- */
let lenis = null
let lenisTick = null
function initScroll() {
  if (reduced() || !finePointer) return
  lenis = new Lenis({ lerp: 0.11, smoothWheel: true, wheelMultiplier: 1, autoRaf: false })
  lenis.on('scroll', ScrollTrigger.update)
  lenisTick = (time) => { if (lenis) lenis.raf(time * 1000) }
  gsap.ticker.add(lenisTick)
  gsap.ticker.lagSmoothing(0)
}

/* ---------- reveals ---------- */
function initReveals() {
  const io = createRevealObserver()
  document.querySelectorAll('.reveal, .reveal-stagger, .ink-rule, .act__rule, .strike-line, .rung, .marginal')
    .forEach((el) => io.observe(el))

  const discs = [...document.querySelectorAll('.discipline')]
  if (discs.length) {
    const dio = createRevealObserver(null, { threshold: 0.6 })
    discs.forEach((d) => dio.observe(d))
  }

  const rate = document.getElementById('rateNum')
  if (rate) {
    const target = +rate.dataset.target || 0
    const rio = createRevealObserver((el) => {
      if (reduced()) { el.textContent = formatMoney(target); return }
      const o = { v: 0 }
      gsap.to(o, { v: target, duration: 1.3, ease: EASE, onUpdate: () => { el.textContent = formatMoney(Math.round(o.v)) } })
    }, { threshold: 0.8 })
    rio.observe(rate)
  }
}

/* ---------- kinetic pull-quotes ---------- */
function initSplitQuotes() {
  document.querySelectorAll('[data-splitquote]').forEach((q) => {
    if (reduced()) return
    ScrollTrigger.create({
      trigger: q, start: 'top 80%', once: true,
      onEnter: () => {
        let split
        try { split = new SplitText(q, { type: 'lines', mask: 'lines', linesClass: 'sq-line' }) }
        catch { gsap.fromTo(q, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.6, ease: STAMP }); return }
        gsap.from(split.lines, { yPercent: 108, duration: 0.7, ease: STAMP, stagger: 0.09 })
      },
    })
  })
}

/* ---------- preloader → hero ---------- */
function runIntro() {
  const pre = document.getElementById('preloader')
  const count = document.getElementById('preCount')
  const bar = document.getElementById('preBar')

  const revealHero = () => {
    const l1 = document.querySelector('.hero__l1')
    const l2 = document.querySelector('.hero__l2')
    const sub = document.querySelector('.hero__sub')
    const eyebrow = document.querySelector('.hero__eyebrow')
    const foot = document.querySelector('.hero__foot')
    if (reduced()) { gsap.set([l1, l2, sub, eyebrow, foot], { clearProps: 'all' }); return }
    const tl = gsap.timeline()
    tl.from(eyebrow, { opacity: 0, y: 12, duration: 0.5, ease: EASE })
      .from([l1, l2, sub], { yPercent: 112, duration: 0.72, ease: STAMP, stagger: 0.1 }, '-=0.2')
      .from(foot, { opacity: 0, y: 16, duration: 0.6, ease: EASE }, '-=0.3')
  }

  const finish = () => {
    if (lenis) lenis.start()
    root.classList.remove('is-locked')
    if (reduced()) { pre.classList.add('is-done'); revealHero(); ScrollTrigger.refresh(); return }
    gsap.to(pre, { opacity: 0, duration: 0.6, ease: 'power2.inOut', onComplete: () => pre.classList.add('is-done') })
    revealHero()
    ScrollTrigger.refresh()
  }

  root.classList.add('is-locked')
  if (lenis) lenis.stop()
  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()

  if (reduced()) { if (count) count.textContent = formatNumber(38); fontsReady.finally(finish); return }

  const proxy = { n: 0 }
  const tl = gsap.timeline()
  tl.to(proxy, {
    n: 38,
    duration: 1.1,
    ease: 'power1.inOut',
    onUpdate: () => {
      if (!count) return
      const lang = currentLanguage()
      count.textContent = formatNumber(Math.round(proxy.n), lang).padStart(2, lang === 'fa' ? '۰' : '0')
    },
  })
  tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1.1, ease: 'power1.inOut' }, 0)

  Promise.all([fontsReady, tl.then ? tl.then() : Promise.resolve()])
    .then(() => new Promise((r) => setTimeout(r, 100)))
    .then(finish)
}

/* ---------- visualizations (lazy) ---------- */
async function initSections() {
  const safe = async (loader, sel, label) => {
    const el = document.querySelector(sel)
    if (!el) return
    try { const mod = await loader(); mod.init(el, { reduced: reduced(), gsap, ScrollTrigger, lenis }) }
    catch (err) { console.warn(`[viz] ${label} failed:`, err) }
  }
  await Promise.all([
    safe(() => import('./sections/threeLane.js'), '[data-viz="threeLane"]', 'threeLane'),
    safe(() => import('./sections/compoundCurve.js'), '[data-viz="compound"]', 'compound'),
    safe(() => import('./sections/leverageQuadrant.js'), '[data-viz="leverage"]', 'leverage'),
    safe(() => import('./sections/wealthEquation.js'), '#equation', 'equation'),
  ])
  ScrollTrigger.refresh()
}

/* ---------- reduced-motion live change ---------- */
reduceMQ.addEventListener &&
  reduceMQ.addEventListener('change', () => {
    const isReduced = reduced()
    root.classList.toggle('reduce-motion', isReduced)
    if (isReduced && lenis) {
      if (lenisTick) { gsap.ticker.remove(lenisTick); lenisTick = null }
      lenis.destroy(); lenis = null
    } else if (!isReduced && !lenis && finePointer) {
      initScroll(); if (lenis) lenis.start() // restore smooth scroll if the user turns motion back on
    }
    ScrollTrigger.refresh()
  })

let resizeRaf
addEventListener('resize', () => { cancelAnimationFrame(resizeRaf); resizeRaf = requestAnimationFrame(() => ScrollTrigger.refresh()) }, { passive: true })

/* ---------- language switch ---------- */
function initLanguageSwitch() {
  const button = document.getElementById('languageToggle')
  const content = document.getElementById('main')
  if (!button) return

  const commit = (lang) => {
    applyLanguage(lang)
    buildLedger()
    dispatchEvent(new CustomEvent('languagechange', { detail: { lang } }))
    ScrollTrigger.refresh()
  }

  button.addEventListener('click', () => {
    if (root.classList.contains('is-language-changing')) return
    const lang = alternateLanguage()
    if (reduced() || !content) {
      commit(lang)
      return
    }

    // Subtle cross-dissolve: the page dips out, swaps edition under cover of
    // the fade (hiding the reflow), and settles back in. No curtain, no stamp.
    root.classList.add('is-language-changing')
    gsap.timeline({
      defaults: { ease: EASE },
      onComplete: () => root.classList.remove('is-language-changing'),
    })
      .to(content, { autoAlpha: 0, y: -7, duration: 0.26, ease: 'power2.in' })
      .add(() => commit(lang))
      .set(content, { y: 9 })
      .to(content, { autoAlpha: 1, y: 0, duration: 0.44 })
  })
}

/* ---------- go ---------- */
function boot() {
  applyLanguage(getInitialLanguage(), { persist: false })
  buildLedger()
  initLanguageSwitch()
  initScroll()
  initReveals()
  initSplitQuotes()
  initSections()
  runIntro()
  root.classList.add('has-booted')
}
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot)
else boot()
