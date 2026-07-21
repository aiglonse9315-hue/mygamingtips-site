# Retouches V2 — Site MyGamingTips

**Date :** 2026-07-20
**Objet :** Retouches suite au 1er retour utilisateur. 5 chantiers ciblés + 1 direction artistique transverse.

---

## ⚠️ IMPORTANT : direction transverse à appliquer PARTOUT

L'utilisateur veut que **les dispositions des images et des textes soient moins formelles, moins droites, moins alignées** — **plus jeunes, plus "pub gamers", plus étonnantes**. « Étonne-moi. »

Cela signifie : introduire de l'**asymétrie**, du **décalage**, de la **rotation subtile**, des **offsets**, des **chevauchements**, des **variations de taille**. Sortir du grid symétrique `1fr 1fr` rectiligne actuel.

**Cependant** — contrainte absolue : **ne JAMAIS éteindre la lumière du site**. La signature "Arcade Vivante" (halos néon, glow, mode nuit vedette) doit rester **renforcée**, pas atténuée. Le néon reste roi.

Donc : plus de **mouvement et d'asymétrie dans la composition**, mais **plus de néon et de vie**, pas moins.

### Outils CSS à utiliser pour l'asymétrie
- `transform: rotate(-2deg)` / `rotate(3deg)` sur certains mockups (léger, pas plus de ±4deg)
- `transform: translateY(±Xpx)` / `translateX(±Xpx)` pour décaler des éléments hors de l'alignement
- Grid asymétrique : `grid-template-columns: 0.9fr 1.3fr` au lieu de `1fr 1fr`, ou placement explicite via `grid-column` / `grid-row` + `margin-top` décalés
- Chevauchements via `z-index` + `margin` négatifs contrôlés
- Mix de tailles : un screenshot plus grand que ses voisins
- Variations de `border-radius` et de `padding`
- Éléments décoratifs flottants en plus (badges, badges néon, formes géométriques)

**À éviter :** rotation excessive (→ chaos), asymétrie sur le texte de lecture (reste lisible), néon partout (reste sélectif — cf. règle "le néon signale").

---

## 📋 Les 5 chantiers précis

---

### CHANTIER 1 — Section Mobile : disposer les screenshots de façon éparse

#### Problème actuel
- Section Mobile Showcase : `index.html` lignes **370–501**
- Galerie = scroll horizontal (`.gallery` = `display: flex; overflow-x: auto`, cf. `css/components.css` lignes **578–600**)
- 7 screenshots alignés en file indienne, tous identiques (`.gallery__item` width 240px), tous centrés verticalement
- **Effet : "trop ramassé, en file indienne"** → monotone, formel

#### Objectif
Disposer les **7 screenshots mobile** de façon **éparse et contextuelle** :
- Chaque screenshot est accompagné de **son commentaire/légende en regard** (à côté, pas en dessous systématiquement)
- Les screenshots sont **décalés** verticalement (certains hauts, d'autres bas), **rotationnées légèrement** (±2-4deg), **tailles variées**
- Le visiteur doit sentir qu'il **parcourt l'app en situation**, pas qu'il scrolle une galerie uniforme

#### Solution recommandée (libre de proposer mieux)
Remplacer la galerie scroll horizontale par une **composition en "mosaïque asymétrique"** :
- Grid à 12 colonnes (desktop) avec placement explicite de chaque screenshot
- Chaque screenshot dans un `.phone` mockup (conserver la classe)
- Placer les screenshots 2 par 2 ou 1 par 1, alternant gauche/droite
- À côté de chaque screenshot : un bloc texte avec **numéro d'étape** (1–7), titre, et commentaire contextuel
- Alterner l'alignement (screenshot à gauche + texte à droite, puis l'inverse)
- Légers décalages verticaux (`margin-top: 40px`, `margin-top: -20px`) pour casser l'alignement
- Rotations légères et alternées (`rotate(-2deg)`, `rotate(2.5deg)`, etc.)
- Au moins un screenshot mis en avant (plus grand, halo néon violet/cyan, `NeonContainer`)

