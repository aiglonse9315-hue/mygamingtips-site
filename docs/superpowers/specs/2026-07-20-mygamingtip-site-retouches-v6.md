# Retouches V6 — Finitions (5 chantiers ciblés)

**Date :** 2026-07-20
**Objet :** 5 ajustements précis après la V5. Audit chirurgical déjà fait — les numéros de ligne sont exacts.

---

## 📋 Vue d'ensemble

| # | Zone | Demande | Localisation |
|---|---|---|---|
| A | Drifts néon en mode clair | **Aucun ne passe en light** → en rajouter | `promo.css` 476-480 |
| B | Espacements verticaux | **Trop de scroll** → resserrer, surtout les décalages asymétriques | `base.css` 99, `components.css` multiples |
| C | Switch phone-theme : thumb noir | Le thumb reste **noir mat** en nuit → le rendre lumineux | `components.css` 1120-1128 |
| D | Plans Plus : bug halo permanent | Le halo néon reste coincé sur Annuel → doit **suivre la sélection** (Mensuel aussi) | `index.html` 964-983, `components.css` 1535-1572, `main.js` 205-218 |
| E | Section Plus : alignement + taille | Panneau pub **pas au niveau** du pricing → aligner + **raccourcir** le pricing (trop vide) | `components.css` 1396-1462 |

---

## CHANTIER A — Drifts néon en mode clair (plus aucun ne passe)

### Diagnostic
Fichier : `css/promo.css` lignes **476-480** :
```css
[data-theme="light"] .promo-drift { opacity: 0.4; }
[data-theme="light"] .promo-drift:nth-child(3),
[data-theme="light"] .promo-drift:nth-child(6) { display: none; }
```
**2 problèmes :**
1. L'`@keyframes promo-drift` (lignes 246-262) anime l'opacity de 0 → 0.9 → 0. Mais la règle light pose `opacity: 0.4` **sans `!important`** → pendant l'animation, l'opacity suit la keyframe (0 → 0.9 → 0), donc la valeur 0.4 ne s'applique qu'au repos. Sur 4 drifts visibles, quasi rien ne se voit.
2. Les drifts magenta (nth-child 3) et green (nth-child 6) sont en `display: none` → trop masqués.

### Solution
Fichier : `css/promo.css` — remplacer les lignes **476-480** par :

```css
/* V6 Chantier A — Drifts visibles en mode clair aussi.
   On adapte les couleurs au mode clair (couleurs plus profondes
   pour contraster sur fond blanc) au lieu de masquer. */
[data-theme="light"] .promo-drift {
  background: #6A11CB;  /* violet profond (lisible sur blanc) */
  box-shadow:
    0 0 8px #6A11CB,
    0 0 16px rgba(106, 17, 203, 0.5),
    0 0 24px rgba(106, 17, 203, 0.3);
}
[data-theme="light"] .promo-drift:nth-child(1),
[data-theme="light"] .promo-drift:nth-child(5) {
  background: #6A11CB;  /* violet */
}
[data-theme="light"] .promo-drift:nth-child(2),
[data-theme="light"] .promo-drift:nth-child(4) {
  background: #00798C;  /* cyan profond (pas le néon trop clair) */
  box-shadow: 0 0 8px #00798C, 0 0 16px rgba(0, 121, 140, 0.5);
}
[data-theme="light"] .promo-drift:nth-child(3) {
  background: #C2185B;  /* magenta foncé */
  box-shadow: 0 0 8px #C2185B, 0 0 16px rgba(194, 24, 91, 0.5);
}
[data-theme="light"] .promo-drift:nth-child(6) {
  background: #2E7D32;  /* vert foncé */
  box-shadow: 0 0 8px #2E7D32, 0 0 16px rgba(46, 125, 50, 0.5);
}
```

**Justification :** au lieu de baisser l'opacity ou de masquer, on **change les couleurs** pour des versions profondes qui contrastent sur fond blanc. Les drifts restent animés (keyframes inchangées) → ils passent bien derrière le contenu en mode clair.

**Vérifier** que l'`@keyframes promo-drift` (lignes 246-262) reste intacte — c'est elle qui pilote l'opacity 0 → 0.9 → 0. Ne pas y toucher.

