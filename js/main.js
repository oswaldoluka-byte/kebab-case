(() => {
  const C = window.CONFIG;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // ---------- Contenido ----------
  const fill = (sel, text) => $$(sel).forEach((el) => (el.textContent = text));
  fill("[data-her-name]", C.herName);
  fill("[data-from-name]", C.fromName);
  fill("[data-initial]", C.herName.charAt(0));
  fill("[data-quote]", C.quote);
  $("[data-hero]").src = C.heroPhoto;
  $("[data-ending]").src = C.endingPhoto;

  const [y, m, d] = C.date.split("-").map(Number);
  fill("[data-date]", new Date(y, m - 1, d).toLocaleDateString("es-PE", {
    day: "numeric", month: "long", year: "numeric",
  }));
  fill("[data-date-short]", [d, m, y].map((n) => String(n).padStart(2, "0")).join(" · "));

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

  // Guardado en el celular de ella (si el navegador lo bloquea, todo sigue funcionando)
  const store = {
    get(k, fb) { try { return JSON.parse(localStorage.getItem(k)) ?? fb; } catch { return fb; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
  };
  const shortDate = (ts) => new Date(ts).toLocaleDateString("es-PE", { day: "numeric", month: "long" });

  // ---------- Carta ----------
  $("#letter-body").innerHTML =
    C.letter.map((t) => `<p>${t}</p>`).join("") +
    `<p class="sheet__sign">Con todo mi amor,<br><span>${C.fromName}</span></p>`;
  $$("#letter-body p").forEach((p, i) => p.style.setProperty("--i", i));
  const env = $("#envelope");
  const modal = $("#letter-modal");
  const showSheet = () => {
    modal.hidden = false;
    document.body.classList.add("reading");
    requestAnimationFrame(() => modal.classList.add("show"));
    modal.scrollTop = 0;
    burst(40);
  };
  const hideSheet = () => {
    modal.classList.remove("show");
    document.body.classList.remove("reading");
    setTimeout(() => (modal.hidden = true), 500);
  };
  const openLetter = () => {
    if (env.classList.contains("open")) return showSheet();
    env.classList.add("open");
    $("#envelope-hint").textContent = "toca el sobre para leerla otra vez";
    setTimeout(showSheet, 1500);
  };
  env.addEventListener("click", openLetter);
  env.addEventListener("keydown", (e) => (e.key === "Enter" || e.key === " ") && openLetter());
  $("#letter-close").addEventListener("click", hideSheet);
  modal.addEventListener("click", (e) => e.target === modal && hideSheet());
  addEventListener("keydown", (e) => e.key === "Escape" && !modal.hidden && hideSheet());

  // ---------- Vales (una vez canjeados, se quedan así) ----------
  if (!C.coupons.length) $("#coupons-section").remove();
  const redeemed = store.get("vales", {});
  C.coupons.forEach((c, i) => {
    const card = document.createElement("button");
    card.className = "coupon";
    card.innerHTML = `
      <span class="coupon__face coupon__front">
        <small>Vale Nº ${String(i + 1).padStart(2, "0")}</small>
        <strong>${c.title}</strong>
        <em>${c.note}</em>
      </span>
      <span class="coupon__face coupon__back">
        <small class="coupon__stamp"></small>
        <strong>${c.title}</strong>
        <em>Muéstrale este vale a ${C.fromName} ♥</em>
      </span>`;
    const markRedeemed = (ts) => {
      card.classList.add("flipped");
      card.setAttribute("aria-disabled", "true");
      $(".coupon__stamp", card).textContent = `Canjeado el ${shortDate(ts)}`;
    };
    if (redeemed[i]) markRedeemed(redeemed[i]);
    card.addEventListener("click", () => {
      if (redeemed[i]) return;
      redeemed[i] = Date.now();
      store.set("vales", redeemed);
      markRedeemed(redeemed[i]);
      burst(25);
    });
    $("#coupons").appendChild(card);
  });

  // ---------- Tarjeta para raspar (una sorpresa al azar cada 24 h) ----------
  if (!C.scratch.length) $("#scratch-section").remove();
  else {
    const DAY = 24 * 60 * 60 * 1000;
    const sc = $("#scratch-cover");
    const sx = sc.getContext("2d");
    const hint = $("#scratch-hint");
    let state, painted = false, done = false, drawing = false;

    const newCard = () => {
      const prev = state?.i;
      let i;
      do i = Math.floor(Math.random() * C.scratch.length);
      while (C.scratch.length > 1 && i === prev);
      state = { i, start: Date.now(), done: false };
      store.set("rasca", state);
    };
    const setup = () => {
      state = store.get("rasca", null);
      if (!state || Date.now() - state.start >= DAY || !C.scratch[state.i]) newCard();
      fill("[data-scratch]", C.scratch[state.i]);
      done = state.done;
      sc.classList.toggle("cleared", done);
      if (!done) { hint.textContent = "raspa con tu dedo"; painted = false; paint(); }
      updateWait();
    };
    const updateWait = () => {
      if (!done) return;
      const left = state.start + DAY - Date.now();
      if (left <= 0) return setup();
      const h = Math.floor(left / 3600000), m = Math.floor(left / 60000) % 60;
      hint.textContent = `nueva sorpresa en ${h} h ${m} min`;
    };
    setInterval(updateWait, 30000);

    const paint = () => {
      const r = sc.getBoundingClientRect();
      if (!r.width) return;
      sx.globalCompositeOperation = "source-over";
      const dpr = Math.min(devicePixelRatio || 1, 2);
      sc.width = r.width * dpr;
      sc.height = r.height * dpr;
      sx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = sx.createLinearGradient(0, 0, r.width, r.height);
      g.addColorStop(0, "#d9b87c"); g.addColorStop(.5, "#f1dcae"); g.addColorStop(1, "#c39a5c");
      sx.fillStyle = g;
      sx.fillRect(0, 0, r.width, r.height);
      sx.fillStyle = "rgba(255,255,255,.18)";
      for (let i = 0; i < 260; i++) sx.fillRect(Math.random() * r.width, Math.random() * r.height, 1.5, 1.5);
      sx.fillStyle = "#7a5526";
      sx.font = "italic 500 22px 'Cormorant Garamond', serif";
      sx.textAlign = "center";
      sx.fillText("Rasca aquí ♥", r.width / 2, r.height / 2 + 7);
      painted = true;
    };
    const scratchAt = (e) => {
      const r = sc.getBoundingClientRect();
      sx.globalCompositeOperation = "destination-out";
      sx.beginPath();
      sx.arc(e.clientX - r.left, e.clientY - r.top, 22, 0, Math.PI * 2);
      sx.fill();
    };
    const check = () => {
      if (done) return;
      const px = sx.getImageData(0, 0, sc.width, sc.height).data;
      let clear = 0;
      for (let i = 3; i < px.length; i += 64) if (px[i] === 0) clear++;
      if (clear / (px.length / 64) > 0.45) {
        done = true;
        state.done = true;
        store.set("rasca", state);
        sc.classList.add("cleared");
        updateWait();
        burst(50);
      }
    };
    let touched = false;
    sc.addEventListener("pointerdown", (e) => { if (!painted) paint(); touched = drawing = true; sc.setPointerCapture(e.pointerId); scratchAt(e); });
    sc.addEventListener("pointermove", (e) => drawing && scratchAt(e));
    sc.addEventListener("pointerup", () => { drawing = false; check(); });
    setup();
    // Repinta con la tipografía ya cargada, si aún no la ha tocado
    document.fonts.ready.then(() => !done && !touched && paint());
  }

  // ---------- Contador ----------
  if (C.startDate) {
    $("#counter").hidden = false;
    const start = new Date(C.startDate).getTime();
    fill("[data-start-text]", `desde el ${new Date(start).toLocaleDateString("es-PE", { day: "numeric", month: "long", year: "numeric" })} ♥`);
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

  // Vista previa: /#ver o /#ver-<id> salta la portada (solo para revisar)
  if (location.hash.startsWith("#ver")) {
    document.body.classList.add("no-anim");
    $("#open-btn").click();
    $("#gate").remove();
    $$(".reveal").forEach((el) => el.classList.add("in"));
    const target = location.hash.slice(5);
    if (target === "carta") env.click();
    else if (target) setTimeout(() => $(`#${target}`)?.scrollIntoView({ block: "start", behavior: "instant" }), 300);
  }
})();
