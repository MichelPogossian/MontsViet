import { useEffect, useState } from "react";
import { NAV_LINKS, RESTAURANT } from "../../lib/restaurant";
import { CloseIcon, MenuIcon, PhoneIcon } from "./icons";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    return () => document.documentElement.classList.remove("menu-open");
  }, [open]);

  return (
    <header className={`site-nav ${scrolled ? "site-nav-solid" : ""} ${open ? "site-nav-open" : ""}`}>
      <div className="site-nav-inner">
        <a href="#accueil" className="site-brand" aria-label="Monts Việt, retour en haut de page">
          <img src="/assets/logo.webp" alt="" width="48" height="48" className="site-brand-mark" />
          <span className="site-brand-name">
            Monts <em>Việt</em>
          </span>
        </a>

        <nav className="site-links" aria-label="Navigation principale">
          {NAV_LINKS.map((link) => (
            <a key={link.href} href={link.href} className="site-link">
              {link.label}
            </a>
          ))}
        </nav>

        <a href={RESTAURANT.phoneHref} className="nav-phone">
          <PhoneIcon className="nav-phone-icon" />
          <span>{RESTAURANT.phoneDisplay}</span>
        </a>

        <button
          type="button"
          className="nav-burger"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      <div id="mobile-menu" className="mobile-menu" hidden={!open}>
        <nav aria-label="Navigation mobile" className="mobile-menu-links">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className="mobile-menu-link"
              style={{ transitionDelay: `${0.08 + i * 0.07}s` }}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a href={RESTAURANT.phoneHref} className="mobile-menu-phone" onClick={() => setOpen(false)}>
          <PhoneIcon /> {RESTAURANT.phoneDisplay}
        </a>
        <p className="mobile-menu-hours">
          {RESTAURANT.hoursLabel} · 11h00 à 15h00 · 18h30 à 22h30
        </p>
      </div>
    </header>
  );
}