---

## CHANTIER B — Resserrement vertical (moins de scroll)

### Diagnostic
- `.section` padding-block `clamp(48px, 8vw, 96px)` = jusqu'à **192px de respiration par section × 7 sections** = énorme.
- Décalages asymétriques trop marqués : `mobile-scene--offset-down` +40px, windows gallery `translateY ±10-14px`, plan-featured `translateY -6px`, etc.

### Solution — 2 leviers

#### B.1 — Réduire les paddings verticaux des sections
Fichier : `css/base.css` ligne **99** :
```css
/* Avant : */
.section { padding-block: clamp(48px, 8vw, 96px); }

/* Après : */
.section { padding-block: clamp(36px, 6vw, 72px); }
```
**Économie :** ~24px par section × 2 (haut+bas) × 7 sections = ~336px de scroll en moins.

Fichier : `css/base.css` ligne **104** :
```css
/* Avant : */
.section__head { margin-bottom: var(--space-2xl); }  /* 40px */

/* Après : */
.section__head { margin-bottom: var(--space-xl); }   /* 24px */
```

#### B.2 — Atténuer les décalages asymétriques (sans les supprimer)
On garde l'effet "jeune/pub gamer" mais on **resserre** pour réduire la hauteur des blocs.

Fichier : `css/components.css` lignes **633-634** :
```css
/* Avant : */
.mobile-scene--offset-down { margin-top: var(--space-2xl); }      /* +40px */
.mobile-scene--offset-up   { margin-top: calc(-1 * var(--space-lg)); } /* -16px */

/* Après : */
.mobile-scene--offset-down { margin-top: var(--space-lg); }       /* +16px */
.mobile-scene--offset-up   { margin-top: calc(-1 * var(--space-md)); } /* -12px */
```

Fichier : `css/components.css` lignes **611-612** (`.mobile-scenes` gap + padding) :
```css
/* Avant : */
gap: clamp(var(--space-2xl), 6vw, var(--space-3xl));   /* 40-64px */
padding-block: var(--space-xl) var(--space-2xl);       /* 24/40 */

/* Après : */
gap: clamp(var(--space-xl), 4vw, var(--space-2xl));    /* 24-40px */
padding-block: var(--space-lg) var(--space-xl);        /* 16/24 */
```

Fichier : `css/components.css` lignes **731-736** (windows gallery) :
```css
/* Avant : */
.windows-gallery__item--a { transform: rotate(-2deg) translateY(14px); }
.windows-gallery__item--b { transform: rotate(1.5deg) translateY(-10px); }
.windows-gallery__item--c { transform: rotate(-1deg) translateY(6px); }

/* Après : */
.windows-gallery__item--a { transform: rotate(-2deg) translateY(8px); }
.windows-gallery__item--b { transform: rotate(1.5deg) translateY(-6px); }
.windows-gallery__item--c { transform: rotate(-1deg) translateY(4px); }
```

Fichier : `css/components.css` lignes **1369-1370** (plan-featured transform) :
```css
/* Avant : */
.plan--featured { transform: rotate(-1.5deg) translateY(-6px); }

/* Après : */
.plan--featured { transform: rotate(-1.5deg) translateY(-4px); }
```

Fichier : `css/components.css` lignes **1674-1679** (footer margin-top) :
```css
/* Avant : */
.site-footer { margin-top: var(--space-3xl); }   /* 64px */

/* Après : */
.site-footer { margin-top: var(--space-2xl); }   /* 40px */
```

**Note :** on ne touche PAS aux rotations (effet gamer conservé), juste aux translations verticales excessives.

---

## CHANTIER C — Switch phone-theme : thumb lumineux en mode nuit

### Diagnostic
Fichier : `css/components.css` lignes **1076-1086** (règle de base) :
```css
.switch__thumb {
  background: var(--surface-solid);   /* = #10131F en dark = NOIR PROFOND */
  box-shadow: var(--shadow-soft);     /* ombre douce, AUCUN glow */
}
```
Et `.switch--phone .switch__thumb` (lignes **1120-1123**) ne surcharge ni le background ni le box-shadow → le thumb reste noir mat en nuit. Le glow cyan n'est posé QUE dans la règle `is-day` (ligne 1127).

