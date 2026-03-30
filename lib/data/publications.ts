/**
 * Press / “as seen in” outlets. Logo files live under public/assets/images/
 * (or public/assets/logos/press/); set logoSrc to the public URL path.
 */

export type FeaturedPublication = {
  id: string;
  /** Display name (also used for alt text and text fallback when no logo) */
  name: string;
  /** Public URL path under /public, e.g. "/assets/logos/press/the-sun.svg" */
  logoSrc?: string;
  /** Optional link to a feature article */
  href?: string;
};

export const FEATURED_PUBLICATIONS: FeaturedPublication[] = [
  { id: "the-sun", name: "The Sun", logoSrc: "/assets/images/logo1.jpg" },
  { id: "stylist", name: "Stylist", logoSrc: "/assets/images/logo2.jpg" },
  { id: "the-times", name: "The TIMES", logoSrc: "/assets/images/logo3.png" },
  { id: "bellanaija", name: "Bellanaija", logoSrc: "/assets/images/logo4.png" },
  { id: "ipaper", name: "iPaper", logoSrc: "/assets/images/logo5.jpeg" },
  { id: "logo6", name: "Press", logoSrc: "/assets/images/logo6.jpeg" },
];
