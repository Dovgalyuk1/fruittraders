// ===== Fruit Traders $FRUITS =====

// ---- CONFIG: fill these in once the token is live ----
const CONFIG = {
  CA: "",                 // e.g. "So1anaTokenAddressHere..."
  CHART_URL: "#",         // e.g. Dexscreener pair URL
  BUY_URL: "#",           // e.g. Jupiter / pump.fun swap link
  X_URL: "#",
  TELEGRAM_URL: "#",
};

const CA_PLACEHOLDER = "COMING SOON — NOT PLANTED YET";

document.addEventListener("DOMContentLoaded", () => {
  wireCA();
  wireNav();
  wireHeroButtons();
  buildTicker();
  startProfitPops();
  setupOverlays();
  setupSound();
  setupReveal();
  refreshSilo();
});

// ---------------- CA / copy ----------------
function wireCA() {
  const hasCA = !!CONFIG.CA;
  const text = hasCA ? CONFIG.CA : CA_PLACEHOLDER;
  const el1 = document.getElementById("caText");
  const el2 = document.getElementById("caTextFooter");
  if (el1) el1.textContent = text;
  if (el2) el2.textContent = text;

  [["copyBtn", "caText"], ["copyBtnFooter", "caTextFooter"]].forEach(([btnId, textId]) => {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.addEventListener("click", () => {
      const value = document.getElementById(textId).textContent;
      if (!CONFIG.CA) {
        btn.textContent = "Soon!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1400);
        return;
      }
      navigator.clipboard?.writeText(value).then(() => {
        btn.textContent = "Copied!";
        btn.classList.add("copied");
        setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("copied"); }, 1400);
      });
    });
  });
}

// ---------------- Nav ----------------
function wireNav() {
  const hamburger = document.getElementById("hamburger");
  const links = document.getElementById("navLinks");
  hamburger?.addEventListener("click", () => links.classList.toggle("open"));
  links?.querySelectorAll("a").forEach(a => a.addEventListener("click", () => links.classList.remove("open")));
}

// ---------------- Hero buttons ----------------
function wireHeroButtons() {
  const map = [
    ["buyBtn", CONFIG.BUY_URL], ["chartBtn", CONFIG.CHART_URL], ["xBtn", CONFIG.X_URL],
    ["xBtnFooter", CONFIG.X_URL], ["tgBtnFooter", CONFIG.TELEGRAM_URL], ["chartBtnFooter", CONFIG.CHART_URL],
  ];
  map.forEach(([id, url]) => {
    const el = document.getElementById(id);
    if (!el) return;
    if (url && url !== "#") { el.href = url; el.target = "_blank"; el.rel = "noopener"; }
  });
}

// ---------------- Ticker tape ----------------
function buildTicker() {
  const track = document.getElementById("tickerTrack");
  if (!track) return;
  const symbols = [
    ["$FRUITS", null], ["🍍 PINE", null], ["🍌 NANA", null], ["🍇 GRAPE", null],
    ["🍓 BERRY", null], ["🍉 MELON", null], ["🥕 CARROT", null], ["🐔 EGG", null],
  ];
  const items = [];
  for (let i = 0; i < 4; i++) {
    symbols.forEach(([sym]) => {
      const pct = (Math.random() * 40 - 8).toFixed(1);
      const up = parseFloat(pct) >= 0;
      items.push(`<span>${sym} <span class="${up ? "up" : "down"}">${up ? "+" : ""}${pct}%</span></span>`);
    });
  }
  track.innerHTML = items.join("");
}

// ---------------- Floating profit pop-ups ----------------
function startProfitPops() {
  const layer = document.getElementById("profitPopLayer");
  if (!layer) return;
  const phrases = ["+PROFIT", "+12.4%", "+HARVEST", "+YIELD", "TO THE SILO", "+8.1%", "+FRESH GAINS"];
  const negPhrases = ["healthy pullback", "-3.2%", "consolidating"];

  function spawn() {
    const isNeg = Math.random() < 0.18;
    const pop = document.createElement("div");
    pop.className = "profit-pop" + (isNeg ? " neg" : "");
    pop.textContent = isNeg
      ? negPhrases[Math.floor(Math.random() * negPhrases.length)]
      : phrases[Math.floor(Math.random() * phrases.length)];
    pop.style.left = (5 + Math.random() * 90) + "%";
    pop.style.top = (55 + Math.random() * 35) + "%";
    layer.appendChild(pop);
    setTimeout(() => pop.remove(), 3300);
  }
  spawn();
  setInterval(spawn, 2400);
}

// ---------------- Overlay positioning (cigar smoke, phone, laptop, windmill, chickens) ----------------
// Coordinates are in the ORIGINAL image pixel space (1792 x 592).
const IMG_W = 1792, IMG_H = 592;
const POINTS = {
  ovSmoke:    { x: 992,  y: 314 },
  ovPhone:    { x: 1035, y: 385 },
  ovLaptop:   { x: 1180, y: 424 },
  ovWindmill: { x: 1295, y: 125 },
  ovChickenA: { x: 1690, y: 432 },
  ovChickenB: { x: 1765, y: 418 },
};

