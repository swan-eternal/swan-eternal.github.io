import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/**
 * Two collections, mirroring the two halves of the site:
 *
 *   projects/  -> the "Digital" / "Physical" grids
 *   blog/      -> the "Writing" list
 *
 * Each collection uses the `glob` loader (reads a folder of Markdown files
 * at build time) plus a Zod schema. The schema is the important part: it
 * validates frontmatter at build time, so a typo like `pubData:` fails the
 * build with a clear message instead of rendering a broken page.
 */

/** Shared shape for the links under a project (repo, demo, write-up...). */
const linkSchema = z.object({
  label: z.string(),
  url: z.string(),
});

/** An embedded interactive widget: an in-browser game or a data visualization. */
const embedSchema = z.object({
  title: z.string(),
  // Where the widget lives. Usually a path on another repo of yours
  // (e.g. /astro-rescue/) or an absolute itch.io / project-page URL.
  src: z.string(),
  // Height of the iframe in CSS pixels.
  height: z.number().default(420),
  // Optional note rendered under the frame, e.g. "Controls: drag to rotate".
  caption: z.string().optional(),
});

const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // One line, shown on the project card. Keep it to a single sentence.
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),

      // Which grid the project appears in:
      //   game       -> "Digital"
      //   interactive-> "Digital" (data viz, small web apps)
      //   software   -> "Digital"
      //   physical   -> "Physical" (machined parts, rigs, gear)
      kind: z.enum(['game', 'interactive', 'software', 'physical']),

      // Where the work stands. Shown as a small badge.
      status: z.enum(['shipped', 'in-progress', 'experiment']).default('experiment'),

      // Short, concrete facts — the "Stats: 400+ signups | 2k+ users" line
      // borrowed from saadpasta's card design. e.g. ["Godot 4", "2026", "itch.io"]
      stats: z.array(z.string()).default([]),

      // Card thumbnail. Optimized to WebP at build time by astro:assets.
      // Keep the source image in this project's folder and reference it
      // relatively (e.g. "./cover.png").
      cover: image().optional(),

      // Extra photos for the project page. Plain URLs — put them in public/
      // if you want them untouched, or reference them relatively if you
      // want Astro to optimize them too.
      photos: z.array(z.string()).default([]),

      // YouTube video ID (the part after youtube.com/watch?v=). Rendered as a
      // click-to-load embed so YouTube's ~1 MB of iframe JS only loads on
      // click, and with youtube-nocookie for privacy.
      videoId: z.string().optional(),

      // Interactive embeds: an in-browser game, a chart, a small web app.
      embeds: z.array(embedSchema).default([]),

      // Outbound links (source repo, download, itch.io page, write-up).
      links: z.array(linkSchema).default([]),
    }),
});

const blog = defineCollection({
  // .mdx files are Markdown that can import Astro components.
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      // Free-form tags, e.g. ["godot", "scada"].
      tags: z.array(z.string()).default([]),
      // Optional cover for the post header.
      cover: image().optional(),
      // Set true to hide the post from the blog list while keeping the page
      // live (useful for drafts you want to share with one person).
      draft: z.boolean().default(false),
    }),
});

export const collections = { projects, blog };
