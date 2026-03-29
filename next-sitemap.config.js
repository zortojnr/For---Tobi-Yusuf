/**
 * Runs on `postbuild` after `next build` (including on Vercel). Outputs `public/sitemap.xml`
 * and `public/robots.txt` — those files are committed so `next dev` serves them without a prior build.
 * @type {import('next-sitemap').IConfig}
 */
module.exports = {
  siteUrl: "https://www.tobiyusuf.com",
  outDir: "public",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  autoLastmod: true,
  exclude: ["/api/*", "/plugins/*", "/_next/*", "/404"],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/plugins/"],
      },
    ],
    includeNonIndexSitemaps: true,
  },
  additionalPaths: async (config) => {
    return [
      {
        loc: "/",
        changefreq: "weekly",
        priority: 1,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/reflections",
        changefreq: "monthly",
        priority: 0.8,
        lastmod: new Date().toISOString(),
      },
      {
        loc: "/book/intentional-space",
        changefreq: "weekly",
        priority: 0.9,
        lastmod: new Date().toISOString(),
      },
    ];
  },
};