### Solution
Fichier : `css/components.css` — modifier la règle `.switch--phone .switch__thumb` (lignes **1120-1123**) :

```css
/* Avant : */
.switch--phone .switch__thumb {
  inset-inline-start: calc(100% - 26px); /* NUIT = thumb à droite */
  transition: inset-inline-start 200ms ease-out;
}

/* Après : */
.switch--phone .switch__thumb {
  inset-inline-start: calc(100% - 26px); /* NUIT = thumb à droite */
  background: radial-gradient(circle at 35% 35%,
              #EAF0FF 0%,
              #B8E8FF 40%,
              var(--neon-cyan) 100%);
  box-shadow:
    0 0 8px var(--neon-cyan),
    0 0 16px rgba(0, 229, 255, 0.6),
    0 0 24px rgba(0, 229, 255, 0.35);
  transition: inset-inline-start 200ms ease-out, box-shadow 200ms ease-out;
}
```

**Pour la position JOUR** (lignes **1124-1128**), on peut maintenant donner un glow violet pour différencier :

```css
/* Avant : */
[data-phone-theme-demo].is-day .switch--phone .switch__thumb {
  inset-inline-start: 2px;
  box-shadow: 0 0 8px rgba(0, 229, 255, 0.5);
}

/* Après : */
[data-phone-theme-demo].is-day .switch--phone .switch__thumb {
  inset-inline-start: 2px;
  background: radial-gradient(circle at 35% 35%,
              #FFF5D6 0%,
              #FFE89A 40%,
              var(--plus-gold) 100%);
  box-shadow:
    0 0 8px var(--plus-gold),
    0 0 16px rgba(255, 201, 60, 0.6),
    0 0 24px rgba(255, 201, 60, 0.35);
}
```

**Effet recherché :**
- NUIT → thumb est un **orbe cyan brillant** (cohérent avec le track cyan)
- JOUR → thumb est un **orbe or/orange** (comme un soleil)

### Variante mode clair
Vérifier que `.switch__thumb` en mode clair reste lisible. Si besoin, ajouter :
```css
[data-theme="light"] .switch--phone .switch__thumb {
  background: radial-gradient(circle at 35% 35%, #FFFFFF, var(--neon-cyan));
  box-shadow: 0 0 6px rgba(0, 229, 255, 0.5);
}
```

---

## CHANTIER D — Plans Plus : halo qui suit la sélection

### Diagnostic du bug
- **HTML** (`index.html` 964-983) : l'annuel porte `plan--featured is-selected` → 2 classes simultanées.
- **CSS** : `.plan--featured` (lignes 1554-1572) + `.plan--featured::before` (bordure dégradée gold→violet) + `[data-theme="dark"] .plan--featured` (1906-1910) + `.plan--featured .plan__price { color: var(--plus-gold) }` (1612) → **TOUJOURS actifs sur l'annuel**, indépendamment de `is-selected`.
- **JS** (`main.js` 205-218) : ne toggle QUE `is-selected`, ne touche jamais à `plan--featured`.

→ L'annuel a donc son halo néon permanent, même quand on sélectionne Mensuel.

### Solution — faire suivre le halo via le JS

#### D.1 — HTML
Fichier : `index.html` lignes **964-983**

**Retirer `plan--featured` du bouton annuel** (laisser seulement `is-selected` au chargement) :

