/**
 * Gallery assets under /public/assets/images.
 * Many paths are intentionally reused in two places; see per-key comments where relevant.
 */
export const SITE_IMAGES = {
  /** Brand mark: SiteFooter; Speaking / Reflections hero backgrounds */
  siteLogo: "/assets/images/logo.jpeg",
  /** Circular favicon + Apple touch icon (see app/layout.tsx metadata.icons); regenerate via `node scripts/generate-favicons.mjs` */
  favicon: "/assets/images/favicon.png",
  appleTouchIcon: "/assets/images/apple-touch-icon.png",
  img1: "/assets/images/1.jpg",
  img2: "/assets/images/2.jpg",
  img3: "/assets/images/3.jpg",
  img4: "/assets/images/4.jpg",
  img5: "/assets/images/5.jpg",
  /** Home hero background — LandingView */
  img6: "/assets/images/6.jpg",
  gson8453: "/assets/images/GSON8453.JPG",
} as const;
