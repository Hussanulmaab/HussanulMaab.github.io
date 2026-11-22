---
layout: post
title: From hex codes to color cubes
date: 2026-10-12
description: >
  What `#FF5733` actually means, and why every color on your screen
  lives inside a 3D cube.
tags: [color, visualization]
---

If you have ever touched CSS, a design tool, or a paint app, you have seen strings like `#FF5733`. They look cryptic, but they are just three numbers wearing a disguise. Once you see them as numbers, a much nicer picture appears: every color your screen can show is a point inside a cube.
{:.lead}

1. this list will be replaced by the toc
{:toc}

## Light, not paint

Your screen is a grid of tiny lights, and each pixel has three of them: red, green and blue. Mixing light is *additive*. Red plus green light gives yellow, all three at full strength give white, and all three off give black. So to describe a color, we only need to say how bright each of the three lights should be.

## Three numbers from 0 to 255

Computers usually store each brightness in one byte, which holds 256 values: 0 (off) to 255 (full). That gives 256 × 256 × 256 ≈ 16.7 million colors. Drag the sliders and watch the codes change.

<figure class="panel">
  <div class="mixer">
    <div class="swatch" id="sw"></div>
    <div>
      <label class="slider"><span>R</span><input type="range" min="0" max="255" id="r" value="255"><output id="ro"></output></label>
      <label class="slider"><span>G</span><input type="range" min="0" max="255" id="g" value="87"><output id="go"></output></label>
      <label class="slider"><span>B</span><input type="range" min="0" max="255" id="b" value="51"><output id="bo"></output></label>
    </div>
  </div>
  <div class="bytes"><span>#</span><span id="hr" style="background:#c22"></span><span id="hg" style="background:#1a8a3a"></span><span id="hb" style="background:#2558c9"></span></div>
  <div class="readout"><span id="rgb"></span><span id="hsl"></span></div>
  <figcaption>Each pair of hex digits is one byte: one channel's brightness.</figcaption>
</figure>

## Why hexadecimal?

Hexadecimal is base 16, using digits `0–9` and `A–F`. Two hex digits cover exactly 16 × 16 = 256 values, so one byte always fits in two characters. `FF` is 15 × 16 + 15 = 255, and `57` is 5 × 16 + 7 = 87. So `#FF5733` is simply `rgb(255, 87, 51)`: red fully on, a bit of green, a little blue. A warm orange.

The shorthand `#F53` doubles each digit, becoming `#FF5533`. An eight-digit code like `#FF573380` adds a fourth byte for transparency (alpha).

## Three numbers means three dimensions

Here is the key idea. A color is three numbers, and three numbers are exactly the coordinates of a point in 3D space. Put red on one axis, green on another and blue on the third, and every possible color fills a cube. Black sits at one corner `(0,0,0)`, white at the opposite corner `(255,255,255)`, and the diagonal between them holds every shade of gray.

<figure class="panel">
  <canvas id="cube" aria-label="Interactive 3D RGB color cube. Drag to rotate."></canvas>
  <div class="btns" role="group" aria-label="View">
    <button data-mode="cube" aria-pressed="true">RGB cube</button>
    <button data-mode="hsl" aria-pressed="false">HSL cylinder</button>
    <button id="spin" aria-pressed="true">Auto-rotate</button>
  </div>
  <figcaption>Drag to rotate. The white ring marks the color from the sliders above.</figcaption>
</figure>

Corners of the cube are the "pure" colors: red, green, blue, and their pairwise mixes cyan, magenta and yellow. Moving along an edge fades one channel in or out.

## Same colors, different shape: HSL

RGB is how the hardware thinks, but not how people do. We tend to describe color by its **hue** (which color), **saturation** (how vivid) and **lightness** (how bright). HSL rearranges the very same cube into a cylinder: hue goes around the circle as an angle, saturation is the distance from the center, and lightness is the height. Switch the view above to see the cube's colors reshaped. Notice the gray diagonal of the cube has become the central axis.

## Where the cube falls short

Equal steps in RGB do not look like equal steps to our eyes. A jump in green looks much bigger than the same jump in blue. Color scientists built spaces like CIELAB and OKLab to fix this: they are also 3D, but shaped so that distance roughly matches how different two colors *look*. That will be the subject of a future post.

## Recap

A hex code is three bytes. Three bytes are three coordinates. Three coordinates put every screen color inside a cube, and other color models like HSL are just different ways of bending that same space into shapes that match how we think.

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script src="/assets/js/color-cube.js"></script>
