// ACT II viz — the compounding curve, printed. A straight line of linear effort
// stays low while (1+r)^n bends into a crimson hockey stick. Scrub it: the last
// decade dwarfs the first.
import { clamp, smoothstep } from '../lib/motion.js'
import { formatNumber, getVisualCopy, isPersian } from '../data/i18n.js'

const N = 40
const R = 0.15
const INK = 'rgba(32,21,14,'
const CRIMSON = '#d62828'

export function init(root, { reduced, ScrollTrigger } = {}) {
  const canvas = root.querySelector('#curveCanvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let dpr = Math.min(2, window.devicePixelRatio || 1)
  let W = 0, H = 0, padL = 0, padR = 0, padT = 0, padB = 0
  const maxVal = Math.pow(1 + R, N)

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1)
    const r = canvas.getBoundingClientRect()
    W = r.width; H = r.height
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    padL = Math.max(54, W * 0.09); padR = Math.max(28, W * 0.06)
    padT = Math.max(40, H * 0.12); padB = Math.max(46, H * 0.14)
  }

  const X = (n) => padL + (n / N) * (W - padL - padR)
  const Y = (v) => H - padB - (v / maxVal) * (H - padT - padB)
  const fontSans = () => isPersian() ? "'Vazirmatn', 'Noto Sans Arabic', Tahoma, sans-serif" : "'Space Mono', monospace"
  const fontDisplay = () => isPersian() ? "'Vazirmatn', 'Noto Naskh Arabic', Tahoma, sans-serif" : "'Fraunces Variable', Georgia, serif"

  function draw(p) {
    const strings = getVisualCopy().compound
    const rtl = isPersian()
    ctx.clearRect(0, 0, W, H)
    const n = p * N

    // axes
    ctx.strokeStyle = INK + '0.55)'; ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(padL, padT - 6); ctx.lineTo(padL, H - padB); ctx.lineTo(W - padR, H - padB); ctx.stroke()

    ctx.direction = rtl ? 'rtl' : 'ltr'
    ctx.font = `700 11px ${fontSans()}`
    ctx.fillStyle = INK + '0.5)'; ctx.textAlign = 'center'; ctx.textBaseline = 'top'
    for (const yr of [0, 10, 20, 30, 40]) ctx.fillText(yr === 0 ? formatNumber(0) : `${formatNumber(yr)}${rtl ? ' ' : ''}${strings.yearSuffix}`, X(yr), H - padB + 8)
    ctx.save(); ctx.translate(padL - 36, padT + (H - padT - padB) / 2); ctx.rotate(-Math.PI / 2)
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(strings.outcome, 0, 0); ctx.restore()

    // linear "effort" reference
    ctx.strokeStyle = INK + '0.34)'; ctx.setLineDash([4, 5]); ctx.lineWidth = 1.5
    ctx.beginPath(); ctx.moveTo(X(0), Y(0)); ctx.lineTo(X(N), Y(N)); ctx.stroke()
    ctx.setLineDash([])
    ctx.direction = rtl ? 'rtl' : 'ltr'
    ctx.textAlign = rtl ? 'right' : 'left'; ctx.fillStyle = INK + '0.5)'
    ctx.fillText(strings.linear, rtl ? X(N) : X(N) - 96, Y(N) - 16)

    // compound curve, drawn to progress
    ctx.strokeStyle = CRIMSON; ctx.lineWidth = 3
    ctx.lineJoin = 'round'
    ctx.beginPath()
    const steps = 120
    for (let i = 0; i <= steps; i++) {
      const nn = (i / steps) * n
      const px = X(nn), py = Y(Math.pow(1 + R, nn))
      i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py)
    }
    ctx.stroke()

    // halftone-ish crimson area under the curve
    ctx.lineTo(X(n), Y(0)); ctx.lineTo(X(0), Y(0)); ctx.closePath()
    const grad = ctx.createLinearGradient(0, padT, 0, H - padB)
    grad.addColorStop(0, 'rgba(214,40,40,0.22)'); grad.addColorStop(1, 'rgba(214,40,40,0)')
    ctx.fillStyle = grad; ctx.fill()

    // divergence annotation (Fraunces italic) — set large, in the open area above the low curve
    const av = smoothstep(clamp((p - 0.38) / 0.22))
    if (av > 0.01) {
      const fs = Math.min(38, Math.max(20, W * 0.036))
      ctx.font = `${rtl ? '500' : 'italic 500'} ${fs}px ${fontDisplay()}`
      ctx.fillStyle = `rgba(32,21,14,${0.9 * av})`
      ctx.direction = rtl ? 'rtl' : 'ltr'
      ctx.textAlign = rtl ? 'right' : 'left'; ctx.textBaseline = 'alphabetic'
      const ax = rtl ? X(17) : X(3.5), ay = padT + (H - padT - padB) * 0.3
      ctx.fillText(strings.line1, ax, ay)
      ctx.fillText(strings.line2, ax, ay + fs * 1.05)
    }

    // riding dot + live multiple readout
    if (n > 0.2) {
      const v = Math.pow(1 + R, n)
      const dx = X(n), dy = Y(v)
      ctx.fillStyle = CRIMSON; ctx.beginPath(); ctx.arc(dx, dy, 6, 0, Math.PI * 2); ctx.fill()
      ctx.fillStyle = '#f1e6d0'; ctx.beginPath(); ctx.arc(dx, dy, 2.4, 0, Math.PI * 2); ctx.fill()
      ctx.direction = rtl ? 'rtl' : 'ltr'
      ctx.font = `700 22px ${fontSans()}`
      ctx.fillStyle = '#20150e'; ctx.textAlign = dx > W * 0.7 ? 'right' : 'left'
      const tx = dx > W * 0.7 ? dx - 15 : dx + 15
      ctx.fillText('×' + formatNumber(Number(v.toFixed(v < 10 ? 1 : 0))), tx, dy - 12)
      ctx.font = `700 11px ${fontSans()}`; ctx.fillStyle = INK + '0.6)'
      ctx.fillText(`${strings.year} ${formatNumber(Math.round(n))}`, tx, dy + 7)
    }
  }

  resize()
  let current = 0
  window.addEventListener('resize', () => { resize(); draw(current) }, { passive: true })
  window.addEventListener('languagechange', () => { resize(); draw(current) })

  if (reduced) { current = 1; draw(1); (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => draw(current)); return }
  draw(0)
  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => { current = self.progress; draw(current) },
      onRefresh: () => draw(current),
    })
  }
}
