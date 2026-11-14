---
title: Revelation Space
description: An interactive map and timeline of Alastair Reynolds' Revelation Space universe — pick a character or a ship and step through two and a half thousand years of it.
pubDate: 2026-07-15
kind: interactive
status: in-progress
stats:
  - Astro
  - TypeScript
  - "2026"
cover: "./images/revelation-space.jpg"
embeds:
  - title: Revelation Space — interactive map
    src: /revelation-space/
    height: 760
    caption: Placeholder embed. A real one points at the map's own GitHub Pages repo — same URL, so this line does not change when the real build lands.
---

## The idea

Alastair Reynolds' Revelation Space universe is mostly told through
characters moving between places. The Glitter Band collapses. The
Scorpius runs for Aral Vorkosigan and comes back wrong. Ana Khouri walks
into Chasm City and the century she arrives in turns on itself.

A list of events does not show any of that. What shows it is a **map you
can move through in time**: pick a character or a ship, and watch where
they are, year by year, with the places themselves changing state around
them.

So the map's central idea is that **time is a first-class thing you
scrub**, not a filter applied afterwards. The Glitter Band does not have
an event called "collapse" — it has a condition that lasts decades, and
the chart shades it by whichever condition contains the current year. A
dot cannot turn from thriving to ruined; a shaded place can.

## What it is

A static site. No backend, no database, no server — the dataset is baked
at build time and the whole thing deploys to any static host.

- **A sky chart** of the local neighbourhood, the ten star systems at
  their real positions and real distances. Only this one view carries
  real numbers; everything below it is schematic, because the canon fact
  is the attachment ("orbiting Yellowstone"), not the distance.
- **Three scales** — region, star system, planet. Drilling into a system
  shows its planets on exaggerated orbits, because fitting them on one
  screen matters more than being right about AU.
- **A shared timeline** with event ticks, a brush-to-zoom strip over the
  whole span, and a presence track for the entity being traced.
- **The beat stepper** — step through a character's life one decisive
  moment at a time, with the map focusing in place rather than switching
  scene, so the journey stays on one chart.

## The data is the point

Every node in the universe is one file under `data/nodes/`, and every
reference in those files is a **name** rather than an id, resolved at
build time. The resolver never guesses: an exact name wins only among
nodes of a plausible kind, and an unknown name is an error with
suggestions. A misspelled place fails the build instead of quietly
leaving a hole in a character's life.

Vessels carry **voyages** as well as presence intervals. A presence says
where a thing is; a voyage says where it is *going*, and when each end
happened — which is how a ship that left Sol in 2083 and did not reach
61 Cygni until the twenty-third century can still be placed on the chart
for the two centuries in between.

## What I learned

The hard part was never the drawing. It was making the data able to say
things it should not be able to say.

A character's presence cannot outrun the ship it is aboard. That rule
catches the mistake that matters most — a passenger riding a vessel that
wasn't there — but it only works if the rule knows what a voyage is. The
moment voyages existed, that rule had to learn about them, and every
check that reasons about "where was it" had to be re-read. A rule that a
feature silently invalidates is worse than a missing feature, because
the content you write against it gets rejected for no visible reason.

The other one: **the deployed site has no write path at all.** The author
tool that writes the data is a local-only app on a loopback address that
is never built into anything. That is the property that makes the map
safe to publish — a visitor cannot add an event however they try.

## Source

The plan, the research and the data live in a separate repository. The
cover image on this page is the map's own chart, rendered by the same
code the site uses.