```html
<div class="plans">
  <!-- Mensuel -->
  <button class="plan" type="button" data-plan="monthly" aria-pressed="false">
    <div class="plan__name" data-i18n="plus.plan_monthly_name">Mensuel</div>
    <div class="plan__price">
      <span data-i18n="plus.plan_monthly_price">1,99 €</span>
      <small data-i18n="plus.plan_monthly_unit">/ mois</small>
    </div>
  </button>

  <!-- Annuel (sélectionné par défaut) -->
  <button class="plan is-selected" type="button" data-plan="annual" aria-pressed="true">
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

#### D.2 — CSS
Fichier : `css/components.css`

**Renommer les sélecteurs `.plan--featured` en `.plan.is-selected`** pour que le halo suive la sélection. Concrètement :

- Lignes **1554-1559** `.plan--featured { ... }` → **déjà couvert par `.plan.is-selected` (1535-1541)** qui fait presque la même chose. Vérifier qu'ils ne se contradictent pas. Si oui, supprimer les doublons.
- Lignes **1560-1572** `.plan--featured::before` (bordure dégradée) → **changer le sélecteur** en `.plan.is-selected::before`.
- Lignes **1612-1613** `.plan--featured .plan__price { color: var(--plus-gold) }` → **changer** en `.plan.is-selected .plan__price { color: var(--plus-gold) }`.
- Lignes **1906-1910** `[data-theme="dark"] .plan--featured` → changer en `[data-theme="dark"] .plan.is-selected`.
- Lignes **1369-1370** `.plan--featured { transform: ... }` → changer en `.plan.is-selected { transform: ... }`.

**MASQUER le badge "Économisez 16%"** quand Mensuel est sélectionné (le badge reste dans le DOM annuel mais doit se cacher) :

```css
.plan:not(.is-selected) .plan__badge {
  display: none;
}
```

En fait, le badge `plan__badge` est **uniquement dans le bouton annuel** (HTML). Quand Mensuel est sélectionné, l'annuel n'a plus `is-selected` → le badge se masque. Quand Annuel redevient sélectionné, le badge réapparaît. C'est cohérent.

#### D.3 — JS
Fichier : `js/main.js` lignes **205-218**

Modifier `selectPlan` pour **toggle aussi `is-selected` correctement** (déjà fait), mais surtout **s'assurer qu'un seul plan a `is-selected` à la fois** :

```js
function selectPlan(planName) {
  plans.forEach(function (plan) {
    var isSelected = plan.getAttribute("data-plan") === planName;
    plan.classList.toggle("is-selected", isSelected);
    plan.setAttribute("aria-pressed", isSelected ? "true" : "false");
  });
  currentPlan = planName;
}
```

**Ce JS est déjà correct** — le bug venait uniquement de la classe `plan--featured` permanente dans le HTML. Une fois qu'on retire `plan--featured` du HTML et qu'on renomme les sélecteurs CSS, le halo suivra automatiquement la classe `is-selected`.

### Effet attendu
- État initial : Annuel sélectionné → halo or/violet + prix en or + badge "Économisez 16%" visible
- Clic Mensuel → halo or/violet **bascule sur Mensuel**, prix Mensuel devient or, badge annuel se masque
- Clic Annuel → retour à l'état initial
- L'effet néon (joli) **passe de gauche à droite** selon la sélection

---

## CHANTIER E — Section Plus : alignement + raccourcir pricing

### Diagnostic
- `.plus` grid a `align-items: stretch` → les 2 colonnes ont la même hauteur (la plus grande = pricing).
- `.plus__visual` a `justify-content: center` → le poster flotte au milieu de la colonne, loin du top.
- `.neon-premium` a `padding: var(--space-2xl)` (40px) → carte très haute, "trop vide".

### Solution — 3 actions

#### E.1 — Aligner les colonnes (centrer verticalement)
Fichier : `css/components.css` ligne **1400** :
```css
/* Avant : */
.plus { align-items: stretch; }

/* Après : */
.plus { align-items: center; }
```
Les 2 colonnes se centrent sur leur propre hauteur → le poster s'aligne avec le pricing.

#### E.2 — Remonter le panneau pub au top
Fichier : `css/components.css` ligne **1413** :
```css
/* Avant : */
.plus__visual { justify-content: center; }

/* Après : */
.plus__visual { justify-content: flex-start; }
```
Le poster commence en haut de sa colonne.

**Combinaison E.1 + E.2 :** comme `align-items: center` est sur le grid, les 2 colonnes se centrent verticalement sur leur plus grande hauteur. Le pricing est plus grand → le poster se centre par rapport à lui. C'est l'effet recherché.

#### E.3 — Raccourcir le menu pricing (trop vide)
Fichier : `css/components.css` ligne **1442** :
```css
/* Avant : */
.neon-premium { padding: var(--space-2xl); }   /* 40px */