function computeCoverMap(container, imgW, imgH) {
  const rect = container.getBoundingClientRect();
  const cw = rect.width, ch = rect.height;
  const scale = Math.max(cw / imgW, ch / imgH);
  const dispW = imgW * scale, dispH = imgH * scale;
  const offX = (cw - dispW) / 2;
  const offY = (ch - dispH) / 2;
  return { scale, offX, offY, cw, ch };
}

function placeOverlays() {
  const container = document.getElementById("heroImg");
  if (!container) return;
  const map = computeCoverMap(container, IMG_W, IMG_H);
  Object.entries(POINTS).forEach(([id, p]) => {
    const el = document.getElementById(id);
    if (!el) return;
    const x = map.offX + p.x * map.scale;
    const y = map.offY + p.y * map.scale;
    el.style.left = x + "px";
    el.style.top = y + "px";
  });
}

function setupOverlays() {
  placeOverlays();
  window.addEventListener("resize", placeOverlays);
  window.addEventListener("load", placeOverlays);
  // image might reflow after fonts/layout settle
  setTimeout(placeOverlays, 300);
  setTimeout(placeOverlays, 1000);

  // ticking number in laptop glow
  const tick = document.getElementById("tickNum");
  if (tick) {
    setInterval(() => {
      const val = (Math.random() * 20 - 3).toFixed(1);
      const up = parseFloat(val) >= 0;
      tick.textContent = (up ? "+" : "") + val + "%";
      tick.style.color = up ? "#1f6b39" : "#8a3b2a";
    }, 1400);
  }
}

// ---------------- Sound (Web Audio, off by default) ----------------
function setupSound() {
  const btn = document.getElementById("soundBtn");
  if (!btn) return;
  let ctx = null;
  let nodes = null;
  let playing = false;

  function ensureCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    return ctx;
  }

  function startAmbience() {
    const audioCtx = ensureCtx();
    const master = audioCtx.createGain();
    master.gain.value = 0.05;
    master.connect(audioCtx.destination);

    // gentle wind drone
    const osc = audioCtx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = 90;
    const oscGain = audioCtx.createGain();
    oscGain.gain.value = 0.4;
    osc.connect(oscGain).connect(master);
    osc.start();

    nodes = { master, osc };

    // periodic cluck
    const cluckInterval = setInterval(() => {
      if (!playing) return;
      cluck(audioCtx, master);
    }, 4200 + Math.random() * 3000);
    nodes.cluckInterval = cluckInterval;
  }

  function cluck(audioCtx, master) {
    const o = audioCtx.createOscillator();
    o.type = "square";
    const g = audioCtx.createGain();
    g.gain.value = 0.0001;
    o.connect(g).connect(master);
    const t = audioCtx.currentTime;
    o.frequency.setValueAtTime(520, t);
    o.frequency.exponentialRampToValueAtTime(300, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.25, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
    o.start(t);
    o.stop(t + 0.2);
  }

  function cashRegister() {
    if (!playing) return;
    const audioCtx = ensureCtx();
    const master = audioCtx.createGain();
    master.gain.value = 0.12;
    master.connect(audioCtx.destination);
    [1046, 1318, 1568].forEach((freq, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      const t = audioCtx.currentTime + i * 0.06;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.3, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.3);
      o.connect(g).connect(master);
      o.start(t); o.stop(t + 0.32);
    });
  }

  function stopAmbience() {
    if (nodes) {
      nodes.osc.stop();
      clearInterval(nodes.cluckInterval);
      nodes = null;
    }
  }

  btn.addEventListener("click", () => {
    playing = !playing;
    btn.textContent = playing ? "🔊" : "🔇";
    if (playing) startAmbience(); else stopAmbience();
  });

  // cash register ka-ching on buy click / CA copy, only if sound is on
  ["buyBtn", "copyBtn", "copyBtnFooter"].forEach(id => {
    document.getElementById(id)?.addEventListener("click", () => { if (playing) cashRegister(); });
  });
}

// ---------------- Reveal on scroll ----------------
function setupReveal() {
  const targets = document.querySelectorAll(".trader-card, .ledger-book, .silo-card, .season-card, .note-card");
  targets.forEach(el => el.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    targets.forEach(el => el.classList.add("in"));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.15 });
  targets.forEach(el => io.observe(el));
  // safety net: never leave content permanently invisible if the observer misbehaves
  setTimeout(() => targets.forEach(el => el.classList.add("in")), 4000);
}

// ---------------- Silo report (DexScreener when CA is set) ----------------
async function refreshSilo() {
  if (!CONFIG.CA) return; // stays N/A until token is planted
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONFIG.CA}`);
    const data = await res.json();
    const pair = data?.pairs?.[0];
    if (!pair) return;
    document.getElementById("statPrice").textContent = pair.priceUsd ? `$${Number(pair.priceUsd).toFixed(6)}` : "N/A";
    document.getElementById("statMcap").textContent = pair.fdv ? `$${Number(pair.fdv).toLocaleString()}` : "N/A";
    document.getElementById("statVol").textContent = pair.volume?.h24 ? `$${Number(pair.volume.h24).toLocaleString()}` : "N/A";
    document.getElementById("statHolders").textContent = "N/A"; // Dexscreener API doesn't provide holder count
    document.getElementById("silo-note").textContent = "Live from Dexscreener. Updates on page load.";
  } catch (e) {
    // leave placeholders as-is
  }
}
