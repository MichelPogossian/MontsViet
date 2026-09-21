# Monts Việt

Site vitrine du restaurant vietnamien **Monts Việt** (2 bis avenue des Demoiselles, 85160 Saint-Jean-de-Monts).

Landing page moderne construite à partir du flyer du restaurant : logo, plats signature (Bò Bún, Phở Bò, Bò Lúc Lắc),
horaires et coordonnées, dans les couleurs crème et rouge laqué du flyer.

## Ce que contient le site

- Ouverture de page avec un lotus qui se déploie, puis rideau qui se lève sur le hero.
- Hero animé : film généré avec Higgsfield (bol de phở, lanternes, pétales), logo qui apparaît avec un cercle tracé,
  pétales en canvas, parallaxe au défilement et à la souris.
- Section « Saveurs du Vietnam » sur un second film généré (branche de fleurs et lanternes).
- Cartes des plats avec effet de relief 3D au survol, étiquettes « coup de pinceau » et vapeur animée sur le phở.
- Section sur place et à emporter, infos pratiques avec statut d'ouverture en direct et plan d'accès, footer illustré.

## Développement

Le projet vit dans `app/` (React 19, TanStack Start, Tailwind v4, GSAP, Lenis) et se déploie comme un Worker Cloudflare
via la plateforme Higgsfield (`here.now`).

```bash
cd app
bun install
bun run typecheck
bun run build
```

Les visuels et vidéos se trouvent dans `app/public/assets/` ; les textes et coordonnées dans `app/src/lib/restaurant.ts`.
