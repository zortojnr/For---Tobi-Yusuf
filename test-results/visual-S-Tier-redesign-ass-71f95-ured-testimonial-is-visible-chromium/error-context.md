# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: visual.spec.ts >> S-Tier redesign assertions >> featured testimonial is visible
- Location: e2e\visual.spec.ts:25:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test.describe("S-Tier redesign assertions", () => {
> 4  |   test.beforeEach(async ({ page }) => {
     |        ^ Test timeout of 30000ms exceeded while running "beforeEach" hook.
  5  |     await page.goto("/");
  6  |   });
  7  | 
  8  |   test("hero headline uses clip-path reveal (no span children)", async ({ page }) => {
  9  |     const h1 = page.locator(".hero-headline");
  10 |     await expect(h1).toBeVisible();
  11 |     const spanCount = await h1.locator("span").count();
  12 |     expect(spanCount).toBe(0);
  13 |   });
  14 | 
  15 |   test("work pillar index elements — count is 3", async ({ page }) => {
  16 |     const indices = page.locator(".work-pillar-index");
  17 |     await expect(indices).toHaveCount(3);
  18 |   });
  19 | 
  20 |   test("featured offer card — exactly 1", async ({ page }) => {
  21 |     const featured = page.locator(".offer-card--featured");
  22 |     await expect(featured).toHaveCount(1);
  23 |   });
  24 | 
  25 |   test("featured testimonial is visible", async ({ page }) => {
  26 |     const testimonial = page.locator(".testimonial-featured");
  27 |     await expect(testimonial).toBeVisible();
  28 |   });
  29 | 
  30 |   test("contact split visual is removed", async ({ page }) => {
  31 |     const splitVisual = page.locator(".contact-split-visual");
  32 |     await expect(splitVisual).toHaveCount(0);
  33 |   });
  34 | 
  35 |   test("footer wordmark text is visible", async ({ page }) => {
  36 |     const wordmark = page.locator(".footer-wordmark-text");
  37 |     await expect(wordmark).toBeVisible();
  38 |   });
  39 | 
  40 |   test("no horizontal overflow on desktop", async ({ page }) => {
  41 |     const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  42 |     const viewportWidth = await page.evaluate(() => window.innerWidth);
  43 |     expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 2);
  44 |   });
  45 | 
  46 |   test("no horizontal overflow on mobile (390px)", async ({ page }) => {
  47 |     await page.setViewportSize({ width: 390, height: 844 });
  48 |     await page.goto("/");
  49 |     // Use window.scrollX after scrolling left to check for real user-scrollable overflow.
  50 |     // document.body.scrollWidth is inflated by clipped marquee children even when
  51 |     // html { overflow-x: clip } prevents actual scrolling.
  52 |     const canScrollHorizontally = await page.evaluate(() => {
  53 |       window.scrollBy(9999, 0);
  54 |       return window.scrollX;
  55 |     });
  56 |     expect(canScrollHorizontally).toBe(0);
  57 |   });
  58 | 
  59 |   test("subscribe form submit button is enabled", async ({ page }) => {
  60 |     const submitBtn = page.locator(".shimmer-button, .love-reset-slide-submit").first();
  61 |     await expect(submitBtn).toBeEnabled();
  62 |   });
  63 | });
  64 | 
```