# Brief de Design — Site MyGamingTip

**Date :** 2026-07-20
**Projet :** Site internet promo pour l'app mobile + l'app Windows **MyGamingTips**
**Direction visuelle :** Dark Néon Gaming (Option A — Arcade Vivante)
**Structure :** One-Page Interactif Démo (Option C)
**Stack :** HTML / CSS / JS vanilla statique (zéro framework, zéro build)

---

## 1. Objectif du site

Promouvoir **MyGamingTips** : une application mobile (et son compagnon Windows) qui **centralise les contenus gaming utiles — vidéos, guides, liens — organisés par jeu et vérifiés**, plutôt que dispersés dans un feed algorithmique.

**Promesse centrale (cf. PRODUCT.md) :**
> « Le seul endroit où chaque jeu a ses meilleurs contenus, **triés et vérifiés** — pas un feed infini. »

**Job-to-be-done du visiteur :** comprendre en moins de 30 secondes ce que fait l'app, voir à quoi elle ressemble, et atterrir sur le bon bouton de téléchargement (Play Store pour mobile, téléchargement direct pour Windows).

## 2. Identité de marque (résumé de PRODUCT.md)

- **Personnalité :** Rapide, Clair, Premium.
- **Voix :** directe et utile, jamais promo. Les accents néon sont la signature, pas un bruit de fond.
- **Anti-références :** feed infini algorithmique, forum surchargé, UI SaaS froide (bleu/gris corporate), site gaming daté (pubs intrusives, chargement lent).
- **Creative North Star :** « L'Arcade Vivante » — la nuit est la vedette, le jour est le repli.

## 3. Design System (extrait strict de DESIGN.md)

Le site **doit** respecter exactement la palette et les principes de l'app. Ce n'est pas une inspiration libre, c'est une réplique du système existant.

### 3.1 Palette

#### Néons (brand colors — constants jour/nuit, seule l'intensité/alpha s'adapte)
| Nom | Hex | Usage |
|---|---|---|
| Violet Néon | `#8A2BE2` | Accent principal nuit. Boutons actifs, bordures focus, nav sélectionnée |
| Cyan Néon | `#00E5FF` | Secondary. Halos d'arrière-plan, grille de fond, icônes actives |
| Magenta Néon | `#FF2D95` | Halo d'ambiance, accents ponctuels — **jamais en texte** (contraste insuffisant) |
| Vert Néon | `#39FF14` | Rare. Highlights de réussite, badges de validation |
| Violet Plus | `#B026FF` | Marque premium |
| Or Plus | `#FFC93C` | Couronnes, contributeurs VIP |

#### Catégories sémantiques (toujours doublées d'une icône + label)
- Rouge Vidéo : `#FF2D55`
- Vert Guide : `#34C759`
- Bleu Lien : `#00A3FF`

#### Surfaces — Mode NUIT (primaire)
| Nom | Hex |
|---|---|
| Encre Nuit (fond) | `#070912` |
| Surface Nuit (cartes, nav) | `#10131F` (alpha 0.86) |
| Surface Alt Nuit (champs, chips) | `#181C2B` |
| Texte Clair | `#EAF0FF` (contraste ~16:1) |
| Texte Gris-Bleu | `#9AA3BD` (contraste ~7:1) |
| Bordure Nuit | `#262C40` |

#### Surfaces — Mode JOUR (repli)
| Nom | Hex |
|---|---|
| Papier Froid | `#F5F7FB` |
| Blanc | `#FFFFFF` |
| Gris-Bleu Clair | `#EEF1F7` |
| Encre | `#11131A` |
| Ardoise | `#5A6172` |
| Bordure Jour | `#D9DEE9` |
| Accent Jour | `#6A11CB` |

### 3.2 Typography

**Famille unique :** Roboto (avec `system-ui, sans-serif` en repli). **Charger depuis Google Fonts.**

