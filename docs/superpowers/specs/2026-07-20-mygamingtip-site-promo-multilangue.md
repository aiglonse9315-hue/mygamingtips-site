# Brief V4 — Composition Promo Multi-langue (HTML/CSS)

**Date :** 2026-07-20
**Objet :** Remplacer l'image promo statique `promo-hero.png` (FR figé) par une **composition HTML/CSS** qui :
- Affiche le **screenshot du téléphone dans la bonne langue** (12 versions)
- Ajoute des **effets visuels néon** (éclairs, glow, rayons) — façon affiche pub d'arcade
- Affiche le **texte marketing traduit** automatiquement via l'i18n existant
- **Change automatiquement** quand l'utilisateur switch de langue

## 🎯 Objectif

L'utilisateur a fourni l'affiche pub modèle (`imageapp/Affiche pub verticale pour l'app MyGamingTips...png`) qui contient :
- Un **téléphone central** (légerement incliné), affichant l'écran d'accueil de l'app
- **Derrière le téléphone** : des **éclairs néon** (violet/cyan/magenta) qui partent en rayons, un **glow radial** intense
- **Au-dessus** : titre marketing (« TOUS TES GUIDES / AU MÊME ENDROIT » en FR, à traduire)
- **En dessous** : sous-texte + badges stores (Google Play + iOS)

L'objectif est de **reproduire cette composition en HTML/CSS vivant** sur le site, en remplaçant le screenshot figé FR par le bon screenshot selon la langue active.

## 📦 Assets fournis

Les 12 screenshots promo sont déjà en place dans `assets/screenshots/promo/` :

```
promo-screen-FR.jpg   (français — langue par défaut)
promo-screen-EN.jpg   (anglais)
promo-screen-ES.jpg   (espagnol)
promo-screen-DE.jpg   (allemand)
promo-screen-IT.jpg   (italien)
promo-screen-PT.jpg   (portugais)
promo-screen-RU.jpg   (russe)
promo-screen-ZH.jpg   (chinois)
promo-screen-JA.jpg   (japonais)
promo-screen-KO.jpg   (coréen)
promo-screen-AR.jpg   (arabe — RTL)
promo-screen-HI.jpg   (hindi)
```

**Tous en 1280×2772** (portrait, ratio ~9:19.5, format téléphone moderne).

## 🎨 Spécifications visuelles de la composition

### Structure générale (verticale)

```
┌─────────────────────────────────┐
│                                 │  ← Glow radial violet/cyan intense
│         TITRE MARKETING         │     derrière tout
│       (2 lignes, gros)          │
│                                 │
│       ╱╲╱╲ ÉCLAIRES ╱╲╱╲         │  ← Éclairs néon qui convergent
│        ╲  ┌─────┐  ╱            │     vers le téléphone
│         ╲ │     │ ╱             │
│          ╲│ TEL │╱              │
│           │═════│               │  ← Téléphone central, légèrement
│           │     │               │     incliné (rotation -3deg)
│           │     │               │
│           └─────┘               │
│                                 │
│        SOUS-TEXTE PUB           │  ← Texte secondaire
│                                 │
│      [▶ Play]  [ iOS ]          │  ← Badges stores
└─────────────────────────────────┘
```

### 1. Conteneur principal

```css
.promo-poster {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(16px, 4vw, 32px);
  padding: clamp(32px, 6vw, 64px) clamp(16px, 4vw, 32px);
  border-radius: var(--radius-lg);
  overflow: hidden;
  isolation: isolate;  /* pour z-index propres */
}
```

### 2. Fond avec glow radial intense

