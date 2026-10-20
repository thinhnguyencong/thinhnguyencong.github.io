/*
 * Quantum flavour for the page:
 *  1. a live Ising spin glass in the background, annealed on a repeating schedule
 *     (transverse-field "wobble" early, Metropolis freezing late); the cursor is a
 *     local field, a click quenches a region,
 *  2. the name "collapses" out of a superposition of symbols on load / hover,
 *  3. research interests behave like amplitudes that collapse when measured (hover),
 *  4. interference fringes follow the cursor over the portrait.
 */
(() => {
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const byId = (id) => document.getElementById(id);

  /* ---------- 1. Ising lattice ---------- */
  const canvas = byId("lattice");
  const ctx = canvas.getContext("2d");
  const GAP = 34;
  const CYCLE = 26000; // ms for one anneal sweep s: 0 -> 1
  const HOLD = 5000; // ms frozen in the ground-state basin before reheating
  let cols = 0, rows = 0, n = 0, width = 0, height = 0;
  let spin, angle, phase, jRight, jDown, field;
  let start = performance.now();
  let colors = {};
  const pointer = { x: -1e4, y: -1e4, active: false };
  const ripples = [];

  function readColors() {
    const style = getComputedStyle(document.documentElement);
    colors = {
      spin: style.getPropertyValue("--spin").trim(),
      accent: style.getPropertyValue("--accent").trim(),
      accent2: style.getPropertyValue("--accent-2").trim(),
    };
  }

  function resize() {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    width = innerWidth;
    height = innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / GAP) + 1;
    rows = Math.ceil(height / GAP) + 1;
    n = cols * rows;
    spin = new Int8Array(n);
    angle = new Float32Array(n);
    phase = new Float32Array(n);
    field = new Float32Array(n);
    jRight = new Int8Array(n);
    jDown = new Int8Array(n);
    for (let i = 0; i < n; i += 1) {
      spin[i] = Math.random() < 0.5 ? 1 : -1;
      angle[i] = spin[i] > 0 ? 0 : Math.PI;
      phase[i] = Math.random() * Math.PI * 2;
      // mostly ferromagnetic with some antiferromagnetic bonds: a mildly frustrated spin glass
      jRight[i] = Math.random() < 0.82 ? 1 : -1;
      jDown[i] = Math.random() < 0.82 ? 1 : -1;
    }
    start = performance.now();
    readColors();
    if (reduced) frame(start + CYCLE);
  }

  const idx = (c, r) => ((r + rows) % rows) * cols + ((c + cols) % cols);

  function localField(i) {
    const c = i % cols, r = (i / cols) | 0;
    return (
      jRight[i] * spin[idx(c + 1, r)] +
      jRight[idx(c - 1, r)] * spin[idx(c - 1, r)] +
      jDown[i] * spin[idx(c, r + 1)] +
      jDown[idx(c, r - 1)] * spin[idx(c, r - 1)] +
      field[i]
    );
  }

  function energyPerSpin() {
    let e = 0;
    for (let i = 0; i < n; i += 1) {
      const c = i % cols, r = (i / cols) | 0;
      e -= spin[i] * (jRight[i] * spin[idx(c + 1, r)] + jDown[i] * spin[idx(c, r + 1)] + field[i]);
    }
    return e / n;
  }

  function quench(x, y, radius) {
    const c0 = Math.round(x / GAP), r0 = Math.round(y / GAP), span = Math.ceil(radius / GAP);
    for (let r = r0 - span; r <= r0 + span; r += 1)
      for (let c = c0 - span; c <= c0 + span; c += 1) {
        if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
        if (Math.hypot(c * GAP - x, r * GAP - y) <= radius) spin[r * cols + c] = Math.random() < 0.5 ? 1 : -1;
      }
    ripples.push({ x, y, t: performance.now() });
  }

  const meter = byId("anneal-meter");
  const sLabel = byId("anneal-s");
  const eLabel = byId("energy");
  let lastReadout = 0;

  function frame(now) {
    const elapsed = Math.max(0, now - start) % (CYCLE + HOLD);
    const s = Math.min(1, elapsed / CYCLE); // annealing parameter
    const temperature = 3.2 * Math.pow(1 - s, 2) + 0.05;
    const gamma = 1 - s; // transverse-field strength, drives the visual wobble

    // local field from the cursor
    field.fill(0);
    if (pointer.active) {
      const c0 = Math.round(pointer.x / GAP), r0 = Math.round(pointer.y / GAP);
      for (let r = r0 - 4; r <= r0 + 4; r += 1)
        for (let c = c0 - 4; c <= c0 + 4; c += 1) {
          if (c < 0 || r < 0 || c >= cols || r >= rows) continue;
          const d = Math.hypot(c * GAP - pointer.x, r * GAP - pointer.y);
          if (d < 120) field[r * cols + c] = 2.5 * (1 - d / 120);
        }
    }

    // Metropolis updates
    if (!reduced) {
      const updates = Math.ceil(n * 0.12);
      for (let k = 0; k < updates; k += 1) {
        const i = (Math.random() * n) | 0;
        const dE = 2 * spin[i] * localField(i);
        if (dE <= 0 || Math.random() < Math.exp(-dE / temperature)) spin[i] = -spin[i];
      }
    } else {
      for (let sweep = 0; sweep < 40; sweep += 1)
        for (let i = 0; i < n; i += 1) if (spin[i] * localField(i) < 0) spin[i] = -spin[i];
    }

    ctx.clearRect(0, 0, width, height);

    // frustrated (unsatisfied) bonds glow faintly
    ctx.lineWidth = 1;
    ctx.strokeStyle = colors.accent2;
    ctx.globalAlpha = 0.12;
    ctx.beginPath();
    for (let r = 0; r < rows; r += 1)
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c, x = c * GAP, y = r * GAP;
        if (c + 1 < cols && jRight[i] * spin[i] * spin[i + 1] < 0) {
          ctx.moveTo(x + 6, y);
          ctx.lineTo(x + GAP - 6, y);
        }
        if (r + 1 < rows && jDown[i] * spin[i] * spin[i + cols] < 0) {
          ctx.moveTo(x, y + 6);
          ctx.lineTo(x, y + GAP - 6);
        }
      }
    ctx.stroke();

    // spins as little arrows; early in the anneal they precess (quantum fluctuations)
    const t = now / 1000;
    const len = 7;
    const up = new Path2D(), down = new Path2D();
    for (let r = 0; r < rows; r += 1)
      for (let c = 0; c < cols; c += 1) {
        const i = r * cols + c;
        const target = spin[i] > 0 ? 0 : Math.PI;
        angle[i] += (target - angle[i]) * (reduced ? 1 : 0.18);
        const wobble = reduced ? 0 : gamma * 0.9 * Math.sin(t * 2.2 + phase[i]);
        const a = angle[i] + wobble;
        const x = c * GAP, y = r * GAP;
        const dx = Math.sin(a) * len, dy = -Math.cos(a) * len;
        const path = spin[i] > 0 ? up : down;
        path.moveTo(x - dx, y - dy);
        path.lineTo(x + dx, y + dy);
        path.moveTo(x + dx + 1.6, y + dy);
        path.arc(x + dx, y + dy, 1.6, 0, Math.PI * 2);
      }
    ctx.lineWidth = 1.1;
    ctx.globalAlpha = 0.13;
    ctx.strokeStyle = "rgb(" + colors.spin + ")";
    ctx.stroke(down);
    ctx.globalAlpha = 0.3;
    ctx.strokeStyle = colors.accent;
    ctx.stroke(up);

    // measurement ripples
    for (let k = ripples.length - 1; k >= 0; k -= 1) {
      const age = (now - ripples[k].t) / 1000;
      if (age > 1.4) {
        ripples.splice(k, 1);
        continue;
      }
      for (let ring = 0; ring < 3; ring += 1) {
        const radius = age * 160 - ring * 18;
        if (radius <= 0) continue;
        ctx.globalAlpha = Math.max(0, 0.35 * (1 - age / 1.4));
        ctx.strokeStyle = colors.accent;
        ctx.beginPath();
        ctx.arc(ripples[k].x, ripples[k].y, radius, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.globalAlpha = 1;

    if (now - lastReadout > 250) {
      lastReadout = now;
      if (meter) meter.style.setProperty("--v", (s * 100).toFixed(1) + "%");
      if (sLabel) sLabel.textContent = "s=" + s.toFixed(2);
      if (eLabel) eLabel.textContent = "E/N = " + energyPerSpin().toFixed(3);
    }
  }

  function loop(now) {
    frame(now);
    requestAnimationFrame(loop);
  }

  addEventListener("resize", resize);
  addEventListener("themechange", readColors);
  matchMedia("(prefers-color-scheme: dark)").addEventListener("change", readColors);
  addEventListener("pointermove", (event) => {
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    pointer.active = true;
  });
  document.addEventListener("pointerleave", () => (pointer.active = false));
  addEventListener("pointerdown", (event) => {
    if (event.target.closest("a,button,pre")) return;
    quench(event.clientX, event.clientY, 90);
  });
  resize();
  if (!reduced) requestAnimationFrame(loop);

  /* ---------- 2. name collapses out of superposition ---------- */
  const nameEl = byId("profile-name");
  const SYMBOLS = "01ψφ|⟩⟨+−αβ↑↓";
  let collapsing = false;
  function collapse() {
    if (reduced || collapsing) return;
    collapsing = true;
    const finalText = nameEl.textContent;
    nameEl.setAttribute("aria-label", finalText);
    const chars = [...finalText];
    const settleAt = chars.map((ch, i) => (ch === " " ? 0 : 220 + i * 45 + Math.random() * 260));
    const begin = performance.now();
    const step = () => {
      const age = performance.now() - begin;
      let done = true;
      nameEl.textContent = "";
      chars.forEach((ch, i) => {
        if (age >= settleAt[i]) nameEl.append(ch);
        else {
          done = false;
          const span = document.createElement("span");
          span.className = "q";
          span.setAttribute("aria-hidden", "true");
          span.textContent = SYMBOLS[(Math.random() * SYMBOLS.length) | 0];
          nameEl.append(span);
        }
      });
      if (done) {
        nameEl.textContent = finalText;
        collapsing = false;
      } else requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    // never leave the name scrambled, e.g. when the tab is in the background
    setTimeout(() => {
      nameEl.textContent = finalText;
      collapsing = false;
    }, 3000);
  }
  collapse();
  nameEl.addEventListener("pointerenter", collapse);

  /* ---------- 3. interests as amplitudes ---------- */
  const states = [...document.querySelectorAll(".state")];
  function setAmplitudes(probabilities, label) {
    states.forEach((card, i) => {
      card.querySelector(".amp i").style.setProperty("--p", (probabilities[i] * 100).toFixed(1) + "%");
      card.querySelector(".amp-val").textContent = label(probabilities[i]);
    });
  }
  function superpose() {
    const raw = states.map(() => 0.6 + Math.random());
    const total = raw.reduce((a, b) => a + b, 0);
    setAmplitudes(
      raw.map((v) => v / total),
      (p) => "α=" + Math.sqrt(p).toFixed(2),
    );
  }
  states.forEach((card, i) => {
    card.addEventListener("pointerenter", () =>
      setAmplitudes(
        states.map((_, j) => (j === i ? 1 : 0)),
        (p) => "P=" + p.toFixed(2),
      ),
    );
    card.addEventListener("pointerleave", superpose);
  });
  superpose();
  if (!reduced) setInterval(() => !document.querySelector(".state:hover") && superpose(), 3500);

  /* ---------- 4. interference fringes over the portrait ---------- */
  const photoBox = byId("photo-box");
  photoBox.addEventListener("pointermove", (event) => {
    const box = photoBox.getBoundingClientRect();
    photoBox.style.setProperty("--mx", ((event.clientX - box.left) / box.width) * 100 + "%");
    photoBox.style.setProperty("--my", ((event.clientY - box.top) / box.height) * 100 + "%");
  });
})();
