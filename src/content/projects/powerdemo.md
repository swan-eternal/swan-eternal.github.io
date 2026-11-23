---
title: PowerDemo
description: A small power system you can operate — full Newton-Raphson power flow solved live in the browser. Open breakers, island the network, apply faults.
pubDate: 2026-11-23
kind: interactive
status: shipped
stats:
  - TypeScript
  - Newton-Raphson
  - zero runtime deps
links:
  - label: Open the demo
    url: https://swan-eternal.github.io/powerdemo/
  - label: Source
    url: https://github.com/swan-eternal/powerdemo
embeds:
  - title: PowerDemo — live one-line
    src: /powerdemo/
    height: 640
    caption: Live — the solver runs in the page. Click any bus, line, breaker, or generator.
---

## What it is

A seven-bus transmission system — grid tie, a generator, an industrial
load, a residential ring — with the full AC power flow solved in your
browser on every change. No server, no WASM, no libraries: the
Newton-Raphson solver, admittance model, and islanding logic are plain
TypeScript, warm-started from the previous solution so slider drags feel
instant.

## What you can do to it

Open breakers and watch islands de-energize and frequency drift on
droop. Apply a fault anywhere on a line and watch current rush in from
both terminals — each side animated at its own real infeed. Chase a
voltage sag with the generator's excitation until it hits its reactive
ceiling, then recover it with the cap banks or the LTC tap. Loads shed
the way real ones do as voltage sags.
