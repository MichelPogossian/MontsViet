import { createFileRoute } from "@tanstack/react-router";
import { StructuredData } from "../components/StructuredData";
import { Dishes } from "../components/montsviet/dishes";
import { Footer } from "../components/montsviet/footer";
import { Hero } from "../components/montsviet/hero";
import { Infos } from "../components/montsviet/infos";
import { Motion } from "../components/montsviet/motion";
import { Nav } from "../components/montsviet/nav";
import { Preloader } from "../components/montsviet/preloader";
import { Saveurs } from "../components/montsviet/saveurs";
import { Service } from "../components/montsviet/service";
import { DISHES, RESTAURANT, SITE_URL } from "../lib/restaurant";

const RESTAURANT_JSON_LD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Restaurant",
  name: RESTAURANT.name,
  url: SITE_URL,
  image: `${SITE_URL}/assets/og-image.jpg`,
  logo: `${SITE_URL}/assets/logo.png`,
  telephone: "+33762797955",
  email: RESTAURANT.email,
  servesCuisine: "Vietnamienne",
  priceRange: "€€",
  address: {
    "@type": "PostalAddress",
    streetAddress: RESTAURANT.address.street,
    postalCode: RESTAURANT.address.postalCode,
    addressLocality: RESTAURANT.address.city,
    addressCountry: "FR",
  },
  openingHoursSpecification: RESTAURANT.services.map((s) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    opens: s.open,
    closes: s.close,
  })),
  hasMenu: {
    "@type": "Menu",
    hasMenuSection: {
      "@type": "MenuSection",
      name: "Plats signature",
      hasMenuItem: DISHES.map((d) => ({
        "@type": "MenuItem",
        name: d.name,
        description: d.description,
        image: `${SITE_URL}${d.image}`,
      })),
    },
  },
});

export const Route = createFileRoute("/")({
  head: () => ({
    links: [{ rel: "canonical", href: `${SITE_URL}/` }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <StructuredData json={RESTAURANT_JSON_LD} />
      <Preloader />
      <Nav />
      <main>
        <Hero />
        <Saveurs />
        <Dishes />
        <Service />
        <Infos />
      </main>
      <Footer />
      <Motion />
    </>
  );
}
