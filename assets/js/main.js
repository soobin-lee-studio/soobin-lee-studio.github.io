(() => {
  const root = document.documentElement;
  root.classList.remove("no-js");

  /* ---------- Theme toggle ---------- */
  const THEME_KEY = "sl-theme";
  const toggle = document.querySelector(".theme-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => root.dataset.theme || (prefersDark.matches ? "dark" : "light");

  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    });
  }

  /* ---------- Language toggle ---------- */
  const LANG_KEY = "sl-lang";
  const setLang = (lang) => {
    root.dataset.lang = lang;
    root.lang = lang;
    const title = root.dataset[lang === "en" ? "titleEn" : "titleKo"];
    if (title) document.title = title;
    document.querySelectorAll("[data-set-lang]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.setLang === lang))
    );
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}
  };
  if (!root.dataset.titleKo) root.dataset.titleKo = document.title;
  setLang(root.dataset.lang === "en" ? "en" : "ko");
  document.querySelectorAll("[data-set-lang]").forEach((b) =>
    b.addEventListener("click", () => setLang(b.dataset.setLang))
  );

  /* ---------- TOC active state (project pages) ---------- */
  const tocLinks = [...document.querySelectorAll('.toc a[href^="#"]')];
  const chapters = tocLinks.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if (chapters.length && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          tocLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${e.target.id}`));
        }),
      { rootMargin: "-30% 0px -60% 0px" }
    );
    chapters.forEach((c) => io.observe(c));
  }

  /* ---------- Reveal on scroll ---------- */
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const ro = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            ro.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => ro.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Lightbox (case study figures) ---------- */
  const figures = document.querySelectorAll(".fig button[data-full]");
  if (figures.length && typeof HTMLDialogElement === "function") {
    const dialog = document.createElement("dialog");
    dialog.className = "lightbox";
    dialog.innerHTML = '<button class="lightbox-close" aria-label="닫기">×</button><img alt="">';
    document.body.appendChild(dialog);
    const img = dialog.querySelector("img");

    figures.forEach((btn) =>
      btn.addEventListener("click", () => {
        img.src = btn.dataset.full;
        img.alt = btn.querySelector("img")?.alt || "";
        dialog.showModal();
      })
    );
    dialog.addEventListener("click", () => dialog.close());
  }

  /* ---------- Footer year ---------- */
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