#### Exemple de structure (à adapter)
```html
<!-- Paire 1 : screenshot gauche, texte droite -->
<div class="mobile-scene mobile-scene--left">
  <div class="mobile-scene__phone">
    <div class="phone" style="transform: rotate(-2deg)">...</div>
  </div>
  <div class="mobile-scene__text">
    <span class="step-badge">01</span>
    <h3 class="scene-title">Accueil</h3>
    <p class="scene-desc">Toutes vos astuces, guides et tips réunis...</p>
  </div>
</div>

<!-- Paire 2 : texte gauche, screenshot droite, décalé vers le bas -->
<div class="mobile-scene mobile-scene--right" style="margin-top: 80px;">
  ...
</div>
```

#### Légendes à utiliser (déjà dans `locales/fr.json`, clés `mobile.*_title` et `mobile.*_caption`)
1. `mobile-home.jpg` — **Accueil** — "Toutes vos astuces, guides et tips réunis au même endroit. Démarrage instantané."
2. `mobile-explore.jpg` — **Explorer** — "Découvrez les jeux les plus populaires, triés et vérifiés."
3. `mobile-mygames.jpg` — **Mes jeux** — "Votre liste personnalisée, accessible en un tap."
4. `mobile-playlist.jpg` — **My Playlist** — "Retrouvez vos contenus sans les chercher. Triez, organisez à votre façon."
5. `mobile-playlist-bygame.jpg` — **Playlists par jeu** — "Une organisation toujours plus claire, jeu par jeu."
6. `mobile-profile.jpg` — **Profil** — "Personnalisez votre setup image et découvrez le contributeur du mois."
7. `mobile-daynight.jpg` — **Jour ou nuit** — "C'est votre style. L'arcade vivante la nuit, le repli lisible le jour."

*(NB : le screenshot 7 jour/nuit sera repris dans le chantier 4 avec les nouvelles images jour/nuit séparées — voir plus bas. Ici on peut le laisser en galerie ou le retirer pour éviter la redondance avec la section Personnalisation. **Décision recommandée : retirer le screenshot 7 de la galerie Mobile** car il sera mieux traité dans la section Personnalisation avec les 2 vraies images jour/nuit. La galerie Mobile fait donc 6 screenshots.)*

#### Responsive
- Mobile (<700px) : empilement vertical simple, screenshot centré au-dessus du texte, rotation conservée ou réduite
- Desktop (≥900px) : composition asymétrique complète

---

### CHANTIER 2 — Section Windows : refonte de l'animation overlay vidéo

#### Problème actuel
- Section Windows Showcase : `index.html` lignes **503–683**
- Démo overlay actuelle : `index.html` lignes **516–544** + JS `js/main.js` lignes **78–118** + CSS `css/components.css` lignes **649–749**
- **Effet actuel jugé "bof"** : un stage avec un faux fond dégradé + un bouton "Afficher la vidéo" qui toggle un player fictif (barre de progression animée, badge "NO ADS"). Visuellement pauvre, pas représentatif de l'app.

#### Objectif
Le bouton **« Afficher la vidéo »** doit, au clic, **afficher la VRAIE image `windows-overlay.png`** (le screenshot réel `app windows lecteur vidéo intégrer a l'app , vidéo sans pub en overlay sur ton jeux préférer`) à l'écran.

De plus, la vidéo doit **s'ouvrir depuis une flèche présente sur le côté de l'écran** :
- **Avant le clic** : la flèche est **presque transparente** (opacity ~0.15-0.25) — discrète, présente mais presque invisible
- **Au clic sur le bouton "Afficher la vidéo"** : la vidéo **glisse depuis le bord** (côté flèche), en **crossfade + translate**, et devient **opaque** (opacity 1)
- **Réclic / bouton "Masquer"** : la vidéo retourne vers le bord et redevient transparente

#### Spécifications précises

