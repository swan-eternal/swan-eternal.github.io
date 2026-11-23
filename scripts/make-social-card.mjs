/**
 * Build the site social card (og:image / twitter:image).
 *
 *   node scripts/make-social-card.mjs
 *
 * Minimal on purpose: dark gradient, the name, a one-line tagline —
 * same restraint as the site itself. Regenerate whenever the name or
 * tagline changes.
 */

import sharp from 'sharp';

const WIDTH = 1200;
const HEIGHT = 630;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#1a1d27"/>
      <stop offset="1" stop-color="#0b0e18"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <text x="96" y="322" fill="#fdfdfc" font-family="Helvetica, Arial, sans-serif"
        font-size="60" font-weight="700" letter-spacing="2">Swanware</text>
  <text x="100" y="378" fill="#8b93a7" font-family="Helvetica, Arial, sans-serif"
        font-size="26">Engineer · game developer · tinkerer</text>
</svg>`;

await sharp(Buffer.from(svg)).png().toFile('public/social-card.png');
console.log(`Wrote public/social-card.png — ${WIDTH}x${HEIGHT}`);
