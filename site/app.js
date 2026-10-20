const profile = window.PROFILE;
if (!profile) throw new Error("Profile content could not be loaded.");

const byId = (id) => document.getElementById(id);
const setText = (id, value) => {
  const element = byId(id);
  if (element && value) element.textContent = value;
};
const make = (tag, className, text) => {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
};
const external = (element, url) => {
  element.href = url;
  element.target = "_blank";
  element.rel = "noreferrer";
  return element;
};
const rich = (text) =>
  text.split(/\*\*(.+?)\*\*/).map((part, index) => (index % 2 ? make("strong", "", part) : part));
const people = (list) => {
  const line = make("p", "fine");
  (list || []).forEach((person, index) => {
    if (index) line.append(" · ");
    line.append(person.role + ": ");
    line.append(person.url ? external(make("a", "", person.name), person.url) : person.name);
  });
  return line;
};
const when = (date, upcoming) => {
  const element = make("span", "when", date);
  if (upcoming) element.append(make("em", "", "upcoming"));
  return element;
};

/* theme toggle: remembers the choice per browser, falls back to the OS setting */
const root = document.documentElement;
try {
  const saved = localStorage.getItem("theme");
  if (saved) root.dataset.theme = saved;
} catch {}
byId("theme").addEventListener("click", () => {
  const dark = root.dataset.theme
    ? root.dataset.theme === "dark"
    : matchMedia("(prefers-color-scheme: dark)").matches;
  root.dataset.theme = dark ? "light" : "dark";
  try {
    localStorage.setItem("theme", root.dataset.theme);
  } catch {}
  dispatchEvent(new Event("themechange"));
});

/* hero */
document.title = profile.pageTitle;
document.querySelector('meta[name="description"]').content = profile.description;
setText("profile-name", profile.name.replace("-", "\u2011")); // keep a hyphenated surname on one line
setText("position", profile.position + " · " + profile.affiliation);
setText("location", profile.location);
setText("status", profile.status);
setText("bio", profile.bio);
setText("photo-label", profile.photoLabel);
setText("copyright", "© " + new Date().getFullYear() + " " + profile.name);
if (profile.photo) document.querySelectorAll("#photo-box img").forEach((img) => (img.src = profile.photo));
if (profile.cv) {
  byId("cv-link").href = profile.cv;
  byId("cv-link").hidden = false;
}

document.querySelectorAll("[data-email]").forEach((link) => {
  if (!profile.email) return;
  link.href = "mailto:" + profile.email;
  link.textContent = profile.email;
  link.hidden = false;
});
document.querySelectorAll("[data-link]").forEach((link) => {
  const url = profile[link.dataset.link];
  if (url) link.href = url;
  else link.hidden = true;
});
const action = byId("primary-action");
if (profile.email) {
  action.href = "mailto:" + profile.email;
  action.removeAttribute("target");
  action.firstChild.textContent = "Email me";
} else {
  action.href = profile.linkedin || profile.github;
}

const clockFormat = new Intl.DateTimeFormat("en-US", {
  timeZone: profile.timezone,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZoneName: "short",
});
function tick() {
  const parts = Object.fromEntries(clockFormat.formatToParts(new Date()).map((part) => [part.type, part.value]));
  setText("clock", parts.hour + ":" + parts.minute + " " + parts.timeZoneName);
}
tick();
setInterval(tick, 20000);

/* research interests as a superposition; quantum.js animates the amplitudes */
byId("interest-list").replaceChildren(
  ...profile.interests.map((item, index) => {
    const card = make("article", "state");
    const amp = make("div", "amp");
    amp.append(make("span", "", "|" + index + "⟩"), make("i"), make("span", "amp-val", "—"));
    card.append(amp, make("h3", "", item.title), make("p", "", item.text));
    return card;
  }),
);

byId("news-list").replaceChildren(
  ...profile.news.map((item) => {
    const row = make("article", "item");
    const text = make("p", "news-text");
    if (item.url) text.append(external(make("a"), item.url));
    (text.firstChild || text).append(...rich(item.text));
    row.append(when(item.date, item.upcoming), text);
    return row;
  }),
);

byId("publication-list").replaceChildren(
  ...profile.publications.map((item, index) => {
    const row = make("article", "paper");
    const links = Object.entries(item.links || {}).filter(([, url]) => url);

    const title = make("h3");
    if (links.length) title.append(external(make("a", "", item.title), links[0][1]));
    else title.textContent = item.title;

    const authors = make("p", "authors");
    item.authors.forEach((author, authorIndex) => {
      const name = make(author.self ? "strong" : "span", "", author.name);
      authors.append(author.url ? external(make("a", "", author.name), author.url) : name);
      const marks = (author.equal ? "#" : "") + (author.corresponding ? "*" : "");
      if (marks) authors.append(make("sup", "", marks));
      if (authorIndex < item.authors.length - 1) authors.append(", ");
    });

    row.append(make("p", "paper-venue", item.venue), title, authors);

    const actions = make("div", "actions");
    links.forEach(([label, url]) => actions.append(external(make("a", "", label + " ↗"), url)));

    if (item.bibtex) {
      const toggle = make("button", "", "BibTeX");
      toggle.type = "button";
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-controls", "bib-" + index);
      actions.append(toggle);

      const panel = make("div", "bib");
      panel.id = "bib-" + index;
      panel.hidden = true;
      const copy = make("button", "", "copy");
      copy.type = "button";
      copy.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(item.bibtex);
          copy.textContent = "copied";
        } catch {
          copy.textContent = "select to copy";
        }
        setTimeout(() => (copy.textContent = "copy"), 1600);
      });
      panel.append(make("pre", "", item.bibtex), copy);

      toggle.addEventListener("click", () => {
        panel.hidden = !panel.hidden;
        toggle.setAttribute("aria-expanded", String(!panel.hidden));
      });
      row.append(actions, panel);
    } else if (links.length) {
      row.append(actions);
    }
    return row;
  }),
);

byId("experience-list").replaceChildren(
  ...profile.experience.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.title), make("p", "", item.institution));
    if (item.people) body.append(people(item.people));
    row.append(when(item.date), body);
    return row;
  }),
);

byId("honors-list").replaceChildren(
  ...profile.honors.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.title), make("p", "", item.institution));
    row.append(when(item.year), body);
    return row;
  }),
);

byId("education-list").replaceChildren(
  ...profile.education.map((item) => {
    const row = make("article", "item");
    const body = make("div");
    body.append(make("h3", "", item.institution), make("p", "", item.degree));
    if (item.detail) body.append(make("p", "fine", item.detail));
    if (item.people) body.append(people(item.people));
    row.append(when(item.date), body);
    return row;
  }),
);

/* scroll progress + active section */
const nav = document.querySelector(".nav");
let queued = false;
addEventListener(
  "scroll",
  () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - innerHeight;
      nav.style.setProperty("--progress", max > 0 ? (scrollY / max).toFixed(4) : 0);
      queued = false;
    });
  },
  { passive: true },
);
const navLinks = [...document.querySelectorAll(".links a[data-section]")];
const sectionObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      navLinks.forEach((link) => {
        if (entry.isIntersecting) link.classList.toggle("active", link.dataset.section === entry.target.id);
        else if (link.dataset.section === entry.target.id) link.classList.remove("active");
      });
    }),
  { rootMargin: "-40% 0px -55% 0px" },
);
navLinks.forEach((link) => sectionObserver.observe(byId(link.dataset.section)));

/* reveal on scroll */
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      }
    }),
  { threshold: 0.08 },
);
document.querySelectorAll(".reveal").forEach((element) => revealObserver.observe(element));
