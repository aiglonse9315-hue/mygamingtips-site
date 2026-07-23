/* ============================================================
   main.js — Init, smooth scroll, header opaque au scroll,
   drawer mobile, démo overlay vidéo, reveal au scroll.
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Header opaque au scroll ---------- */
  function initHeaderScroll() {
    var header = document.querySelector("[data-site-header]");
    if (!header) return;
    var onScroll = function () {
      if (window.scrollY > 8) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Smooth scroll sur ancres ---------- */
  function initSmoothAnchors() {
    document.addEventListener("click", function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute("href");
      if (!href || href === "#") return;
      var target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      var headerH = 64 + 12;
      var rect = target.getBoundingClientRect();
      var top = rect.top + window.scrollY - headerH;
      window.scrollTo({
        top: top,
        behavior: prefersReduced ? "auto" : "smooth"
      });
      // Ferme le drawer mobile si ouvert
      closeDrawer();
      // Met à jour le focus pour a11y
      target.setAttribute("tabindex", "-1");
      target.focus({ preventScroll: true });
    });
  }

  /* ---------- Drawer mobile ---------- */
  function initDrawer() {
    var openers = document.querySelectorAll("[data-drawer-open]");
    var closers = document.querySelectorAll("[data-drawer-close]");
    var drawer = document.querySelector("[data-drawer]");
    if (!drawer) return;

    openers.forEach(function (b) {
      b.addEventListener("click", function () {
        drawer.classList.add("is-open");
        drawer.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
      });
    });
    closers.forEach(function (b) {
      b.addEventListener("click", closeDrawer);
    });
    // Ferme sur Escape
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeDrawer();
    });
  }
  function closeDrawer() {
    var drawer = document.querySelector("[data-drawer]");
    if (!drawer || !drawer.classList.contains("is-open")) return;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  /* ---------- Démo overlay vidéo (Windows) — CHANTIER 2 refonte ---------- */
  function initOverlayDemo() {
    var demos = document.querySelectorAll("[data-overlay-demo]");
    demos.forEach(function (demo) {
      var stage = demo.querySelector("[data-overlay-stage]");
      var showBtns = demo.querySelectorAll("[data-overlay-show]");
      var hideBtns = demo.querySelectorAll("[data-overlay-hide]");
      var status = demo.querySelector("[data-overlay-status]");
      if (!stage) return;

      function setActive(active) {
        demo.classList.toggle("is-active", active);
        if (status) {
          var key = active ? "windows.demo_active" : "windows.demo_idle";
          var text = (window.MGTi18n && window.MGTi18n.t(key)) || "";
          if (text) {
            status.innerHTML = active
              ? "<strong>" + text + "</strong>"
              : text;
          }
        }
        // aria-pressed sur tous les boutons "Afficher" (flèche + bouton texte)
        showBtns.forEach(function (b) {
          b.setAttribute("aria-pressed", active ? "true" : "false");
        });
        // Le player lui-même : aria-hidden inversé pour les lecteurs d'écran
        var player = demo.querySelector("[data-overlay-player]");
        if (player) player.setAttribute("aria-hidden", active ? "false" : "true");
      }

      // Clic sur le stage = toggle (mais PAS si on clique sur la flèche handle,
      // qui a son propre handler). On stoppe la propagation depuis la flèche.
      stage.addEventListener("click", function (e) {
        if (e.target.closest("[data-overlay-show]") ||
            e.target.closest("[data-overlay-hide]")) {
          return; // géré par les handlers dédiés ci-dessous
        }
        setActive(!demo.classList.contains("is-active"));
      });
      stage.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setActive(!demo.classList.contains("is-active"));
        }
      });
      // Boutons "Afficher" (flèche latérale + bouton texte) -> ouvrir
      showBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          setActive(true);
        });
      });
      // Boutons "Masquer" -> fermer
      hideBtns.forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.stopPropagation();
          setActive(false);
        });
      });

      // État initial
      setActive(false);
    });
  }

  /* ---------- CHANTIER 5 : Switch LOCAL jour/nuit du mockup téléphone.
     IMPORTANT : ce switch ne change QUE l'image du mockup (mobile-day.jpg /
     mobile-night.jpg). Il ne touche PAS au thème global du site
     (géré par theme.js via [data-theme-toggle] dans le header).
     "N'éteins pas la lumière du site." */
  function initPhoneThemeDemo() {
    var toggle = document.querySelector("[data-phone-theme-toggle]");
    var demo = document.querySelector("[data-phone-theme-demo]");
    var phone = document.querySelector("[data-phone-mockup]");
    // Figure parent (commun au phone + badges jour/nuit) pour piloter
    // l'inversion des badges sans dépendre de :has().
    var figure = document.querySelector(".personalize__figure");
    if (!toggle || !demo) return;

    function applyState(isDay) {
      // Classe sur le conteneur (pour :has() + pills)
      demo.classList.toggle("is-day", isDay);
      // Classe aussi sur le phone (fallback crossfade si :has() non supporté)
      if (phone) phone.classList.toggle("is-day", isDay);
      // Classe sur la figure parent (pour inverser les badges jour/nuit
      // même sans :has()). La figure est le parent commun aux badges.
      if (figure) figure.classList.toggle("is-day", isDay);
      // ARIA + thumb (via CSS .is-day)
      toggle.setAttribute("aria-checked", isDay ? "true" : "false");
    }

    // État initial : NUIT (l'arcade vivante est la vedette)
    applyState(false);

    toggle.addEventListener("click", function () {
      var isDay = !demo.classList.contains("is-day");
      applyState(isDay);
    });

    // Accessibilité clavier : le bouton est déjà un <button>, donc Enter/Space
    // fonctionnent nativement. On garantit juste le focus visible.
    toggle.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft")  { applyState(false); e.preventDefault(); }
      if (e.key === "ArrowRight") { applyState(true);  e.preventDefault(); }
    });
  }

  /* ---------- CHANTIER B (V5) : Sélecteur de plan Mensuel/Annuel + CTA.
     Rend les <button class="plan"> sélectionnables (un seul à la fois) et
     redirige le CTA "Passer à Plus" vers l'URL d'abonnement Google Play.
     IMPORTANT : si l'utilisateur met une vraie URL dans le href du CTA,
     le code la respecte (ne la surcharge que si href === "#plus-subscribe"). */
  function initPlanSelector() {
    var plans = document.querySelectorAll("[data-plan]");
    var cta = document.querySelector(".btn--plus");
    if (!plans.length) return;

    // URLs d'abonnement (placeholders — à remplacer par les vraies URLs
    // Google Play quand elles seront disponibles).
    var SUBSCRIBE_URLS = {
      monthly: "https://play.google.com/store/apps/details?id=com.mygamingtips.app",
      annual:  "https://play.google.com/store/apps/details?id=com.mygamingtips.app"
    };

    // État courant : annuel par défaut (mis en avant dans le HTML).
    var currentPlan = "annual";

    function selectPlan(planName) {
      plans.forEach(function (plan) {
        var isSelected = plan.getAttribute("data-plan") === planName;
        plan.classList.toggle("is-selected", isSelected);
        plan.setAttribute("aria-pressed", isSelected ? "true" : "false");
      });
      currentPlan = planName;
    }

    plans.forEach(function (plan) {
      plan.addEventListener("click", function () {
        selectPlan(plan.getAttribute("data-plan"));
      });
    });

    // CTA "Passer à Plus" → redirige vers l'URL Google Play selon le plan
    // sélectionné. Si le href est déjà une vraie URL (≠ "#plus-subscribe"),
    // on laisse le navigateur faire (l'utilisateur aura mis sa vraie URL).
    if (cta) {
      cta.addEventListener("click", function (e) {
        if (cta.getAttribute("href") !== "#plus-subscribe") return;
        e.preventDefault();
        var url = SUBSCRIBE_URLS[currentPlan] || SUBSCRIBE_URLS.annual;
        window.open(url, "_blank", "noopener,noreferrer");
      });
    }
  }

  /* ---------- Reveal au scroll (respect reduced-motion) ---------- */
  function initReveal() {
    var els = document.querySelectorAll("[data-reveal]");
    if (!els.length) return;
    if (prefersReduced || !("IntersectionObserver" in window)) {
      els.forEach(function (el) { el.classList.add("is-revealed"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-revealed");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    els.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Année footer ---------- */
  function initYear() {
    var nodes = document.querySelectorAll("[data-year]");
    nodes.forEach(function (n) { n.textContent = new Date().getFullYear(); });
  }

  /* ---------- V-PERF : pause des animations .gbg hors viewport (TOP 5)
     La toile .gbg est position:fixed : elle anime en permanence même quand
     l'utilisateur a scrollé loin du hero. On pose un sentinel collé en bas
     de la page et on l'observe. Quand l'utilisateur dépasse ~1 viewport de
     scroll, on met .gbg en pause (animation-play-state: paused via la classe
     CSS .is-paused). Les éléments restent visibles (statiques), seul le
     mouvement est figé. Respecte reduced-motion (rien à figer dans ce cas,
     les animations sont déjà neutralisées par le CSS). */
  function initBackgroundPause() {
    if (prefersReduced) return; // rien à gagner, déjà figé
    if (!("IntersectionObserver" in window)) return;
    var gbg = document.querySelector(".gbg");
    if (!gbg) return;

    // Sentinel : 1px en bas du document. Il n'est visible (dans le viewport)
    // que lorsque l'utilisateur est tout en bas de page. Dès qu'il sort par
    // le haut (scrollY grand), on met le fond en pause.
    var sentinel = document.createElement("div");
    sentinel.style.cssText = "position:absolute;bottom:0;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.appendChild(sentinel);

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        // entry.isIntersecting = true => sentinel visible (utilisateur vers
        // le bas / page courte) => on réanime. boundingClientRect.top < 0 =>
        // sentinel passé au-dessus => utilisateur a scrollé loin => on fige.
        var scrolledFar = !entry.isIntersecting && entry.boundingClientRect.top < 0;
        gbg.classList.toggle("is-paused", scrolledFar);
      });
    }, { threshold: 0 });
    observer.observe(sentinel);
  }

  /* ---------- Boot ---------- */
  function boot() {
    // Theme d'abord (déjà partiellement posé par le script inline en <head>)
    if (window.MGTtheme) window.MGTtheme.init();
    // i18n ensuite (charge la locale, traduit le DOM)
    var p = window.MGTi18n ? window.MGTi18n.init() : Promise.resolve();
    p.then(function () {
      initHeaderScroll();
      initSmoothAnchors();
      initDrawer();
      initOverlayDemo();
      initPhoneThemeDemo();
      initPlanSelector();
      initReveal();
      initYear();
      initBackgroundPause();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
