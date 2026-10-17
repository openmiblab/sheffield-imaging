(function () {
  "use strict";

  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const search = document.getElementById("search");
  const status = document.getElementById("status");

  let data = { groups: {}, staff: [] };
  let activeGroup = "All";

  // Only allow safe link types.
  function safeUrl(value, allowed) {
    try {
      const url = new URL(value, location.href);
      return allowed.includes(url.protocol) ? url.href : null;
    } catch (e) {
      return null;
    }
  }

  function initials(name) {
    const skip = new Set(["dr", "prof", "mr", "mrs", "ms", "mx"]);
    const parts = name
      .replace(/[.,]/g, "")
      .split(/\s+/)
      .filter((p) => p && !skip.has(p.toLowerCase()));
    if (parts.length === 0) return "?";
    const first = parts[0][0];
    const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
    return (first + last).toUpperCase();
  }

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function addRow(dl, label, linkText, href) {
    if (!href) return;
    const dt = el("dt", "", label);
    const dd = el("dd");
    const a = el("a", "", linkText);
    a.href = href;
    if (href.startsWith("http")) {
      a.rel = "noopener noreferrer";
      a.target = "_blank";
    }
    dd.appendChild(a);
    dl.append(dt, dd);
  }

  function buildBadge(person) {
    const li = el("li");
    const badge = el("article", "badge");
    const color = data.groups[person.group];
    if (color) badge.style.setProperty("--band", color);

    badge.appendChild(el("div", "band", person.group || "Staff"));

    const avatar = el("div", "avatar");
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = initials(person.name);
    if (person.photo) {
      const img = new Image();
      img.alt = "";
      img.loading = "lazy";
      img.onload = () => {
        avatar.textContent = "";
        avatar.appendChild(img);
      };
      img.src = person.photo; // falls back to initials if the file is missing
    }
    badge.appendChild(avatar);

    const who = el("div", "who");
    who.appendChild(el("h2", "name", person.name));
    if (person.role) who.appendChild(el("p", "role", person.role));
    badge.appendChild(who);

    const dl = el("dl", "details");
    if (person.email) {
      addRow(dl, "Email", person.email, "mailto:" + encodeURIComponent(person.email).replace("%40", "@"));
    }
    if (person.web) {
      const href = safeUrl(person.web, ["https:", "http:"]);
      addRow(dl, "Web", person.web.replace(/^https?:\/\//, "").replace(/\/$/, ""), href);
    }
    if (person.github) {
      addRow(dl, "GitHub", person.github, "https://github.com/" + encodeURIComponent(person.github));
    }
    if (person.orcid) {
      addRow(dl, "ORCID", person.orcid, "https://orcid.org/" + encodeURIComponent(person.orcid));
    }
    if (dl.children.length) badge.appendChild(dl);

    li.appendChild(badge);
    return li;
  }

  function render() {
    const q = search.value.trim().toLowerCase();
    const shown = data.staff.filter((p) => {
      const inGroup = activeGroup === "All" || p.group === activeGroup;
      const text = (p.name + " " + (p.role || "")).toLowerCase();
      return inGroup && (!q || text.includes(q));
    });

    grid.replaceChildren(...shown.map(buildBadge));

    if (shown.length === 0) {
      status.textContent = "No one matches. Clear the search or choose a different group.";
    } else {
      status.textContent = shown.length + (shown.length === 1 ? " person" : " people");
    }
  }

  function buildFilters() {
    const names = ["All", ...Object.keys(data.groups)];
    filters.replaceChildren(
      ...names.map((name) => {
        const b = el("button", "", name === "All" ? "Everyone" : name);
        b.type = "button";
        b.setAttribute("aria-pressed", String(name === activeGroup));
        b.addEventListener("click", () => {
          activeGroup = name;
          filters.querySelectorAll("button").forEach((btn, i) =>
            btn.setAttribute("aria-pressed", String(names[i] === activeGroup))
          );
          render();
        });
        return b;
      })
    );
  }

  async function init() {
    try {
      const res = await fetch("staff.json", { cache: "no-cache" });
      if (!res.ok) throw new Error("HTTP " + res.status);
      data = await res.json();
    } catch (err) {
      status.textContent =
        "Could not load staff.json. If you opened index.html directly from disk, " +
        "run a local server instead (see README).";
      return;
    }

    if (data.title) {
      document.getElementById("title").textContent = data.title;
      document.title = data.title;
    }
    if (data.intro) document.getElementById("intro").textContent = data.intro;

    buildFilters();
    search.addEventListener("input", render);
    render();
  }

  init();
})();
