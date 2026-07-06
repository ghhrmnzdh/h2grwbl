// ACT IV viz — the four kinds of leverage ignite in sequence as you scroll.
// Labor + Capital (permissioned) fill first in pewter; Code + Media (permissionless)
// ignite in lapis and replicate a glyph across the cell — zero marginal cost.
export function init(root, { reduced, gsap, ScrollTrigger } = {}) {
  const quadrant = root.querySelector('#quadrant')
  if (!quadrant) return
  const cells = [...quadrant.querySelectorAll('.qcell')].sort(
    (a, b) => (+a.dataset.order || 0) - (+b.dataset.order || 0)
  )
  const caption = root.querySelector('#quadrantCaption')

  function replicate(cell) {
    const holder = cell.querySelector('.qcell__glyphs')
    if (!holder || holder.dataset.done) return
    holder.dataset.done = '1'
    const count = 16
    const glyphs = []
    for (let i = 0; i < count; i++) {
      const g = document.createElement('span')
      g.className = 'qcell__glyph'
      g.style.left = 6 + i * (86 / (count - 1)) + '%'
      holder.appendChild(g)
      glyphs.push(g)
    }
    if (reduced || !gsap) { glyphs.forEach((g) => (g.style.opacity = '0.85')); return }
    gsap.fromTo(
      glyphs,
      { opacity: 0, scale: 0.3 },
      { opacity: 0.85, scale: 1, duration: 0.5, stagger: 0.045, ease: 'power2.out' }
    )
  }

  function lightCell(cell) {
    if (cell.classList.contains('is-lit')) return
    cell.classList.add('is-lit')
    if (cell.classList.contains('is-permissionless')) replicate(cell)
  }

  function enableReveal() {
    cells.forEach((c) => {
      c.classList.add('can-reveal')
      c.setAttribute('aria-expanded', 'false')
    })
  }

  // touch/click reveal (hover-less devices) + keyboard toggle
  cells.forEach((c) => {
    c.addEventListener('click', () => {
      if (!c.classList.contains('can-reveal')) return
      const open = c.classList.toggle('is-open')
      c.setAttribute('aria-expanded', String(open))
    })
  })

  // Buttons are operable and their examples reachable from load — keyboard users
  // shouldn't have to scroll ~80% before they can interact. Ignite choreography stays.
  enableReveal()

  if (reduced) {
    cells.forEach(lightCell)
    caption && caption.classList.add('is-in')
    return
  }

  // thresholds per cell order (1..4) + caption
  const thresholds = [0.14, 0.3, 0.48, 0.64]
  if (ScrollTrigger) {
    ScrollTrigger.create({
      trigger: root, start: 'top top', end: 'bottom bottom', scrub: true,
      onUpdate: (self) => {
        const p = self.progress
        cells.forEach((c, i) => { if (p >= thresholds[i]) lightCell(c) })
        if (caption) caption.classList.toggle('is-in', p >= 0.74)
      },
    })
  }
}
