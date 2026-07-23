/* ============================================================
   performance.js — Auto-adaptation intelligente des effets.

   Détecte la puissance matérielle (CPU cores, RAM, saveData,
   type de réseau) et pose un attribut `data-power="high|medium|low"`
   sur <html>. Le CSS s'appuie ensuite sur cet attribut pour
   dégrader progressivement les effets signature (halos, particules,
   bolts, sparks, drifts, pulsations néon).

   Philosophie :
   - HIGH   : tout (défaut, aucune règle spécifique).
   - MEDIUM : on réduit les quantités (particules, bolts...).
   - LOW    : on retire les éléments les plus coûteux d'abord.

   Ce module est sans dépendance, très léger, et s'exécute le plus
   tôt possible (idéalement dans le <head>, avant la première
   peinture) pour éviter tout flash d'effets lourds sur un appareil
   faible. Il ne casse jamais prefers-reduced-motion (le filet de
   sécurité ultime reste reset.css / les @media dédiés).
   ============================================================ */
(function () {
  "use strict";

  function detectPower() {
    var cores = navigator.hardwareConcurrency || 4;
    // deviceMemory n'existe qu'en Chromium (Go), défaut prudent 4.
    var memory = navigator.deviceMemory || 4;
    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};
    var saveData = conn.saveData === true;
    var effectiveType = conn.effectiveType || "4g"; // slow-2g|2g|3g|4g

    // 1) Réseau lent ou save-data → on force low (le débit compte pour
    //    la fluidité perçue et l'utilisateur a demandé de l'économie).
    if (saveData || effectiveType.indexOf("2g") !== -1 || effectiveType === "slow-2g") {
      return "low";
    }
    // 2) Appareil faible : peu de cores OU peu de RAM.
    if (cores <= 2 || memory <= 2) {
      return "low";
    }
    // 3) Appareil moyen : 4 cores ou 4 Go.
    if (cores <= 4 || memory <= 4) {
      return "medium";
    }
    // 4) Appareil puissant : 8+ cores et 8+ Go.
    return "high";
  }

  function applyPower() {
    try {
      var power = detectPower();
      document.documentElement.setAttribute("data-power", power);
      // Diagnostique en console (utile au débogage, silencieux en prod côté UI).
      if (window.console && console.log) {
        console.log("[MGT] Power mode:", power);
      }
    } catch (e) {
      // En cas d'erreur (navigateur exotique), on reste sur le défaut
      // (high = tous les effets). Mieux vaut trop d'effets qu'un plantage.
    }
  }

  // Appliquer immédiatement si <html> est déjà dispo, sinon dès DOMContentLoaded.
  if (document.documentElement) {
    applyPower();
  } else {
    document.addEventListener("DOMContentLoaded", applyPower);
  }

  // API publique (ré-application possible, p.ex. après un changement de réseau).
  window.MGTpower = { detect: detectPower, apply: applyPower };

  // Bonus : si le réseau change de catégorie (4g -> 2g en mobile),
  // on réévalue. Pas de reflow coûteux : juste l'attribut repris par CSS.
  var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (conn && typeof conn.addEventListener === "function") {
    conn.addEventListener("change", function () {
      applyPower();
    });
  }
})();