**Hiérarchie :**
- **Display** : w800, `clamp(2rem, 8vw, 3rem)`, letterSpacing 0.3px, lineHeight court
- **Headline** : w800, 18-20px, letterSpacing 0.3px
- **Title** : w700, 16px
- **Body** : w400, 14px, lineHeight 1.4
- **Label** : w800, 11-13px, letterSpacing 0.6px (imite le tracking arcade)

**Règle du Poids :** la hiérarchie se fait par le poids (w800 → w400), pas par la couleur seule.

### 3.3 Rayons & espacements
- Rounded : sm 8px · md 14px · lg 16px · pill 20px
- Spacing : xs 4px · sm 8px · md 12px · lg 16px

### 3.4 Règles NON-NÉGOCIABLES (extrait DESIGN.md §6)

**DO :**
- Concevoir d'abord en mode nuit, puis adapter au jour. La nuit est la vedette — c'est le défaut du site.
- Réserver le néon aux éléments qui portent une information (actif, premium, catégorie, focus). Une carte au repos n'a pas de néon.
- Doubler chaque couleur de catégorie d'une icône + label (daltonisme).
- Maintenir l'alpha des surfaces ≥ 0.86 en mode nuit.
- Roboto w800 pour titres/labels.
- Finir chaque liste / section (pas de scroll infini — cohérent avec l'anti-référence "feed infini").

**DON'T :**
- **Pas de néon en texte plein sur fond sombre** (magenta et cyan sont illisibles en corps de texte — réserver aux icônes, bordures, accents, titres très courts).
- Pas d'UI SaaS froide. Pas de site gaming daté. Pas de pub intrusive.
- **Pas de `border-left`/`border-right` > 1px comme accent latéral (side-stripe)** — c'est le "tell #1" d'une UI générée par IA, à proscrire absolument.
- Respecter `prefers-reduced-motion` (alternative instantanée ou crossfade aux animations flottantes/pulsées).

## 4. Architecture du site — One-Page Interactif Démo (Option C)

Une seule page `index.html` avec sections ancrées. Navigation top fixe avec ancres + sélecteur de langue + toggle jour/nuit.

### 4.1 Header (sticky, transparent → opaque au scroll)
- Logo MyGamingTips (à gauche) — utiliser `ic_launcher` de l'app (cf. §5.1)
- Nav center desktop : `#features` · `#mobile` · `#windows` · `#community` · `#plus` · `#download`
- Actions droite : 🌐 sélecteur de langue (FR par défaut, 12 langues) · 🌙/☀️ toggle theme live
- Mobile : burger menu → drawer full-screen

### 4.2 Hero (au-dessus de la ligne de flottaison)
**Composition :**
- Fond `GamingBackground` (cf. §4.10) en mode nuit par défaut
- H1 Display w800 : titre accroche (FR par défaut) avec un mot-clé en dégradé violet→cyan
- Sous-titre Body : la promesse "trié et vérifié, pas un feed infini"
- 2 CTA côte à côte :
  - **Primaire** (NeonButton violet néon) : `▶ Disponible sur Google Play` → `#play-store` (placeholder)
  - **Secondaire** (Ghost bordure cyan) : `Télécharger pour Windows` → `#windows-download` (placeholder)
- Visuel hero : **mockup flottant** du téléphone (screenshot mobile `écran d'acceuil.jpg`) avec halo néon violet/cyan en arrière-plan + glassmorphism
- Bandeau de confiance : "★ ★ ★ ★ ★", "+XX jeux référencés", "Contenu vérifié par la communauté" (placeholders, à remplacer)

### 4.3 Section Features (`#features`)
**Grille de 3-6 cards** (mode nuit par défaut, surface semi-transparente, bordure 1px, radius 16px). Chaque card : icône néon + titre Headline + 1 phrase Body.

Features à illustrer (issues de PRODUCT.md + screenshots) :
1. **Trié et vérifié** — pas un algorithme, des humains
2. **Listes qui se terminent** — chaque jeu a un nombre fini de contenus
3. **Favoris & playlists** — suis tes contenus sur plusieurs sessions
4. **Mode jour/nuit** — l'arcade vivante ou le repli lisible
5. **12 langues** — trouve du contenu dans TA langue
6. **Démarrage instantané** — cache local, synchro en arrière-plan

### 4.4 Section Mobile Showcase (`#mobile`)
**Galerie horizontale scrollable** (ou grille responsive) des **7 screenshots mobile** (cf. §5.2). Chaque screenshot dans un mockup "téléphone" (cadre arrondi, encoche, halo néon). Au hover/scroll, la légende s'affiche.

Texte d'intro Headline + Body décrivant l'expérience mobile (sessions courtes, quelques taps, démarrage instantané).

### 4.5 Section Windows Showcase (`#windows`)
**Feature signature à mettre en avant :** le **lecteur vidéo overlay sans pub** pendant qu'on joue.

**Composition :**
- 1 grand screenshot Windows (le lecteur vidéo overlay) en mockup "fenêtre desktop"
- À côté : explication de la feature (Body + bullets)
- **Démo interactive inline** : un mini-mockup où l'utilisateur peut cliquer pour voir la vidéo "overlay" apparaître/disparaître (simulé en CSS/JS, sans vraie vidéo)
- Grille secondaire avec les 4 autres screenshots Windows (Mes jeux, Accueil, Accueil 2, panneau 12 langues)

### 4.6 Section Communauté / Contribution (`#community`)
**Feature signature :** le **Contributeur du mois**.

- Screenshot `profil, setup image + visu contributeur du mois.jpg` en mockup
- Texte : le contenu est trié et vérifié par des contributeurs reconnus. Chaque mois, un contributeur est mis à l'honneur (couronne Or Plus `#FFC93C`).
- Stats community (placeholders) : contributeurs actifs, contenus validés, jeux couverts

### 4.7 Section Personnalisation (`#personalize`)
**Feature signature :** le **mode jour/nuit** + le **setup image** (cf. screenshots `moi jour ou nuit` + `profil`).

**Démo interactive :** un bouton 🌙/☀️ dans cette section bascule le thème du site ENTIÈREMENT (pas juste le hero) — c'est la démo live du mode jour/nuit de l'app.

### 4.8 Section Plus / Pricing (`#plus`)

**Position :** après la section Personnalisation (#4.7), AVANT la section Download.

**Structure :** 2 colonnes (mobile : empilées) :
- **Colonne gauche :** image promo `Affiche pub verticale pour l'app MyGamingTips...png` (mockup flottant avec halo néon, dans un cadre arrondi) + bandeau "🆓 L'app est 100% GRATUITE"
- **Colonne droite :** carte **NeonContainer premium** (bordure dégradé Violet Plus `#B026FF` → Or Plus `#FFC93C` + halo double couche) présentant l'offre Plus :

**Contenu de la carte Plus :**

Header :
- Badge Or Plus `#FFC93C` : "★ Plus"
- Titre Headline : "Passez à MyGamingTips Plus"
- Sous-titre Body : "L'app reste gratuite. Le menu **My Playlist** devient Plus."

Liste des bénéfices (icône néon + label w800 + 1 ligne Body) :
1. 🔖 **My Playlist** — organisez, triez et retrouvez tous vos contenus sans les chercher (le seul menu réservé à Plus)
2. 🖼️ **3 fonds d'écran exclusifs** — personnalisez l'app avec 3 wallpapers premium
3. 💻 **Application Windows dédiée** — retrouvez TOUS vos contenus sur PC Windows, synchronisés avec votre mobile

Bloc tarifs (2 options côte à côte, la plus avantageuse mise en avant) :
- **Mensuel : 1,99 € / mois** (carte secondaire)
- **Annuel : 19,99 € / an** ⭐ (carte NeonContainer — bordure Or Plus, badge "ÉCONOMISEZ 16%")
  - Sous-prix : "~1,67 € / mois"

Microcopy : "Annulez à tout moment. Aucun engagement."

CTA NeonButton (Violet Plus → dégradé Or) : "Passer à Plus" → `#plus-subscribe` (placeholder)

**Note visuelle :** cette section est la seule où l'Or Plus `#FFC93C` est utilisé massivement (couronnes, badges, bordures) — c'est la couleur de la premium distinction, à réserver à cet usage (cf. DESIGN.md §2 Tertiary).

### 4.9 Section Download (`#download`)
**Le call-to-action final.** Fond halos néon intenses.
- 2 grosses cards côte à côte :
  - **Mobile** : icône Play Store, QR code placeholder, "Disponible sur Google Play" → `#play-store`
  - **Windows** : icône Windows, "Télécharger gratuitement" → `#windows-download`, system requirements (placeholders)
- Microcopy : gratuit, pas de pub, pas de compte requis

### 4.10 Footer
- Logo + tagline courte
- Liens : à propos · confidentialité · contact (placeholders `#`)
- Mention "Contenu vérifié par la communauté"
- Copyright 2026 MyGamingTips
- Sélecteur de langue redondant en bas

### 4.10 GamingBackground (composant signature — cf. DESIGN.md §5)

Toile peinte en dessous de tout. À reproduire en CSS pour le site :
- Fond Encre Nuit `#070912`
- **Grille néon** subtile (lignes cyan alpha ~0.05, 20-40px)
- **Halos néon flottants** : 2-3 blobs radial-gradient (violet + cyan + magenta), alpha 0.04-0.14, blur fort, qui flottent lentement (animation respectant `prefers-reduced-motion`)
- En mode jour : fond Papier Froid, violet profond `#6A11CB` à la place des néons, grille quasi invisible

**Contrainte :** opacité des halos **jamais au-dessus de 0.14** — le contenu reste roi.

## 5. Assets fournis

### 5.1 Logo

| Fichier | Source | Usage |
|---|---|---|
| `ic_launcher.png` (xxxhdpi, 192×192) | `D:\NONO\Projet APP\Zprojet\MygamingTis\android\app\src\main\res\mipmap-xxxhdpi\` | Header + footer + favicon |

**Action :** copier ce fichier dans `assets/logo/` du site (le renommer `logo-192.png`). Créer aussi `favicon.ico` / `favicon-32.png` dérivés.

### 5.2 Screenshots MOBILE (7) — dossier `imageapp/`

Tous à placer dans `assets/screenshots/mobile/`. **Renommer** avec un nom propre (cf. colonne "Nom cible"). Chaque screenshot DOIT être affiché avec sa légende associée (colonne "Légende") sur le site.

| Fichier original | Nom cible | Légende (FR) — à i18n-iser |
|---|---|---|
| `écran d'acceuil.jpg` | `mobile-home.jpg` | **Accueil** — toutes vos astuces, guides et tips réunis au même endroit. Démarrage instantané. |
| `écran d'acceuil liste de jeux a explorer.jpg` | `mobile-explore.jpg` | **Explorer** — découvrez les jeux les plus populaires, triés et vérifiés. |
| `menu mes jeux liste personalisé de tes jeux.jpg` | `mobile-mygames.jpg` | **Mes jeux** — votre liste personnalisée, accessible en un tap. |
| `menu My playlist pour retrouver ses contenu directement sans devoir les chercher , trier et organiser comme vousl e voulez.jpg` | `mobile-playlist.jpg` | **My Playlist** — retrouvez vos contenus sans les chercher. Triez, organisez à votre façon. |
| `menu playlist trie par jeu afin de toujour mieux les organiser.jpg` | `mobile-playlist-bygame.jpg` | **Playlists par jeu** — une organisation toujours plus claire, jeu par jeu. |
| `profil , setup image + visu contributeur du mois.jpg` | `mobile-profile.jpg` | **Profil** — personnalisez votre setup image et découvrez le contributeur du mois. |
| `moi jour ou nuit c'est votre style.jpg` | `mobile-daynight.jpg` | **Jour ou nuit** — c'est votre style. L'arcade vivante la nuit, le repli lisible le jour. |

### 5.3 Screenshots WINDOWS (5) — dossier `imageapp/`

Tous à placer dans `assets/screenshots/windows/`.

| Fichier original | Nom cible | Légende (FR) |
|---|---|---|
| `app windows acceuil.png` | `windows-home.png` | **Accueil Windows** — toute la puissance de MyGamingTips sur grand écran. |
| `app windows acceuil 2.png` | `windows-home-2.png` | **Vue détaillée** — parcourez les contenus avec confort. |
| `app windows Mes jeux.png` | `windows-mygames.png` | **Mes jeux** — votre bibliothèque, version desktop. |
| `app windows lecteur vidéo intégrer a l'app , vidéo sans pub en overlay sur ton jeux préférer.png` | `windows-overlay.png` | ** Lecteur vidéo overlay sans pub** — regardez vos guides préférés en superposition pendant que vous jouez. Aucune publicité, aucune interruption. |
| `app windows panneau config 12 langue , pour trouver du contenu dans ta langue et sinon en anglais y'aura toujours ce qu'il faut.png` | `windows-languages.png` | **12 langues** — trouvez du contenu dans votre langue. Et si rien n'existe encore, l'anglais vous couvre toujours. |

### 5.4 Logos Play Store / Windows

À générer en SVG inline ou récupérer les officiels :
- **Google Play** : utiliser le logo officiel "Get it on Google Play" (SVG inline dans le HTML)
- **Windows** : utiliser le logo Windows officiel (SVG inline)

### 5.5 Image Promo (hero marketing)

| Fichier original | Nom cible | Usage |
|---|---|---|
| `Affiche pub verticale pour l'app MyGamingTips avec le téléphone au centre et texte promotionnel.png` | `promo-hero.png` | Section Plus/Pricing (#4.8) — visuel principal. Téléphone centré, composition promo verticale. Peut aussi servir en tant que visuel secondaire dans le Hero (#4.2) ou la section Download (#4.9). |

**Note :** cette image est verticale (format affiche). À intégrer dans un mockup cadre arrondi avec halo néon. Vérifier le rendu sur mobile (peut nécessiter un crop ou un scale adaptatif).

## 6. Internationalisation (12 langues)

**Langues supportées :** FR, EN, ES, DE, IT, PT, RU, ZH, JA, KO, AR, HI

**Comportement :**
1. **Détection auto au premier chargement :** lire `navigator.language` / `navigator.languages`. Si la langue détectée commence par l'un des codes supportés → l'utiliser. Sinon → fallback **EN** (ou FR ? à confirmer — recommandation : FR car c'est la langue d'origine du projet, mais EN pour portée internationale. **Décision : fallback EN par défaut** car l'app couvre l'international).
2. **Mémorisation :** si l'utilisateur change la langue via le sélecteur, sauvegarder dans `localStorage` (`mgt-lang`). Au rechargement, `localStorage` prime sur la détection.
3. **Sélecteur de langue :** dropdown avec drapeau + nom natif de la langue. Accessible depuis le header ET le footer.
4. **Direction RTL :** pour l'**arabe (AR)** uniquement, basculer `dir="rtl"` sur `<html>`. Tester que le layout tient en RTL (flèches, icônes directionnelles, padding asymétrique).
5. **Fichiers de traduction :** un fichier JSON par langue dans `locales/<code>.json` (ex. `locales/fr.json`). Clés structurées par section (`hero.title`, `features.tried.title`, etc.). Le JS charge le bon fichier au démarrage et remplace les `[data-i18n="key"]` du DOM.
6. **Police :** Roboto couvre les latins + cyrillique + grec. Pour **ZH/JA/KO**, ajouter `Noto Sans SC` / `Noto Sans JP` / `Noto Sans KR` en fallback dans la font-stack. Pour **AR**, ajouter `Noto Sans Arabic` et prévoir que la typo RTL reste lisible.
7. **Textes à traduire :** TOUT le contenu visible (titres, body, légendes des screenshots, libellés de boutons, alt d'images, microcopy). Les placeholders `#` des liens ne se traduisent pas.

**Note :** pour le lancement initial, fournir les traductions **FR + EN complètes et de qualité**. Les 10 autres langues : fournir une traduction de base (peut être machine-aidée puis relue). **Prévoir la structure i18n complète dès le départ** même si certaines langues sont en draft.

## 7. Thème jour/nuit (toggle live)

**Comportement :**
1. **Défaut :** mode NUIT (la nuit est la vedette — cf. DESIGN.md).
2. **Détection :** respecter `prefers-color-scheme: dark` comme hint initial, mais le défaut explicite du site est NUIT. Si l'utilisateur a `prefers-color-scheme: light`, on peut soit respecter, soit forcer nuit — **décision : respecter le préférence système au premier chargement** (nuit si dark/no-preference, jour si light), puis mémoriser le choix dans `localStorage` (`mgt-theme`).
3. **Toggle :** bouton 🌙/☀️ dans le header + un second dans la section "Personnalisation" (#4.7). Les deux basculent le thème **en live** (transition crossfade 200ms sur `background-color`, `color`, `border-color`). Respecter `prefers-reduced-motion` (instantané si réduit).
4. **Implémentation :** attribut `data-theme="dark|light"` sur `<html>`. Variables CSS définies pour les deux thèmes. Toutes les couleurs via `var(--color-x)`.

## 8. Protections demandées

> ⚠️ **Note importante sur l'efficacité :** ces protections sont des **freins dissuasifs**, pas des sécurités absolues. Tout ce qui arrive dans le navigateur est inspectable par un utilisateur déterminé (DevTools, désactivation JS). Ces mesures arrêtent le clic-droit "de curiosité" mais **ne protègent pas réellement** le code ni les images. À présenter au client comme telles.

1. **Désactiver le clic droit :** `contextmenu` event → `preventDefault()`. Un toast discret peut indiquer "Contenu protégé".
2. **Bloquer la sélection de texte** sur les zones non-éditables (sauf inputs) : `user-select: none` global, réactivé sur `input, textarea`.
3. **Bloquer certaines touches :** F12 (DevTools), Ctrl+Shift+I/J/C, Ctrl+U (view source) → `preventDefault()`. *(Frein léger, contournable.)*
4. **Désactiver le drag des images :** `draggable="false"` sur toutes les images + `dragstart` → `preventDefault()`.
5. **Watermark discret** optionnel sur les screenshots (à discuter — peut dégrader le rendu).

## 9. Performance & accessibilité

- **Lighthouse visé :** ≥90 sur les 4 catégories (Performance, Accessibility, Best Practices, SEO).
- **Images :** optimiser les screenshots (WebP si possible + fallback JPG/PNG). `loading="lazy"` sur tout sauf le hero. `width`/`height` explicites pour éviter le CLS.
- **Fonts :** `preconnect` à Google Fonts. `font-display: swap`. Charger uniquement Roboto (400, 700, 800) + Noto fallbacks pour CJK/AR.
- **A11y :**
  - Contraste WCAG AA visé (déjà respecté par la palette).
  - Tous les boutons/liens navigables au clavier. Focus visible (bordure accent 1.6px).
  - `alt` descriptifs sur les images (i18n-isés).
  - `prefers-reduced-motion` respecté.
  - Les couleurs de catégorie (rouge/vert/bleu) doublées d'icône + label.
- **SEO :** `<title>`, `<meta description>`, Open Graph tags, `lang` attribute mis à jour dynamiquement selon la langue active, structured data (JSON-LD `SoftwareApplication`).

## 10. Structure de fichiers attendue

```
SiteMygamingTip/
├── index.html                  # page unique
├── assets/
│   ├── logo/
│   │   ├── logo-192.png        # copié depuis ic_launcher xxxhdpi
│   │   ├── favicon.ico
│   │   └── favicon-32.png
│   ├── screenshots/
│   │   ├── mobile/             # 7 fichiers renommés (cf. §5.2)
│   │   └── windows/            # 5 fichiers renommés (cf. §5.3)
│   └── icons/                  # logos Play Store / Windows en SVG
├── css/
│   ├── reset.css               # reset minimal
│   ├── tokens.css              # variables CSS (couleurs, spacing, radius, typo) — 2 thèmes
│   ├── base.css                # typo, layout, a11y
│   ├── components.css          # header, hero, cards, mockups, buttons, nav
│   └── gaming-background.css   # composant signature
├── js/
│   ├── i18n.js                 # chargement locales + remplacement DOM
│   ├── theme.js                # toggle jour/nuit + persistance
│   ├── protections.js          # clic-droit, devtools, drag (cf. §8)
│   └── main.js                 # init, smooth scroll, interactions démos
├── locales/
│   ├── fr.json
│   ├── en.json
│   ├── es.json
│   ├── de.json
│   ├── it.json
│   ├── pt.json
│   ├── ru.json
│   ├── zh.json
│   ├── ja.json
│   ├── ko.json
│   ├── ar.json
│   └── hi.json
└── docs/
    └── superpowers/
        └── specs/
            └── 2026-07-20-mygamingtip-site-design.md   # ce brief
```

## 11. Liens de téléchargement (placeholders)

En attendant les vrais liens, utiliser :
- **Play Store :** `#play-store` (à remplacer par `https://play.google.com/store/apps/details?id=...`)
- **Windows :** `#windows-download` (à remplacer par l'URL de téléchargement direct ou GitHub Releases)

## 12. Acceptance criteria

Le site est terminé quand :
- [ ] Toutes les sections §4 sont présentes et remplies
- [ ] **Section Plus/Pricing** (#4.8) en place avec : mention gratuité, 3 bénéfices Plus, tarifs (1,99€/mois + 19,99€/an), image promo intégrée
- [ ] Les 13 visuels (7 screenshots mobile + 5 screenshots Windows + 1 image promo) sont intégrés avec leurs légendes i18n-isées
- [ ] Le logo `ic_launcher` est utilisé dans header/footer/favicon
- [ ] Le toggle jour/nuit fonctionne en live sur TOUTE la page
- [ ] Le sélecteur de langue traduit la page en live pour les 12 langues
- [ ] L'arabe passe en RTL
- [ ] Les protections §8 sont en place
- [ ] Lighthouse ≥90 sur les 4 catégories
- [ ] La palette respecte EXACTEMENT le DESIGN.md (pas d'invention chromatique)
- [ ] Pas de side-stripe (border-left/right > 1px)
- [ ] `prefers-reduced-motion` respecté
- [ ] Mobile-first responsive (320px → 4K)

## 13. Notes pour CodeurFou

- **Tu dois utiliser tous tes skills associés** comme demandé par l'utilisateur.
- **Respecte la palette à la lettre** — elle vient du DESIGN.md officiel de l'app, c'est la source de vérité.
- **Le néon signale, il ne décore pas.** Une carte au repos n'a pas de néon. Les halos d'arrière-plan restent ≤0.14 d'alpha.
- **Pas de side-stripe** (border latérale > 1px) — c'est le "tell #1" d'une UI IA, banni.
- **La nuit est la vedette.** Conçois d'abord en mode nuit.
- **Les démos interactives inline** (toggle theme, overlay vidéo, sélecteur de langue) sont ce qui distingue l'option C — soigne-les.
- **i18n :** FR et EN doivent être parfaits. Les 10 autres langues peuvent être en draft initial mais la structure doit être complète.
- **Copie les assets** depuis les dossiers source vers `assets/` AVANT de coder (cf. §5).
