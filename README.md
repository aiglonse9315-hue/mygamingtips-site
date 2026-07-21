# 🎮 MyGamingTips — Site officiel

Site web promotionnel pour l'application **MyGamingTips** (mobile + Windows), qui centralise les contenus gaming utiles — vidéos, guides, liens — organisés par jeu et vérifiés.

> **Promesse :** le seul endroit où chaque jeu a ses meilleurs contenus, triés et vérifiés — pas un feed infini.

## 🌐 Stack technique

- **HTML / CSS / JS vanilla** (statique, zéro framework, zéro build)
- **i18n** : 12 langues (FR, EN, ES, DE, IT, PT, RU, ZH, JA, KO, AR, HI) avec détection auto + persistance + RTL pour l'arabe
- **Thème dark/light** : dark néon par défaut, toggle live, persistance
- **Protections** : anti-clic-droit, anti-sélection, anti-DevTools (freins dissuasifs)

## 🎨 Direction visuelle

Dark Néon Gaming — "Arcade Vivante" :
- Mode dark par défaut (indépendant du système)
- Halos néon (violet `#8A2BE2`, cyan `#00E5FF`, magenta `#FF2D95`, vert `#39FF14`)
- Particules drift + aurora effect + scanlines CRT
- Glassmorphism + contours néon

## 📁 Structure

```
├── index.html              # Page unique
├── assets/
│   ├── logo/               # Logo officiel
│   ├── screenshots/        # Screenshots mobile, windows, promo (12 langues)
│   └── promo-hero.png      # Image OG (réseaux sociaux)
├── css/                    # tokens, reset, base, gaming-background, components, promo
├── js/                     # i18n, theme, protections, main, promo
├── locales/                # 12 fichiers JSON (fr, en, es, de, it, pt, ru, zh, ja, ko, ar, hi)
└── docs/                   # Briefs de design (V1 → V8)
```

## 🚀 Déploiement

Le site est hébergé sur **Cloudflare Pages** avec déploiement automatique depuis GitHub.

Chaque `git push` sur la branche `main` → rebuild + déploiement automatique (~30s).

## 📝 Licence

Projet privé. Tous droits réservés.
