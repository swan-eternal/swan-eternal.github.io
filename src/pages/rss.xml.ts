/**
 * RSS feed.
 *
 * Hand-written rather than pulled from a package, so there are no extra
 * dependencies and the output format is completely visible. (ncase.me does
 * the same thing.)
 *
 * Astro runs this at build time: `astro build` writes dist/rss.xml.
 */
import { getCollection } from 'astro:content';

export async function GET({ site }: { site: URL }) {
  const posts = (await getCollection('blog', ({ data }) => !data.draft)).sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );

  const items = posts
    .map((post) => {
      const slug = post.id.replace(/\.md$/, '');
      const url = new URL(`/blog/${slug}/`, site).href;

      return `    <item>
      <title>${escapeXml(post.data.title)}</title>
      <link>${url}</link>
      <description>${escapeXml(post.data.description)}</description>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
      <guid isPermaLink="true">${url}</guid>
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <atom:link href="${new URL('/rss.xml', site).href}" rel="self" type="application/rss+xml"/>
    <title>Swanware</title>
    <link>${site.href}</link>
    <description>Notes on games, tools, hardware, and the occasional tangent.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}

/**
 * Escape the five XML special characters. Without this, an ampersand in a
 * post title produces a feed that no reader can parse.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
