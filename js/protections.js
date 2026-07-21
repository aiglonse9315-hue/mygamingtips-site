/* ============================================================
   protections.js — Freins dissuasifs (NON une sécurité absolue).
   Tout ce qui arrive dans le navigateur est inspectable par un
   utilisateur déterminé. Ces freins arrêtent juste la curiosité.
   ------------------------------------------------------------
   1. Anti-clic-droit (contextmenu preventDefault + toast discret)
   2. Anti-sélection (user-select none global, sauf inputs)
   3. Anti-F12 / Ctrl+Shift+I/J/C / Ctrl+U (preventDefault)
   4. Anti-drag images (draggable=false + dragstart preventDefault)
   ============================================================ */
(function () {
  "use strict";

  var toastTimer = null;
  function showToast() {
    var toast = document.querySelector("[data-protect-toast]");
    if (!toast) return;
    var msg = (window.MGTi18n && window.MGTi18n.t("protections.toast")) || "";
    if (msg) toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toast.classList.remove("is-visible");
    }, 1800);
  }

  // 1. Clic droit
  document.addEventListener("contextmenu", function (e) {
    // On autorise dans les champs éditables
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
      return;
    }
    e.preventDefault();
    showToast();
  });

  // 3. Touches DevTools / view source (frein léger, contournable)
  document.addEventListener("keydown", function (e) {
    var k = (e.key || "").toLowerCase();
    // F12
    if (e.key === "F12") { e.preventDefault(); showToast(); return; }
    // Ctrl+Shift+I / J / C
    if ((e.ctrlKey || e.metaKey) && e.shiftKey &&
        (k === "i" || k === "j" || k === "c")) {
      e.preventDefault(); showToast(); return;
    }
    // Ctrl+U (view source)
    if ((e.ctrlKey || e.metaKey) && k === "u" && !e.shiftKey && !e.altKey) {
      e.preventDefault(); showToast(); return;
    }
  });

  // 4. Drag images
  function stopDrag(e) { e.preventDefault(); }
  function protectImages() {
    var imgs = document.querySelectorAll("img");
    imgs.forEach(function (img) {
      if (img.getAttribute("data-protect") === "false") return;
      img.setAttribute("draggable", "false");
      img.addEventListener("dragstart", stopDrag);
    });
  }
  // Les images peuvent arriver après (lazy), on protège aussi au DOMContentLoaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", protectImages);
  } else {
    protectImages();
  }
  // Et au chargement complet (images lazy finalisées)
  window.addEventListener("load", protectImages);

  // 2. Anti-sélection — géré en CSS (user-select: none global),
  //    mais on renforce côté JS sur les zones non-éditables.
  document.addEventListener("selectstart", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea" || e.target.isContentEditable) {
      return;
    }
    // On laisse le CSS faire, mais on coupe aussi la sélection effective
    // sur les éléments marqués protégés.
    if (e.target.closest && e.target.closest("[data-noselect]")) {
      e.preventDefault();
    }
  });
})();
