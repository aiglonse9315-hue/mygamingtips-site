# Retouches V8 — Resserrement Mobile + Refonte layout Plus/Download

**Date :** 2026-07-20
**Objet :** Resserrement vertical supplémentaire + restructuration de la section Plus (titre à droite + Télécharger sous le pricing).

---

## 📋 Vue d'ensemble

| # | Zone | Demande | Localisation |
|---|---|---|---|
| A | Section Mobile | Encore **trop éloignée / trop haute** → resserrer vertical | `base.css` + `components.css` |
| B | Écart Mobile → Windows | **Trop d'espace** entre les 2 sections | `base.css` ou override ciblé |
| C | Section Plus | **Remonter d'au moins 5 cm** + **titre à droite au-dessus du pricing** + **Télécharger sous le panneau pricing** | `index.html` + `components.css` |

---

## CHANTIER A — Section Mobile : encore moins d'espace vertical

### Problème
La section Mobile est toujours jugée "trop éloignée / trop haute". Réduire encore ses espacements internes.

### Cibles et changements

**A.1 — Réduire le gap entre les scènes mobiles**
Fichier : `css/components.css` lignes **608-613** (`.mobile-scenes`) :
```css
/* Avant : */
gap: clamp(var(--space-lg), 3vw, var(--space-xl));   /* 16-24px */
padding-block: var(--space-md) var(--space-lg);       /* 12/16px */

/* Après : */
gap: clamp(var(--space-md), 2vw, var(--space-lg));   /* 12-16px */
padding-block: var(--space-sm) var(--space-md);       /* 8/12px */
```

**A.2 — Réduire les décalages verticaux des scènes**
Fichier : `css/components.css` lignes **632-634** :
```css
/* Avant : */
.mobile-scene--offset-down { margin-top: var(--space-lg); }         /* +16px */
.mobile-scene--offset-up   { margin-top: calc(-1 * var(--space-md)); } /* -12px */

/* Après : */
.mobile-scene--offset-down { margin-top: var(--space-md); }          /* +12px */
.mobile-scene--offset-up   { margin-top: calc(-1 * var(--space-sm)); } /* -8px */
```

**A.3 — Réduire le gap interne des scènes (entre phone + texte)**
Fichier : `css/components.css` lignes **620-625** (`.mobile-scene` desktop) :
```css
/* Avant : */
@media (min-width: 760px) {
  .mobile-scene { grid-template-columns: 0.95fr 1.05fr; gap: var(--space-2xl); } /* 40px */
}

/* Après : */
@media (min-width: 760px) {
  .mobile-scene { grid-template-columns: 0.95fr 1.05fr; gap: var(--space-xl); } /* 24px */
}
```

**A.4 — Réduire le `translateY` du phone featured**
Fichier : `css/components.css` lignes **657-660** :
```css
/* Avant : */
.mobile-scene__phone--featured { transform: translateY(-8px); }

/* Après : */
.mobile-scene__phone--featured { transform: translateY(-4px); }
```

### Effet attendu
La section Mobile se compacte : moins d'espace entre les scènes, décalages plus discrets, gap phone-texte réduit. Concerne UNIQUEMENT la section Mobile, sans toucher aux autres sections.

---

## CHANTIER B — Réduire l'écart Mobile → Windows

### Problème
Actuellement l'espace entre `#mobile` et `#windows` = 2 × `clamp(28px, 5vw, 56px)` = **jusqu'à 112px sur desktop**. L'utilisateur veut moins.

### Solution — override ciblé
On ne touche pas au `padding-block` global de `.section` (sinon on affecte toutes les sections). À la place, on ajoute un override **ciblé sur les 2 sections concernées**.

Fichier : `css/components.css` — ajouter après la section `.mobile-scenes` (~ligne 660) :

```css
/* V8 Chantier B — Réduit l'écart entre #mobile et #windows.
   On écrase le padding-block standard de .section pour ces 2 sections. */
#mobile { padding-block-end: clamp(8px, 1.5vw, 16px); }
#windows { padding-block-start: clamp(8px, 1.5vw, 16px); }
```

**Économie :** l'écart entre les 2 sections passe de ~112px à ~32px sur desktop. Concerne UNIQUEMENT cette transition, pas les autres.

