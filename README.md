# Tobi Yusuf — Premium landing (Next.js)

Luxury editorial single-page site: marriage, relationships, and experiences. Built with **Next.js App Router**, brand tokens in [`app/globals.css`](app/globals.css), and **server-side ConvertKit** via [`app/api/subscribe/route.ts`](app/api/subscribe/route.ts).

## Run locally

```bash
npm install
cp .env.example .env.local
# Edit .env.local — at minimum set CONVERTKIT_API_KEY and form IDs (or DEFAULT_FORM_ID for testing)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Production

```bash
npm run build
npm start
```

## Content & data (easy edits)

| File | Purpose |
|------|---------|
| [`lib/data/prices.ts`](lib/data/prices.ts) | Offer prices (`PRICES`) — confirm with Tobi before launch |
| [`lib/data/reflections.ts`](lib/data/reflections.ts) | Reflection cards (`reflections[]`) |
| [`lib/data/site.ts`](lib/data/site.ts) | `INTENTIONAL_SPACE_REMAINING_PLACES`, public URL env wiring |

## ConvertKit

- The browser **never** receives `CONVERTKIT_API_KEY`.
- `POST /api/subscribe` with JSON: `{ "intent": "...", "email": "...", "firstName": "..." }` and optional `fields` for custom fields (used by the booking page).
- Map each `intent` to a **form ID** in `.env.local` (or set `CONVERTKIT_DEFAULT_FORM_ID` for a single test form).
- Optional: set `CONVERTKIT_TAG_ID_*` env vars to also call the [tag subscribe](https://developers.convertkit.com/#tag-a-subscriber) endpoint.

### Intents → brief tags (configure in Kit)

| intent | Tag (from brief) |
|--------|-------------------|
| `love-reset` | Love Reset Download |
| `intentional-space` | Intentional Space |
| `ct-collab` | CT Collaboration |
| `forever-day` | Forever & A Day |
| `forever-table` | Forever Table |
| `circle` | Real Marriages Circle |
| `speaking` | Speaking |
| `general` | General Enquiry |
| `newsletter` | Newsletter |

## UPDATE checklist before go-live

- [ ] Intentional Space booking form: in ConvertKit, set **Subscriber notification** for that form to `bookings@tobiyusuf.com`
- [ ] Ensure `CONVERTKIT_FORM_INTENTIONAL_SPACE` matches the fields defined in `content/intentional-space-booking.md`
- [ ] Substack subscribe + article URLs → `NEXT_PUBLIC_SUBSTACK_URL` and `reflections[].substackUrl`
- [ ] Instagram → `NEXT_PUBLIC_INSTAGRAM_URL`
- [ ] Confirmed prices in [`lib/data/prices.ts`](lib/data/prices.ts)
- [ ] `INTENTIONAL_SPACE_REMAINING_PLACES` in [`lib/data/site.ts`](lib/data/site.ts)
- [ ] Real testimonials (placeholders in [`components/landing/LandingView.tsx`](components/landing/LandingView.tsx))
- [ ] ConvertKit API key + form IDs in `.env.local` (never commit)
- [ ] Optional: add `tobi_yusuf_landing.html` to the repo and visually diff against this build

## Env files

`.env.local` is ignored via `.gitignore` (`.env*`). Copy from [`.env.example`](.env.example).
