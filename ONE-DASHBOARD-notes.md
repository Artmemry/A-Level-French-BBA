# One dashboard, four sites — and the Spanish hub brought level

18 September 2026. Touches all four repositories.

## What changed

**The Spanish hub now records real scores.** Its kit (`bba-kit-es.js` v2.1) had
been writing genuine marks into `localStorage["bba-scores"]` all along; the hub
ignored them and counted ticks. `index.html` is now built from the French hub's
page with every Spanish string put back, so it reads the store, shows the
percentage and attempt count on each tile, adds the *actually scored* and
*average score* figures, reports ticks with no score behind them, and issues
`DOSES2.` codes carrying evidence rather than claims. `DOSES1.` codes still
decode. The candidate-number and Forms-prefill changes from the French hub
(IDENTITIES-notes.md) come with it: nothing is ever disabled, the Forms button
copies the code and opens the blank form until the two field tokens are known.

New files in the Spanish repository: `bba-progress.js` (identical to the French
one) and `bba-catalogue.js`. `index.html` now also links `bba-mobile.css` and
`bba-mobile.js`, which were already in the repository but not loaded by the hub.

**One teacher dashboard.** `teacher.html` in the French hub is the dashboard for
everything. It loads both catalogues — its own, and the Spanish one straight
from the Spanish repository, same host, so it stays current when you add
Spanish activities — and `bba-lessons.js`, the lesson titles of both vocabulary
sites, so the per-student breakdown says *U6.1 · Les grandes fêtes françaises*
rather than *U6.1*. The *Claimed also correct* table that only the older copies
had is now here too, with the flag count in the summary line. The other three
`teacher.html` pages forward to it. Nothing needs moving: all four sites share
one browser store, so the roster you built on any of them is already there.

**Le Lexique sends like El Léxico.** The end-of-activity panel (*Your teacher
will see: 25 words seen, 0 mastered, 0 % accuracy* → *Envoyer à mon professeur*),
the amber/green strip under the header on every tab, the inline name field when
the name is blank, and the one send route that records every send. Sentences in
English, buttons in French, as agreed. Le Lexique's Forms tokens were already
filled in, so the form opens with name and code prefilled — one tap, no paste.

## Regenerating things

Two scripts sit in the French repository and expect the four repositories side
by side in one folder, as in *Site backups/depots*:

* `build-catalogue.py` — both `bba-catalogue.js` files, from each `index.html`.
  Run it whenever an activity is added to either hub.
* `build-lessons.py` — `bba-lessons.js`, from the two `data/corpus.js`. Run it
  when a list is added to either vocabulary site.

## Still to do

El Léxico's `FORMS_FIELD_NAME` and `FORMS_FIELD_CODE` in `app.js` are still
empty, so its students paste the code. The five-minute recipe is in
ENVIO-AL-PROFESOR-notes.md in that repository. The same two tokens go into
`CFG.formsName` and `CFG.formsCode` in the Spanish hub's `index.html`, since
both use the Spanish form.

`activities.json` in the Spanish repository is the orphan from the old
`suivi-professeur.html`; nothing reads it and it can go.

## Verified

37 end-to-end checks in headless Chromium against local copies of the four
sites, with the Spanish catalogue served at its live address. Among them: the
Spanish hub rendering all 107 tiles with `BBAProgress` loaded; a Spanish kit
page at v2.1; three seeded scores giving *3 scored · 62 %* and a tile reading
*70 % · 2 attempts*; a tick without a score raising the amber note; a `DOSES2.`
code of 491 characters with nothing on the page disabled; a Le Lexique lesson of
25 cards played to *Session terminée* with the panel above the *À revoir* list,
the strip amber with *1 activity still to send*, the inline name field, the
Forms address carrying the name and a `LEXFR2.` code, the strip green
afterwards and still green after a reload; the three forwarding pages landing on
the dashboard; both catalogues and both lesson-title sets loaded; three codes
(`DOSES2.`, `DOSFR2.`, `LEXFR2.`) decoding into named marks grids and a named
per-student breakdown; the Spanish group's Excel workbook downloading with two
sheets and the activity title inside; no JavaScript errors anywhere.
