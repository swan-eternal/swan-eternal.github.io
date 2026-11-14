// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// The canonical origin for the site: where it's actually published.
//
// This is the ONE value in the project that depends on which account or
// domain the site lives under, so it reads from the environment instead of
// being hardcoded. Switching accounts later means setting SITE_URL in the
// deploy workflow — no source edit, no hunt through the config.
//
//   SITE_URL=https://your-domain.example npm run build
//
// The fallback below is used for local builds so `npm run dev` and
// `npm run build` work with no environment set up.
//
// GitHub Pages apex: if the account is `your-handle`, the repo must be
// named `your-handle.github.io` for the site to serve at the root domain.
const SITE_URL = process.env.SITE_URL ?? 'https://swan-eternal.github.io';

// The path the site is served from. A user site named <handle>.github.io
// is served from the root, so this is '/' for the normal case. It is
// here because a site published as a PROJECT repo is served from a
// subdirectory, and every asset URL has to know that.
const BASE_PATH = process.env.BASE_PATH ?? '/';

export default defineConfig({
  site: SITE_URL,
  base: BASE_PATH,

  // MDX is Markdown plus components. A post can import ExpandableTerm and
  // drop it inline in a paragraph. That's what makes a technical blog
  // comfortable to read — a term opens into its own explanation instead of
  // sending the reader to a glossary page.
  integrations: [mdx()],

  // Image optimization is build-time only, so it works on any static host.
  // Uncomment to serve AVIF as well as WebP (smaller files, slightly slower build).
  // image: {
  //   responsiveStyles: true,
  // },

  // `output: 'static'` is the default; leaving it out means the same thing.
  // If a project later needs a backend (leaderboards, saved progress),
  // switch to 'server' and add the Cloudflare adapter — but stay static
  // as long as you can.
});
