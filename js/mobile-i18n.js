/* ============================================================
   mobile-i18n.js — Commutation multilingue des screenshots Mobile (V1)
   - Change les screenshots de la galerie Mobile, de la section
     Communauté (image profil) et de la section Personnalisation
     (jour/nuit) selon la langue active.
   - Cible tous les <img data-mobile-screen="category"> présents
     dans le DOM. Catégories gérées :
       · home, playlist-genre, mygames, abo, playlist-game, profile
         (galerie Mobile + Communauté — 7 cibles possibles)
       · daynight/day, daynight/night (section Personnalisation)
   - Écoute l'événement i18n "mgt:langchange" (dispatché par
     js/i18n.js avec detail.lang en MINUSCULES : "fr","en","ar"…).
   - Précharge la nouvelle image AVANT de permuter (pas de flash).
   - Fallback FR si la langue n'a pas de screenshot / erreur.
   - Idempotent : si la langue ne change pas pour une catégorie,
     on ne recharge pas cette catégorie.
   - IMPORTANT (différence vs windows-i18n.js) :
       Pour la catégorie "daynight/*" on NE touche PAS à l'opacité
       inline de l'image : le crossfade jour/nuit est géré en CSS
       via la classe .is-day posée par initPhoneThemeDemo (main.js).
       On se contente de permuter le src (préchargé -> instantané).
       Pour les autres catégories, on applique le crossfade opacity
       classique (comme windows-i18n.js), puisque leur opacité n'est
       pas pilotée par un toggle CSS.
   ============================================================ */
(function () {
  "use strict";

  var BASE = "assets/screenshots/mobile-i18n/";
  var FALLBACK_LANG = "FR";

  // Catégories "jour/nuit" : pas de crossfade opacity inline, sinon
  // on écrase la règle CSS .phone__img--day/--night (casserait le
  // toggle is-day de la section Personnalisation).
  var NO_FADE_PREFIX = "daynight/";

  // Langues qui ont un screenshot dédié (codes i18n en minuscules).
  // Les fichiers sont en MAJUSCULES (home-FR.jpg) — on normalise via
  // toUpperCase() au build du chemin.
  var SCREENED = ["fr", "en", "es", "de", "it", "pt",
                  "ru", "zh", "ja", "ko", "ar", "hi"];

  // Cache des images déjà préchargées (URL -> true si chargée OK).
  var preloaded = {};
  // État courant par catégorie : { "home": "fr", "daynight/night": "ar", ... }
  // évite de recharger la même langue plusieurs fois pour la même catégorie.
  var currentByCategory = {};

  function normalizeLang(langLower) {
    var code = String(langLower || "").toLowerCase();
    if (SCREENED.indexOf(code) === -1) return "fr";
    return code;
  }

  function buildPath(category, langLower) {
    var code = normalizeLang(langLower);
    return BASE + category + "-" + code.toUpperCase() + ".jpg";
  }

  function buildFallbackPath(category) {
    return BASE + category + "-" + FALLBACK_LANG + ".jpg";
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

  /* Applique un chemin d'image au <img data-mobile-screen>.
     - Pour les catégories daynight/* : pas de crossfade opacity
       inline (sinon on écrase la règle CSS pilotée par is-day).
       On permute juste le src.
     - Pour les autres catégories : crossfade opacity -> 0 -> 1
       (transition CSS gère l'effet). Image préchargée -> instantané. */
  function setScreen(img, url, category, langLower) {
    // Garde V12/P4b : si l'image affiche DÉJÀ l'URL cible, ne rien faire.
    // Au boot, le cache currentByCategory est vide mais l'<img> a déjà le bon
    // src (home-FR.jpg posé en HTML). Sans cette garde, on relançait un
    // crossfade opacity:0 → l'image restait invisible si pas encore décodée.
    if (img.src.indexOf(url) !== -1 && img.src.indexOf(category) !== -1) {
      currentByCategory[category] = langLower;
      return;
    }
    // Sécurité : même langue déjà mémorisée → on sort sans crossfade.
    if (currentByCategory[category] === langLower) {
      return;
    }

    var noFade = category.indexOf(NO_FADE_PREFIX) === 0;

    function swapWithFade() {
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

    function swapWithoutFade() {
      var fallbackUrl = buildFallbackPath(category);
      img.onerror = function () {
        if (url !== fallbackUrl) {
          img.onerror = null;
          img.src = fallbackUrl;
        }
      };
      img.src = url;
      currentByCategory[category] = langLower;
    }

    if (noFade) {
      swapWithoutFade();
    } else {
      swapWithFade();
    }
  }

  /* Met à jour tous les <img data-mobile-screen> du DOM pour la
     langue donnée. */
  function updateAllScreens(langLower) {
    var code = normalizeLang(langLower);
    var imgs = document.querySelectorAll("[data-mobile-screen]");
    // NodeList -> Array pour compatibilité large (forEach existe
    // sur NodeList modern, mais on reste défensif).
    Array.prototype.forEach.call(imgs, function (img) {
      var category = img.getAttribute("data-mobile-screen");
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
  window.MGTmobile = { update: updateAllScreens };
})();
