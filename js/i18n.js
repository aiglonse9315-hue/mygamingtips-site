/* ============================================================
   i18n.js — Internationalisation (12 langues)
   - Détection auto navigator.language au 1er chargement
   - Persistance localStorage ('mgt-lang')
   - Chargement locales/<code>.json
   - Remplacement DOM via [data-i18n] / [data-i18n-html] / [data-i18n-alt]
   - Bascule RTL pour l'arabe (dir="rtl" sur <html>)
   - Fallback EN si la locale demandée échoue
   ============================================================ */
(function () {
  "use strict";

  var SUPPORTED = [
    { code: "fr", native: "Français",  flag: "FR" },
    { code: "en", native: "English",   flag: "EN" },
    { code: "es", native: "Español",   flag: "ES" },
    { code: "de", native: "Deutsch",   flag: "DE" },
    { code: "it", native: "Italiano",  flag: "IT" },
    { code: "pt", native: "Português", flag: "PT" },
    { code: "ru", native: "Русский",   flag: "RU" },
    { code: "zh", native: "中文",        flag: "ZH" },
    { code: "ja", native: "日本語",      flag: "JA" },
    { code: "ko", native: "한국어",      flag: "KO" },
    { code: "ar", native: "العربية",   flag: "AR" },
    { code: "hi", native: "हिन्दी",     flag: "HI" }
  ];
  var SUPPORTED_CODES = SUPPORTED.map(function (s) { return s.code; });
  var DEFAULT_LANG = "en";
  var STORAGE_KEY = "mgt-lang";
  var RTL_LANGS = ["ar"];

  var cache = {};
  var currentLang = DEFAULT_LANG;
  var currentDict = {};

  /* ---------- Détection ---------- */
  function detectLang() {
    // 1. localStorage d'abord
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved && SUPPORTED_CODES.indexOf(saved) !== -1) return saved;
    } catch (e) {}

    // 2. navigator.language / languages
    var navLangs = [];
    if (navigator.languages && navigator.languages.length) {
      navLangs = navigator.languages.slice();
    } else if (navigator.language) {
      navLangs = [navigator.language];
    }
    for (var i = 0; i < navLangs.length; i++) {
      var lower = String(navLangs[i]).toLowerCase();
      // match exact (fr) puis base (fr-CA -> fr)
      var exact = lower.split("-")[0];
      if (SUPPORTED_CODES.indexOf(exact) !== -1) return exact;
    }
    return DEFAULT_LANG;
  }

  /* ---------- Chargement locales ---------- */
  function loadLocale(code) {
    if (cache[code]) {
      return Promise.resolve(cache[code]);
    }
    var url = "locales/" + code + ".json";
    return fetch(url, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) throw new Error("locale not found: " + code);
        return res.json();
      })
      .then(function (dict) {
        cache[code] = dict;
        return dict;
      })
      .catch(function (err) {
        // Fallback EN
        if (code !== DEFAULT_LANG) {
          console.warn("[i18n] Locale", code, "failed, fallback", DEFAULT_LANG);
          return loadLocale(DEFAULT_LANG);
        }
        console.error("[i18n] Even fallback failed:", err);
        return {};
      });
  }

  /* ---------- Résolution de clé (dot path) ---------- */
  function t(key) {
    if (!key) return "";
    var parts = key.split(".");
    var val = currentDict;
    for (var i = 0; i < parts.length; i++) {
      if (val && typeof val === "object" && parts[i] in val) {
        val = val[parts[i]];
      } else {
        return "";
      }
    }
    return val == null ? "" : String(val);
  }

  /* ---------- Application au DOM ---------- */
  function applyToDOM() {
    // Texte simple
    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      var val = t(key);
      if (val) el.textContent = val;
    });
    // HTML autorisé
    var htmlNodes = document.querySelectorAll("[data-i18n-html]");
    htmlNodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n-html");
      var val = t(key);
      if (val) el.innerHTML = val;
    });
    // alt d'images
    var altNodes = document.querySelectorAll("[data-i18n-alt]");
    altNodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n-alt");
      var val = t(key);
      if (val) el.setAttribute("alt", val);
    });
    // aria-label
    var ariaNodes = document.querySelectorAll("[data-i18n-aria]");
    ariaNodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var val = t(key);
      if (val) el.setAttribute("aria-label", val);
    });
    // placeholder
    var phNodes = document.querySelectorAll("[data-i18n-placeholder]");
    phNodes.forEach(function (el) {
      var key = el.getAttribute("data-i18n-placeholder");
      var val = t(key);
      if (val) el.setAttribute("placeholder", val);
    });
    // <title> + <html lang>
    var titleVal = t("seo.title") || "MyGamingTips";
    document.title = titleVal;
    document.documentElement.lang = currentDict.meta && currentDict.meta.htmlLang
      ? currentDict.meta.htmlLang
      : currentLang;
    // Meta description dynamique
    var desc = t("seo.description");
    if (desc) {
      var meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", desc);
    }
  }

  /* ---------- Direction RTL ---------- */
  function applyDirection() {
    var dir = RTL_LANGS.indexOf(currentLang) !== -1 ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.classList.toggle("is-rtl", dir === "rtl");
  }

  /* ---------- Sélecteur UI ---------- */
  function renderLangMenu() {
    var menus = document.querySelectorAll("[data-lang-menu]");
    menus.forEach(function (menu) {
      menu.innerHTML = "";
      SUPPORTED.forEach(function (s) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "lang-menu__opt";
        btn.setAttribute("data-lang-code", s.code);
        btn.setAttribute("aria-current", s.code === currentLang ? "true" : "false");
        btn.innerHTML =
          '<span class="lang-menu__flag" aria-hidden="true">' + s.flag + "</span>" +
          '<span>' + s.native + "</span>";
        btn.addEventListener("click", function () {
          setLang(s.code);
          closeAllLangMenus();
        });
        menu.appendChild(btn);
      });
    });
    // Met à jour le bouton d'ouverture (libellé code)
    var langBtns = document.querySelectorAll("[data-lang-btn] .lang-code");
    langBtns.forEach(function (codeEl) {
      codeEl.textContent = currentLang.toUpperCase();
    });
  }

  function closeAllLangMenus() {
    document.querySelectorAll("[data-lang-menu].is-open").forEach(function (m) {
      m.classList.remove("is-open");
    });
    document.querySelectorAll("[data-lang-btn][aria-expanded='true']").forEach(function (b) {
      b.setAttribute("aria-expanded", "false");
    });
  }

  function bindLangSwitchers() {
    var btns = document.querySelectorAll("[data-lang-btn]");
    btns.forEach(function (btn) {
      btn.addEventListener("click", function (e) {
        e.stopPropagation();
        var menu = btn.parentElement.querySelector("[data-lang-menu]");
        if (!menu) return;
        var isOpen = menu.classList.toggle("is-open");
        btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    });
    // Ferme au clic dehors / Escape
    document.addEventListener("click", closeAllLangMenus);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeAllLangMenus();
    });
  }

  /* ---------- API publique ---------- */
  function setLang(code) {
    if (SUPPORTED_CODES.indexOf(code) === -1) code = DEFAULT_LANG;
    return loadLocale(code).then(function (dict) {
      currentLang = code;
      currentDict = dict;
      try { localStorage.setItem(STORAGE_KEY, code); } catch (e) {}
      applyDirection();
      applyToDOM();
      renderLangMenu();
      document.dispatchEvent(new CustomEvent("mgt:langchange", {
        detail: { lang: code }
      }));
    });
  }

  function init() {
    bindLangSwitchers();
    var initial = detectLang();
    return setLang(initial);
  }

  window.MGTi18n = {
    init: init,
    setLang: setLang,
    t: t,
    current: function () { return currentLang; },
    supported: function () { return SUPPORTED.slice(); }
  };
})();
