# Press logos

Add logo files here, then set `logoSrc` in `lib/data/publications.ts` (repo root) for each outlet.

Suggested paths (public URL = path below with leading slash):

| File | Publication |
|------|-------------|
| `the-sun.svg` or `.png` | The Sun |
| `stylist.svg` | Stylist |
| `the-times.svg` | The TIMES |
| `bellanaija.svg` | Bellanaija |
| `ipaper.svg` | iPaper |

Example entry:

```ts
{ id: "the-sun", name: "The Sun", logoSrc: "/assets/logos/press/the-sun.svg" },
```

Use SVG or transparent PNG; wide logos work best with `object-fit: contain` (already applied).
