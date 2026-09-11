# -*- coding: utf-8 -*-
"""
Compression des images servies par le site → WebP (copies .webp à côté
des originaux, AUCUN original modifié).

- Sources ≤ 1600 px de large : dimensions conservées (aucun rééchantillonnage,
  donc aucune perte nette) — redimensionnement seulement si plus large.
- WebP qualité 85, method 6 (meilleur encodage). Alpha PNG préservée.
- promo-hero.png (og:image) → promo-hero-social.jpg (JPEG q85) car les
  crawlers sociaux n'acceptent pas toujours le WebP.
"""
import os
import sys
from PIL import Image

RACINE = os.path.dirname(os.path.abspath(__file__))
MAX_LARGEUR = 1600
QUALITE = 85

GLOBS = [
    os.path.join("assets", "screenshots", "mobile-i18n"),
    os.path.join("assets", "screenshots", "windows-i18n"),
    os.path.join("assets", "screenshots", "promo"),
    os.path.join("assets", "screenshots", "windows"),
]
EXT_SRC = {".jpg", ".jpeg", ".png"}


def taille(n):
    try:
        return os.path.getsize(n)
    except OSError:
        return 0


def formate(octets):
    if octets >= 1024 * 1024:
        return "%.1f Mo" % (octets / 1024 / 1024)
    return "%.0f Ko" % (octets / 1024)


def compresse(src_rel):
    src = os.path.join(RACINE, src_rel)
    stem, _ = os.path.splitext(src_rel)
    dst_rel = stem + ".webp"
    dst = os.path.join(RACINE, dst_rel)

    im = Image.open(src)
    if im.width > MAX_LARGEUR:
        h = round(im.height * MAX_LARGEUR / im.width)
        im = im.resize((MAX_LARGEUR, h), Image.LANCZOS)

    im.save(dst, "WEBP", quality=QUALITE, method=6)

    avant, apres = taille(src), taille(dst)
    if apres >= avant:
        # Cas improbable : la copie webp serait plus lourde → on la retire
        # et on gardera l'original comme référence.
        os.remove(dst)
        return None
    return avant, apres, dst_rel


def main():
    total_avant = total_apres = 0
    n = 0
    for dossier in GLOBS:
        base = os.path.join(RACINE, dossier)
        for racine, _, fichiers in os.walk(base):
            for f in sorted(fichiers):
                if os.path.splitext(f)[1].lower() not in EXT_SRC:
                    continue
                src_rel = os.path.relpath(os.path.join(racine, f), RACINE)
                res = compresse(src_rel)
                if res is None:
                    print("IGNORÉ (webp plus lourd) : %s" % src_rel)
                    continue
                avant, apres, dst_rel = res
                total_avant += avant
                total_apres += apres
                n += 1
                if n % 25 == 0:
                    print("  … %d images traitées" % n)

    # og:image social (JPEG, pas WebP)
    hero_src = os.path.join(RACINE, "assets", "promo-hero.png")
    hero_dst = os.path.join(RACINE, "assets", "promo-hero-social.jpg")
    if os.path.exists(hero_src):
        im = Image.open(hero_src).convert("RGB")
        im.save(hero_dst, "JPEG", quality=QUALITE, optimize=True, progressive=True)
        total_avant += taille(hero_src)
        total_apres += taille(hero_dst)
        n += 1

    print("-" * 60)
    print("%d images compressées : %s → %s (-%.0f %%)"
          % (n, formate(total_avant), formate(total_apres),
             100 * (1 - total_apres / total_avant)))


if __name__ == "__main__":
    sys.exit(main())
