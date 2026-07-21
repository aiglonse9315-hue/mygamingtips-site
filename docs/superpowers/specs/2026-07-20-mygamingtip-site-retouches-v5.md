# Retouches V5 — Détails de finition (5 chantiers ciblés)

**Date :** 2026-07-20
**Objet :** 5 ajustements précis demandés par l'utilisateur après la V4 (composition promo multi-langue).

---

## 📋 Vue d'ensemble

| # | Zone | Demande | Localisation code |
|---|---|---|---|
| A | Switch jour/nuit (section personnalisation) | Le rendre **cyan plus visible** en dark ET en light | `components.css` 1098-1101 |
| B | Section Plus : boutons Mensuel/Annuel + CTA | **Rendre les plans sélectionnables** + CTA → URL abonnement Google Play | `index.html` 950-977, `js/main.js` (nouveau module) |
| C | Badges stores sous la fiche pub | Les rendre **plus gros et visibles** | `promo.css` 286-325 |
| D | Cartes Mobile/Windows (section download) | Les 2 cartes doivent **monter identiquement** au hover (mouvement symétrique) | `components.css` 1361-1365 |
| E | Composition `.promo-poster` | **Plus de néons qui se baladent** + **un peu plus d'éclair** | `promo.css` 89-176, `index.html` 826-898 |

---

## CHANTIER A — Switch jour/nuit plus visible (cyan)

### Problème
Le bouton switch local `.switch--phone` (section personnalisation) est trop discret :
- Son cyan est atténué (alpha 0.20)
- **Aucun glow / box-shadow**
- **Aucune variante mode clair** → sur fond clair, on le voit à peine

### Cible
Fichier : `css/components.css` lignes **1098-1101** (règle `.switch--phone`)

### Changements

**1. Intensifier le cyan et ajouter un glow en mode dark :**

```css
.switch--phone {
  background: linear-gradient(95deg,
              rgba(138, 43, 226, 0.45),   /* était 0.30 */
              rgba(0, 229, 255, 0.55));   /* était 0.20 → 0.55 */
  border-color: rgba(0, 229, 255, 0.75);  /* cyan vif au lieu du violet atténué */
  box-shadow:
    0 0 0 1px rgba(0, 229, 255, 0.35),
    0 0 16px rgba(0, 229, 255, 0.45),
    0 0 32px rgba(0, 229, 255, 0.25);
}
```

