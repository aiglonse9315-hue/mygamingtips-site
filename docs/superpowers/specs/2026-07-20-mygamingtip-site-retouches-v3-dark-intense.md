# Retouches V3 — Mode DARK = Arcade Vivante Intense

**Date :** 2026-07-20
**Objet :** Le mode DARK actuel manque de lumière et d'effet "salle d'arcade". L'utilisateur veut un DARK néon **beaucoup plus vivant**, avec des contours néon **plus marqués** et des **effets de lumière sur l'arrière-plan**.

---

## ⚠️ Le constat

Le mode DARK actuel respecte strictement le DESIGN.md officiel de l'app (halos néon ≤ 0.14 d'alpha). Mais l'utilisateur a été clair :
- « c'est triste noir/blanc »
- « on m'avait vendu du DARK neon purple »
- « avec contour réhausse mode néon »
- « le fond d'écran tous blanc est triste trouve autre chose »

Le "fond blanc triste" est un **bug de détection** : si l'OS est en `prefers-color-scheme: light`, l'anti-flash script charge le site en mode clair. **MAIS** même en mode dark, le rendu est jugé trop timide.

## ✅ Décisions utilisateur

| Question | Réponse |
|---|---|
| Thème défaut | **Le mode clair reste tel quel**. On ne le supprime pas, on ne le force pas en dark. |
| Intensité néon | **Pousser l'intensité néon** (halos à 0.22-0.30, contours plus marqués) |
| Dominance | **Mix violet/cyan/magenta équilibré** |

**Donc :** on intensifie UNIQUEMENT le mode DARK. Le mode clair reste inchangé.

---

## 🎯 Objectif V3

Transformer le mode DARK en véritable **"Arcade Vivante"** :
- Comme l'intérieur d'une **salle d'arcade** : halos néon qui vibrent, contours qui glow, lumières qui dansent
- Les **3 couleurs néon** (violet `#8A2BE2`, cyan `#00E5FF`, magenta `#FF2D95`) bien présentes et équilibrées
- Les **contours des cartes/boutons/images** ont un glow néon marqué
- L'**arrière-plan** a des effets de lumière dynamiques (scanlines, pulses, gradients animés)

**SANS tomber dans :**
- Le chaos visuel (le contenu reste lisible — le néon signale, ne noie pas)
- Le délai de chargement (animations GPU-only, `will-change` maîtrisé)
- La fatigue rétinienne (les néons intenses restent en arrière-plan/bordures, pas en plein texte)

---

## 📋 Les 5 chantiers V3

---

### CHANTIER 1 — Intensifier les halos d'arrière-plan (mode DARK uniquement)

#### Fichiers concernés
- `css/tokens.css` lignes 88-124 (bloc `[data-theme="dark"]`)
- `css/gaming-background.css` (tout le fichier)

#### Changements tokens (mode DARK)
Augmenter les alpha des halos de 0.10-0.14 → **0.22-0.30** :

```css
[data-theme="dark"] {
  /* ... existing ... */
  --grid-line: rgba(0, 229, 255, 0.08);        /* était 0.05 → 0.08 */
  --halo-a: rgba(138, 43, 226, 0.30);           /* était 0.14 → 0.30 */
  --halo-b: rgba(0, 229, 255, 0.22);            /* était 0.10 → 0.22 */
  --halo-c: rgba(255, 45, 149, 0.22);           /* était 0.10 → 0.22 */
  /* ... */
}
```

#### Changements gaming-background.css
- Ajouter **un 4e halo** néon (vert néon `#39FF14` très subtil, alpha 0.10) pour enrichir la palette
- Augmenter le `blur` des halos de 60px → **80-100px** pour un effet plus diffus et enveloppant
- Augmenter la taille des halos (déjà en `vw`, on peut passer à 65-70vw)
- **Ajouter un effet de "scanlines"** subtil sur le fond (lignes horizontales très fines, alpha 0.015, façon vieille borne CRT) — UNIQUEMENT en mode dark
- **Ajouter un effet de "pulse"** global : une légère animation de luminosité sur les halos (en plus du float) qui donne l'impression que la salle d'arcade "respire"
- Le `.gbg__veil` en mode dark doit rester très transparent (ne pas assombrir les halos)

#### Scanlines CSS (à ajouter)
```css
[data-theme="dark"] .gbg::after {
  content: "";
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 2px,
    rgba(0, 229, 255, 0.015) 2px,
    rgba(0, 229, 255, 0.015) 3px
  );
  pointer-events: none;
  z-index: 1;
}
```

