// Single source of truth for everything printed on the flyer.
// Every section of the site reads from here so a change lands everywhere at once.

export const SITE_URL = "https://montsviet.here.now";

export const RESTAURANT = {
  name: "Monts Việt",
  kind: "Restaurant vietnamien",
  tagline: "Authentique · Généreuse · Faite avec cœur",
  phoneDisplay: "07 62 79 79 55",
  phoneHref: "tel:+33762797955",
  email: "montsviet@gmail.com",
  address: {
    street: "2 bis avenue des Demoiselles",
    postalCode: "85160",
    city: "Saint-Jean-de-Monts",
  },
  hoursLabel: "Lundi au dimanche",
  // Two daily services, 24h clock.
  services: [
    { open: "11:00", close: "15:00" },
    { open: "18:30", close: "22:30" },
  ],
  mapsEmbed:
    "https://www.google.com/maps?q=2+bis+avenue+des+Demoiselles,+85160+Saint-Jean-de-Monts&z=16&hl=fr&output=embed",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=2+bis+avenue+des+Demoiselles,+85160+Saint-Jean-de-Monts",
} as const;

export const NAV_LINKS = [
  { href: "#plats", label: "Nos plats" },
  { href: "#restaurant", label: "Le restaurant" },
  { href: "#infos", label: "Infos et horaires" },
] as const;

export type Dish = {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  imageWebp: string;
  steam?: boolean;
};

export const DISHES: Dish[] = [
  {
    id: "bo-bun",
    name: "Bò Bún",
    subtitle: "Le bol frais et généreux",
    description:
      "Vermicelles de riz, bœuf sauté à la citronnelle, nems croustillants, carottes et concombre, cacahuètes grillées et sauce nuoc mam.",
    image: "/assets/bobun.jpg",
    imageWebp: "/assets/bobun.webp",
  },
  {
    id: "pho-bo",
    name: "Phở Bò",
    subtitle: "La soupe emblématique du Vietnam",
    description:
      "Bouillon de bœuf mijoté longuement, nouilles de riz, fines tranches de bœuf, oignons, coriandre et herbes fraîches à ajouter à votre goût.",
    image: "/assets/phobo.jpg",
    imageWebp: "/assets/phobo.webp",
    steam: true,
  },
  {
    id: "bo-luc-lac",
    name: "Bò Lúc Lắc",
    subtitle: "Le bœuf sauté au wok",
    description:
      "Dés de bœuf caramélisés sautés au wok, riz sauté à la tomate et œuf au plat, tomate fraîche et citron vert au sel et poivre.",
    image: "/assets/boluclac.jpg",
    imageWebp: "/assets/boluclac.webp",
  },
];

export function fullAddress(): string {
  const a = RESTAURANT.address;
  return `${a.street}, ${a.postalCode} ${a.city}`;
}
