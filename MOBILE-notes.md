# The mobile sweep

Twelve files — two new, ten replacements.

## Install

| | |
|---|---|
| **New** | `bba-mobile.css`, `bba-mobile.js` — to the repository root |
| **Replace** | `bba-kit-fr.js` (now v2.1), and the nine HTML files |

Five of those HTML files **supersede earlier batches** — they carry those changes plus this
one. Use these:

- `index.html`, `teacher.html`, `french_vocab_trainer_all_units_Paper_3.html` — supersede the real-scores batch
- `Writing_about_La_Haine__Jan_26__Unit_3_Assessment.html` — supersedes the no-CDN batch
- `bba-kit-fr.js` — supersedes v2

## The result

Measured at 390 px across all 95 pages, before and after:

| | Before | After |
|---|---|---|
| Pages scrolling sideways | 6 | **0** |
| Pages with no viewport tag | 5 | **0** |
| Pages with text under 12 px | 36 | **0** |
| Pages with fields under 16 px | 88 | **0** |
| Pages showing two accent pads | 0 | **0** |

Desktop at 1280 px, checked separately: no overflow, no errors, and the text floor never
fires. Everything below lives inside a `max-width: 480px` media query.

## The defect that was not on the list

Eighty-eight pages had text fields under 16 px. **iOS Safari zooms the whole page in when
you focus a field smaller than 16 px, and does not zoom back out.** On the sixty-item
accuracy bootcamp that is sixty zooms, each one leaving the student to pinch back. I had
not measured this in the original audit and it was almost certainly the worst thing about
using the site on an iPhone. One CSS rule fixes all eighty-eight, and it uses
`max(16px, 1em)` so a page that already sets 17 px keeps it.

The one field left over was the kit's own name box, which is the first thing a student
touches. It is fixed too.

## How the fixes reach the pages

`bba-kit-fr.js` v2.1 links `bba-mobile.css` and `bba-mobile.js` itself, so the 91 pages
that load the kit needed **no edit at all**. The four that do not — the hub, the
dashboard, the vocabulary trainer and the house template — link them directly. The five
pages that had no viewport tag got one.

## What each file does

**`bba-mobile.css`** — the structural fixes: the 16 px field rule, wide tables scrolling
inside themselves instead of dragging the page, images and video capped, single-column
grids, wrapping flex rows, 40 px buttons, 24 px checkboxes.

**`bba-mobile.js`** — the text floor. Thirty-six pages carried type under 12 px across
**eighty-five different class names**, several of them bare `<span>`, `<th>` and `<b>` that
carry perfectly good type elsewhere on the same page. Naming them in a stylesheet would
have been guesswork with collateral damage, so this reads what the browser actually
computed and lifts only what is genuinely too small. It runs at phone widths only, adds no
markup, and re-runs when a phone is turned.

## Two things I got wrong on the way, and what they changed

**I masked the overflow before I fixed it.** My first version put `overflow-x: hidden` on
the body. The audit went to zero — and the first screenshot I took showed the right-hand
column of a vocabulary list clipped clean off the screen, with no way to reach it. The
rule hid the symptom and lost the content. It is gone; every cause is fixed at source and
the audit now tells the truth.

**My measurements overstated two faults.** Counting radio buttons as zoom-triggering
fields turned "1 field per page" into "64", and counting an accent pad's own show/hide
button as a second pad produced sixteen phantom duplicate-pad pages. Corrected, the real
picture was better than reported — and the duplicate accent pads had in fact already been
fixed by the kit's auto-suppression in v2, so there was nothing left to do there.

## Fixed at the family, not the instance

Two pages scrolled sideways because a flex row held a fixed-width label beside a text box
that neither would shrink. Rather than patch those two, I walked all 95 pages and found
**ten** such rows across the site; all ten now wrap. The same for grids: eleven explicitly
multi-column grids collapse to one column on a phone, found by reading the stylesheets
rather than guessing. The `auto-fit` and `auto-fill` grids already handle themselves and
are left alone.

## Tap targets — where I stopped

The original audit reported hundreds of tiny tap targets. Most of that was a measurement
error: on every quiz the radio buttons sit inside labels 260 px wide, so the real target
was always the whole option row. Measuring the label rather than the box, what remained
was around twenty per page — inline links inside sentences, which do not need to be 40 px.

Genuinely fixed: buttons and `.btn` to a 40 px minimum, checkboxes and radios to the WCAG
2.5.8 floor of 24 px, and the three confidence faces on a hub tile, which were 28 px wide.

## If you want to check it yourself

Open any activity on a phone, or in a desktop browser narrowed below 480 px. The things to
look for: no sideways scroll, no zoom when you tap a box, nothing smaller than about 12 px,
and one accent pad.
