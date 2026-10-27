(() => {
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Contenido ----------
  $$("[data-her-name]").forEach((el) => (el.textContent = C.herName));
  $$("[data-initial]").forEach((el) => (el.textContent = C.herName.charAt(0)));
  $$("[data-signature]").forEach((el) => (el.textContent = C.signature));

  const [y, m, d] = C.date.split("-").map(Number);
  const dateText = new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  });
  $$("[data-date]").forEach((el) => (el.textContent = dateText));

  // ---------- Galería ----------
  const track = $("#polaroids");
  const dots = $("#dots");
  C.photos.forEach((p, i) => {
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.setProperty("--tilt", `${[-2.5, 1.8, -1.2, 2.4][i % 4]}deg`);
    fig.innerHTML = `
      <div class="polaroid__img"><img src="${p.src}" alt="${p.caption || ""}" loading="lazy"></div>
      <figcaption>${p.caption || ""}</figcaption>`;
    // Mientras no estén las fotos, muestra un marcador bonito
    $("img", fig).addEventListener("error", (e) => {
      e.target.parentElement.classList.add("is-empty");
      e.target.parentElement.dataset.n = i + 1;
      e.target.remove();
    });
    track.appendChild(fig);
    dots.appendChild(document.createElement("i"));
  });
  const updateDots = () => {
    const i = Math.round(track.scrollLeft / track.clientWidth);
    $$("i", dots).forEach((dot, k) => dot.classList.toggle("on", k === i));
  };
  track.addEventListener("scroll", updateDots, { passive: true });
  updateDots();

  // ---------- Carta ----------
  $("#letter-body").innerHTML =
    C.letter.map((t) => `<p>${t}</p>`).join("") +
    `<p class="letter__sign">${C.signature}</p>`;
  const env = $("#envelope");
  const openLetter = () => {
    if (env.classList.contains("open")) return;
    env.classList.add("open");
    $("#envelope-hint").textContent = "";
    burst(40);
    setTimeout(() => {
      $("#letter").classList.add("open");
      setTimeout(() => $("#letter").scrollIntoView({ behavior: "smooth", block: "start" }), 350);
    }, 700);
  };
  env.addEventListener("click", openLetter);
  env.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && openLetter());

  // ---------- Razones ----------
  if (!C.reasons.length) $("#reasons-section").remove();
  C.reasons.forEach((r, i) => {
    const card = document.createElement("button");
    card.className = "reason";
    card.innerHTML = `<span class="reason__front">${String(i + 1).padStart(2, "0")}</span><span class="reason__back">${r}</span>`;
    card.addEventListener("click", () => card.classList.toggle("flipped"));
    $("#reasons").appendChild(card);
  });

  // ---------- Contador ----------
  if (C.startDate) {
    $("#counter").hidden = false;
    const start = new Date(C.startDate).getTime();
    const tick = () => {
      let s = Math.max(0, Math.floor((Date.now() - start) / 1000));
      const v = { days: Math.floor(s / 86400), hours: Math.floor(s / 3600) % 24, minutes: Math.floor(s / 60) % 60, seconds: s % 60 };
      for (const k in v) $(`[data-c="${k}"]`).textContent = v[k].toLocaleString("es-PE");
    };
    tick();
    setInterval(tick, 1000);
  }

  // ---------- Música ----------
  const audio = $("#music");
  const musicBtn = $("#music-toggle");
  if (C.music) audio.src = C.music;
  else $(".gate__hint").remove();
  musicBtn.addEventListener("click", () => {
    audio.paused ? audio.play() : audio.pause();
  });
  audio.addEventListener("play", () => musicBtn.classList.remove("paused"));
  audio.addEventListener("pause", () => musicBtn.classList.add("paused"));

  // ---------- Portada ----------
  $("#open-btn").addEventListener("click", () => {
    document.body.classList.remove("locked");
    $("#gate").classList.add("gone");
    $("#story").setAttribute("aria-hidden", "false");
    if (C.music) {
      musicBtn.hidden = false;
      audio.play().catch(() => musicBtn.classList.add("paused"));
    }
    burst(70);
    setTimeout(() => $("#gate").remove(), 1200);
  });

  $("#love-btn").addEventListener("click", () => burst(90));

  // ---------- Aparición al hacer scroll ----------
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target)));
  }, { threshold: 0.18 });
  $$(".reveal").forEach((el) => io.observe(el));

  // ---------- Pétalos ----------
  const cv = $("#petals");
  const ctx = cv.getContext("2d");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const colors = ["#e8b4a6", "#d98e7a", "#f2d0c4", "#c9a46a", "#b4553f"];
  let petals = [];
  const fit = () => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = innerWidth * dpr;
    cv.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  fit();
  addEventListener("resize", fit);

  const make = (fromTop) => ({
    x: Math.random() * innerWidth,
    y: fromTop ? -20 : innerHeight * 0.45 + (Math.random() - 0.5) * 80,
    r: 5 + Math.random() * 7,
    vx: (Math.random() - 0.5) * (fromTop ? 0.6 : 5),
    vy: fromTop ? 0.6 + Math.random() * 0.9 : -3 - Math.random() * 4,
    rot: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.06,
    sway: Math.random() * Math.PI * 2,
    color: colors[(Math.random() * colors.length) | 0],
    heart: Math.random() < 0.3,
  });

  function burst(n) {
    if (reduce) return;
    for (let i = 0; i < n; i++) petals.push(make(false));
  }

  function drawHeart(r) {
    ctx.beginPath();
    ctx.moveTo(0, r * 0.35);
    ctx.bezierCurveTo(-r, -r * 0.4, -r * 0.4, -r * 1.1, 0, -r * 0.45);
    ctx.bezierCurveTo(r * 0.4, -r * 1.1, r, -r * 0.4, 0, r * 0.35);
    ctx.fill();
  }

  function loop() {
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    // Lluvia suave constante
    if (!reduce && petals.length < 28 && Math.random() < 0.06) petals.push(make(true));
    petals = petals.filter((p) => p.y < innerHeight + 30);
    for (const p of petals) {
      p.sway += 0.02;
      p.vy = Math.min(p.vy + 0.06, 1.4);
      p.vx *= 0.985;
      p.x += p.vx + Math.sin(p.sway) * 0.5;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = 0.85;
      if (p.heart) drawHeart(p.r);
      else {
        ctx.beginPath();
        ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    requestAnimationFrame(loop);
  }
  loop();
})();