**HTML de la démo (à reconstruire) :**
```html
<div class="overlay-demo" data-overlay-demo>
  <!-- Le "jeu" en arrière-plan = une image de fond de jeu (screenshot windows-home.png ou windows-mygames.png) -->
  <div class="overlay-demo__stage">
    <img src="assets/screenshots/windows/windows-mygames.png" class="overlay-demo__game" alt="..." />
    
    <!-- Flèche "handle" sur le côté droit, quasi-transparente avant clic -->
    <button class="overlay-demo__handle" data-overlay-show aria-label="Ouvrir la vidéo overlay">
      <span class="overlay-demo__handle-icon">◀</span>
      <span class="overlay-demo__handle-label">Vidéo overlay</span>
    </button>
    
    <!-- Le player overlay (la VRAIE image) -->
    <div class="overlay-demo__player" data-overlay-player>
      <img src="assets/screenshots/windows/windows-overlay.png" alt="Lecteur vidéo overlay sans pub" />
      <span class="overlay-demo__ad-badge">NO ADS</span>
    </div>
  </div>
  
  <!-- Boutons de contrôle -->
  <div class="overlay-demo__controls">
    <button class="btn btn--ghost" data-overlay-show data-i18n="windows.demo_show">Afficher la vidéo</button>
    <button class="btn btn--ghost" data-overlay-hide data-i18n="windows.demo_hide">Masquer la vidéo</button>
  </div>
  
  <p class="overlay-demo__status" data-overlay-status data-i18n="windows.demo_idle">Vidéo masquée</p>
</div>
```

**Comportement CSS/JS attendu :**
1. **État initial** : `.overlay-demo__player` est `opacity: 0` + `transform: translateX(40px)` (décalé vers la droite, hors de la zone visible) + `.overlay-demo__handle` est `opacity: 0.2` (presque transparent).
2. **Clic "Afficher"** : ajouter classe `is-active` sur `.overlay-demo` → `.overlay-demo__player` devient `opacity: 1` + `transform: translateX(0)` (glisse en place) en transition 400ms ease-out. En parallèle, `.overlay-demo__handle` devient `opacity: 0` (la flèche disparaît une fois la vidéo sortie).
3. **Clic "Masquer"** : retirer `is-active` → inverse.
4. **Transition** : `transition: opacity 400ms ease-out, transform 400ms ease-out;` sur le player. Respecter `prefers-reduced-motion` (si réduit → pas de translate, juste opacity instantanée).

