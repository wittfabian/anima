/* ============================================================
   anima-nav.js — shared exhibition navigation for the ANIMA cabinet.
   Injected into every world. Replaces the per-world home link with a
   consistent capsule: ❮ prev · ✦ anima 0X/07 · next ❯, plus arrow-key
   navigation between worlds. Respects prefers-reduced-motion.
   ============================================================ */
(() => {
  "use strict";
  const WORLDS = [
    { slug: "primordia",     name: "Primordia",     accent: "#f4a428", bg: "#07070b" },
    { slug: "flux",          name: "Flux",          accent: "#62c7e0", bg: "#060608" },
    { slug: "morphogenesis", name: "Morphogenesis", accent: "#5fe6c0", bg: "#04080a" },
    { slug: "resonance",     name: "Resonance",     accent: "#f0c27b", bg: "#05050a" },
    { slug: "mycelia",       name: "Mycelia",       accent: "#aef24a", bg: "#04060a" },
    { slug: "folia",         name: "Folia",         accent: "#3f6b46", bg: "#efe7d6", light: true },
    { slug: "animalcula",    name: "Animalcula",    accent: "#b98cff", bg: "#06040c" },
  ];

  const path = location.pathname;
  let idx = WORLDS.findIndex(w => path.indexOf("/" + w.slug + "/") !== -1 || path.endsWith("/" + w.slug));
  if (idx === -1) return; // not on a world page

  const n = WORLDS.length;
  const cur = WORLDS[idx];
  const prev = WORLDS[(idx - 1 + n) % n];
  const next = WORLDS[(idx + 1) % n];
  const pad = (i) => String(i).padStart(2, "0");

  // remove the static fallback home link (we replace it with a richer capsule)
  const old = document.querySelector(".home-link");
  if (old) old.remove();

  const css = `
    .anav{position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:40;display:flex;align-items:stretch;
      font-family:"JetBrains Mono",ui-monospace,monospace;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;
      border:1px solid rgba(255,255,255,0.14);border-radius:100px;overflow:hidden;
      background:rgba(8,8,12,0.55);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);
      box-shadow:0 10px 34px rgba(0,0,0,0.4);}
    .anav a,.anav button{font:inherit;letter-spacing:inherit;text-transform:inherit;background:transparent;border:0;
      color:rgba(255,255,255,0.55);text-decoration:none;cursor:pointer;display:flex;align-items:center;gap:8px;
      padding:8px 14px;transition:color .2s,background .2s;}
    .anav a:hover,.anav button:hover{color:#fff;background:rgba(255,255,255,0.06);}
    .anav .sep{width:1px;background:rgba(255,255,255,0.12);}
    .anav .home{color:rgba(255,255,255,0.7);}
    .anav .home b{color:${cur.accent};font-weight:400;}
    .anav .pos{color:rgba(255,255,255,0.38);font-variant-numeric:tabular-nums;}
    .anav .arr{font-size:12px;letter-spacing:0;}
    .anav.light{background:rgba(247,241,229,0.74);border-color:rgba(36,31,23,0.16);box-shadow:0 10px 34px rgba(60,45,20,0.18);}
    .anav.light a,.anav.light button{color:rgba(36,31,23,0.6);}
    .anav.light a:hover,.anav.light button:hover{color:#241f17;background:rgba(36,31,23,0.06);}
    .anav.light .sep{background:rgba(36,31,23,0.14);}
    .anav.light .home{color:rgba(36,31,23,0.78);}
    .anav.light .pos{color:rgba(36,31,23,0.4);}
    :focus-visible{outline:2px solid var(--accent,#9ad);outline-offset:2px;border-radius:3px;}
    canvas{touch-action:none;}
    @media (prefers-reduced-motion: reduce){*{animation-duration:.001ms !important;animation-iteration-count:1 !important;transition-duration:.001ms !important;}}
    @media (max-width:520px){.anav{font-size:9px}.anav a,.anav button{padding:7px 10px}.anav .pos{display:none}}
  `;
  const style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  // a11y: re-enable pinch-zoom that the per-world viewport meta disabled (WCAG 1.4.4)
  const vp = document.querySelector('meta[name="viewport"]');
  if (vp) vp.setAttribute("content", "width=device-width, initial-scale=1, viewport-fit=cover");

  // shared favicon + theme colour across the cabinet
  if (!document.querySelector('link[rel="icon"]')) { const ic = document.createElement("link"); ic.rel = "icon"; ic.type = "image/svg+xml"; ic.href = "../favicon.svg"; document.head.appendChild(ic); }
  if (!document.querySelector('meta[name="theme-color"]')) { const tc = document.createElement("meta"); tc.name = "theme-color"; tc.content = cur.bg || "#07070b"; document.head.appendChild(tc); }

  // offline + installable: shared service worker lives at the deploy root
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("../service-worker.js").catch(() => {});

  const nav = document.createElement("nav");
  nav.className = "anav" + (cur.light ? " light" : "");
  nav.setAttribute("aria-label", "Exhibition navigation");
  nav.innerHTML =
    `<button class="arr" id="anavPrev" title="Previous: ${prev.name}" aria-label="Previous world: ${prev.name}">❮</button>` +
    `<span class="sep"></span>` +
    `<a class="home" href="../index.html" title="Back to the gallery">✦&nbsp;<b>anima</b>&nbsp;<span class="pos">${pad(idx + 1)}/${pad(n)}</span></a>` +
    `<span class="sep"></span>` +
    `<button class="arr" id="anavNext" title="Next: ${next.name}" aria-label="Next world: ${next.name}">❯</button>`;
  document.body.appendChild(nav);

  const go = (w) => { location.href = "../" + w.slug + "/index.html"; };
  document.getElementById("anavPrev").addEventListener("click", () => go(prev));
  document.getElementById("anavNext").addEventListener("click", () => go(next));

  addEventListener("keydown", (e) => {
    if (e.target && (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "ArrowLeft")  { e.preventDefault(); go(prev); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(next); }
    else if (e.key.toLowerCase() === "g") { location.href = "../index.html"; }
  });
})();
