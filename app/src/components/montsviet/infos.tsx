import { useEffect, useState } from "react";
import { RESTAURANT, fullAddress } from "../../lib/restaurant";
import { ArrowRightIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon } from "./icons";

type Status = { open: boolean; label: string };

function toMinutes(hhmm: string): number {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

function formatFr(hhmm: string): string {
  return hhmm.replace(":", "h");
}

/** Computes "open now / next service" from the Paris clock. Client only. */
function computeStatus(): Status {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    timeZone: "Europe/Paris",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 0) % 24;
  const minute = Number(parts.find((p) => p.type === "minute")?.value ?? 0);
  const now = hour * 60 + minute;

  for (const s of RESTAURANT.services) {
    const open = toMinutes(s.open);
    const close = toMinutes(s.close);
    if (now >= open && now < close) {
      return { open: true, label: `Ouvert en ce moment, jusqu'à ${formatFr(s.close)}` };
    }
  }
  const next = RESTAURANT.services.find((s) => now < toMinutes(s.open));
  if (next) return { open: false, label: `Fermé pour l'instant, ouverture à ${formatFr(next.open)}` };
  return { open: false, label: `Fermé ce soir, réouverture demain à ${formatFr(RESTAURANT.services[0].open)}` };
}

function OpenStatus() {
  const [status, setStatus] = useState<Status | null>(null);
  useEffect(() => {
    setStatus(computeStatus());
    const id = window.setInterval(() => setStatus(computeStatus()), 60_000);
    return () => window.clearInterval(id);
  }, []);
  if (!status) return null;
  return (
    <p className={`open-status ${status.open ? "open-status-on" : "open-status-off"}`}>
      <span className="open-status-dot" aria-hidden="true" />
      {status.label}
    </p>
  );
}

export function Infos() {
  return (
    <section id="infos" className="infos">
      <div className="infos-details">
        <h2 className="section-title" data-split>
          Infos pratiques
        </h2>

        <ul className="infos-list" data-stagger>
          <li className="infos-item">
            <span className="infos-icon">
              <PhoneIcon />
            </span>
            <div>
              <span className="infos-label">Téléphone</span>
              <a href={RESTAURANT.phoneHref} className="infos-value infos-value-big">
                {RESTAURANT.phoneDisplay}
              </a>
            </div>
          </li>
          <li className="infos-item">
            <span className="infos-icon">
              <MailIcon />
            </span>
            <div>
              <span className="infos-label">E-mail</span>
              <a href={`mailto:${RESTAURANT.email}`} className="infos-value">
                {RESTAURANT.email}
              </a>
            </div>
          </li>
          <li className="infos-item">
            <span className="infos-icon">
              <PinIcon />
            </span>
            <div>
              <span className="infos-label">Adresse</span>
              <span className="infos-value">
                {RESTAURANT.address.street},<br />
                {RESTAURANT.address.postalCode} {RESTAURANT.address.city}
              </span>
              <a
                href={RESTAURANT.mapsDirections}
                target="_blank"
                rel="noreferrer noopener"
                className="cta-route"
              >
                <span>Itinéraire</span>
                <ArrowRightIcon />
              </a>
            </div>
          </li>
          <li className="infos-item">
            <span className="infos-icon">
              <ClockIcon />
            </span>
            <div>
              <span className="infos-label">Horaires</span>
              <span className="infos-value infos-hours">
                <strong>{RESTAURANT.hoursLabel}</strong>
                {RESTAURANT.services.map((s) => (
                  <span key={s.open} className="infos-hours-slot">
                    {formatFr(s.open)} <small>à</small> {formatFr(s.close)}
                  </span>
                ))}
              </span>
              <OpenStatus />
            </div>
          </li>
        </ul>
      </div>

      <div className="infos-map" data-reveal="right">
        <div className="infos-map-frame">
          <iframe
            src={RESTAURANT.mapsEmbed}
            title={`Plan d'accès, ${fullAddress()}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>
        <p className="infos-map-caption">
          Au cœur de Saint-Jean-de-Monts, à deux pas de la plage et du remblai.
        </p>
      </div>
    </section>
  );
}