**Position du player overlay :** en bas à droite du stage (comme dans l'app réelle — cf. le screenshot `windows-overlay.png` qui montre la vidéo en overlay pendant le jeu). Utiliser `position: absolute; bottom: 16px; inset-inline-end: 16px; width: ~45%;` — adapter pour que l'image reste lisible.

**Le stage** doit avoir un aspect ratio 16/9 et `position: relative; overflow: hidden;` pour contenir le player. Image de fond = un screenshot Windows qui représente "le jeu en cours".

#### Comportement à supprimer
Retirer l'ancien système : le faux player avec barre de progression `player-progress` keyframes (lignes 716–719) et le faux fond dégradé. Conserver le badge "NO ADS" sur le vrai player.

---

### CHANTIER 3 — Section Windows : dédupliquer et réduire la taille des screenshots

#### Problème actuel
- Section Windows : `index.html` lignes **597–681** — grille `.grid--windows` contenant 4 figures
- Les 2 premiers (`windows-home.png` ligne 607 et `windows-home-2.png` ligne 628) sont **2 variantes très proches de l'écran d'accueil Windows** → effet de répétition
- Le grand screenshot principal (`.window` ligne 557, `windows-overlay.png` repris dans le chantier 2) et les images de la grille sont en **pleine largeur**, **résolution trop grosse**

#### Objectif
1. **Dédupliquer** : remplacer `windows-home-2.png` par un autre screenshot ou supprimer purement et simple cette figure. Puisqu'on a 5 screenshots Windows (home, home-2, mygames, overlay, languages) et que l'overlay est maintenant dans la démo interactive, il reste : home, home-2, mygames, languages. **Décision recommandée : supprimer home-2 (redondant avec home), garder 3 dans la grille (home, mygames, languages).** Cela donne une grille de 3 figures propres.
2. **Réduire la taille** : les images ne doivent pas prendre toute la largeur de leur colonne.
   - Sur le grand screenshot principal (`.window`) : ajouter `max-width: 90%` ou similaire, ou réduire la colonne dans le grid `.windows-feature` (passer de `1.1fr 0.9fr` à `1fr 1fr` ou moins)
   - Sur les images de la grille secondaire : réduire le `max-width` de chaque `<img>` ou ajouter du padding/margin autour
   - **Ne pas dégrader la lisibilité** — les détails des screenshots doivent rester visibles
3. **Appliquer l'asymétrie transverse** (cf. direction artistique) : rotation légère de certaines images, décalages, variations de taille au sein de la grille.

#### À vérifier
S'assurer que les images ont des `width`/`height` explicites (anti-CLS) — actuellement `width="1280" height="720"` sur la plupart. Si on réduit la taille affichée, garder les attributs naturels (pour le ratio) mais contrôler via CSS `max-width` / `width: 100%`.

---

### CHANTIER 4 — Section Communauté : corriger les stats

#### Problème actuel
- Section Communauté : `index.html` lignes **685–737**
- Stats actuelles (codées en dur) :
  - `+50` Contributeurs actifs (ligne 722)
  - `1 200+` Contenus validés (ligne 726)
  - `+120` Jeux couverts (ligne 730)
- Ces chiffres sont **inventés** et ne reflètent pas la réalité actuelle

#### Objectif
Remplacer par les **vraies valeurs fournies par l'utilisateur** :
- **`1` IA super active** (la base de données initiale est suggérée par un bot — il n'y a qu'une seule IA très active pour le moment)
- **`3 000+` contenus validés** (au lieu de 1 200+)

Et **refondre le texte de présentation** pour refléter la vraie nature de la communauté :
- L'app a pour but de **vivre par sa communauté, pour sa communauté**
- Pour le moment, c'est une **IA super active** qui a validé les 3 000+ contenus
- Le **but** : que la communauté humaine prenne le relais, contribue, et enrichisse l'app

#### Changements précis

**Stats (HTML lignes 720–733) :**

Remplacer les 3 stats actuelles par :
1. **`1` IA active** — label : "IA super active" / i18n clé : `community.stat_ai` → "Bot contributeur"
2. **`3 000+` Contenus validés** — label inchangé / i18n clé : `community.stat_contents`
3. **`∞` potentiel** — label : "Portée communauté" / i18n clé : `community.stat_community` → "Vivre par sa communauté"

*(Alternative si l'utilisateur préfère 2 stats seulement : `1 IA active` + `3 000+ contenus validés`. **Décision recommandée : garder 3 stats pour l'équilibre visuel, avec la 3e "∞ / Vivre par sa communauté" qui annonce la vision.**)*

**Texte de présentation (lignes 711–717) :**

Le badge "Contributeur du mois" actuel pointe vers un contributeur humain fictif. Le remplacer par :
- Badge : "🤖 IA contributrice" (au lieu de "Contributeur du mois") — ou garder "Contributeur du mois" mais avec une IA
- Description réécrite : "Pour le moment, une **IA super active** nourrit et valide la base — **plus de 3 000 contenus** déjà validés. Mais l'app est conçue pour **vivre par sa communauté, pour sa communauté** : à terme, ce sont les joueurs qui contribueront, trieront et feront vivre chaque jeu."

**i18n :**
- Clés à modifier dans les 12 locales : `community.stat_contrib` → `community.stat_ai`, ajouter `community.stat_community`, modifier `community.month_badge`, `community.month_desc`
- Traduire les nouveaux textes dans les 12 langues (FR + EN qualité native ; les autres en draft acceptable)

---

### CHANTIER 5 — Section Personnalisation : refonte du mode jour/nuit

#### Problème actuel (CRITIQUE)
- Section Personnalisation : `index.html` lignes **739–787**
- Bouton switch `data-theme-toggle` ligne **753** : il bascule le **thème du SITE entier** (`data-theme` sur `<html>`, cf. `js/theme.js`)
- **Effet non voulu** : "il bascule l'éclairage du site noir-blanc et non l'écran du téléphone"
- En clair : le visiteur s'attend à voir **l'écran du téléphone (mockup) passer du jour à la nuit**, pas le site entier devenir sombre/clair
- De plus, l'utilisateur dit explicitement : **"N'éteins pas la lumière du site"** → le thème global du site NE DOIT PAS changer quand on actionne ce switch

#### Objectif
Le switch de la section Personnalisation doit **uniquement changer l'image affichée dans le mockup téléphone** :
- Position "jour" → afficher `assets/screenshots/mobile/mobile-day.jpg` (le nouveau screenshot `jour.jpg`)
- Position "nuit" → afficher `assets/screenshots/mobile/mobile-night.jpg` (le nouveau screenshot `nuit.jpg`)
- Le **site lui-même ne change pas de thème** (rester en mode nuit par défaut, la lumière du site reste allumée)

#### Changements précis

**Nouveaux assets disponibles :**
- `assets/screenshots/mobile/mobile-day.jpg` (déjà copié)
- `assets/screenshots/mobile/mobile-night.jpg` (déjà copié)

**HTML à reconstruire (lignes 752–787) :**

Remplacer le switch `data-theme-toggle` actuel par un switch **local** qui ne contrôle QUE le mockup :

```html
<div class="theme-demo">
  <!-- Switch LOCAL (pas data-theme-toggle global) -->
  <button class="switch" type="button" data-phone-theme-toggle
          aria-checked="true" aria-label="Bascule le thème du téléphone">
    <span class="switch__thumb" aria-hidden="true"></span>
    <span class="switch__label-day">☀️ Jour</span>
    <span class="switch__label-night">🌙 Nuit</span>
  </button>
  
  <!-- Mockup téléphone avec 2 images superposées -->
  <div class="phone phone--themable" data-phone-theme-demo>
    <span class="phone__notch" aria-hidden="true"></span>
    <div class="phone__screen">
      <!-- Image NUIT (visible par défaut - l'arcade vivante) -->
      <img class="phone__img phone__img--night"
           src="assets/screenshots/mobile/mobile-night.jpg"
           alt="Mode nuit" width="540" height="1140" loading="lazy" />
      <!-- Image JOUR (visible quand switch activé) -->
      <img class="phone__img phone__img--day"
           src="assets/screenshots/mobile/mobile-day.jpg"
           alt="Mode jour" width="540" height="1140" loading="lazy" />
    </div>
  </div>
  
  <p class="theme-demo__caption" data-i18n="personalize.caption">
    L'arcade vivante la nuit, le repli lisible le jour. C'est votre style.
  </p>
</div>
```

**CSS :**
```css
.phone--themable .phone__img {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: opacity 400ms ease-out;
}
.phone--themable .phone__img--night { opacity: 1; }  /* défaut */
.phone--themable .phone__img--day { opacity: 0; }    /* caché par défaut */

/* Quand le switch local est activé (classe sur le parent) */
.phone--themable.is-day .phone__img--night { opacity: 0; }
.phone--themable.is-day .phone__img--day { opacity: 1; }

/* Respect reduced motion : transition instantanée */
@media (prefers-reduced-motion: reduce) {
  .phone--themable .phone__img { transition: none; }
}
```

**JS (à ajouter, ne PAS modifier `theme.js` qui gère le thème global) :**

Créer un nouveau comportement dans `js/main.js` (ou un nouveau fichier `js/phone-theme.js`):
```js
function initPhoneThemeDemo() {
  const toggle = document.querySelector("[data-phone-theme-toggle]");
  const phone = document.querySelector("[data-phone-theme-demo]");
  if (!toggle || !phone) return;
  
  toggle.addEventListener("click", () => {
    const isDay = phone.classList.toggle("is-day");
    toggle.setAttribute("aria-checked", String(isDay));
  });
}
```

**IMPORTANT :** laisser le `data-theme-toggle` global (header) intact — c'est lui qui contrôle le thème du site. Le switch de la section Personnalisation doit avoir un **attribut différent** (`data-phone-theme-toggle`) et un **comportement purement local**.

**i18n :**
- Ajouter clés `personalize.caption`, `personalize.day_label`, `personalize.night_label` dans les 12 locales (FR + EN natifs, autres en draft)
- La valeur par défaut (FR) : caption = "L'arcade vivante la nuit, le repli lisible le jour. C'est votre style."

---

## 🎨 Direction artistique transverse (rappel)

Appliquer l'asymétrie et le "plus jeune/pub gamer" sur TOUTES les sections, pas seulement les 5 chantiers ci-dessus. Spécifiquement :

- **Hero** : le mockup téléphone flottant peut avoir une rotation légère, des halos néon plus dynamiques, des badges flottants "NEW", "GRATUIT", "12 LANGUES" qui se superposent
- **Features** : les 6 cards peuvent avoir des rotations alternées très légères, des tailles variées (1 card mise en avant plus grande)
- **Communauté** : le badge contributeur, les stats — typography plus expressive, décalages
- **Plus/Pricing** : la carte Or peut être légèrement pivotée, badges flottants "★ PLUS" en superposition
- **Download** : les 2 boutons peuvent être décalés, halos néon intenses

**Toujours respecter :**
- Palette exacte du DESIGN.md (pas d'invention chromatique)
- Néon sélectif (signale, pas décore)
- Pas de side-stripe (border latérale > 1px)
- `prefers-reduced-motion` (animations alternes ou crossfade si réduit)
- `alpha ≥ 0.86` pour les surfaces nuit
- Roboto w800 pour titres/labels
- Mobile-first responsive

---

## ✅ Critères d'acceptation V2

- [ ] **Chantier 1** : Galerie Mobile refactorisée en composition asymétrique éparse, chaque screenshot avec son commentaire en regard. Plus de "file indienne".
- [ ] **Chantier 2** : Bouton "Afficher la vidéo" affiche la VRAIE image `windows-overlay.png`. Flèche latérale quasi-transparente avant clic, devient opaque après. Vidéo qui slide depuis le bord.
- [ ] **Chantier 3** : Doublon `windows-home-2.png` supprimé (ou remplacé). Taille des screenshots Windows réduite. Lisibilité conservée.
- [ ] **Chantier 4** : Stats communauté = `1 IA active`, `3 000+ contenus validés`, `∞ Vivre par sa communauté`. Texte de présentation reflète la vraie nature (IA + vision communautaire). i18n mis à jour dans les 12 locales.
- [ ] **Chantier 5** : Switch Personnalisation change UNIQUEMENT l'image du mockup téléphone (jour ↔ nuit via `mobile-day.jpg` / `mobile-night.jpg`). Le thème du SITE ne change PAS (la lumière du site reste allumée). Attribut `data-phone-theme-toggle` distinct du global `data-theme-toggle`.
- [ ] **Direction transverse** : Composition plus asymétrique, plus jeune, plus "pub gamer" sur toutes les sections. Rotations légères, décalages, variations de taille, chevauchements. **Sans atténuer le néon — au contraire le renforcer là où c'est pertinent.**
- [ ] Pas de side-stripe, `prefers-reduced-motion` respecté, palette respectée, mobile-first.

---

## 🔧 Méthodologie

1. **Relis d'abord le brief V1** (`docs/superpowers/specs/2026-07-20-mygamingtip-site-design.md`) et le DESIGN.md/PRODUCT.md pour conserver l'identité.
2. **Applique chantier par chantier**, teste après chacun.
3. **Utilise tes skills associés** (l'utilisateur l'a exigé) — notamment frontend-design, code review, vérification avant complétion.
4. **Ne casse pas l'existant qui marche** : i18n 12 langues, protections, theme global, smooth scroll, header sticky.
5. **Vérifie l'acceptance criteria V2** avant de déclarer fini.
6. **Rapporte à la fin** : ce qui est changé par chantier, les décisions prises, ce qui reste en draft.
