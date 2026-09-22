import { RESTAURANT } from "../../lib/restaurant";
import { BrushLabel } from "./brush-label";
import { PhoneIcon, TableIcon, TakeawayIcon } from "./icons";

/** "Sur place & à emporter": the room and the takeaway counter, side by side. */
export function Service() {
  return (
    <section id="restaurant" className="service">
      <div className="service-visuals">
        <figure className="service-room" data-reveal="clip">
          <picture>
            <source srcSet="/assets/interior.webp" type="image/webp" />
            <img
              src="/assets/interior.jpg"
              alt="La salle du restaurant, lanternes rouges et tables en bois"
              loading="lazy"
              width="1200"
              height="1500"
            />
          </picture>
        </figure>
        <img
          src="/assets/lantern.webp"
          alt=""
          className="service-lantern"
          width="500"
          height="978"
          loading="lazy"
          aria-hidden="true"
        />
        <figure className="service-takeaway" data-reveal="right">
          <picture>
            <source srcSet="/assets/takeaway.webp" type="image/webp" />
            <img
              src="/assets/takeaway.jpg"
              alt="Plats à emporter dans leurs boîtes kraft"
              loading="lazy"
              width="1200"
              height="1500"
            />
          </picture>
        </figure>
      </div>

      <div className="service-text">
        <div className="service-banner" data-reveal>
          <TakeawayIcon className="service-banner-icon" />
          <BrushLabel size="lg">Sur place & à emporter</BrushLabel>
          <TableIcon className="service-banner-icon" />
        </div>

        <h2 className="section-title" data-split>
          Chez nous ou chez vous
        </h2>

        <ul className="service-list" data-stagger>
          <li>
            <span className="service-list-icon">
              <TableIcon />
            </span>
            <div>
              <h3>Sur place</h3>
              <p>
                Une salle chaleureuse, des lanternes rouges et des plats généreux servis chauds.
                Venez déjeuner ou dîner en famille, entre amis ou en amoureux.
              </p>
            </div>
          </li>
          <li>
            <span className="service-list-icon">
              <TakeawayIcon />
            </span>
            <div>
              <h3>À emporter</h3>
              <p>
                Un coup de fil, et votre commande est prête à l'heure convenue. Idéal pour un repas
                à la maison ou un pique-nique face à l'océan.
              </p>
            </div>
          </li>
        </ul>

        <a href={RESTAURANT.phoneHref} className="cta-outline" data-reveal>
          <PhoneIcon />
          <span>Commander par téléphone</span>
        </a>
      </div>
    </section>
  );
}
