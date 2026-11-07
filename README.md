# VectorCodex

Production marketing site for VectorCodex, a UK-focused agency for SEO, web development, and digital marketing.

The site is a static Astro build. React is used only for the mobile menu and the contact form. Blog posts are fetched from the WordPress REST API at build time.

## Requirements

- Node.js 22.23.4 or newer (required by Astro 7)
- npm 10 or newer

## Setup

```bash
npm install
cp .env.example .env
npm run dev
```

On Windows PowerShell, copy the example env file with `Copy-Item .env.example .env`.

## Scripts

| Script | Purpose |
| --- | --- |
| `npm run dev` | Local development |
| `npm run build` | Static production build |
| `npm run preview` | Preview the production build |
| `npm run check` | Astro and TypeScript checks |
| `npm run lint` | ESLint |

## Environment variables

| Name | Scope | Purpose |
| --- | --- | --- |
| `SITE_URL` | Server | Canonical origin, sitemap, Open Graph, and `llms.txt`. No trailing slash. |
| `WORDPRESS_API_URL` | Server | WordPress origin or `/wp-json` URL. Public REST works with this alone. |
| `WORDPRESS_API_KEY` | Server secret | Optional `Bearer` token, or a full `Basic ...` application-password value. Never prefix with `PUBLIC_`. |
| `PUBLIC_CONTACT_ENDPOINT` | Public | Optional URL that accepts `POST` form data from the contact form. |

Leave the WordPress variables empty to build the site with an empty journal. Articles, authors, categories, excerpts, featured images, and HTML are read on the server, sanitised, and written to static pages. Rebuild the site to publish new posts.

`WORDPRESS_API_KEY` is read only in server code and is not exposed to the browser.

## Routes

- `/` Home
- `/about/`
- `/services/` and the service pages: `/services/seo/`, `/services/technical-seo/`, `/services/local-seo/`, `/services/ecommerce-seo/`, `/services/ai-seo/`, `/services/web-development/`, `/services/wordpress-development/`, `/services/digital-marketing/`
- `/case-studies/` and `/case-studies/[slug]/`
- `/blog/`, `/blog/page/[page]/`, `/blog/[slug]/`
- `/contact/`
- `/privacy-policy/`
- `/robots.txt`, `/sitemap-index.xml`, `/llms.txt`, `/llms-full.txt`

Case study entries in `src/config/case-studies.ts` are placeholders. They are marked noindex and omitted from the sitemap until `placeholder` is set to `false` and real, sourced copy replaces them.

## Brand

Colours and the logo in `public/logo/vectorcodex.webp` are part of the brand system. Do not redraw the logo file.

## Stack

Astro, React, TypeScript, Tailwind CSS, Framer Motion, Lucide, and the WordPress REST API.
