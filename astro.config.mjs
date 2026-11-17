import { fileURLToPath } from 'node:url';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, envField } from 'astro/config';
import { loadEnv } from 'vite';
import { blogPlaceholders } from './src/config/blog-placeholders.ts';
import { caseStudies } from './src/config/case-studies.ts';
import { DEFAULT_SITE_URL } from './src/config/defaults.ts';

const mode = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const env = loadEnv(mode, process.cwd(), '');
const site = (env.SITE_URL || process.env.SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
const placeholderSlugs = new Set(caseStudies.filter((study) => study.placeholder).map((study) => study.slug));
const placeholderBlogSlugs = new Set(blogPlaceholders.map((post) => post.slug));

export default defineConfig({
  site,
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  env: {
    schema: {
      // Server-only WordPress REST config — never exposed as PUBLIC_.
      WORDPRESS_API_URL: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
      WORDPRESS_API_KEY: envField.string({
        context: 'server',
        access: 'secret',
        optional: true,
      }),
    },
  },
  integrations: [
    react(),
    sitemap({
      filter: (page) => {
        const path = new URL(page).pathname.replace(/\/$/, '');
        if (path === '/404' || path.endsWith('/404')) return false;
        if (/\.txt$/.test(path)) return false;
        const slug = path.split('/').pop() ?? '';
        if (path.startsWith('/case-studies/') && placeholderSlugs.has(slug)) return false;
        if (path.startsWith('/blog/') && placeholderBlogSlugs.has(slug)) return false;
        return true;
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
