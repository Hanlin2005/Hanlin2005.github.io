(function () {
  var storageKey = "theme";
  var systemKey = "theme-system";

  function systemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }

  function read(key) {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      return null;
    }
  }

  function write(key, value) {
    try {
      if (value == null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch (error) {}
  }

  function savedTheme() {
    var value = read(storageKey);
    return value === "dark" || value === "light" ? value : null;
  }

  function themeToUse() {
    var system = systemTheme();
    var saved = savedTheme();
    var savedSystem = read(systemKey);
    if (saved && savedSystem === system) return saved;
    write(storageKey, null);
    write(systemKey, system);
    return system;
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    var button = document.querySelector(".theme-toggle");
    if (!button) return;
    var dark = theme === "dark";
    button.setAttribute("aria-pressed", dark ? "true" : "false");
    button.setAttribute("aria-label", dark ? "Switch to day mode" : "Switch to night mode");
  }

  applyTheme(themeToUse());

  document.addEventListener("DOMContentLoaded", function () {
    applyTheme(document.documentElement.getAttribute("data-theme") || systemTheme());
    var button = document.querySelector(".theme-toggle");
    if (button) {
      button.addEventListener("click", function () {
        var next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
        write(storageKey, next);
        write(systemKey, systemTheme());
        applyTheme(next);
      });
    }

    var toTop = document.createElement("button");
    toTop.className = "totop";
    toTop.type = "button";
    toTop.setAttribute("aria-label", "Back to top");
    toTop.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M6 14l6-6 6 6"/></svg>';
    document.body.appendChild(toTop);
    function showToTop() {
      toTop.classList.toggle("visible", window.scrollY > 500);
    }
    window.addEventListener("scroll", showToTop, { passive: true });
    showToTop();
    toTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });

  var media = window.matchMedia("(prefers-color-scheme: dark)");
  if (media.addEventListener) {
    media.addEventListener("change", function () {
      write(storageKey, null);
      write(systemKey, systemTheme());
      applyTheme(systemTheme());
    });
  }
})();
