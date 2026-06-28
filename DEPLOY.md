# Deploying ANIMA to GitHub Pages

ANIMA is fully static (HTML/CSS/JS, no build, no backend) and already production-hardened:
self-hosted fonts (GDPR-safe — no Google CDN), Open-Graph/Twitter social previews, and an
offline-capable, installable PWA (service worker + manifest). Just publish the folder.

## Option A — Git (recommended)

```bash
cd "Weekly-Fun"
git init
git add .
git commit -m "ANIMA — a cabinet of living things"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git   # create the empty repo on github.com first
git push -u origin main
```

Then on GitHub: **Settings → Pages → Build and deployment → Source: “Deploy from a branch” →
Branch: `main` / folder `/ (root)` → Save.**

After ~1 minute your site is live at:

```
https://<you>.github.io/<repo>/
```

(If you name the repo exactly `<you>.github.io`, it serves at the root `https://<you>.github.io/`.)

## Option B — No command line

1. Create a new repository on github.com.
2. “Add file → Upload files”, drag in **the contents** of the `Weekly-Fun` folder
   (so `index.html` lands at the repo root), commit.
3. Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)` → Save.

## Notes

- **`.nojekyll`** is included so GitHub serves every file (incl. `fonts/`) untouched.
- **Relative paths** are used throughout, so it works in a subdirectory (`/<repo>/`) — no config needed.
- **HTTPS** is automatic; that's all the PWA / service worker needs to install and run offline.
- **Updating:** edit → commit → push. When you change content, bump `VERSION` in
  `service-worker.js` (e.g. `anima-v1` → `anima-v2`) so returning visitors get the new files
  instead of the cached ones.
- **Custom domain (optional):** add a `CNAME` file containing your domain and set the DNS
  records GitHub shows under Settings → Pages.
- **Perfect Twitter/X cards (optional):** the `og:image` tags use a relative path, which most
  platforms resolve. For guaranteed absolute URLs, replace `og-image.png` /
  `../og-image.png` with the full `https://…/og-image.png` once you know the final URL.

## What gets published

```
index.html · codex/ · conway/ · anima-nav.js · service-worker.js
manifest.webmanifest · favicon.svg · og-image.png · .nojekyll · fonts/
primordia/ · flux/ · morphogenesis/ · resonance/ · mycelia/ · folia/ · animalcula/
```
