# hydrogen1999.github.io

Personal academic page of Thinh Nguyen-Cong, live at <https://hydrogen1999.github.io>.

A dependency-free static site in `site/`, deployed by `.github/workflows/pages.yml` on every push to `main`.

- **Edit content:** `site/profile.js` only (bio, interests, news, publications, experience, education, links).
- **Photo / CV:** replace `site/assets/portrait.jpg`; drop a `cv.pdf` into `site/assets/` and set `cv: "assets/cv.pdf"`.
- **Quantum effects:** `site/quantum.js` (live annealed Ising spin glass background, name collapse, amplitude cards, interference fringes).

Preview locally: `python3 -m http.server -d site 8000`.
