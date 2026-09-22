import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportHiggsfieldError } from "../lib/higgsfield-error-reporting";
import { RESTAURANT, SITE_URL } from "../lib/restaurant";
// Page metadata (browser <title>/favicon + social og: tags) committed into the
// repo and read at BUILD time — no runtime fetch.
import appMetaJson from "../app-meta.json";

declare const __HF_DESIGN_INSPECTOR__: boolean;

const DEFAULT_TITLE = `${RESTAURANT.name} · ${RESTAURANT.kind} à ${RESTAURANT.address.city}`;
const DEFAULT_DESCRIPTION =
  "Restaurant vietnamien à Saint-Jean-de-Monts. Cuisine traditionnelle, produits frais, sur place et à emporter.";

const FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@500;600;700&family=Great+Vibes&family=Oswald:wght@400;500;600&family=Poppins:wght@300;400;500;600&display=swap";

type AppMeta = {
  og_title?: string | null;
  og_description?: string | null;
  og_image_url?: string | null;
  favicon_url?: string | null;
  og_video_url?: string | null;
};

const appMeta = appMetaJson as AppMeta;

// Social scrapers need absolute image URLs: root-relative paths from
// app-meta.json are resolved against the site's public origin.
function toAbsoluteUrl(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.startsWith("/")) return `${SITE_URL}${value}`;
  try {
    const u = new URL(value);
    return u.toString();
  } catch {
    return value;
  }
}

function buildHead(meta: AppMeta) {
  const title = meta.og_title ? `${meta.og_title} · ${RESTAURANT.kind} à ${RESTAURANT.address.city}` : DEFAULT_TITLE;
  const description = meta.og_description ?? DEFAULT_DESCRIPTION;
  const ogImage = toAbsoluteUrl(meta.og_image_url);
  const favicon = meta.favicon_url ?? null;
  const ogVideo = toAbsoluteUrl(meta.og_video_url);

  return {
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title },
      { name: "description", content: description },
      { name: "author", content: RESTAURANT.name },
      { name: "theme-color", content: "#F4EBDB" },
      { property: "og:site_name", content: RESTAURANT.name },
      { property: "og:locale", content: "fr_FR" },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "restaurant.restaurant" },
      { property: "og:url", content: `${SITE_URL}/` },
      { name: "twitter:card", content: ogImage ? "summary_large_image" : "summary" },
      ...(ogImage
        ? [
            { property: "og:image", content: ogImage },
            { property: "og:image:width", content: "1200" },
            { property: "og:image:height", content: "630" },
            { name: "twitter:image", content: ogImage },
          ]
        : []),
      ...(ogVideo ? [{ property: "og:video", content: ogVideo }] : []),
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" as const },
      { rel: "stylesheet", href: FONTS_HREF },
      { rel: "stylesheet", href: appCss },
      ...(favicon ? [{ rel: "icon", href: favicon, type: "image/png" }] : []),
      ...(favicon ? [{ rel: "apple-touch-icon", href: favicon }] : []),
    ],
  };
}

function NotFoundComponent() {
  return (
    <div className="status-page">
      <p className="status-page-code">404</p>
      <h1>Cette page n'existe pas</h1>
      <p>Le lien que vous avez suivi ne mène nulle part. Retrouvez-nous sur la page d'accueil.</p>
      <a href="/" className="status-page-link">
        Retour à l'accueil
      </a>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportHiggsfieldError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="status-page">
      <h1>La page n'a pas pu s'afficher</h1>
      <p>Un problème est survenu de notre côté. Vous pouvez réessayer ou revenir à l'accueil.</p>
      <div className="status-page-actions">
        <button
          type="button"
          className="status-page-link"
          onClick={() => {
            router.invalidate();
            reset();
          }}
        >
          Réessayer
        </button>
        <a href="/" className="status-page-link status-page-link-ghost">
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => buildHead(appMeta),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="fr" style={{ colorScheme: "light" }}>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  useEffect(() => {
    if (!__HF_DESIGN_INSPECTOR__) {
      return;
    }

    void import("../module/design-inspector/runtime")
      .then(({ installHiggsfieldDesignInspector }) => {
        installHiggsfieldDesignInspector();
      })
      .catch((error) => {
        reportHiggsfieldError(
          error instanceof Error ? error : new Error("Failed to load design inspector"),
          {
            boundary: "higgsfield_design_inspector_import",
          },
        );
      });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
