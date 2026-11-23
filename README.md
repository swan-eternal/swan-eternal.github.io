# Personal site

A static site built with [Astro](https://astro.build/). Project showcases,
blog posts, and embedded interactive experiments — games, data visualizations,
small web apps.

No trackers, no cookie banner, no client-side framework unless a page
actually needs one.

## Running it

```bash
npm install
npm run dev      # dev server at http://localhost:4321
npm run build    # static output into dist/
npm run preview  # serve the built output locally
```

## Layout

```
src/
  content.config.ts   Schema for the blog and projects collections
  content/
    blog/             One Markdown file per post (.md or .mdx)
    projects/         One Markdown file per project + images/
      images/         Cover images, optimized at build time
  components/         Reusable pieces: cards, video embed, iframe embed
  layouts/            BaseLayout.astro — the <head>, header, footer
  pages/              Routes. [...slug].astro files read from collections
  styles/global.css   All global styles
public/               Copied to the site root as-is. Photos you don't want
                      processed go here.
```

## Adding things

**A blog post** — create `src/content/blog/my-post.md`:

```markdown
---
title: My post
description: One line, shown in the blog list.
pubDate: 2026-11-11
tags: [godot]
---

Body goes here.
```

Save it and the post exists. The schema in `src/content.config.ts` will fail
the build if a field is missing or misspelled, so mistakes surface before
they go live.

**A project** — create `src/content/projects/my-project.md`:

```markdown
---
title: My project
description: One line, shown on the card.
pubDate: 2026-11-11
kind: game              # game | interactive | software | physical
status: experiment      # shipped | in-progress | experiment
stats: [Godot 4, "2026"]
cover: "./images/my-project.jpg"
links:
  - label: Source
    url: https://github.com/
---

The long description.
```

`kind` decides which grid the project lands in on the homepage:
`game` and `interactive` go under "Things you can play"; `software` and
`physical` go under "Things I've built".

**A photo** — put it in `src/content/projects/images/` and reference it
relatively (`cover: "./images/name.jpg"`). Astro converts it to WebP at
build time and generates responsive sizes. For images you want untouched,
put them in `public/photos/` and reference `/photos/name.jpg`.

## Interactive embeds

Games and data visualizations live in their own repositories, each published
by GitHub Pages under this site's domain. See [The embeds are separate
repositories](#the-embeds-are-separate-repositories) below.

## Deploying

Build with `npm run build`; the output in `dist/` is a plain static folder.
GitHub Actions publishes it to GitHub Pages on every push to `main` —
`.github/workflows/deploy.yml` builds, uploads the artifact and deploys
it. No credentials needed: the workflow uses GitHub's built-in token.

`public/.nojekyll` is copied into the build output. It matters for the
older branch-based publishing path — without it GitHub's Jekyll build
skips the `_astro` directory and every stylesheet and script 404s.

### How an update reaches the live site

1. Edit whatever the change is — a blog post, a project page, a photo.
2. `git commit` && `git push`.
3. The workflow builds and deploys. A minute or two later it is live.

Nothing here needs a local build, and nothing needs credentials in the
repository.

### The site URL

One value depends on where the site is published: the canonical origin. It
comes from the `SITE_URL` environment variable, with a fallback in
`astro.config.mjs` for local builds:

```bash
SITE_URL=https://your-domain.example npm run build
```

`SITE_URL` drives every absolute URL in the output — `<link rel="canonical">`,
the `og:url` social tag, and the item links in `rss.xml`. Set it in the
deploy workflow and the same source builds for any account or domain. Nothing
else in the project references a hostname.

In the workflow it comes from a repository variable, so switching to a
custom domain is a settings change rather than a code change: **Settings
→ Secrets and variables → Actions → Variables → `SITE_URL`**.

For GitHub Pages to serve the site at the **apex** domain
(`https://your-domain.example` rather than `https://your-handle.github.io`),
the repository must be named `<your-handle>.github.io` and Pages must have
the custom domain set in the repo's settings.

## The embeds are separate repositories

Each embedded widget — the games, the data visualisations, the map —
lives in its own repository and is published by GitHub Pages under this
site's domain:

```
your-domain.com/                 <- this repo
your-domain.com/astro-rescue/    <- the astro-rescue repo
your-domain.com/powerdemo/       <- the powerdemo repo
your-domain.com/revelation-space/ <- the revelation-space-map repo
```

GitHub Pages inherits the custom domain from your user site, so a project
repo needs no configuration beyond turning Pages on. The main site embeds
them with an iframe (see `src/components/EmbedFrame.astro`), which also
tells the frame when it's on screen so it can pause its animation.

**The useful consequence: changing an embed never rebuilds this site.**
A project repo pushes its own change, its own workflow deploys it, and
the iframe here picks it up on the next load. The embed URL does not
change, so nothing in this repo has to move.

The flip side: the path an embed lives at is the **name of its
repository**. A repo called `revelation-space` is published at
`/revelation-space/`. Rename the repo and the path changes with it.

Until a project repo is published, a stub in `public/<name>/` holds the
path so the embed does not 404. The stub is shadowed by the real
repository once it goes live — the repository takes precedence over a
directory of the same name in this repo — and it can be deleted then.


### The site URL

One value depends on where the site is published: the canonical origin. It
comes from the `SITE_URL` environment variable, with a fallback in
`astro.config.mjs` for local builds:

```bash
SITE_URL=https://your-domain.example npm run build
```

`SITE_URL` drives every absolute URL in the output — `<link rel="canonical">`,
the `og:url` social tag, and the item links in `rss.xml`. Set it in the
deploy workflow and the same source builds for any account or domain. Nothing
else in the project references a hostname.

For GitHub Pages to serve the site at the **apex** domain
(`https://your-domain.example` rather than `https://your-handle.github.io`),
the repository must be named `<your-handle>.github.io` and Pages must have
the custom domain set in the repo's settings.

## Version pins, and why

`package.json` pins exact versions rather than ranges. Two constraints
forced this:

- **Astro 6.4.8, not 7.x.** Astro 7 ships a native Rust compiler
  (`@astrojs/compiler-rs`) built with BMI1 instructions (`andn`, `shlx`,
  `tzcnt`). Older CPUs — Haswell (2013) or newer — are required, and the
  build dies with `Illegal instruction` on anything older. Astro 6 uses the
  WebAssembly compiler, so it has no native binary and runs anywhere.
- **Node 22.22+.** Astro 7.4.2 and later require Node >= 22.23.4.

If you build on a newer machine, or upgrade Node, you can move to Astro 7 by
changing the two version numbers in `package.json` and re-running
`npm install`. Nothing in the source depends on the Astro 6 API.

The `overrides` block pins two transitive dependencies for the same reason:
`@astrojs/prism` and `@astrojs/telemetry` both raised their Node floor to
22.23.4 in later releases.
