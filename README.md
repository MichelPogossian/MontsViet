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

## Mise en ligne

- Site public (here.now) : https://civic-bamboo-6b3c.here.now/
- Copie Higgsfield (accès réservé au compte tant que le site n'est pas publié sur le feed) : https://montsviet.higgsfield.app/

Pour republier sur here.now après une modification :

```bash
node scripts/export-static.mjs            # build + rendu statique dans static-export/
node scripts/publish-herenow.mjs static-export --slug civic-bamboo-6b3c
```

Sans clé API here.now, un site est anonyme et expire au bout de 24 h : il faut le réclamer via le lien de claim reçu
lors de la première publication, ou définir `HERENOW_API_KEY` (clé obtenue sur https://here.now) pour publier un site permanent.

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
