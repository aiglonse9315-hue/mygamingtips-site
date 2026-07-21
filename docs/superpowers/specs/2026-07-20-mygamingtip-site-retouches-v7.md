# Retouches V7 — Intervertir pills + réduire espaces inter-sections

**Date :** 2026-07-20
**Objet :** 2 ajustements fins après la V6.

---

## CHANTIER A — Intervertir les pills "jour" et "nuit"

### Problème
Dans la section personnalisation, les pills sont actuellement **Nuit à gauche, Jour à droite**. Or le thumb du switch se positionne **à gauche en mode jour, à droite en mode nuit**. Donc la pill "allumée" est toujours du côté opposé au thumb — pas cohérent.

### Objectif
Mettre **Jour à gauche, Nuit à droite** → la pill active sera du même côté que le thumb.

### Cible
Fichier : `index.html` lignes **773-774** (ou 774-775 selon offset — les 2 spans `.theme-demo__pill`)

### Solution — inverser l'ordre des 2 spans

**HTML actuel** (autour des lignes 773-774) :
```html
<span class="theme-demo__pill theme-demo__pill--night is-on" aria-hidden="true">🌙 <span ...>Nuit</span></span>
<span class="theme-demo__pill theme-demo__pill--day" aria-hidden="true">☀️ <span ...>Jour</span></span>
```

**HTML après** :
```html
<span class="theme-demo__pill theme-demo__pill--day" aria-hidden="true">☀️ <span ...>Jour</span></span>
<span class="theme-demo__pill theme-demo__pill--night is-on" aria-hidden="true">🌙 <span ...>Nuit</span></span>
```

**C'est tout !** Le CSS existant (lignes ~1190-1192 de `components.css`) et le JS `initPhoneThemeDemo` ciblent les **classes** `--day` / `--night` et le toggle `is-day`, pas leur position. Donc inverser l'ordre source suffit — le comportement reste identique, seul l'ordre visuel change.

### Effet attendu
- **État NUIT (défaut)** : thumb à droite, pill "Nuit" allumée à droite → **cohérent**
- **État JOUR** : thumb à gauche, pill "Jour" allumée à gauche → **cohérent**

---

## CHANTIER B — Réduire encore les espaces inter-sections

### Problème
Il y a **toujours trop d'espace** entre :
1. `#mobile` ↔ `#windows`
2. `#community` ↔ `#plus` (via `#personalize`)
3. `#plus` ↔ `#download`

Actuellement chaque section a `padding-block: clamp(36px, 6vw, 72px)` → jusqu'à **2 × 72px = 144px d'espace** entre 2 sections contiguës.

### Solution — 2 leviers complémentaires

#### B.1 — Réduire le `padding-block` global de `.section`
Fichier : `css/base.css` ligne **99** :
```css
/* Avant : */
.section { padding-block: clamp(36px, 6vw, 72px); }

/* Après : */
.section { padding-block: clamp(28px, 5vw, 56px); }
```
**Économie :** 144px → 112px max entre 2 sections (~22% de réduction).

#### B.2 — Réduire encore les décalages asymétriques internes
Fichier : `css/components.css` lignes **611-612** (`.mobile-scenes`) :
```css
/* Avant : */
.mobile-scenes {
  gap: clamp(var(--space-xl), 4vw, var(--space-2xl));  /* 24-40px */
  padding-block: var(--space-lg) var(--space-xl);       /* 16/24px */
}

/* Après : */
.mobile-scenes {
  gap: clamp(var(--space-lg), 3vw, var(--space-xl));   /* 16-24px */
  padding-block: var(--space-md) var(--space-lg);      /* 12/16px */
}
```
Cela réduit l'espace interne à la section Mobile (entre la dernière scène et le bord bas de la section).

#### B.3 — Vérifier le footer (déjà réduit en V6)
Vérifier que `.site-footer { margin-top: var(--space-2xl); }` (40px) est cohérent — peut être réduit à `var(--space-xl)` (24px) si l'utilisateur trouve encore trop d'espace avant le footer, **mais ce n'est pas demandé dans ce brief V7**. Ne pas toucher.

### Effet attendu
- Les transitions entre sections Mobile → Windows → Communauté → Plus → Télécharger sont **plus fluides**
- La page globale se raccourcit encore (~30-50px par transition × 3-4 transitions = ~150px de scroll en moins)
- Le contenu reste respirant (on ne colle pas les sections, on resserre juste)

---

## ✅ Critères d'acceptation V7

- [ ] **A** : Pills "Jour" à gauche, "Nuit" à droite dans la section personnalisation. La pill active correspond à la position du thumb (jour à gauche = thumb gauche allumé, nuit à droite = thumb droit allumé).
- [ ] **B** : `.section` padding-block réduit (`clamp(28px, 5vw, 56px)`). `.mobile-scenes` gap + padding-block réduits. Les 3 paires de sections demandées (mobile↔windows, community↔plus, plus↔download) ont un espace visiblement plus court.
- [ ] Pas de cassure des fonctionnalités précédentes.
- [ ] `prefers-reduced-motion` respecté (rien à changer ici).

---

## 🔧 Méthodologie

1. **Lis ce brief V7 en entier**.
2. **Applique le Chantier A** (1 edit HTML : inverser les 2 spans).
3. **Applique le Chantier B** (2 edits CSS : `base.css` + `components.css`).
4. **Utilise tes skills associés** (frontend-design, code review, vérification).
5. **Vérifie l'acceptance criteria V7**.
6. **Rapporte à la fin**.

## ⚠️ Ne pas casser
- Toutes les fonctionnalités V1 → V6
- Le JS `initPhoneThemeDemo` (ne pas y toucher — il toggle `is-day`, pas la position des pills)
- Les autres espacements internes (features grid, community stats, etc.)

Bonne finition ! 🎮