### Effet attendu
La transition Mobile → Windows devient fluide, sans vide vertical.

---

## CHANTIER C — Section Plus : refonte layout (titre à droite + Télécharger sous pricing)

### Problème actuel (3 demandes)
1. La section Plus est trop basse → la **remonter d'au moins 5 cm** (~190px en DPI standard, mais on visera ~120-150px via margin-top négatif).
2. Le titre "Passez à MyGamingTips Plus" est centré au-dessus des 2 colonnes → il faut le **décaler à droite**, au-dessus du panneau pricing (`.neon-premium`) uniquement.
3. La section Télécharger (`#download`) est une section séparée placée après → il faut la **déplacer sous le panneau pricing**, à droite.

### Diagnostic de l'audit
- Il existe un **doublon de titre** : h2 "Passez à MyGamingTips Plus" dans `.section__head` (ligne 818) + h3 identique dans `.neon-premium` (ligne 935).
- `#download` est une `<section>` indépendante (lignes 998-1038), il faut l'intégrer dans `.plus`.

### Solution — refonte structurée

#### C.1 — Remonter toute la section Plus
Fichier : `css/components.css` — ajouter un override sur `#plus` :

```css
/* V8 Chantier C.1 — Remonte la section Plus (~5cm). */
#plus {
  margin-block-start: calc(-1 * clamp(80px, 10vw, 150px));
}
/* Mobile : on remonte moins pour ne pas coller */
@media (max-width: 900px) {
  #plus { margin-block-start: calc(-1 * var(--space-xl)); }  /* -24px */
}
```

**Note :** ajuster la valeur si le rendu visuel ne correspond pas à "5cm". Commencer avec `clamp(80px, 10vw, 150px)` et itérer si besoin.

#### C.2 — Supprimer le doublon de titre (h3 dans .neon-premium)
Fichier : `index.html` ligne **935** — **supprimer** le `<h3>Passez à MyGamingTips Plus</h3>` dans `.neon-premium`.

Le titre h2 de la `.section__head` reste le seul titre de la section, et on va le décaler à droite (C.3).

#### C.3 — Décaler le titre h2 à droite, au-dessus du pricing
L'utilisateur veut le titre centré au-dessus de la colonne pricing (droite) uniquement.

**Approche CSS-only** (pas de restructure HTML) — fichier : `css/components.css`, override sur `#plus .section__head` :

```css
/* V8 Chantier C.3 — Titre Plus décalé à droite au-dessus du pricing.
   Desktop uniquement : sur mobile on garde le centrage standard. */
@media (min-width: 900px) {
  #plus .section__head {
    margin-inline-start: auto;  /* pousse à droite */
    margin-inline-end: 0;
    max-width: 57.5%;            /* correspond à la largeur de la colonne pricing (1.15fr / 2fr) */
    text-align: center;
  }
}
```

**Justification :** la colonne pricing fait `1.15fr` sur un total de `2fr` (0.85fr + 1.15fr) = 57.5%. En mettant le titre à `max-width: 57.5%` + `margin-inline-start: auto`, il s'aligne au-dessus de la colonne droite.

#### C.4 — Déplacer #download sous le panneau pricing
C'est la partie la plus structurante. L'utilisateur veut que la section Télécharger vienne se placer **sous le panneau pricing à droite**, sous la CTA "Passer à Plus".

**Approche recommandée — déplacer le contenu de #download dans .neon-premium :**

1. **HTML** — déplacer le bloc `.download-grid` (lignes 1006-1034 de `index.html`) + le microcopy (ligne 1036) à l'intérieur de `.neon-premium`, juste après la CTA (ligne 991).

   ```html
   <div class="neon-premium" data-reveal>
     <!-- ... badge + p + benefits + plans + microcopy + CTA existants ... -->

     <!-- V8 C.4 : Télécharger déplacé ici, sous le CTA -->
     <div class="download-inline">
       <div class="download-grid">
         <a class="download-card" href="#play-store">Mobile</a>
         <a class="download-card" href="#windows-download">Windows</a>
       </div>
     </div>
   </div>
   ```

2. **Supprimer la section `#download`** qui n'a plus de raison d'être (lignes 998-1038), MAIS **conserver l'ancre `#download`** quelque part (pour la navigation header). Solution : poser `id="download"` sur un élément existant (ex. la première `.download-card` Windows, ou le conteneur `.download-inline`).

