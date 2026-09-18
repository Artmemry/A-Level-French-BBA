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

## Forms tokens

Both progress forms carry the same two field tokens — the Spanish form was
duplicated from the French one — so `r08cab71007074f60a012ed77717b62d2` (name)
and `rbd3a09625c5c42399a03efd42ac1d5fa` (code) are now set in all four sites:
El Léxico's `FORMS_FIELD_NAME` / `FORMS_FIELD_CODE` and the Spanish hub's
`formsName` / `formsCode` were the two that were empty. Every send is now one
tap: the form opens with the name and the code already in.

## Still to do

`activities.json` in the Spanish repository is the orphan from the old
`suivi-professeur.html`; nothing reads it and it can go.

## Task first (added the same day)

Every site now opens on the task. `assignments.js` in each repository is the
file you edit each week on GitHub — pencil icon, change one line, commit:

    hubs         window.ASSIGNMENT = { label:"Semaine du 21 septembre",
                   items:["FR6_festivals_maitrise_du_contenu.html", "atelier PEEL"],
                   since:"2026-09-21", due:"2026-09-25", note:"Bring your score on Thursday" };
    vocabulary   window.ASSIGNMENT = { label:"Semaine du 21 septembre",
                   lessons:["U6.1","U6.2"], since:"2026-09-21", due:"2026-09-25" };

On the hubs an item is a file name (as in the tile's link), a tile id, or a
fragment of the title; anything that does not resolve is dropped silently.
*Done* means a score or a tick dated after `since`, so last term's tick does
not satisfy this week's task. The card sits first on the page, blue while
something is pending, green when the whole task is done, with a chip per
activity (*fait ✓ · 71 %*, *ouvert*, *à faire*) and an *Ouvrir ↗* button; no
task set, no card. Under the header, the same amber/green strip as the
vocabulary sites — *Your teacher has not received anything from you yet · 1
activity to send* → *Envoyer maintenant* — which records the send;
copying the code counts too, because a paste into Teams is a send.

On the vocabulary sites the task card moves above the name box, gains
*1 of 2 done · For Friday 25 September*, and a second strip under the send
strip keeps it in view on every tab, with *Voir la tâche / Ver la tarea*
returning to it. `due` is new and optional. Nothing is ever locked.

Verified with 56 checks (the 37 above plus 19 for this): the card first in
`<main>` with title, count, due date and note; chips right for a scored, an
opened and an untouched item; an unresolvable item dropped; the strip amber
with the right count, opening Forms prefilled, green afterwards, amber again
after a new activity, green again after *Copy the code*; a score older than
`since` not counting; a fresh device showing the task and no strip; the
Spanish hub showing no card when nothing is set, with its Spanish labels;
on Le Lexique the task card first on the home page with its chips, the task
strip with count and due date staying on the Révision tab and its button
returning to the task. Screenshots at 1100 px and 390 px looked right.

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
per-student breakdown; the Spanish hub's and El Léxico's Forms buttons opening the form with name and code filled in; the Spanish group's Excel workbook downloading with two
sheets and the activity title inside; no JavaScript errors anywhere.
