# PASSATION — Site MyGamingTips

> **À lire en premier dans toute nouvelle conversation ZCode sur ce projet.**
> **À mettre à jour à CHAQUE modification du projet** (règle fixée par l'utilisateur le 2026-09-12) : renseigner « Dernières modifications connues », ajuster l'arborescence et les problèmes ouverts si impactés.
> Rédigé le 2026-09-12 après l'erreur 413 qui a clôturé la conversation précédente.

## Contexte du projet

Site vitrine statique (HTML/CSS/JS, aucun framework) promouvant :
- **l'application mobile MyGamingTips** — astuces, guides et tips triés/ vérifiés sur les jeux populaires, gestion de favoris et de playlists multi-sessions ;
- **le compagnon Windows associé** — killer feature : lecteur vidéo overlay **sans pub pendant qu'on joue**.

- **Design retenu** : *Dark Néon Gaming* (option A) — sombre, néons violet/cyan, glow, glassmorphism, aligné sur le DESIGN.md de l'app (« Arcade Vivante »).
- **Structure retenue** : *One-Page Interactif Démo* (modèle C) — démos live inline (toggle jour/nuit réel sur le hero, sélecteur de langue qui traduit instantanément, mockup overlay vidéo).
- **i18n** : 12 langues (`locales/*.json` : ar, de, en, es, fr, hi, it, ja, ko, pt, ru, zh) avec détection auto, switch, RTL arabe.
- **Protections** : anti-clic droit (`js/protections.js`).
- **Déploiement** : Cloudflare Pages → **https://mygamingtips-site.pages.dev** (vérifier avec Ctrl+Shift+R).

## Arborescence

| Dossier / fichier | Rôle |
|---|---|
| `index.html` | Page unique (sections : Hero, Features, Mobile, Windows, Communauté, Plus, Download) |
| `css/` | tokens, reset, base, components, gaming-background, promo |
| `js/` | main, i18n, mobile-i18n, windows-i18n, theme, promo, protections, performance |
| `locales/` | 12 fichiers de traduction JSON |
| `assets/` | images utilisées par le site (screenshots, logo, brand, icons) |
| `imageapp/` | captures source de l'app fournies par l'utilisateur |
| `miniatures/` | ⭐ versions allégées de TOUTES les images (voir ci-dessous) |
| `generer_miniatures.py` | script de régénération des miniatures |
| `compresser_images_web.py` | script de génération des WebP servies par le site (voir ci-dessous) |
| `Conversationini.txt` | transcription de la conversation initiale de création du site |

Références externes : DESIGN.md et PRODUCT.md de l'app sont dans le projet applicatif `D:\NONO Projet APP\Zprojet\MygamingTis`.

## ⚠️ L'incident 413 (à ne pas reproduire)

La conversation précédente est morte sur : `status=413 — Request body too large. Maximum size is 52428800 bytes` (50 Mo).

**Cause** : ZCode renvoie tout l'historique à chaque requête. Les images lues en conversation sont encodées en base64 (+33 %). Le projet contient 338 images totalisant 325 Mo (203 font plus de 1 Mo). Lire ne serait-ce que 25-30 captures originales (≈ 1,4-1,9 Mo chacune) fait dépasser les 50 Mo → la conversation est **perdue sans récupération** (retryable=false, et même `/compact` échoue car il requiert l'historique complet).

**Règles pour les conversations futures** :
1. **Ne jamais lire les images de `imageapp/` ni d'`assets/` directement** — toujours leurs équivalents dans `miniatures/`.
2. Lire les miniatures **par petites séries** (3-4 à la fois, 10 max par conversation).
3. **Ne jamais lire `Conversationini.txt` en entier** (200 Ko ≈ 60 k tokens). Le présent fichier le résume ; si un détail manque, faire des recherches ciblées (`grep`) dans le fichier plutôt qu'une lecture complète.
4. Éviter de dumper de grosses sorties de commandes en continu.

## 📁 Le dossier `miniatures/`

