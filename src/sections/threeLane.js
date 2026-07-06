// ACT I viz — the distinction, told as three live meters that contrast on their own:
//   WEALTH  — an asset keeps banking; the total climbs even while you're idle.  (crimson, rising)
//   MONEY   — a reservoir that drains unless you keep feeding it; it never compounds. (ink, draining)
//   STATUS  — a zero-sum see-saw: for one to rise, another must fall. Net stays 0.
import { clamp, smoothstep, prefersReducedMotion } from '../lib/motion.js'

const INK = '32,21,14'
const CRIMSON = '214,40,40'
const CRIMSON_D = '165,29,33'
const PAPER = '#f1e6d0'

export function init(root, { reduced, ScrollTrigger } = {}) {
  const canvas = root.querySelector('#threeLaneCanvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  let dpr = Math.min(2, window.devicePixelRatio || 1)
  let W = 0, H = 0

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1)
    const r = canvas.getBoundingClientRect()
    W = r.width; H = r.height
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()
  const repaint = () => { resize(); if (reduced || prefersReducedMotion()) drawScene() }
  window.addEventListener('resize', repaint, { passive: true })

  const st = { activity: 0, lastY: window.scrollY, t: 0, wealth: 0, fill: 0, money: 940, drips: [], banks: [] }

  const fmt = (n) => Math.floor(n).toLocaleString()

  function label(text, x, y, color, size = 13, w = 700) {
    ctx.font = `${w} ${size}px 'Space Mono', monospace`; ctx.fillStyle = color
    ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(text, x, y)
  }
  function bigNumber(xRight, y, big, sub, color) {
    ctx.textAlign = 'right'; ctx.textBaseline = 'alphabetic'
    ctx.font = `600 ${Math.round(Math.min(56, Math.max(30, W * 0.075)))}px 'Fraunces Variable', Georgia, serif`
    ctx.fillStyle = color; ctx.fillText(big, xRight, y)
    ctx.font = "700 10.5px 'Space Mono', monospace"; ctx.fillStyle = `rgba(${INK},0.6)`
    ctx.fillText(sub, xRight, y + 20)
  }
  function coin(x, y, r) {
    ctx.fillStyle = `rgba(${CRIMSON},1)`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill()
    ctx.fillStyle = PAPER; ctx.beginPath(); ctx.arc(x, y, r * 0.38, 0, Math.PI * 2); ctx.fill()
  }

  function drawScene() {
    ctx.clearRect(0, 0, W, H)
    const laneH = H / 3
    const padX = Math.max(24, W * 0.06)
    const barW = W - padX * 2
    const xR = W - padX

    ctx.strokeStyle = `rgba(${INK},0.2)`; ctx.lineWidth = 1
    for (let i = 1; i < 3; i++) { ctx.beginPath(); ctx.moveTo(padX * 0.6, i * laneH); ctx.lineTo(W - padX * 0.6, i * laneH); ctx.stroke() }

    /* ---------- WEALTH ---------- */
    {
      const y0 = 0, cy = laneH * 0.5
      label('WEALTH', padX, y0 + laneH * 0.2, `rgba(${CRIMSON_D},1)`, 14)
      label('AN ASSET · EARNS WHILE YOU SLEEP', padX, y0 + laneH * 0.2 + 20, `rgba(${INK},0.55)`, 10.5)
      bigNumber(xR, cy + laneH * 0.05, fmt(st.wealth), '▲ BANKED WHILE IDLE', `rgba(${CRIMSON},1)`)
      const barY = cy + laneH * 0.24, barH = 16
      ctx.strokeStyle = `rgba(${INK},0.85)`; ctx.lineWidth = 2; ctx.strokeRect(padX, barY, barW, barH)
      ctx.fillStyle = `rgba(${CRIMSON},1)`; ctx.fillRect(padX, barY, barW * st.fill, barH)
      // asset (the press) at the start of the bar
      ctx.fillStyle = `rgba(${CRIMSON},1)`; roundRect(ctx, padX - 4, barY - 12, 40, barH + 24, 6); ctx.fill()
      coin(padX + 16, barY + barH / 2, 9)
      // coins banking off the right end
      for (const b of st.banks) { const a = clamp(1 - b.t); ctx.globalAlpha = a; coin(padX + barW * st.fill + b.t * 26, barY + barH / 2 - b.t * 30, 6); ctx.globalAlpha = 1 }
      label('→ WORKS WHILE YOU DON’T', padX + 46, barY - 8, `rgba(${INK},0.4)`, 9.5)
    }

    /* ---------- MONEY ---------- */
    {
      const y0 = laneH, cy = laneH * 1.5
      label('MONEY', padX, y0 + laneH * 0.2, `rgba(${INK},0.9)`, 14)
      label('A CLAIM YOU SPEND · DOESN’T COMPOUND', padX, y0 + laneH * 0.2 + 20, `rgba(${INK},0.55)`, 10.5)
      const down = st.activity < 0.08
      bigNumber(xR, cy + laneH * 0.05, '$' + fmt(st.money), down ? '▼ DRAINS WHEN IDLE' : '▲ TOPPING UP…', `rgba(${INK},0.9)`)
      const barY = cy + laneH * 0.24, barH = 16, lvl = clamp(st.money / 1200)
      ctx.strokeStyle = `rgba(${INK},0.85)`; ctx.lineWidth = 2; ctx.strokeRect(padX, barY, barW, barH)
      ctx.fillStyle = `rgba(${INK},0.5)`; ctx.fillRect(padX, barY, barW * lvl, barH)
      // hatch the empty (spent) portion
      ctx.strokeStyle = `rgba(${INK},0.18)`; ctx.lineWidth = 1
      for (let x = padX + barW * lvl + 6; x < padX + barW; x += 8) { ctx.beginPath(); ctx.moveTo(x, barY); ctx.lineTo(x - barH, barY + barH); ctx.stroke() }
      // leaking drips under the fill edge
      for (const d of st.drips) { ctx.fillStyle = `rgba(${INK},${clamp(1 - d.t) * 0.5})`; ctx.beginPath(); ctx.arc(d.x, d.y, 2.2, 0, Math.PI * 2); ctx.fill() }
    }

    /* ---------- STATUS ---------- */
    {
      const y0 = laneH * 2, cy = laneH * 2.52
      label('STATUS', padX, y0 + laneH * 0.2, `rgba(${CRIMSON_D},1)`, 14)
      label('ZERO-SUM · TO RISE, ANOTHER MUST FALL', padX, y0 + laneH * 0.2 + 20, `rgba(${INK},0.55)`, 10.5)
      bigNumber(xR, cy - laneH * 0.02, '0', 'NET GAIN · SOMEONE LOSES', `rgba(${INK},0.9)`)
      const beamCx = padX + Math.min(barW * 0.42, 230), beamW = Math.min(barW * 0.62, 320)
      const osc = reduced ? 0.17 : Math.sin(st.t * 0.9) * 0.2
      ctx.save(); ctx.translate(beamCx, cy); ctx.rotate(osc)
      ctx.strokeStyle = `rgba(${INK},0.9)`; ctx.lineWidth = 3; ctx.lineCap = 'round'
      ctx.beginPath(); ctx.moveTo(-beamW / 2, 0); ctx.lineTo(beamW / 2, 0); ctx.stroke()
      coin(-beamW / 2, -10, 11); coin(beamW / 2, -10, 11)
      ctx.restore()
      ctx.textAlign = 'center'; ctx.font = "700 9.5px 'Space Mono', monospace"; ctx.fillStyle = `rgba(${INK},0.6)`
      ctx.fillText('YOU', beamCx - beamW / 2, cy + 34); ctx.fillText('RIVAL', beamCx + beamW / 2, cy + 34)
      ctx.fillStyle = `rgba(${INK},0.9)`; ctx.beginPath(); ctx.moveTo(beamCx - 12, cy + 20); ctx.lineTo(beamCx + 12, cy + 20); ctx.lineTo(beamCx, cy); ctx.closePath(); ctx.fill()
    }
  }

  function step(dt) {
    st.t += dt
    const y = window.scrollY, moved = Math.abs(y - st.lastY); st.lastY = y
    st.activity = clamp(Math.max(st.activity * 0.9, Math.min(1, moved / 30)))

    // wealth: smooth climb + a sweeping bar that banks a coin each cycle
    st.wealth += 58 * dt
    st.fill += dt / 2.4
    if (st.fill >= 1) { st.fill -= 1; st.banks.push({ t: 0 }) }
    for (let i = st.banks.length - 1; i >= 0; i--) { st.banks[i].t += dt * 1.4; if (st.banks[i].t >= 1) st.banks.splice(i, 1) }

    // money: drains steadily; scrolling tops up; never grows on its own
    st.money = clamp(st.money - 34 * dt + st.activity * 150 * dt, 0, 1200)
    if (st.activity < 0.08 && Math.random() < 0.5) {
      const laneH = H / 3, cy = laneH * 1.5, padX = Math.max(24, W * 0.06), barW = W - padX * 2, lvl = clamp(st.money / 1200)
      st.drips.push({ x: padX + barW * lvl, y: cy + laneH * 0.24 + 18, t: 0 })
    }
    for (let i = st.drips.length - 1; i >= 0; i--) { const d = st.drips[i]; d.y += 80 * dt; d.t += dt * 1.3; if (d.t >= 1) st.drips.splice(i, 1) }

    drawScene()
  }

  if (ScrollTrigger) {
    ScrollTrigger.create({ trigger: root, start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: () => {} })
  }

  const fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
  if (reduced) {
    st.wealth = 12480; st.fill = 0.62; st.money = 430; st.activity = 0
    resize(); drawScene(); fontsReady.then(drawScene); return
  }

  let running = false, last = performance.now(), raf = 0
  function loop(now) {
    if (prefersReducedMotion()) { running = false; drawScene(); return }
    const dt = Math.min(0.05, (now - last) / 1000); last = now
    step(dt)
    if (running) raf = requestAnimationFrame(loop)
  }
  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; last = performance.now(); raf = requestAnimationFrame(loop) }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
  }, { rootMargin: '20% 0px 20% 0px' })
  io.observe(root)
}

function roundRect(ctx, x, y, w, h, r) {
  r = Math.min(r, h / 2, w / 2)
  ctx.beginPath(); ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath()
}