#### Pulse animation (à ajouter)
```css
@keyframes gbg-pulse {
  0%, 100% { opacity: 1; }
  50%      { opacity: 0.78; }
}
.gbg__halo {
  animation: gbg-float-a 22s ease-in-out infinite, gbg-pulse 6s ease-in-out infinite;
}
/* Respecter reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .gbg__halo { animation: none !important; }
}
```

---

### CHANTIER 2 — Contours néon plus marqués sur les cartes (mode DARK)

#### Objectif
En mode dark, les cartes/blocs (`.surface`, `.card`, `.window`, `.phone`, etc.) doivent avoir un **contour néon subtil mais visible** qui les fait "glow" légèrement, comme les contours lumineux d'une borne d'arcade.

#### Changements à apporter dans `css/components.css` (et/ou `tokens.css`)

Créer un token de bordure néon en mode dark :
```css
[data-theme="dark"] {
  /* ... existing ... */
  --border-neon: 1px solid rgba(138, 43, 226, 0.35);   /* violet glow subtil */
  --border-neon-cyan: 1px solid rgba(0, 229, 255, 0.30);
  --glow-card: 0 0 0 1px rgba(138, 43, 226, 0.25),
               0 0 20px rgba(138, 43, 226, 0.15);      /* halo doux sur cartes au repos */
  --glow-card-hover: 0 0 0 1px rgba(138, 43, 226, 0.6),
                     0 0 30px rgba(138, 43, 226, 0.35); /* halo renforcé au hover */
}
```

Appliquer sur les principaux composants (mode DARK uniquement) :
- `.card`, `.surface-card`, `.window`, `.phone` → `box-shadow: var(--glow-card);`
- Au hover → `box-shadow: var(--glow-card-hover);` (transition 200ms)
- Les `.step-badge`, `.badge` → contour néon correspondant à leur couleur
- Les boutons `.btn--ghost` → bordure néon plus marquée en mode dark

**IMPORTANT :** ces effets glow ne s'appliquent **QUE** en mode dark (`[data-theme="dark"]`). En mode clair, on garde les ombres légères actuelles.

---

### CHANTIER 3 — Effets de lumière dynamiques sur l'arrière-plan (mode DARK)

#### Objectif
L'arrière-plan doit "vivre" — pas juste des halos statiques qui flottent, mais des **effets de lumière qui dansent** comme dans une salle d'arcade.

#### Idées à implémenter (au choix, cf. ce qui rend le mieux)

**Option A — "Rayons néon" en movement**
Des rayons de lumière diagonaux très subtils qui se déplacent lentement à travers l'écran (effet light sweep, alpha ~0.04).

**Option B — "Particules flottantes"**
Des petits points néon (5-10 particules) qui flottent lentement à travers l'écran, façon poussière dans un faisceau lumineux. Alpha ~0.3, taille 2-4px.

**Option C — "Aurora effect"**
Un gradient animé très lent (30-40s) qui fait varier les zones de couleur néon à l'écran, comme les aurores boréales.

**Recommandation :** Combiner B (particules) + C (aurora) pour un effet riche mais pas surchargé. Éviter A (rayons) qui peut paraître cliché.

#### Implémentation recommandée

Ajouter dans `css/gaming-background.css` :

```css
/* Particules flottantes — 8 petites orbes néon */
.gbg__particle {
  position: absolute;
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: var(--neon-cyan);
  box-shadow: 0 0 8px var(--neon-cyan);
  opacity: 0.4;
  animation: gbg-particle-float 18s linear infinite;
}
/* Varier les couleurs et positions via :nth-child */
.gbg__particle:nth-child(1) { top: 10%; left: 15%; animation-delay: 0s; background: var(--neon-violet); box-shadow: 0 0 8px var(--neon-violet); }
.gbg__particle:nth-child(2) { top: 25%; left: 80%; animation-delay: -3s; background: var(--neon-cyan); box-shadow: 0 0 8px var(--neon-cyan); }
/* ... etc pour 8 particules ... */

@keyframes gbg-particle-float {
  0%   { transform: translate(0, 0); opacity: 0; }
  10%  { opacity: 0.4; }
  90%  { opacity: 0.4; }
  100% { transform: translate(20vw, -30vh); opacity: 0; }
}

/* Aurora effect — gradient animé très lent */
.gbg__aurora {
  position: absolute;
  inset: -20%;
  background: conic-gradient(
    from 0deg at 50% 50%,
    rgba(138, 43, 226, 0.12) 0deg,
    rgba(0, 229, 255, 0.10) 120deg,
    rgba(255, 45, 149, 0.10) 240deg,
    rgba(138, 43, 226, 0.12) 360deg
  );
  filter: blur(100px);
  animation: gbg-aurora-rotate 45s linear infinite;
  opacity: 0.6;
}

@keyframes gbg-aurora-rotate {
  0%   { transform: rotate(0deg) scale(1); }
  50%  { transform: rotate(180deg) scale(1.1); }
  100% { transform: rotate(360deg) scale(1); }
}

@media (prefers-reduced-motion: reduce) {
  .gbg__particle, .gbg__aurora { animation: none !important; opacity: 0.3; }
}
```

