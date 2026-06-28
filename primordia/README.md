# PRIMORDIA

*An emergent particle-life observatory — a single, self-contained HTML file.*

A handful of coloured species, each governed by simple rules of attraction and
repulsion toward the others. No design, no goal — just physics. Out of that
nothing, **cells, swarms, chasers and rotating galaxies organize themselves**.
Leave it running; it never repeats.

```
anima/primordia/
└── index.html      ← just open it in a browser
```

## Run it

Double-click `index.html`. No build step, no dependencies, no server.
Best in a desktop Chrome / Firefox / Safari window. Fonts (Fraunces +
IBM Plex Mono) load from Google Fonts when online; clean fallbacks otherwise.

> Tip: leave a world running for 15–30 seconds — structure emerges over time,
> it isn't there in the first frame.

## The worlds (presets)

| # | World      | What emerges                                              |
|---|------------|----------------------------------------------------------|
| 1 | GENESIS    | A fresh random rule-set — pure chance, always different   |
| 2 | CELLS      | Self-attracting, mutually-repelling blobs → membranes     |
| 3 | SNAKES     | Each species chases the next → wriggling chains           |
| 4 | HUNT       | Asymmetric predator/prey cycles → endless pursuit         |
| 5 | GALAXIES   | Long-range mutual attraction → slow rotating clusters     |
| 6 | CRYSTALS   | Hard segregation → lattice-like crystalline domains       |
| 7 | SYMBIOSIS  | A symmetric rule-set → balanced, reciprocal communities   |

## Controls

- **Worlds** — one click loads a preset (or press `1`–`7`).
- **Interaction matrix** — the laws of the universe. Each cell is the force that
  the *column* species exerts on the *row* species. **Drag a cell up/down** to
  edit it live: <span>green = attract, red = repel</span>.
- **Parameters** — particles, species, interaction radius, force, friction,
  repulsion zone, time scale, trails, particle size, glow.
- **Canvas** — **drag to pull** particles toward the cursor, **right-drag to push**.

### Keyboard

| Key      | Action                          |
|----------|---------------------------------|
| `Space`  | pause / resume time             |
| `R`      | randomize the interaction matrix|
| `N`      | re-seed all particles           |
| `H`      | hide / show the console         |
| `S`      | save a snapshot (PNG)           |
| `F`      | fullscreen                      |
| `1`–`7`  | jump to a preset world          |
| `?`      | field manual                    |

## How it works

Each particle feels every neighbour within the **interaction radius** `rMax`.
The force depends only on the normalized distance `r` and the matrix coefficient
`a` for that species pair:

```
        ┌ r/β − 1                                  ,  r < β     (close repulsion)
f(r,a) =┤ a · (1 − |2r − 1 − β| / (1 − β))         ,  β ≤ r < 1 (attract / repel)
        └ 0                                         ,  r ≥ 1
```

Velocities are damped each step toward zero (the **friction** half-life) and the
space wraps as a torus, so there are no edges. Neighbour lookups use a **uniform
spatial grid** (linked-list buckets), keeping each step ~O(n) instead of O(n²) —
which is what lets it carry a few thousand particles at 60 fps. Rendering layers
a faint additive **halo** under a bright **core** for every particle and fades
the previous frame slightly each tick, producing the luminous motion trails.

The model is the classic *particle life* / *clusters* family popularized by
Jeffrey Ventrella and Tom Mohr; this is an original from-scratch implementation
with a curated set of worlds and an instrument-panel UI.

---

*Part of the ANIMA cabinet. Have fun rewriting the laws of a tiny universe.* ✦
