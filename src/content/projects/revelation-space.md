---
title: Revelation Space
description: An interactive map and timeline of Alastair Reynolds' Revelation Space universe — scrub nearly nine centuries of events, trace a character or a ship, drill from the region chart down to the Glitter Band.
pubDate: 2026-07-15
kind: interactive
status: in-progress
stats:
  - Timewright
  - TypeScript
  - "2026"
cover: "./images/revelation-space.jpg"
links:
  - label: Open the map
    url: https://swan-eternal.github.io/revelation-space/
  - label: Built with Timewright
    url: https://github.com/swan-eternal/timewright
embeds:
  - title: Revelation Space — interactive map
    src: /revelation-space/
    height: 760
    caption: "Live — 'Open full screen' in the top bar opens the standalone map."
---

## What it is

Twelve maps across three scales: a region chart of the local
neighbourhood, ten star systems, and Yellowstone as its own map — the
Glitter Band's habitats ringing the planet, Chasm City on the disc.
Every event — 37, from 2083 to 2950 — is pinned to a place. 47
locations, 17 characters and ships.

## What you can do to it

Scrub the timeline or brush a span. Trace a character or a ship and
step through the events of its life one at a time — the map focuses
each one. Drill down follows the story: region → system → planet, and
the Yellowstone pin opens the Glitter Band.

## How it's built

One Timewright world: maps, locations, characters, events as YAML,
validated and baked to a static site. The system maps generate from a
spec — real stellar classes, orbits, belts — and regenerate
byte-identical, so pins never drift. No backend, no database: nothing
on the live site can be written to.
