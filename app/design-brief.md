# Monts Việt, design brief

**Design read.** A family Vietnamese restaurant in Saint-Jean-de-Monts wants
visitors to feel the warmth of its flyer on screen: cream paper, lacquer red,
lanterns and blossoms, and to pick up the phone.

**Concept spine.** "The flyer comes to life": every element the customer knows
from the printed flyer (round logo, brush labels, framed "Saveurs du Vietnam"
box, contact rows, harbour illustration) is rebuilt and set in motion.

**Delivery tier.** cinema (Lenis + GSAP, generated hero film, scroll chapters).

**Locked palette** (from the printed flyer, so the beige and red family is the
brand, not a default): cream `#F4EBDB`, paper `#FBF6EC`, cream-2 `#EADDC4`,
lacquer red `#B4382C`, deep red `#8E2B21`, ink `#2A211D`, bark `#5B3F33`.
One accent (red), warm neutrals only.

**Locked type** (matching the flyer's brush scripts and condensed caps):
`Dancing Script` for display script, `Great Vibes` for the elegant tagline,
`Oswald` for uppercase labels, `Poppins` for body.

**Animation mode:** non-animated, per the request: "landing page moderne" with
Higgsfield animations in the hero and JavaScript effects on the logo and
dishes, plus a lotus opening on load. The hero film is a generated
image-to-video clip played as a ping-pong loop with scroll parallax; a second
generated blossom-and-lantern film backs the "Saveurs du Vietnam" chapter.

**Section plan.**
1. Preloader: lotus unfolds, name appears, curtain lifts.
2. Hero, split layout: logo blooms in with a drawn ring, film behind, petals.
3. Saveurs du Vietnam: framed panel on the blossom film (centered feature).
4. Nos plats signature: three tilt cards with brush labels (row of cards).
5. Sur place et à emporter: overlapping photos + banner + list (split).
6. Infos pratiques: contact rows with icons + map (two columns).
7. Footer: columns over the harbour illustration.

**Asset plan (all generated with Higgsfield).** Clean vector logo from the
flyer, three dish photos from the flyer references, hero pho scene and its
film, blossom-lantern film, lantern and blossom cutouts, interior, takeaway,
feast (OG), harbour illustration.

**CTA inventory.** `cta-call` (red pill with number, hero), `cta-discover`
(underlined link with bouncing arrow, hero), `nav-phone` (outlined pill),
`cta-inline` (dish footer link), `cta-outline` (service), `cta-route` (map
directions), each with its own interaction.
