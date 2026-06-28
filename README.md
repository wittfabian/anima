# ANIMA — a cabinet of living things

*Seven generative worlds, each grown from a few simple rules. Nothing here
repeats. Pick one, leave it running, and watch it become.*

A self-contained, dependency-free exhibition of generative art built in the
`Weekly-Fun` folder: a gallery, seven living worlds, a science codex, and a
shared navigation that lets you wander between rooms.

## Run it

Double-click **`index.html`** (the gallery). No build, no install, no server —
every page is a single HTML file with relative links. Best in a desktop
Chrome / Firefox / Safari window; runs on mobile too. Fonts load from Google
Fonts when online. It's also an installable PWA (manifest + icon).

```
Weekly-Fun/
├── index.html               ← ANIMA — the gallery / launcher
├── codex/index.html         ← the Codex — the science behind each world
├── anima-nav.js             ← shared exhibition nav (loaded by every world)
├── favicon.svg · manifest.webmanifest
├── primordia/index.html     ← 01 · emergent particle life
├── flux/index.html          ← 02 · silk woven from a flow field
├── morphogenesis/index.html ← 03 · patterns that grow themselves
├── resonance/index.html     ← 04 · a garden that sings in ripples
├── mycelia/index.html       ← 05 · a mind without a brain
├── folia/index.html         ← 06 · growth that folds in on itself
└── animalcula/index.html    ← 07 · small living things that emerge from noise
```

## Wandering the exhibition

Every world carries a shared nav capsule (top-centre): **❮ prev · ✦ anima · next ❯**.

- **← / →** jump to the previous / next world.
- **G** or **✦ anima** returns to the gallery.
- The gallery's **⟳ surprise me** opens a random world.
- Each world's own controls live in its side panel; **S** saves a PNG snapshot,
  **H** hides the UI, **Space** pauses. Look for the on-screen hint / `?`.

## The seven worlds

### 01 · PRIMORDIA — *emergent particle life*
Coloured species pull and push on one another through an editable interaction
matrix. Out of nothing: cells, swarms, chasers, galaxies. Toroidal space,
spatial-grid neighbour search (~O(n)), additive glow with motion trails.
**Canvas 2D.** 7 preset worlds · drag the matrix to rewrite the laws.

### 02 · FLUX — *liquid light*
Thousands of agents drift along an animated Perlin flow field, each tracing a
thin luminous thread. The result is silk, ink-in-water, aurora. Six palettes,
drag to stir the current, click to bloom. **Canvas 2D + Perlin noise.**

### 03 · MORPHOGENESIS — *living patterns*
A Gray-Scott reaction-diffusion system on the GPU. Turing patterns — coral,
mazes, mitosis, solitons — emerge and crawl across the dish. Embossed shading
makes them tactile. **Drag to grow life.** Seven cultures, six palettes. **WebGL2.**

### 04 · RESONANCE — *a generative sound garden*
Click to plant singing seeds. Each pulses and sends out ripples; when a ripple
crosses another seed, it chimes and ripples in turn — emergent, ever-shifting
polyrhythms. Pitch follows height, always on a consonant scale. Five scales,
ambient drone, reverb. **Web Audio + Canvas 2D.** *(Click once to begin.)*

### 05 · MYCELIA — *a mind without a brain*
A *Physarum polycephalum* (slime-mould) simulation entirely on the GPU — over a
million agents, each depositing a trail, smelling the trail ahead and steering
toward it. With no brain and no plan, they weave optimal transport networks:
veins, webs, branching highways. **Drag to feed the colony.** Five behaviours.
**WebGL2** (agent state + chemical field in float textures; 1M+ agents on an RTX 4090).

### 06 · FOLIA — *growth that folds in on itself*
The one bright world: a herbarium plate. A closed curve whose nodes repel their
neighbours, hold hands with the two beside them, and sprout new points between
stretched edges — so the perimeter outgrows its space and the line buckles into
folds: brain coral, leaves, convolutions. Dark ink on warm paper. **Drag to coax
the growth.** Five specimens, four inks. **Canvas 2D · differential growth.**

### 07 · ANIMALCULA — *small living things that emerge from noise*
The flagship: **SmoothLife**, the continuous ancestor of Lenia and descendant of
Conway's Game of Life. State, neighbourhood and time all dissolve into a smooth
medium, and out of a primordial smear, soft self-propelled cells glide, divide,
and die under a fluorescence-microscope dark field. **Drag to inoculate the dish.**
Four cultures, five stains. **WebGL2 · cellular automata.**

## The Codex

[`codex/index.html`](codex/index.html) is the exhibition's field guide — the real
science, history and mathematics behind each world (Turing's morphogenesis,
Ventrella's Clusters, Perlin's noise, the Tokyo-rail slime mould, Nervous System's
Floraform, Rafler's SmoothLife and Chan's Lenia), with cited sources.

## Notes

- **Accessibility:** keyboard-operable controls with visible focus, `aria` labels,
  re-enabled pinch-zoom, and `prefers-reduced-motion` handling (gentle chrome;
  the gallery composes a static frame).
- **Performance:** the gallery pauses off-screen card previews (IntersectionObserver).
- **Privacy & PWA:** fonts are self-hosted (no Google Fonts CDN — GDPR-safe); links carry an
  Open-Graph/Twitter social preview; and the site is an installable, offline-capable PWA
  (service worker + manifest).
- **`?debug`:** appending `?debug` to any world's URL exposes a `window.__pump(n)`
  frame-stepper — an inert verification hook, invisible in normal use.

## Going online

It's fully static — host the folder on any static host. See **[DEPLOY.md](DEPLOY.md)**
for step-by-step GitHub Pages instructions.

---

*Handcrafted for a weekend. ✦*
