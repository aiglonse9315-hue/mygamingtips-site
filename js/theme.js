/* ============================================================
   theme.js — Toggle jour/nuit live + persistance.
   - V3 : Défaut = NUIT (la vedette), quel que soit le système.
   - data-theme="dark|light" sur <html>.
   - 2 déclencheurs : header + section Personnalisation.
   - Le mode clair reste accessible via le toggle.
   - Respecte prefers-reduced-motion (crossfade via CSS déjà réduit).
   ============================================================ */
(function () {
  "use strict";

  var STORAGE_KEY = "mgt-theme";

  function getStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function store(theme) {
    try { localStorage.setItem(STORAGE_KEY, theme); } catch (e) {}
  }

  function resolveInitial() {
    var stored = getStored();
    if (stored === "dark" || stored === "light") return stored;
    // V3 : DARK par défaut, quel que soit le réglage système.
    // Le mode clair reste accessible via le toggle du header.
    return "dark";
  }

  function setTheme(theme) {
    if (theme !== "dark" && theme !== "light") theme = "dark";
    document.documentElement.setAttribute("data-theme", theme);
    store(theme);
    updateToggleUI(theme);
    document.dispatchEvent(new CustomEvent("mgt:themechange", {
      detail: { theme: theme }
    }));
  }

  function toggle() {
    var current = document.documentElement.getAttribute("data-theme") || "dark";
    setTheme(current === "dark" ? "light" : "dark");
  }

  function updateToggleUI(theme) {
    // Boutons header (icône lune/soleil + aria-label + aria-pressed)
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function (btn) {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      // Swap icône : nuit = soleil (pour passer en jour), jour = lune
      var sunIcon = btn.querySelector("[data-icon='sun']");
      var moonIcon = btn.querySelector("[data-icon='moon']");
      if (sunIcon && moonIcon) {
        sunIcon.style.display = theme === "dark" ? "" : "none";
        moonIcon.style.display = theme === "dark" ? "none" : "";
      }
      // aria-label dynamique via i18n si dispo
      if (window.MGTi18n) {
        var key = theme === "dark" ? "a11y.theme_light" : "a11y.theme_dark";
        var label = window.MGTi18n.t(key);
        if (label) btn.setAttribute("aria-label", label);
      }
    });
  }

  // V3 : On ne suit plus prefers-color-scheme. Le défaut est DARK,
  // quoi que fasse le système. L'utilisateur garde le contrôle via le toggle.
  // (On garde la fonction pour ne pas casser d'éventuels appels, mais no-op.)
  function bindSystemListener() { /* no-op : DARK par défaut V3 */ }

  function init() {
    // Pose le data-theme AVANT le rendu pour éviter le flash.
    // (un script inline en <head> fait déjà l'init critique ;
    //  ici on s'assure de la cohérence.)
    var initial = document.documentElement.getAttribute("data-theme");
    if (!initial) {
      initial = resolveInitial();
      document.documentElement.setAttribute("data-theme", initial);
    }
    updateToggleUI(initial);

    // Branche les boutons
    var toggles = document.querySelectorAll("[data-theme-toggle]");
    toggles.forEach(function (btn) {
      btn.addEventListener("click", toggle);
    });

    bindSystemListener();
  }

  window.MGTtheme = {
    init: init,
    set: setTheme,
    toggle: toggle,
    current: function () {
      return document.documentElement.getAttribute("data-theme") || "dark";
    }
  };
})();