**Ajouter le HTML correspondant** dans `index.html` (dans le bloc `.gbg`, lignes ~91-97) :
```html
<div class="gbg" aria-hidden="true">
  <div class="gbg__aurora"></div>
  <div class="gbg__halo gbg__halo--a"></div>
  <div class="gbg__halo gbg__halo--b"></div>
  <div class="gbg__halo gbg__halo--c"></div>
  <div class="gbg__halo gbg__halo--d"></div>   <!-- nouveau vert -->
  <div class="gbg__particle"></div>
  <div class="gbg__particle"></div>
  <!-- ... 8 particules au total ... -->
  <div class="gbg__grid"></div>
  <div class="gbg__veil"></div>
</div>
```

---

### CHANTIER 4 — Mettre en avant les éléments clés avec un glow néon renforcé (mode DARK)

#### Objectif
Les éléments "signaux" (boutons CTA, cards featured, badges, screenshots mis en avant) doivent avoir un **glow néon intense** en mode dark — façon panneau lumineux d'arcade.

#### Éléments à traiter

1. **Boutons primaires CTA** (`.btn--primary`, `.btn--neon`) :
   - En mode dark, ajouter `box-shadow: 0 0 30px rgba(138, 43, 226, 0.5), 0 0 60px rgba(138, 43, 226, 0.3);`
   - Effet de **pulsation** néon douce (opacity 0.85 → 1.0 sur 1600ms, cf. DESIGN.md NeonButton) — UNIQUEMENT si `prefers-reduced-motion` est OK

2. **Cards featured / mises en avant** (`.scene--featured`, `.plus__card`, stat mise en avant) :
   - Bordure néon colorée correspondant à leur rôle (violet pour Playlist, or pour Plus, cyan pour Communauté)
   - `box-shadow` avec halo double couche intense

3. **Badges** (`.step-badge`, badges flottants hero "NOUVEAU"/"GRATUIT"/"12 LANGUES") :
   - Glow néon correspondant à leur couleur
   - Animation de **pulse** très légère pour qu'ils attirent l'œil sans agresser

4. **Screenshots mis en avant** (phone featured, windows-overlay) :
   - Contour néon + halo autour du mockup

#### Pulsation néon (cf. DESIGN.md §4 Pulsation)
```css
@keyframes neon-pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 1px rgba(138, 43, 226, 0.6), 0 0 20px rgba(138, 43, 226, 0.3); }
  50%      { opacity: 0.85; box-shadow: 0 0 0 1px rgba(138, 43, 226, 0.85), 0 0 35px rgba(138, 43, 226, 0.5); }
}

[data-theme="dark"] .btn--primary,
[data-theme="dark"] .btn--neon {
  animation: neon-pulse 1600ms ease-in-out infinite;
}

@media (prefers-reduced-motion: reduce) {
  [data-theme="dark"] .btn--primary,
  [data-theme="dark"] .btn--neon {
    animation: none;
    opacity: 0.9;
  }
}
```

---

### CHANTIER 5 — Forcer le mode DARK par défaut (indépendamment du système)

#### Objectif
Actuellement l'anti-flash script suit `prefers-color-scheme`. Si l'utilisateur est en OS clair, le site charge en blanc. L'utilisateur veut **DARK par défaut**, mais en gardant la possibilité de basculer en clair via le toggle.

#### Changement dans `index.html` (anti-flash script, lignes 7-23)

Modifier la logique :
```js
(function () {
  try {
    var t = localStorage.getItem("mgt-theme");
    if (t !== "dark" && t !== "light") {
      // V3 : DARK par défaut, quel que soit le réglage système.
      // Le mode clair reste accessible via le toggle du header.
      t = "dark";
    }
    document.documentElement.setAttribute("data-theme", t);
  } catch (e) {
    document.documentElement.setAttribute("data-theme", "dark");
  }
})();
```

#### Changement dans `css/tokens.css` (lignes 162-191)
Le bloc `@media (prefers-color-scheme: light)` qui définit des variables "light" sur `:root:not([data-theme])` doit être **supprimé** (ou neutralisé), car il peut causer un flash blanc avant que JS ne pose `data-theme="dark"`.

Soit supprimer purement et simple ce bloc, soit le remplacer par les variables dark par défaut sur `:root`.

