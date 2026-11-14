/**
 * Build the Revelation Space cover image for the personal site.
 *
 *   node scripts/make-cover.mjs [sourceSvg] [outJpg]
 *
 * The source is the map's own region chart, rendered by the map repo:
 *
 *   cd ../revelation-space-map
 *   node scripts/make-cover.ts preview/cover-source.svg
 *
 * and this turns it into the 1280x720 JPEG the project cards use.
 *
 * Why a two-step pipeline across two repos: the chart belongs to the map
 * (it is that repo's renderer, that repo's data, that repo's astronomy),
 * and the image pipeline belongs to the site (sharp is already installed
 * here for Astro's own image optimization). Neither repo needs the
 * other's dependencies.
 *
 * The composition is the chart on the left at its natural square aspect,
 * and the title on the right — because a square chart cropped to 16:9
 * loses the systems at the edge of the neighbourhood, which are the ones
 * that make it a neighbourhood.
 */

import { readFileSync } from 'node:fs';
import sharp from 'sharp';

const WIDTH = 1280;
const HEIGHT = 720;
const CHART = 720;

const source = process.argv[2] ?? '../revelation-space-map/preview/cover-source.svg';
const out = process.argv[3] ?? 'src/content/projects/images/revelation-space.jpg';

/** The title block, drawn as SVG so the type is real vector type. */
function titlePanel() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH - CHART}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="#0b0e18"/>
  <g fill="#e9e9ec" font-family="Helvetica, Arial, sans-serif">
    <text x="64" y="300" font-size="46" font-weight="700" letter-spacing="1">REVELATION</text>
    <text x="64" y="352" font-size="46" font-weight="700" letter-spacing="1">SPACE</text>
  </g>
  <g fill="#8b93a7" font-family="Helvetica, Arial, sans-serif" font-size="19">
    <text x="64" y="404">The local neighbourhood,</text>
    <text x="64" y="432">and two and a half thousand years of it.</text>
  </g>
  <g fill="#5c6478" font-family="Helvetica, Arial, sans-serif" font-size="15" letter-spacing="2">
    <text x="64" y="500">A MAP OF THE REVELATION SPACE UNIVERSE</text>
  </g>
</svg>`;
}

const chart = await sharp(readFileSync(source), { density: 200 })
  .resize(CHART, CHART, { fit: 'contain', background: '#0b0e18' })
  .png()
  .toBuffer();

await sharp({
  create: {
    width: WIDTH,
    height: HEIGHT,
    channels: 3,
    background: '#0b0e18',
  },
})
  .composite([
    { input: chart, left: 0, top: 0 },
    { input: Buffer.from(titlePanel()), left: CHART, top: 0 },
  ])
  .jpeg({ quality: 88, chromaSubsampling: '4:4:4' })
  .toFile(out);

console.log(`Wrote ${out} — ${WIDTH}x${HEIGHT}`);
