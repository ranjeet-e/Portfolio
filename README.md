# Ranjeet Epili — Portfolio

A single-page portfolio, split into separate HTML/CSS/JS files by concern. No build step, no dependencies — open `index.html` directly, or serve it with any static server.

## Structure

```
ranjeet-portfolio/
├── index.html              # structure only — links every file below
├── css/
│   ├── base.css             # design tokens, dark-mode tokens, resets, page grid
│   ├── navigation.css       # top nav bar + left sidebar (profile card, section nav)
│   ├── hero.css              # name/tagline, flip ID card, phone-chat back face
│   ├── sections.css         # Work/About tabs, Skills & Tools grid, Experience list
│   └── footer.css           # closing CTA + contact icons
├── js/
│   ├── interactions.js      # flip card, tab switching, save-profile toggle
│   └── navigation.js        # scroll-to-section nav, footer date
├── assets/                  # empty — put your photo, resume PDF, etc. here
├── public/                  # empty — build/deploy output target (see below)
└── README.md
```

## Run it locally

Just open `index.html` in a browser — everything is relative paths, no server required.

For a local dev server (useful to test on your phone over local wifi):
```bash
cd ranjeet-portfolio
python3 -m http.server 8000
# visit http://localhost:8000
```

## The `assets/` folder

Currently empty. This is where you add:
- A real photo (to replace the "RE" initials avatars — see **Customizing** below)
- Your resume PDF (to wire up the "Resume" button in the top nav, currently pointing to `#`)

## The `public/` folder

Currently empty — this is the conventional static-output directory that Vercel/Netlify/GitHub Pages look for by default. Since this site has no build step, you have two options:
1. **Simplest:** deploy the project root directly (see Deploy section below) and ignore `public/`.
2. **If your host requires `public/`:** copy everything into it before deploying:
   ```bash
   cp -r index.html css js assets public/
   ```

## Deploy it

Your skills list already includes Vercel, Render, and Netlify — any of these work with zero config:

**Vercel**
```bash
npm i -g vercel
cd ranjeet-portfolio
vercel
```

**Netlify** — drag-and-drop the whole `ranjeet-portfolio` folder onto [app.netlify.com/drop](https://app.netlify.com/drop), or:
```bash
npm i -g netlify-cli
cd ranjeet-portfolio
netlify deploy --prod
```

**GitHub Pages** — push this folder to a repo, then enable Pages on the `main` branch, root directory.

## Customizing

- **Colors/fonts** — CSS custom properties at the top of `css/base.css` (`--accent`, `--ink`, `--bg`, etc.). Everything else references these variables, so changing a token here updates the whole site.
- **Content** — each section lives in its own labeled block in `index.html`: `#hero`, `#work`/`#panel-about`, `#skills`, `#experiences`, `<footer>`.
- **Photo** — the site uses an "RE" initials avatar (`.avatar-initials`) instead of a photo, in 4 places: top nav, sidebar, ID card, phone chat bubble. To swap in a real photo: drop it in `assets/`, then replace the relevant `<div class="avatar-initials ...">RE</div>` with `<img src="assets/your-photo.jpg" class="...">` (keep the existing class names so sizing/position still applies).
- **Resume link** — the "Resume" button in `index.html`'s top nav points to `#`. Add your resume PDF to `assets/` and update that `href`.
- **Interactivity** — `js/interactions.js` handles the flip card, tabs, and save button; `js/navigation.js` handles scroll-to-section links and the footer date. Both are plain vanilla JS, no framework.

## Contact links already wired up
- Email: `ranjeet8022007@gmail.com`
- GitHub: `github.com/ranjeet-e`
- LinkedIn: `linkedin.com/in/ranjeet-epili`