**Recommandation :** définir les variables DARK directement sur `:root` (en plus de `[data-theme="dark"]`), pour que même sans JS le site soit dark. Le bloc `[data-theme="light"]` vient ensuite surcharger quand le mode clair est activé.

```css
/* :root = DARK par défaut (même sans JS) */
:root {
  --bg: #070912;
  --surface: rgba(16, 19, 31, 0.86);
  /* ... toutes les variables dark ... */
}

/* [data-theme="dark"] = même chose (redondant mais explicite) */
[data-theme="dark"] { /* même contenu que :root */ }

/* [data-theme="light"] surcharge quand activé */
[data-theme="light"] { /* variables claires existantes */ }

/* SUPPRIMER le bloc @media (prefers-color-scheme: light) */
```

---

## 🎨 Contraintes à respecter (toujours en vigueur)

1. **Mode CLAIR inchangé** — ses variables, ses styles, ses halos restent tels quels.
2. **Pas de side-stripe** (border-left/right > 1px).
3. **`prefers-reduced-motion`** : TOUTES les animations (float, pulse, particules, aurora) doivent avoir une alternative instantanée ou fixe sous reduced-motion.
4. **Le néon reste lisible** : en texte, on garde le blanc `#EAF0FF` pour les corps de texte. Le néon intense est pour les arrière-plans, bordures, icônes, titres courts.
5. **Performance** : animations GPU-only (`transform`, `opacity`), `will-change` maîtrisé, pas de layout thrashing. Limiter le nombre de particules (8 max) pour la perf.
6. **Mobile-first** : tester que les effets rendent bien sur petit écran (les halos 60vw peuvent être trop gros sur mobile — ajuster si besoin).
7. **Pas de chaos visuel** : l'objectif est "arcade vivante", pas "soupe néon". Le contenu reste roi, les effets sont en arrière-plan ou en bordure.

---

## ✅ Critères d'acceptation V3

- [ ] **Chantier 1** : Halos néon en mode dark passent à alpha 0.22-0.30. Scanlines subtiles visibles. 4e halo vert ajouté. Pulse global des halos.
- [ ] **Chantier 2** : Cartes/blocs ont un contour néon subtil + glow doux en mode dark (renforcé au hover). Mode clair inchangé.
- [ ] **Chantier 3** : Particules flottantes (8) + aurora effect animé en arrière-plan mode dark. Effets désactivés sous reduced-motion.
- [ ] **Chantier 4** : Boutons CTA, cards featured, badges, screenshots mis en avant ont un glow néon intense en mode dark (+ pulsation sur boutons primaires).
- [ ] **Chantier 5** : Le site charge en DARK par défaut, même si l'OS est en mode clair. Toggle jour/nuit reste fonctionnel. Plus de flash blanc au chargement.
- [ ] **Mode clair 100% inchangé** (visuellement identique à V2).
- [ ] `prefers-reduced-motion` respecté partout.
- [ ] Pas de chaos visuel — contenu reste lisible.

---

## 🔧 Méthodologie

1. **Relis le brief V3** en entier.
2. **Fais une copie mentale de l'état actuel** (V2) — tu vas intensifier le dark sans toucher au light.
3. **Commence par le Chantier 5** (anti-flash + tokens :root) — c'est la fondation. Teste que le site charge bien en dark par défaut.
4. **Puis Chantier 1** (halos + scanlines + pulse).
5. **Puis Chantier 2** (contours néon sur cartes).
6. **Puis Chantier 3** (particules + aurora).
7. **Puis Chantier 4** (glow sur éléments clés).
8. **Teste après chaque chantier** si possible.
9. **Utilise tes skills associés** (frontend-design, code review, vérification avant complétion).
10. **Rapporte à la fin** : ce qui est changé, les valeurs finales d'alpha utilisées, les décisions de perf.

## ⚠️ Garde le contexte V1 + V2

- Brief V1 : `docs/superpowers/specs/2026-07-20-mygamingtip-site-design.md`
- Brief V2 : `docs/superpowers/specs/2026-07-20-mygamingtip-site-retouches-v2.md`
- DESIGN.md de l'app : `D:\NONO\Projet APP\Zprojet\MygamingTis\DESIGN.md` (pour la palette exacte)
- PRODUCT.md : `D:\NONO\Projet APP\Zprojet\MygamingTis\PRODUCT.md`

Les 5 chantiers V2 (galerie éparse, overlay vidéo, déduplication, stats communauté, switch local) **doivent rester fonctionnels**. Tu ne fais qu'intensifier le rendu visuel du mode dark.

Bonne intensification. Fais de ce site une vraie salle d'arcade. 🎮✨