**2. Ajouter une variante mode clair** (pour qu'il reste très visible sur fond clair) :

```css
[data-theme="light"] .switch--phone {
  background: linear-gradient(95deg,
              rgba(106, 17, 203, 0.20),    /* violet profond */
              rgba(0, 229, 255, 0.65));    /* cyan bien saturé pour contraster sur blanc */
  border-color: rgba(0, 180, 210, 0.85);  /* cyan un peu plus foncé pour le contraste sur clair */
  box-shadow:
    0 0 0 1px rgba(0, 180, 210, 0.45),
    0 0 14px rgba(0, 229, 255, 0.55),
    0 0 28px rgba(0, 229, 255, 0.30);
}
```

**3. Le thumb (pastille blanche) peut rester tel quel**, mais si tu veux ajouter un glow discret sur le thumb quand le switch est en position "jour", tu peux :

```css
[data-phone-theme-demo].is-day .switch--phone .switch__thumb {
  /* règle existante à conserver */
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}
```

### Ne pas toucher
- Le JS `js/main.js` `initPhoneThemeDemo()` (lignes 143-183) fonctionne déjà — juste du CSS.

---

## CHANTIER B — Plans Mensuel/Annuel sélectionnables + CTA abonnement

### Problème actuel
- Les 2 plans (`index.html` 950-968) sont de simples `<div>` → **pas sélectionnables**
- Le bouton "Passer à Plus" (ligne 973-977) pointe vers `#plus-subscribe` (ancre inexistante)

### Objectif
1. Transformer les plans en **boutons sélectionnables** (un seul à la fois)
2. Au clic sur "Passer à Plus", **rediriger vers l'URL d'abonnement Google Play**
   - Pour l'instant : placeholder `https://play.google.com/store/apps/details?id=PACKAGE_NAME&subscribe=PLAN`
   - L'utilisateur remplacera plus tard par la vraie URL

### Changements HTML

Fichier : `index.html` lignes **950-977**

**Transformer `<div class="plan">` et `<div class="plan plan--featured">` en `<button>` :**

```html
<div class="plans">
  <!-- Plan Mensuel -->
  <button class="plan" type="button" data-plan="monthly" aria-pressed="false">
    <div class="plan__name" data-i18n="plus.plan_monthly_name">Mensuel</div>
    <div class="plan__price">
      <span data-i18n="plus.plan_monthly_price">1,99 €</span>
      <small data-i18n="plus.plan_monthly_unit">/ mois</small>
    </div>
  </button>

  <!-- Plan Annuel (sélectionné par défaut) -->
  <button class="plan plan--featured is-selected" type="button" data-plan="annual" aria-pressed="true">
    <span class="plan__badge" data-i18n="plus.plan_yearly_badge">Économisez 16%</span>
    <div class="plan__name" data-i18n="plus.plan_yearly_name">Annuel</div>
    <div class="plan__price">
      <span data-i18n="plus.plan_yearly_price">19,99 €</span>
      <small data-i18n="plus.plan_yearly_unit">/ an</small>
    </div>
    <div class="plan__sub" data-i18n="plus.plan_yearly_sub">~1,67 € / mois</div>
  </button>
</div>
```

### Changements CSS

Fichier : `css/components.css`

**1. Rendre les `<button class="plan">` visuellement cohérents** (reset button + même rendu que div) :
```css
button.plan {
  font: inherit;
  color: inherit;
  text-align: center;
  cursor: pointer;
  width: 100%;
}
```

**2. Ajouter un état sélectionné visuel clair** `.plan.is-selected` :
```css
.plan.is-selected {
  border-color: var(--plus-gold);
  box-shadow:
    0 0 0 2px rgba(255, 201, 60, 0.6),
    0 0 24px rgba(255, 201, 60, 0.35),
    0 0 48px rgba(176, 38, 255, 0.20);
}
.plan.is-selected .plan__name {
  color: var(--plus-gold);
}

/* Conserver le style featured de l'annuel même quand pas sélectionné (rare) */
.plan.plan--featured:not(.is-selected) {
  /* garder le glow subtil existant */
}
```

**3. Ajouter un état hover** (pour indiquer que c'est cliquable) :
```css
.plan:not(.is-selected):hover {
  border-color: var(--border-strong);
  transform: translateY(-2px);
  transition: transform var(--t-fast);
}
```

**4. Ne pas casser `.plan--featured::before`** (bordure gradient du plan annuel). Le combiner avec `.is-selected`.

### Changements JS

Fichier : `js/main.js` — **ajouter un nouveau module**

```js
/* ---------- initPlanSelector ----------
   Gère la sélection Mensuel/Annuel et la redirection CTA. */
function initPlanSelector() {
  const plans = document.querySelectorAll("[data-plan]");
  const cta = document.querySelector(".btn--plus");

  // URLs d'abonnement (placeholders — à remplacer par les vraies URLs Google Play)
  const SUBSCRIBE_URLS = {
    monthly: "https://play.google.com/store/apps/details?id=com.mygamingtips.app",
    annual:  "https://play.google.com/store/apps/details?id=com.mygamingtips.app"
  };

  // État courant
  let currentPlan = "annual"; // défaut = annuel (mis en avant)

  function selectPlan(planName) {
    plans.forEach(plan => {
      const isSelected = plan.dataset.plan === planName;
      plan.classList.toggle("is-selected", isSelected);
      plan.setAttribute("aria-pressed", String(isSelected));
    });
    currentPlan = planName;
  }

  plans.forEach(plan => {
    plan.addEventListener("click", () => {
      selectPlan(plan.dataset.plan);
    });
  });

  // CTA "Passer à Plus" → redirige vers l'URL Google Play selon le plan sélectionné
  if (cta) {
    cta.addEventListener("click", (e) => {
      // Si le href est déjà une vraie URL, on laisse le navigateur faire.
      // Sinon, on construit l'URL selon le plan sélectionné.
      const url = SUBSCRIBE_URLS[currentPlan] || SUBSCRIBE_URLS.annual;
      // On empêche l'ancre par défaut et on redirige
      if (cta.getAttribute("href") === "#plus-subscribe") {
        e.preventDefault();
        window.open(url, "_blank", "noopener,noreferrer");
      }
      // Sinon : l'utilisateur aura mis la vraie URL directement dans le href
    });
  }
}
```

**Important :** si l'utilisateur remplace plus tard le `href="#plus-subscribe"` du CTA par une vraie URL complète, le code doit **respecter cette URL** (ne pas la surcharger). C'est pourquoi il y a la condition `if (cta.getAttribute("href") === "#plus-subscribe")`.

**Appeler `initPlanSelector()` dans le `DOMContentLoaded`** (cf. pattern existant des autres init).

---

## CHANTIER C — Badges stores plus gros et visibles

### Problème
Les badges "Disponible sur Google Play" / "Bientôt sur iOS" sont trop petits :
- `font-size: var(--fs-small)` = 0.75rem (12px)
- Icône SVG : 18×18px
- Padding réduit

### Cible
Fichier : `css/promo.css` lignes **295-325**

### Changements

**1. Augmenter la taille** (règle `.store-badge` lignes 295-310) :
```css
.store-badge {
  /* ... garder le reste ... */
  padding: var(--space-md) var(--space-xl);   /* était sm/md → plus généreux */
  font-size: var(--fs-body);                   /* était --fs-small (0.75rem) → 0.875rem (14px) */
  font-weight: var(--fw-black);                /* était bold → black, plus affirmé */
  letter-spacing: 0.5px;
  border-radius: var(--radius-pill);
  /* Ajouter un glow subtil pour les rendre plus visibles */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  transition: transform var(--t-fast), box-shadow var(--t-fast);
}

.store-badge:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
}
```

**2. Agrandir l'icône SVG** (règle `.store-badge svg` lignes 311-315) :
```css
.store-badge svg {
  width: 24px;    /* était 18px */
  height: 24px;   /* était 18px */
  flex-shrink: 0;
}
```

**3. Intensifier le glow du badge Play** (lignes 316-320) :
```css
.store-badge--play {
  color: var(--neon-green);
  border-color: rgba(57, 255, 20, 0.55);   /* était 0.40 */
  box-shadow:
    0 0 0 1px rgba(57, 255, 20, 0.3),
    0 0 16px rgba(57, 255, 20, 0.35);
}

.store-badge--play:hover {
  box-shadow:
    0 0 0 1px rgba(57, 255, 20, 0.5),
    0 0 24px rgba(57, 255, 20, 0.5);
}
```

**4. Adapter le gap du conteneur** si nécessaire (lignes 286-294) :
```css
.promo-poster__stores {
  gap: var(--space-md);   /* était sm */
}
```

**5. Vérifier la variante mode clair** (lignes 394-398) : conserver un contraste suffisant. Le vert néon devient vert foncé `#2E7D32` (déjà fait), mais avec la nouvelle taille + black + glow, ça doit rester lisible.

---

## CHANTIER D — Cartes Mobile/Windows : mouvement symétrique au hover

### Problème
La carte Mobile descend au repos (`translateY(10px)`) et la Windows monte (`translateY(-10px)`), ce qui donne une asymétrie bizarre au hover.

L'utilisateur veut : **les 2 cartes au même niveau au départ**, et **les 2 qui montent identiquement au hover**.

### Cible
Fichier : `css/components.css` lignes **1361-1365**

### Changements

Remplacer les translations asymétriques par une **position neutre au repos** et un **hover identique** :

```css
/* Avant (à remplacer) :
@media (min-width: 760px) {
  .download-grid > .download-card:first-child { transform: translateY(10px) rotate(-1deg); }
  .download-grid > .download-card:last-child  { transform: translateY(-10px) rotate(1deg); }
  .download-grid > .download-card:hover { transform: translateY(-4px) rotate(0); }
}
*/

/* Après : */
@media (min-width: 760px) {
  /* Les 2 cartes partent du même niveau (pas de translateY au repos) */
  .download-grid > .download-card:first-child { transform: translateY(0) rotate(-1deg); }
  .download-grid > .download-card:last-child  { transform: translateY(0) rotate(1deg); }

  /* Au hover : les 2 montent identiquement, rotation remise à 0 */
  .download-grid > .download-card:hover {
    transform: translateY(-12px) rotate(0);
  }
}
```

**Note :** les rotations légères (-1deg / +1deg) au repos sont conservées pour garder un peu d'asymétrie visuelle "jeune/pub gamer", mais les translations Y sont maintenant identiques (0). Au hover, les 2 montent de 12px de la même façon.

**Penser à conserver la branche reduced-motion** (lignes 1366-1368) : si elle existe déjà, ne pas y toucher.

---

## CHANTIER E — Plus de néons qui se baladent + un peu plus d'éclair

### Objectif
La composition `.promo-poster` est déjà riche (8 bolts + 4 sparks = 12 éléments lumineux), mais l'utilisateur en veut encore plus :
1. **"Quelques néons qui se baladent"** → des orbes/lignes qui se déplacent à travers la composition
2. **"Un peu plus d'effet d'éclair"** → intensifier les bolts existants

### Cible
Fichiers :
- `css/promo.css` lignes **89-176** (bolts/sparks)
- `index.html` lignes **826-898** (composition)

### Changement 1 : Intensifier les bolts existants

Dans `promo.css`, éditer la règle `.promo-bolt` (lignes 98-117) :

```css
.promo-bolt {
  /* ... conserver position/size ... */
  background: linear-gradient(90deg,
              transparent 0%,
              transparent 25%,                        /* était 30% → éclair plus long */
              rgba(138, 43, 226, 1) 42%,              /* était 0.95 → plus saturé */
              rgba(0, 229, 255, 1) 50%,
              rgba(138, 43, 226, 1) 58%,              /* était 0.95 */
              transparent 75%,                        /* était 70% */
              transparent 100%);
  filter: blur(1px) drop-shadow(0 0 12px rgba(0, 229, 255, 1));   /* était 8px 0.9 → plus intense */
  opacity: 0.85;                                                   /* était 0.7 */
  animation: promo-bolt-flicker 2.4s ease-in-out infinite;         /* était 3s → flicker plus rapide */
  height: 3px;                                                     /* était 2px → éclair plus épais */
}
```

### Changement 2 : Ajouter 4 bolts supplémentaires (total = 12)

Dans `index.html` lignes **830-840**, ajouter 4 `<span class="promo-bolt"></span>` supplémentaires (passer de 8 à 12).

Dans `promo.css` après la ligne **125**, ajouter les règles `:nth-child(9)` à `:nth-child(12)` :

```css
.promo-bolt:nth-child(9)  { transform: translate(-50%, -50%) rotate(11deg);  animation-delay: 0.2s; }
.promo-bolt:nth-child(10) { transform: translate(-50%, -50%) rotate(56deg);  animation-delay: 0.7s; }
.promo-bolt:nth-child(11) { transform: translate(-50%, -50%) rotate(101deg); animation-delay: 1.2s; }
.promo-bolt:nth-child(12) { transform: translate(-50%, -50%) rotate(146deg); animation-delay: 1.7s; }
```

### Changement 3 : Ajouter des néons qui se baladent (`.promo-drift`)

Créer une nouvelle classe d'éléments qui **se déplacent lentement à travers la composition** (orbes flous qui glissent).

**HTML** (dans `index.html`, juste avant `.promo-poster__stores` ligne ~882) :

```html
<div class="promo-poster__drifts" aria-hidden="true">
  <span class="promo-drift"></span>
  <span class="promo-drift"></span>
  <span class="promo-drift"></span>
  <span class="promo-drift"></span>
  <span class="promo-drift"></span>
  <span class="promo-drift"></span>
</div>
```

**CSS** (dans `promo.css`, après la section sparks ~ligne 176) :

```css
/* ---------- Néons qui se baladent ---------- */
.promo-poster__drifts {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.promo-drift {
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow:
    0 0 8px var(--neon-cyan),
    0 0 16px rgba(0, 229, 255, 0.6),
    0 0 24px rgba(0, 229, 255, 0.3);
  opacity: 0;
  animation: promo-drift 14s linear infinite;
}

/* Varier les couleurs, positions de départ et délais */
.promo-drift:nth-child(1) {
  background: var(--neon-violet);
  box-shadow: 0 0 8px var(--neon-violet), 0 0 16px rgba(138,43,226,0.6), 0 0 24px rgba(138,43,226,0.3);
  top: 80%; left: 10%;
  animation-delay: 0s;
}
.promo-drift:nth-child(2) {
  background: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan), 0 0 16px rgba(0,229,255,0.6), 0 0 24px rgba(0,229,255,0.3);
  top: 70%; left: 85%;
  animation-delay: -2s;
}
.promo-drift:nth-child(3) {
  background: var(--neon-magenta);
  box-shadow: 0 0 8px var(--neon-magenta), 0 0 16px rgba(255,45,149,0.6), 0 0 24px rgba(255,45,149,0.3);
  top: 50%; left: 20%;
  animation-delay: -5s;
}
.promo-drift:nth-child(4) {
  background: var(--neon-cyan);
  top: 30%; left: 75%;
  animation-delay: -8s;
}
.promo-drift:nth-child(5) {
  background: var(--neon-violet);
  top: 90%; left: 50%;
  animation-delay: -11s;
}
.promo-drift:nth-child(6) {
  background: var(--neon-green);
  box-shadow: 0 0 8px var(--neon-green), 0 0 16px rgba(57,255,20,0.5);
  top: 15%; left: 40%;
  animation-delay: -4s;
}

@keyframes promo-drift {
  0% {
    transform: translate(0, 0) scale(0.5);
    opacity: 0;
  }
  10% {
    opacity: 0.9;
    transform: scale(1);
  }
  90% {
    opacity: 0.9;
  }
  100% {
    transform: translate(var(--drift-x, 30px), var(--drift-y, -80vh)) scale(0.5);
    opacity: 0;
  }
}
```

**Variantes CSS :**
- Mode clair : atténuer (cf. pattern des autres éléments light dans promo.css lignes 330-398) :
  ```css
  [data-theme="light"] .promo-drift {
    opacity: 0.4;
  }
  [data-theme="light"] .promo-drift:nth-child(3),
  [data-theme="light"] .promo-drift:nth-child(6) {
    display: none;  /* magenta et green trop flashy en light */
  }
  ```
- Reduced motion (ajouter dans la branche existante lignes 419-431) :
  ```css
  @media (prefers-reduced-motion: reduce) {
    .promo-drift { animation: none !important; opacity: 0; }
  }
  ```

---

## ✅ Critères d'acceptation V5

- [ ] **A** : Switch `.switch--phone` a un glow cyan visible en dark ET en light. Test : ouvrir la section personnalisation, le switch doit clairement attirer l'œil.
- [ ] **B** : Les 2 plans Mensuel/Annuel sont des `<button>` cliquables. Au clic, l'état sélectionné bascule (classe `is-selected` + `aria-pressed`). Plan Annuel sélectionné par défaut. Au clic sur "Passer à Plus", redirection vers URL Google Play (placeholder). Si l'utilisateur met une vraie URL dans le href, elle est respectée.
- [ ] **C** : Badges stores sont plus gros (font 0.875rem black, padding md/xl, svg 24px). Badge Play a un glow vert visible.
- [ ] **D** : Au hover sur les cartes Mobile/Windows, **les 2 montent identiquement** (translateY(-12px), rotation remise à 0). Au repos, même niveau (translateY 0), rotations légères conservées.
- [ ] **E** : 12 bolts au total (8 + 4 nouveaux), plus intenses (opacity 0.85, drop-shadow 12px, height 3px). 6 néons drift (orbes qui se baladent). Reduced motion et mode clair gérés.
- [ ] Pas de cassure des fonctionnalités précédentes (i18n, theme global, switch phone-theme, overlay vidéo, etc.).
- [ ] `prefers-reduced-motion` respecté partout où il y a de l'animation.

---

## 🔧 Méthodologie

1. **Lis ce brief V5 en entier**.
2. **Lis les fichiers concernés** (`css/components.css`, `css/promo.css`, `index.html` sections ciblées, `js/main.js`).
3. **Applique chantier par chantier** (A → B → C → D → E), teste après chacun.
4. **Utilise tes skills associés** (frontend-design, code review, vérification).
5. **Vérifie l'acceptance criteria V5**.
6. **Rapporte à la fin**.

## ⚠️ Ne pas casser

- i18n 12 langues, protections, theme global header toggle, switch phone-theme local
- Galerie mobile asymétrique (V2)
- Overlay vidéo Windows (V2)
- Mode DARK arcade vivante (V3)
- Composition promo multi-langue (V4)

Bonne finition ! 🎮✨