3. **CSS** — adapter `.download-grid` pour qu'il s'intègre dans `.neon-premium` :
   ```css
   /* V8 C.4 — download-grid intégré dans le panneau pricing */
   .download-inline {
     margin-top: var(--space-lg);
     padding-top: var(--space-lg);
     border-top: 1px solid var(--border);
   }
   .download-inline .download-grid {
     grid-template-columns: 1fr 1fr;
     gap: var(--space-md);
   }
   .download-inline .download-card {
     padding: var(--space-md);  /* réduit par rapport à la version section standalone */
   }
   ```

4. **Microcopy de download** — le garder ou le fusionner avec celui de Plus ? Recommandation : supprimer le microcopy de download (déjà un microcopy "Annulez à tout moment" dans Plus), ou le fusionner en un seul sous le download-grid.

#### C.5 — Réajuster le grid `.plus`
Avec le déplacement de download, le panneau pricing devient plus haut. Vérifier que l'alignement `align-items: center` reste correct, sinon passer à `align-items: start` pour que les 2 colonnes commencent en haut.

Fichier : `css/components.css` lignes **1428-1436** :
```css
/* Avant : */
.plus { align-items: center; }

/* Après (potentiellement) : */
.plus { align-items: start; }
```
**À tester visuellement** — si le poster est centré verticalement par rapport au pricing (qui est maintenant plus haut avec download), `start` peut être meilleur.

### Effet attendu
1. Section Plus remontée (~5cm plus haut)
2. Titre "Passez à MyGamingTips Plus" aligné à droite au-dessus du panneau pricing (desktop)
3. Doublon de titre supprimé (un seul h2)
4. Section Télécharger intégrée sous le panneau pricing à droite (sous la CTA)
5. Ancre `#download` conservée pour la navigation

---

## ✅ Critères d'acceptation V8

- [ ] **A** : Section Mobile plus compacte (gap scènes réduit, décalages atténués, gap phone-texte réduit)
- [ ] **B** : Écart Mobile → Windows réduit (override ciblé `#mobile` padding-bottom + `#windows` padding-top)
- [ ] **C.1** : Section Plus remontée d'environ 5cm (margin-block-start négatif)
- [ ] **C.2** : Doublon de titre supprimé (h3 dans .neon-premium retiré)
- [ ] **C.3** : Titre h2 décalé à droite au-dessus de la colonne pricing (desktop ≥900px)
- [ ] **C.4** : Section Télécharger déplacée dans `.neon-premium` sous le CTA ; ancre `#download` conservée
- [ ] **C.5** : Grid `.plus` cohérent (alignement à valider)
- [ ] Pas de cassure des fonctionnalités précédentes (V1 → V7)
- [ ] Navigation header fonctionne toujours (`#mobile`, `#windows`, `#community`, `#plus`, `#download`)
- [ ] `prefers-reduced-motion` respecté
- [ ] Responsive : tester mobile (les overrides desktop doivent se désactiver proprement sous 900px)

---

## 🔧 Méthodologie

1. **Lis ce brief V8 en entier**.
2. **Applique chantier par chantier** (A → B → C), teste après chacun.
3. **Pour le Chantier C** (le plus structurant) :
   - C.1 d'abord (margin-top négatif)
   - C.2 ensuite (suppression doublon)
   - C.3 ensuite (titre à droite)
   - C.4 ensuite (déplacement download — le plus gros)
   - C.5 enfin (réajustement grid)
4. **Utilise tes skills associés** (frontend-design, code review, vérification).
5. **Vérifie l'acceptance criteria V8**.
6. **Rapporte à la fin** : ce qui est changé, les valeurs finales, les décisions prises (notamment sur le doublon de titre et le microcopy).

## ⚠️ Ne pas casser

- Toutes les fonctionnalités V1 → V7
- L'ancre `#download` doit rester accessible depuis le menu header
- Le bouton "Passer à Plus" (CTA) doit rester fonctionnel (initPlanSelector)
- La section Mobile reste en 6 scènes asymétriques (juste resserrée)
- i18n, protections, theme global, switch phone-theme

Bonne refonte ! 🎮
