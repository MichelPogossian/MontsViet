import { NAV_LINKS, RESTAURANT, fullAddress } from "../../lib/restaurant";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-brand">
          <img src="/assets/logo.webp" alt="" width="96" height="96" className="footer-mark" />
          <p className="footer-tagline">{RESTAURANT.tagline}</p>
        </div>

        <nav className="footer-col" aria-label="Plan du site">
          <h3>Le site</h3>
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="footer-col">
          <h3>Nous trouver</h3>
          <p>{fullAddress()}</p>
          <a href={RESTAURANT.phoneHref}>{RESTAURANT.phoneDisplay}</a>
          <a href={`mailto:${RESTAURANT.email}`}>{RESTAURANT.email}</a>
        </div>

        <div className="footer-col">
          <h3>Horaires</h3>
          <p>{RESTAURANT.hoursLabel}</p>
          <p>11h00 à 15h00</p>
          <p>18h30 à 22h30</p>
        </div>
      </div>

      <div className="footer-harbor" aria-hidden="true">
        <picture>
          <source srcSet="/assets/harbor.webp" type="image/webp" />
          <img src="/assets/harbor.jpg" alt="" loading="lazy" width="2400" height="1029" data-parallax="0.08" />
        </picture>
        <div className="footer-harbor-fade" />
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} {RESTAURANT.name} · {RESTAURANT.kind} · {RESTAURANT.address.city}
        </p>
      </div>
    </footer>
  );
}