Le fond doit avoir un **glow radial néon** intense (comme l'affiche originale) qui émane du centre :

```css
.promo-poster::before {
  content: "";
  position: absolute;
  inset: -20%;
  background:
    radial-gradient(circle at 50% 45%,
      rgba(138, 43, 226, 0.35) 0%,      /* violet intense au centre */
      rgba(0, 229, 255, 0.20) 25%,      /* cyan halo */
      rgba(255, 45, 149, 0.15) 50%,     /* magenta diffus */
      transparent 75%);
  filter: blur(40px);
  z-index: -2;
  animation: promo-glow-pulse 4s ease-in-out infinite;
}

@keyframes promo-glow-pulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50%      { opacity: 1; transform: scale(1.05); }
}
```

### 3. Éclairs néon (élément signature)

C'est l'effet le plus important à reproduire. Des **rayons/éclairs** qui partent du téléphone vers l'extérieur.

**Approche recommandée : multiples gradients coniques/linéaires positionnés en arrière-plan**, OU des **éléments div绝对 positionnés** avec des `linear-gradient` fins et colorés.

```css
.promo-poster__bolts {
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
}

/* Chaque éclair est un rayon fin coloré qui part du centre */
.promo-bolt {
  position: absolute;
  top: 45%;
  left: 50%;
  width: 120%;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    transparent 30%,
    var(--neon-violet) 45%,
    var(--neon-cyan) 50%,
    var(--neon-violet) 55%,
    transparent 70%,
    transparent 100%);
  transform-origin: center;
  filter: blur(1px) drop-shadow(0 0 8px var(--neon-cyan));
  opacity: 0.7;
  animation: promo-bolt-flicker 3s ease-in-out infinite;
}

/* Varier l'angle de chaque éclair via :nth-child ou variables CSS */
.promo-bolt:nth-child(1) { transform: translate(-50%, -50%) rotate(0deg); }
.promo-bolt:nth-child(2) { transform: translate(-50%, -50%) rotate(45deg); animation-delay: 0.5s; }
.promo-bolt:nth-child(3) { transform: translate(-50%, -50%) rotate(90deg); animation-delay: 1s; }
.promo-bolt:nth-child(4) { transform: translate(-50%, -50%) rotate(135deg); animation-delay: 1.5s; }
.promo-bolt:nth-child(5) { transform: translate(-50%, -50%) rotate(22deg); animation-delay: 0.3s; }
.promo-bolt:nth-child(6) { transform: translate(-50%, -50%) rotate(67deg); animation-delay: 0.8s; }
.promo-bolt:nth-child(7) { transform: translate(-50%, -50%) rotate(112deg); animation-delay: 1.3s; }
.promo-bolt:nth-child(8) { transform: translate(-50%, -50%) rotate(157deg); animation-delay: 1.8s; }

@keyframes promo-bolt-flicker {
  0%, 100% { opacity: 0.5; }
  20%      { opacity: 0.9; }
  40%      { opacity: 0.3; }
  60%      { opacity: 0.8; }
  80%      { opacity: 0.4; }
}

/* Reduced motion : éclairs fixes */
@media (prefers-reduced-motion: reduce) {
  .promo-poster::before,
  .promo-bolt { animation: none !important; opacity: 0.7; }
}
```

**Note :** L'effet ci-dessus donne des rayons droits. Si tu veux des éclairs en zigzag plus réalistes, tu peux utiliser des SVG `<path>` inline avec `stroke-dasharray` et animation. **Choisis l'approche qui rend le mieux** — l'important est l'effet « rayons lumineux qui partent du téléphone ».

### 4. Téléphone central

Mockup téléphone affichant le screenshot dans la bonne langue. **Légèrement incliné** comme dans l'affiche originale.

```css
.promo-phone {
  position: relative;
  width: clamp(200px, 35vw, 320px);
  aspect-ratio: 9 / 19.5;
  border-radius: 36px;
  padding: 8px;
  background: linear-gradient(145deg, #1a1d2e, #070912);
  border: 1px solid rgba(138, 43, 226, 0.5);
  box-shadow:
    0 0 0 1px rgba(138, 43, 226, 0.3),
    0 0 40px rgba(138, 43, 226, 0.4),
    0 0 80px rgba(0, 229, 255, 0.25),
    0 20px 60px rgba(0, 0, 0, 0.5);
  transform: rotate(-3deg);
  z-index: 1;
  animation: promo-phone-float 6s ease-in-out infinite;
}

@keyframes promo-phone-float {
  0%, 100% { transform: rotate(-3deg) translateY(0); }
  50%      { transform: rotate(-3deg) translateY(-8px); }
}

.promo-phone__screen {
  width: 100%;
  height: 100%;
  border-radius: 28px;
  overflow: hidden;
  position: relative;
}

.promo-phone__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```

### 5. Texte marketing (i18n)

Le texte marketing doit être **traduit automatiquement** via le système i18n existant.

#### HTML
```html
<div class="promo-poster__text">
  <h3 class="promo-poster__title">
    <span data-i18n="promo.title_1">TOUS TES GUIDES</span><br>
    <span data-i18n="promo.title_2" class="promo-poster__title-accent">AU MÊME ENDROIT</span>
  </h3>
  <p class="promo-poster__subtitle" data-i18n="promo.subtitle">
    Vidéos, liens et astuces pour Aion 2, Diablo 4, Star Citizen et plus.
  </p>
</div>
```

#### CSS
```css
.promo-poster__title {
  font-family: var(--font-sans);
  font-weight: var(--fw-black);
  font-size: clamp(1.5rem, 5vw, 2.5rem);
  line-height: 1.05;
  letter-spacing: 0.5px;
  text-align: center;
  text-transform: uppercase;
  margin: 0;
}

.promo-poster__title-accent {
  background: linear-gradient(90deg, var(--neon-violet), var(--neon-cyan));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 12px rgba(138, 43, 226, 0.6));
}

.promo-poster__subtitle {
  font-size: var(--fs-body);
  color: var(--text-secondary);
  text-align: center;
  max-width: 320px;
  margin: 0;
}
```

#### Clés i18n à ajouter dans les 12 locales

```json
{
  "promo": {
    "title_1": "...",
    "title_2": "...",
    "subtitle": "..."
  }
}
```

**Traductions à fournir (FR = référence, EN qualité native, autres en draft correct) :**

| Langue | title_1 | title_2 | subtitle |
|---|---|---|---|
| FR | TOUS TES GUIDES | AU MÊME ENDROIT | Vidéos, liens et astuces pour Aion 2, Diablo 4, Star Citizen et plus. |
| EN | ALL YOUR GUIDES | IN ONE PLACE | Videos, links and tips for Aion 2, Diablo 4, Star Citizen and more. |
| ES | TODAS TUS GUÍAS | EN UN SITIO | Vídeos, enlaces y consejos para Aion 2, Diablo 4, Star Citizen y más. |
| DE | ALLE DEINE GUIDES | AN EINEM ORT | Videos, Links und Tipps für Aion 2, Diablo 4, Star Citizen und mehr. |
| IT | TUTTE LE TUE GUIDE | IN UN POSTO | Video, link e consigli per Aion 2, Diablo 4, Star Citizen e altro. |
| PT | TODOS OS GUIAS | EM UM LUGAR | Vídeos, links e dicas para Aion 2, Diablo 4, Star Citizen e mais. |
| RU | ВСЕ ТВОИ ГАЙДЫ | В ОДНОМ МЕСТЕ | Видео, ссылки и советы по Aion 2, Diablo 4, Star Citizen и др. |
| ZH | 所有攻略 | 尽在一处 | Aion 2、Diablo 4、Star Citizen 等游戏的视频、链接和技巧。 |
| JA | すべてのガイド | 一か所で | Aion 2、Diablo 4、Star Citizen などの動画、リンク、ヒント。 |
| KO | 모든 가이드를 | 한곳에서 | Aion 2, Diablo 4, Star Citizen 등을 위한 영상, 링크, 팁. |
| AR | كل الأدلة | في مكان واحد | فيديوهات وروابط ونصائح لـ Aion 2 و Diablo 4 و Star Citizen والمزيد. |
| HI | सभी गाइड | एक ही जगह | Aion 2, Diablo 4, Star Citizen और अन्य के लिए वीडियो, लिंक और टिप्स। |

### 6. Badges stores (Play + iOS)

```html
<div class="promo-poster__stores">
  <span class="store-badge store-badge--play">
    <svg><!-- logo Google Play --></svg>
    <span data-i18n="promo.store_play">DISPONIBLE SUR Google Play</span>
  </span>
  <span class="store-badge store-badge--ios">
    <svg><!-- logo Apple --></svg>
    <span data-i18n="promo.store_ios">BIENTÔT SUR iOS</span>
  </span>
</div>
```

**Clés i18n pour les badges :**
- FR : "DISPONIBLE SUR Google Play" / "BIENTÔT SUR iOS"
- EN : "AVAILABLE ON Google Play" / "COMING SOON ON iOS"
- (traduire les 10 autres langues)

## 🔄 Logique de commutation de langue

C'est le cœur de la feature. Le screenshot affiché dans le téléphone doit **correspondre à la langue active du site**.

### Approche recommandée : `<picture>` + `<source>` par langue

```html
<picture class="promo-phone__screen">
  <!-- Ordre : la première source qui match gagne -->
  <source srcset="assets/screenshots/promo/promo-screen-AR.jpg" media="(prefers-locale: ar)">
  <!-- ... mais prefers-locale n'existe pas en CSS/HTML standard ... -->
</picture>
```

⚠️ **`prefers-locale` n'existe pas** en HTML/CSS standard. Il faut donc piloter le changement via **JS**.

### Approche JS (recommandée)

```html
<img class="promo-phone__img"
     src="assets/screenshots/promo/promo-screen-FR.jpg"
     alt="..."
     data-promo-screen
     data-i18n-alt="promo.alt" />
```

```js
// Dans js/main.js ou un nouveau js/promo.js
function updatePromoScreen(lang) {
  const img = document.querySelector("[data-promo-screen]");
  if (!img) return;
  const code = lang.toUpperCase();
  const newPath = `assets/screenshots/promo/promo-screen-${code}.jpg`;

  // Précharger la nouvelle image puis permuter (évite le flash)
  const preload = new Image();
  preload.onload = () => {
    img.src = newPath;
  };
  preload.onerror = () => {
    // Fallback FR si la langue n'a pas de screenshot
    img.src = "assets/screenshots/promo/promo-screen-FR.jpg";
  };
  preload.src = newPath;
}

// Brancher sur l'événement i18n existant
document.addEventListener("mgt:langchange", (e) => {
  updatePromoScreen(e.detail.lang);
});

// Initial au chargement
document.addEventListener("DOMContentLoaded", () => {
  const lang = localStorage.getItem("mgt-lang") || detectLang();
  updatePromoScreen(lang);
});
```

**Vérifie dans `js/i18n.js`** comment l'événement de changement de langue est dispatché. Si l'événement s'appelle différemment (`mgt:languagechange`, `localechange`, etc.), adapte. **Il faut que le screenshot change en même temps que le texte i18n change** — sans décalage.

### Cas particulier : Arabe (RTL)

Quand la langue est AR, le site passe en `dir="rtl"`. Vérifier que :
- La composition promo reste lisible en RTL (le téléphone centré ne pose pas de problème, mais les badges stores et le texte doivent s'adapter naturellement)
- Le screenshot AR.jpg est bien en arabe RTL dans le téléphone

## 🔧 Intégration dans le site

### Où placer la composition ?

Actuellement, l'image promo statique `assets/promo-hero.png` est utilisée dans la **section Plus/Pricing** (section `#plus`). **C'est là qu'il faut la remplacer.**

Dans `index.html`, trouve la référence à `promo-hero.png` et remplace le simple `<img>` par la composition complète `.promo-poster`.

**Conserver `promo-hero.png`** pour les balises Open Graph (og:image, twitter:image) dans le `<head>` — ces balises doivent rester des images statiques pour les réseaux sociaux.

### Sections pouvant aussi utiliser la composition

Optionnel : la composition promo pourrait aussi être utilisée comme **hero visuel secondaire** ailleurs. Mais pour cette V4, contente-toi de remplacer dans la section `#plus`. L'utilisateur dira s'il veut l'utiliser ailleurs.

## 📋 HTML complet à intégrer

Voici la structure HTML complète de la composition :

```html
<div class="promo-poster" aria-label="Affiche promotionnelle MyGamingTips">
  <!-- Éclairs néon en arrière-plan -->
  <div class="promo-poster__bolts" aria-hidden="true">
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
    <span class="promo-bolt"></span>
  </div>

  <!-- Texte marketing au-dessus -->
  <div class="promo-poster__text">
    <h3 class="promo-poster__title">
      <span data-i18n="promo.title_1">TOUS TES GUIDES</span><br>
      <span data-i18n="promo.title_2" class="promo-poster__title-accent">AU MÊME ENDROIT</span>
    </h3>
    <p class="promo-poster__subtitle" data-i18n="promo.subtitle">
      Vidéos, liens et astuces pour Aion 2, Diablo 4, Star Citizen et plus.
    </p>
  </div>

  <!-- Téléphone central -->
  <div class="promo-phone">
    <span class="promo-phone__notch" aria-hidden="true"></span>
    <div class="promo-phone__screen">
      <img class="promo-phone__img"
           src="assets/screenshots/promo/promo-screen-FR.jpg"
           alt="Capture d'écran de l'application MyGamingTips"
           data-promo-screen
           data-i18n-alt="promo.alt"
           width="540" height="1170" />
    </div>
  </div>

  <!-- Badges stores en dessous -->
  <div class="promo-poster__stores">
    <span class="store-badge store-badge--play">
      <!-- SVG Google Play -->
      <span data-i18n="promo.store_play">DISPONIBLE SUR Google Play</span>
    </span>
    <span class="store-badge store-badge--ios">
      <!-- SVG Apple -->
      <span data-i18n="promo.store_ios">BIENTÔT SUR iOS</span>
    </span>
  </div>
</div>
```

## ✅ Critères d'acceptation V4

- [ ] Les 12 screenshots promo sont référencés correctement (`promo-screen-XX.jpg`)
- [ ] La composition `.promo-poster` remplace l'image `promo-hero.png` dans la section `#plus`
- [ ] Le screenshot affiché change automatiquement quand on change de langue (test : FR → EN → AR → ZH → HI)
- [ ] Les éclairs néon sont visibles et animés (flicker subtil)
- [ ] Le téléphone a un glow néon intense (violet/cyan) + légère inclinaison + float
- [ ] Le glow radial derrière la composition pulse doucement
- [ ] Le texte marketing est traduit dans les 12 locales (FR + EN qualité native, autres en draft)
- [ ] Les badges stores sont présents (Play + iOS) avec leurs SVG
- [ ] L'arabe (RTL) rend correctement (composition + screenshot AR)
- [ ] `prefers-reduced-motion` : toutes les animations (bolts flicker, glow pulse, phone float) se désactivent
- [ ] La composition est responsive (mobile empilé, desktop côte à côte avec le texte pricing)
- [ ] `promo-hero.png` reste utilisé pour les OG tags dans le `<head>` (réseaux sociaux)
- [ ] Le screenshot se précharge avant permutation (pas de flash blanc au changement)

## 🔧 Méthodologie

1. **Lis ce brief V4** en entier.
2. **Lis le code i18n actuel** (`js/i18n.js`) pour comprendre comment le changement de langue est dispatché.
3. **Construis le CSS** de la composition (dans `css/components.css` ou un nouveau `css/promo.css`).
4. **Construis le HTML** dans la section `#plus`, en remplaçant l'`<img promo-hero.png>` actuel.
5. **Ajoute le JS** de commutation de screenshot (`js/main.js` ou nouveau `js/promo.js`).
6. **Ajoute les clés i18n** dans les 12 locales (`promo.title_1`, `promo.title_2`, `promo.subtitle`, `promo.store_play`, `promo.store_ios`, `promo.alt`).
7. **Utilise tes skills associés** (frontend-design, code review, vérification).
8. **Vérifie l'acceptance criteria V4**.
9. **Rapporte à la fin**.

## ⚠️ Contraintes

- **Mode DARK prioritaire** (la composition doit être éclatante en dark).
- En mode clair, atténuer les effets néon (moins de glow, éclairs plus subtils) pour rester lisible.
- Respecter `prefers-reduced-motion`.
- Le néon intense va sur les éclairs, le glow du téléphone, le titre accent — **pas sur le sous-titre corps** (illisibilité).
- Pas de side-stripe.
- Mobile-first responsive.

Bonne construction. Fais de cette affiche une vraie star visuelle du site. ⚡📱
