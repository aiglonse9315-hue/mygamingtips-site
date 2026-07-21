/* ============================================================
   promo.js — Composition Promo Multi-langue (V4)
   - Change le screenshot du téléphone selon la langue active.
   - Écoute l'événement i18n "mgt:langchange" (dispatché par
     js/i18n.js avec detail.lang en MINUSCULES : "fr","en","ar"…).
   - Précharge la nouvelle image AVANT de permuter (pas de flash).
   - Fallback FR si la langue n'a pas de screenshot / erreur.
   - Idempotent : si la langue ne change pas, on ne recharge pas.
   ============================================================ */
(function () {
  "use strict";

  var BASE = "assets/screenshots/promo/";
  var FALLBACK = BASE + "promo-screen-FR.jpg";

  // Langues qui ont un screenshot dédié (codes i18n en minuscules).
  // Les fichiers sont en MAJUSCULES (promo-screen-FR.jpg) — on
  // normalise via toUpperCase() au build du chemin.
  var SCREENED = ["fr", "en", "es", "de", "it", "pt",
                  "ru", "zh", "ja", "ko", "ar", "hi"];

  // Cache des images déjà préchargées (URL -> true si chargée OK).
  var preloaded = {};
  var currentScreenLang = null; // ce qui est actuellement affiché

  function buildPath(langLower) {
    var code = String(langLower || "").toLowerCase();
    if (SCREENED.indexOf(code) === -1) return null;
    return BASE + "promo-screen-" + code.toUpperCase() + ".jpg";
  }

  /* Précharge une image, renvoie une Promise qui résout l'URL
     utilisable (chemin demandé ou fallback FR). */
  function preload(url) {
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
        // via onerror inline côté HTML).
        if (url !== FALLBACK) {
          preload(FALLBACK).then(resolve).catch(function () { resolve(FALLBACK); });
        } else {
          resolve(FALLBACK);
        }
      };
      img.src = url;
    });
  }

  /* Applique un chemin d'image au <img data-promo-screen>, sans
     flash : on commence par cacher (opacity 0), permuter le src,
     puis réafficher quand l'image est chargée. Comme on précharge
     en amont, l'image est déjà dans le cache -> instantané. */
  function setScreen(url, langLower) {
    var img = document.querySelector("[data-promo-screen]");
    if (!img) return;
    if (currentScreenLang === langLower && img.src.indexOf(url) !== -1) {
      return; // déjà affiché
    }

    function swap() {
      // opacity -> 0 puis src puis opacity -> 1 (transition CSS gère
      // le crossfade). On pose un onerror défensif sur l'élément.
      img.style.opacity = "0";
      // petite attente pour laisser le fade-out se poser
      window.requestAnimationFrame(function () {
        img.onerror = function () {
          if (url !== FALLBACK) {
            img.onerror = null;
            img.src = FALLBACK;
          }
        };
        img.src = url;
        img.style.opacity = "1";
        currentScreenLang = langLower;
      });
    }

    swap();
  }

  /* API publique : updatePromoScreen(langCodeLower) */
  function updatePromoScreen(langLower) {
    var url = buildPath(langLower) || FALLBACK;
    preload(url).then(function (finalUrl) {
      setScreen(finalUrl, langLower);
    });
  }

  /* Branchement sur l'événement i18n existant. */
  document.addEventListener("mgt:langchange", function (e) {
    var lang = (e && e.detail && e.detail.lang) || null;
    if (lang) updatePromoScreen(lang);
  });

  /* Boot : au chargement, on aligne le screenshot sur la langue
     courante. On lit via MGTi18n.current() si disable, sinon FR. */
  function boot() {
    var lang = (window.MGTi18n && window.MGTi18n.current && window.MGTi18n.current())
      || "fr";
    updatePromoScreen(lang);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

  // API exposée (utile pour debug / tests manuels)
  window.MGTpromo = { update: updatePromoScreen };
})();