Miroir exact de `imageapp/` et `assets/` (mêmes sous-dossiers, mêmes noms de fichiers ; PNG sans transparence réelle convertis en `.jpg`).

- Largeur max 800 px, JPEG qualité 82 (ou PNG si transparence réelle : logos).
- **338 images : 325 Mo → 31,8 Mo (10 %)** — moyenne ≈ 94 Ko, aucune > 400 Ko.
- En base64, une miniature pèse ≈ 125 Ko → on peut en montrer ~20-30 par conversation sans danger (en restant prudent car l'historique texte s'ajoute).

**Après ajout de nouvelles images** dans `imageapp/` ou `assets/`, relancer :
```
python generer_miniatures.py
```
(le script régénère tout `miniatures/` — rapide, ~30 s).

## Dernières modifications connues (session du 2026-09-12, après la passation)

- **Performance images (résout le problème ouvert ci-dessous)** : 162 copies WebP (qualité 85, dimensions d'origine, aucune image source modifiée) générées à côté des originaux dans `assets/screenshots/**` + `assets/promo-hero-social.jpg` pour l'og:image. `index.html`, `js/mobile-i18n.js`, `js/windows-i18n.js` et `js/promo.js` référencent les `.webp`. **148 Mo → 13,4 Mo servis (−91 %)**. Régénérer avec `python compresser_images_web.py` après ajout d'images.
- **Repo allégé + push (2026-09-12, feu vert utilisateur)** : les 162 originaux remplacés ont été retirés du suivi git (`git rm --cached`) et sont **gitignorés** (`.gitignore` : `assets/screenshots/**/*.jpg|jpeg|png` + `assets/promo-hero.png`) — ils **restent sur disque** comme sources de régénération. Ne jamais committer de jpg/png sous `assets/screenshots/` : convertir en WebP d'abord. Commits poussés vers `origin/main` (GitHub → déploiement Cloudflare Pages auto).
- **Badge « Accessible en mode Plus »** : pilule dorée (★) à côté de l'eyebrow « Le compagnon Windows », clé i18n `windows.plus_badge`, traduite dans les 12 langues. Styles `.badge-plus-pill` (components.css).
- **Sous-titre panneau Plus** : le fragment « réservé aux membres Plus » (équivalent par langue) est doré + gras via `<strong class="plus-gold">` dans `plus.subtitle` (12 locales). Attention : `.t-body strong` (base.css) écrase la couleur — le sélectur est donc `.t-body .plus-gold`.
- En thème clair, badge et fragment passent en or foncé `#8A6D00` (lisible sur blanc).
- Cache-bust : `?v=f6bf7cf`.

## Historique (fin de la conversation initiale)

- Sous-titre du panneau pub rendu générique (`promo.subtitle` : « Vos vidéos d'astuces et liens pour tous vos jeux préférés et plus »), traduit dans les 12 langues.
- Microcopy de téléchargement (`download.microcopy`) : « Aucune publicité en compte Plus. Aucun compte requis, seul votre compte Google sert à vous authentifier. Aucune collecte excessive. »
- Barres de titre macOS retirées des 5 aperçus de la galerie Windows.
- Espacement +25 px entre les bénéfices et les encadrés Mensuel/Annuel (section Plus).

## Problème ouvert (hors incident 413)

~~Le site sert des images très lourdes~~ **Résolu le 2026-09-12** : le site sert les copies WebP ET les originaux ont été retirés du dépôt git (voir « Dernières modifications »).

*2e nettoyage (même jour)* : `assets/screenshots/mobile/` (9 JPG, jamais référencés par le site) a aussi été retiré du repo et est couvert par le `.gitignore` — conservé sur disque + miroir `miniatures/`. **Aucun jpg/png d'`assets/screenshots/` n'est donc plus versionné.**

Ne restent en attente de tri par l'utilisateur (« plus tard ») :
- fichiers non suivis : `Conversationini.txt` (à ne jamais committer), `generer_miniatures.py`, `miniatures/` (32 Mo, usage IA uniquement).
