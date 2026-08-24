# Real scores: the hub, the code, and the dashboard

Eleven files — three new, eight replacements.

## Install

| | |
|---|---|
| **New** | `bba-progress.js`, `bba-catalogue.js`, `bba-xlsx.js` — all to the repository root |
| **Replace** | `index.html`, `teacher.html`, the six translation papers, `french_vocab_trainer_all_units_Paper_3.html` |

The six translation papers **supersede the ones from the gating batch** — same gating, plus
the line that reports the mark. Use these.

While you are there, delete `suivi-professeur.html`. It is linked from nowhere and fetches
an `activities.json` that does not exist.

## The problem, restated

The hub counted ticks. I could click every "Mark done" without opening a single activity
and it read **91 / 91, 100 %**, and produced a valid code. Meanwhile the activities were
recording genuine scores and throwing them away when the tab closed. You were collecting
the unreliable signal and discarding the reliable one.

## How it works now

One store, `localStorage["bba-scores"]`, keyed by filename:

```
"FR-TL-1 Leducation en France.html": { title, score, total, best, attempts, t, first }
```

`bba-kit-fr.js` v2 already wrote that shape, so the 92 kit pages needed no change. Two
families mark themselves and now report too: the six translation papers on **Finish**, and
the vocabulary trainer at the end of each set. The hub reads the store; it no longer
believes the tick.

A tile now carries the truth:

> **85 %**  2 attempts · best 17 / 20

and the Progress panel gained two figures — **actually scored** and **average score** —
next to the old completed count. When a student has ticked things they have not done, an
amber line says so in their own interest: *"6 activities are ticked but carry no score."*
Some activities genuinely cannot be auto-marked — an essay plan, a speaking preparation —
so the tick stays the right record for those, and the two are simply reported separately.

Per your choice, **any recorded attempt counts as done**. Coverage is generous; the
evidence column is where the honesty lives.

## The code

`DOSFR2.` replaces `DOSFR1.`. It carries only the activities a student has touched, three
bytes each — position, best percentage, and a byte holding the tick, the confidence face
and the attempt count. Then base64, as before.

| | Old | New |
|---|---|---|
| Everything ticked | 2,171 chars | 943 chars |
| A realistic student (5 done) | ~1,400 chars | **~500 chars** |

Shorter, and it carries evidence instead of a claim. It also holds a six-character
fingerprint of your activity list, so if you add activities and a student sends an old
code, the dashboard flags that row rather than silently mismatching the columns.

**`DOSFR1.` codes still decode.** A student who has not reloaded the hub is not lost.

## The dashboard

`teacher.html` keeps everything it had — roster, dedupe, previous-vs-current deltas, the
Forms file import, CSV — and gains three things.

**Summary columns.** *Attempted*, *Average*, *Ticked only*, alongside the existing counts,
and each section cell now shows `2/13 · 84 %` rather than `2/13`.

**A marks grid.** Every student against every activity anyone in the group has attempted,
colour-banded, with attempt counts, and a **class average row** at the foot. That row is
the fastest read on the page — it tells you which activity the group as a whole has not
understood, which is the thing you actually plan a lesson from.

**Two flags.** The old one (opening a lot, finishing nothing) plus a new one: ten or more
ticks with two or fewer scores. In testing, Théo — 40 ticked, 1 scored, 33 % — was caught
by it.

## The Excel workbook

`BBAXlsx` writes a genuine `.xlsx` in the browser with no library and no CDN, so the
dashboard stays as portable as the rest of the site. Three sheets, header frozen, filters
on, percentages formatted and banded:

1. **Class summary** — the table as shown, with section averages
2. **Marks by activity** — the grid, including the class-average row
3. **Needs a look** — only students the flags caught, with the reason spelled out and their
   weakest activities named:

   > Théo N'Diaye · 4420 · 1 attempted · 33 % · 40 ticked not scored
   > *ticking without doing — 40 ticked, 1 scored; average below 50 %*

The CSV download is untouched.

## What I tested

A full run with three invented students, driven through a real browser:

| | |
|---|---|
| Kit page records a score | ✓ 20/60 written to the store |
| Translation paper records on Finish | ✓ 12/20 with the per-chunk breakdown |
| Vocabulary trainer records per set | ✓ 12/15 with per-unit detail |
| Hub reads all three | ✓ 3 scored, 58 % average, tiles show real percentages |
| **Ticking all 91 without doing them** | ✓ done 91, **scored stays 3**, 88 flagged as claims |
| Code decodes back to the same rows | ✓ 91 rows, 3 with scores, fingerprint matches |
| Dashboard imports three codes | ✓ summary, marks grid, class averages, one row flagged |
| Legacy `DOSFR1.` code | ✓ still accepted |
| Excel export | ✓ 3 sheets, read back with a spreadsheet parser, accents intact |
| Whole site after the change | ✓ 96 pages, 0 external requests, 0 errors |

## Two things worth knowing

**`bba-catalogue.js` needs regenerating when you add activities.** It is what turns
"position 71" back into "L'éducation en France". If it drifts, the dashboard warns rather
than mislabels — but the fix is to regenerate it from `index.html`. Tell me when you next
add a batch and I will do it, or I can write you the one-line script.

**Scores live on the device, like everything else.** A student who works on a school
machine and a home laptop has two half-pictures, and sends whichever they are on. The
candidate number is already the join — the dashboard groups by it across codes — so this
works, but it is worth telling students to type it once on each machine they use. The
existing **Back up (.json)** button on the hub does not yet carry `bba-scores`; say the
word and I will extend it, which would also let a student move their scores between
machines properly.