/* Après : */
.neon-premium { padding: var(--space-lg) var(--space-xl); }  /* 16/24px */
```

Fichier : `css/components.css` ligne **1483** :
```css
/* Avant : */
.plus__benefits { margin-block: var(--space-lg); }   /* 16px */

/* Après : */
.plus__benefits { margin-block: var(--space-md); }   /* 12px */
```

Fichier : `css/components.css` ligne **1516** :
```css
/* Avant : */
.plans { margin-block: var(--space-lg); }   /* 16px */

/* Après : */
.plans { margin-block: var(--space-md); }   /* 12px */
```

Fichier : `css/components.css` ligne **1465** :
```css
/* Avant : */
.neon-premium__badge { margin-bottom: var(--space-md); }

/* Après : */
.neon-premium__badge { margin-bottom: var(--space-sm); }
```

Fichier : `index.html` ligne **987** (wrapper CTA inline) :
```html
<!-- Avant : -->
<div style="margin-top: var(--space-lg); text-align: center">

<!-- Après : -->
<div style="margin-top: var(--space-md); text-align: center">
```

#### E.4 — Réduire aussi les gaps entre benefits
Fichier : `css/components.css` lignes **1479-1484** :
```css
/* Avant : */
.plus__benefits { gap: var(--space-md); }

/* Après : */
.plus__benefits { gap: var(--space-sm); }
```

### Effet attendu
- Les 2 colonnes commencent au même niveau vertical
- Le panneau pub est **au niveau du téléphone** (aligné en haut)
- Le pricing est **plus compact** (moins de padding, moins de marges)
- Le tout tient dans une hauteur plus raisonnable → moins de scroll

---

## ✅ Critères d'acceptation V6

- [ ] **A** : En mode clair, des drifts néon passent derrière le contenu (couleurs adaptées au fond blanc : violet/cyan/magenta/vert profonds). Plus de `display: none`.
- [ ] **B** : La page est plus courte. `.section` padding-block réduit (96px → 72px max). Décalages asymétriques atténués (offset-down 40→16, etc.). Rotations conservées.
- [ ] **C** : En mode NUIT, le thumb du switch phone-theme est un **orbe cyan brillant** (gradient + glow cyan). En mode JOUR, il est **or/orange** (gradient + glow or).
- [ ] **D** : Le halo néon des plans **suit la sélection**. Clic Mensuel → halo bascule sur Mensuel + prix Mensuel devient or + badge annuel masqué. Clic Annuel → inverse. Plus de halo permanent coincé sur Annuel.
- [ ] **E** : Panneau pub aligné avec le top du pricing (`align-items: center` + `justify-content: flex-start`). Pricing raccourci (`padding 16/24px`, marges réduites). Moins de "vide" dans la carte pricing.
- [ ] Pas de cassure des fonctionnalités précédentes (i18n, theme global, switch phone-theme, overlay vidéo, etc.).
- [ ] `prefers-reduced-motion` respecté.

---

## 🔧 Méthodologie

1. **Lis ce brief V6 en entier**.
2. **Lis les fichiers ciblés** (`css/promo.css`, `css/base.css`, `css/components.css`, `index.html`, `js/main.js`) aux lignes indiquées.
3. **Applique chantier par chantier** (A → B → C → D → E).
4. **Utilise tes skills associés** (frontend-design, code review, vérification).
5. **Vérifie l'acceptance criteria V6**.
6. **Rapporte à la fin**.

## ⚠️ Ne pas casser
- i18n 12 langues, protections, theme global header toggle, switch phone-theme local
- Galerie mobile asymétrique (V2)
- Overlay vidéo Windows (V2)
- Mode DARK arcade vivante (V3)
- Composition promo multi-langue (V4)
- Cyan switch glow (V5), badges stores, cartes download symétriques

## Palette (rappel)
- Cyan néon `#00E5FF`, Violet `#8A2BE2`, Magenta `#FF2D95`, Vert `#39FF14`
- Violet Plus `#B026FF`, Or Plus `#FFC93C`
- Couleurs light profondes : violet `#6A11CB`, cyan `#00798C`, magenta `#C2185B`, vert `#2E7D32`

Bonne finition ! 🎮
