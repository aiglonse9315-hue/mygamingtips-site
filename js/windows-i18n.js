/* ============================================================
   windows-i18n.js — Commutation multilingue des screenshots Windows (V1)
   - Change les screenshots de la galerie Windows selon la langue active.
   - Cible tous les <img data-windows-screen="category"> présents dans
     le DOM (home, mygames, playlist-game, playlist-genre — 4 max).
   - Écoute l'événement i18n "mgt:langchange" (dispatché par js/i18n.js
     avec detail.lang en MINUSCULES : "fr","en","ar"…).
   - Précharge la nouvelle image AVANT de permuter (pas de flash).
   - Fallback FR si la langue n'a pas de screenshot / erreur.
   - Idempotent : si la langue ne change pas pour une catégorie,
     on ne recharge pas cette catégorie.
   - Note : le screenshot "languages" (figure --c) est unilingue :
     il n'a pas data-windows-screen et reste donc hors périmètre.
   ============================================================ */
(function () {
  "use strict";

  var BASE = "assets/screenshots/windows-i18n/";
  var FALLBACK_LANG = "FR";

  // Langues qui ont un screenshot dédié (codes i18n en minuscules).
  // Les fichiers sont en MAJUSCULES (home-FR.png) — on normalise via
  // toUpperCase() au build du chemin.
  var SCREENED = ["fr", "en", "es", "de", "it", "pt",
                  "ru", "zh", "ja", "ko", "ar", "hi"];

  // Cache des images déjà préchargées (URL -> true si chargée OK).
  var preloaded = {};
  // État courant par catégorie : { "home": "fr", "mygames": "en", ... }
  // évite de recharger la même langue plusieurs fois pour la même catégorie.
  var currentByCategory = {};

  function normalizeLang(langLower) {
    var code = String(langLower || "").toLowerCase();
    if (SCREENED.indexOf(code) === -1) return "fr";
    return code;
  }

  function buildPath(category, langLower) {
    var code = normalizeLang(langLower);
    return BASE + category + "-" + code.toUpperCase() + ".png";
  }

  function buildFallbackPath(category) {
    return BASE + category + "-" + FALLBACK_LANG + ".png";
  }

  /* Précharge une image, renvoie une Promise qui résout l'URL
     utilisable (chemin demandé ou fallback FR). */
  function preload(url, fallbackUrl) {
    if (preloaded[url]) return Promise.resolve(url);
    return new Promise(function (resolve) {
      var img = new Image();
      img.onload = function () {
        preloaded[url] = true;
        resolve(url);
      };
      img.onerror = function () {
        // Fallback FR. Si même le fallback échoue, on résout quand
        // même l'URL pour ne jamais bloquer (l'<img> gérera son erre
        // via onerror inline côté HTML si besoin).
        if (fallbackUrl && url !== fallbackUrl) {
          preload(fallbackUrl, fallbackUrl).then(resolve).catch(function () { resolve(fallbackUrl); });
        } else {
          resolve(url);
        }
      };
      img.src = url;
    });
  }

  /* Applique un chemin d'image au <img data-windows-screen>, sans
     flash : opacity -> 0, src, opacity -> 1 (transition CSS gère
     le crossfade). Comme on précharge en amont, l'image est déjà
     dans le cache -> instantané. */
  function setScreen(img, url, category, langLower) {
    if (currentByCategory[category] === langLower && img.src.indexOf(url) !== -1) {
      return; // déjà affiché pour cette catégorie
    }

    function swap() {
      img.style.opacity = "0";
      window.requestAnimationFrame(function () {
        var fallbackUrl = buildFallbackPath(category);
        img.onerror = function () {
          if (url !== fallbackUrl) {
            img.onerror = null;
            img.src = fallbackUrl;
          }
        };
        img.src = url;
        img.style.opacity = "1";
        currentByCategory[category] = langLower;
      });
    }

    swap();
  }

  /* Met à jour tous les <img data-windows-screen> du DOM pour la
     langue donnée. */
  function updateAllScreens(langLower) {
    var code = normalizeLang(langLower);
    var imgs = document.querySelectorAll("[data-windows-screen]");
    // NodeList -> Array pour compatibilité large (forEach existe
    // sur NodeList modern, mais on reste défensif).
    Array.prototype.forEach.call(imgs, function (img) {
      var category = img.getAttribute("data-windows-screen");
      if (!category) return;
      var url = buildPath(category, code);
      var fallbackUrl = buildFallbackPath(category);
      preload(url, fallbackUrl).then(function (finalUrl) {
        setScreen(img, finalUrl, category, code);
      });
    });
  }

  /* Branchement sur l'événement i18n existant. */
  document.addEventListener("mgt:langchange", function (e) {
    var lang = (e && e.detail && e.detail.lang) || null;
    if (lang) updateAllScreens(lang);
  });

  /* Boot : au chargement, on aligne les screenshots sur la langue
     courante. On lit via MGTi18n.current() si disponible, sinon FR. */
  function boot() {
    var lang = (window.MGTi18n && window.MGTi18n.current && window.MGTi18n.current())
      || "fr";
    updateAllScreens(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // API exposée (utile pour debug / tests manuels)
  window.MGTwindows = { update: updateAllScreens };
})();
