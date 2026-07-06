// Ambient nocturnal sky — a full-screen OGL fragment shader running low-amplitude
// fbm. Deliberately barely-there: pre-dawn stillness, not a gradient blob.
// Dynamic-imported after first paint; pauses when the tab is hidden.
import { Renderer, Triangle, Program, Mesh } from 'ogl'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

const fragment = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform float uPhase;   // 0 day -> 1 night
  uniform vec2  uRes;

  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 345.45));
    p += dot(p, p + 34.345);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, amp = 0.5;
    for (int i = 0; i < 4; i++) {   // 4 octaves is plenty for a near-invisible ambient layer
      v += amp * noise(p);
      p *= 2.02; amp *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    float asp = uRes.x / max(uRes.y, 1.0);
    vec2 p = vec2(uv.x * asp, uv.y);

    float n = fbm(p * 1.5 + vec2(uTime * 0.018, uTime * 0.010));

    // Base inks — #0d1017 with a faint lapis lift during "day"
    vec3 ink = vec3(0.051, 0.063, 0.090);
    vec3 dayTint = vec3(0.082, 0.110, 0.156);
    vec3 col = mix(ink, dayTint, (1.0 - uPhase) * 0.55);

    // ultra-low-amplitude cloud
    col += (n - 0.5) * 0.045;

    // a single soft glow near the top-right that sinks and cools as night falls
    vec2 gpos = vec2(0.78, mix(0.16, 0.04, uPhase));
    float glow = smoothstep(0.95, 0.15, distance(vec2(uv.x * asp, uv.y), vec2(gpos.x * asp, gpos.y)));
    vec3 glowCol = mix(vec3(0.11, 0.15, 0.22), vec3(0.055, 0.065, 0.085), uPhase);
    col += glow * glowCol * 0.55;

    // sink the bottom into deeper ink
    col *= 1.0 - smoothstep(0.45, 1.0, uv.y) * 0.28;

    // faint vignette
    float vig = smoothstep(1.25, 0.35, length(uv - 0.5));
    col *= mix(0.86, 1.0, vig);

    gl_FragColor = vec4(col, 1.0);
  }
`

export function init(mount) {
  if (!mount) return null
  const renderer = new Renderer({ dpr: Math.min(1.5, window.devicePixelRatio || 1), alpha: false, antialias: false })
  const gl = renderer.gl
  gl.clearColor(0.051, 0.063, 0.09, 1)
  mount.appendChild(gl.canvas)

  const geometry = new Triangle(gl)
  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTime: { value: 0 },
      uPhase: { value: 0 },
      uRes: { value: [1, 1] },
    },
  })
  const mesh = new Mesh(gl, { geometry, program })

  function resize() {
    const w = mount.clientWidth || window.innerWidth
    const h = mount.clientHeight || window.innerHeight
    renderer.setSize(w, h)
    program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height]
  }
  resize()
  window.addEventListener('resize', resize, { passive: true })

  let raf = 0
  let running = true
  let contextLost = false
  const start = performance.now()
  function frame() {
    if (!running) return
    program.uniforms.uTime.value = (performance.now() - start) / 1000
    renderer.render({ scene: mesh })
    raf = requestAnimationFrame(frame)
  }
  frame()

  // reveal the canvas once it's actually drawing
  requestAnimationFrame(() => mount.classList.add('is-live'))

  // if the GPU drops the context, stop and let the CSS poster fade back in
  gl.canvas.addEventListener('webglcontextlost', (e) => {
    e.preventDefault()
    contextLost = true
    running = false
    cancelAnimationFrame(raf)
    mount.classList.remove('is-live')
  })

  document.addEventListener('visibilitychange', () => {
    running = !document.hidden && !contextLost
    if (running) frame()
    else cancelAnimationFrame(raf)
  })

  return {
    setPhase(t) { program.uniforms.uPhase.value = t },
    destroy() {
      running = false
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      gl.canvas.remove()
    },
  }
}
