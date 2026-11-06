# OWII website (Next.js)

Confidential. Sample content only; no real names, dates or photos are included.

## Run locally

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3000
npm run build && npm start   # production check
```

## Assets

Drop the client's files into `public/assets/`:

- `logo.png` (header and footer)
- `globe.png` (hero, transparent background, about 1200 px square)

Until they exist, the site shows drawn placeholders.

## Structure

- `app/` pages, SEO (`robots.ts`, `sitemap.ts`), the newsletter API route
- `components/` the homepage sections (client components only where interaction is needed)
- `lib/content.ts` content layer. Replace each function with a Sanity query when the CMS is connected
- `sanity/schemas/` content models for Research, Insights, Events, People and Focus Areas
- `next.config.mjs` security headers (CSP, HSTS, frame, referrer and permissions policies)

## Security notes

- The site stays `noindex` and blocked in `robots.txt` until `NEXT_PUBLIC_ALLOW_INDEXING=true`. Set it only at launch.
- Secrets live in Vercel environment variables, never in the repo.
- The newsletter endpoint validates input, has a honeypot and a basic rate limit. Before launch: add Cloudflare Turnstile verification and connect the email service (marked TODO in `app/api/newsletter/route.ts`). Until `EMAIL_PROVIDER_API_KEY` is set it runs in demo mode and stores nothing.
- CSP currently allows inline scripts (needed by Next.js). Moving to a nonce-based CSP is a planned hardening step.
- Analytics must load only after the visitor accepts cookies: listen for the `owii:consent` event.
- Turn on 2FA for GitHub, Vercel, Sanity, Cloudflare and the domain registrar.

## Deploy (Vercel)

1. Push to a private GitHub repo owned by the client.
2. Import it in Vercel, add the environment variables from `.env.example`.
3. Add the domain in Vercel; point DNS (Cloudflare) as Vercel instructs.
4. Set `NEXT_PUBLIC_SITE_URL`, and flip `NEXT_PUBLIC_ALLOW_INDEXING` to `true` at launch.
