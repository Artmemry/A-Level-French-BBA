# Unit 1.1 — two opening activities, built from your Word document

Four files. Two are new pages, two replace what is already in the repository.

| | |
|---|---|
| **New** | `SP1_famille_maitrise_du_contenu.html` |
| **New** | `SP1_famille_atelier_PEEL.html` |
| **Replace** | `index.html` — the two activities added at the top of unit 1.1 |
| **Replace** | `bba-catalogue.js` — regenerated, 91 → 93 activities |

Nothing else changes. Both pages use the kit already on the site, so they need no
new scripts.

## Why two and not one

Your document is called *content mastery and language strategy*, and it really does
contain two different things. Squeezing both into one page would have produced
something long enough that no student finishes it on their own.

**1 · Maîtriser le contenu** — 42 marked questions. The six family forms, twelve
figures, the dates and the two laws, six true/false judgements, twelve pieces of
exam vocabulary. Everything comes from your *Indicative Content* and *Vocabulary
Support* sections; I invented no statistic and added no fact of my own.

**2 · L'atelier PEEL** — 30 marked questions. The PEEL table, the seven connectors,
the eight structures from your *Structures to Use* box, and a "which version would
score?" exercise. This is the page that answers the instruction in your document —
*write a sophisticated French version of the indicative content* — but broken into
steps a student can actually be marked on.

They cross-link, and the first one says to do it first.

## What a student gets

Both pages run on `bba-kit-fr.js` v2.1, so they inherit everything from the last
round of work without a line of new code: the floating accent pad, the name box,
autosave and *Reprendre*, Enter to submit, two attempts with a clue before the
answer, the download that carries their name, and the score that reaches the hub.

The clue is worth showing. Type *l'union libres* into question 6 and the box stays
live with:

> Pas encore — réessaie. 3 mots · 18 lettres · féminin (la / une) · Début : l… f… n… **[Voir la réponse]**

## The one thing the kit cannot mark

Each page ends with an A* task that is a piece of continuous writing, and no
marking engine can score that. So instead of a score, it gets a live tally of the
things you would look for. On the atelier page, typing a real answer produces:

> 87 mots · encore 33 mots | ✔ structures : 5 / 3 (si + imparfait + conditionnel ·
> ne … guère · ce qui / ce que · l'instauration de · les avantages fiscaux) |
> ✔ connecteurs : 2 / 2 | ✔ preuves chiffrées : 6 / 2

It looks for the *structure*, not the words: `si` + imparfait + conditionnel is
found by the `-rait` ending, so a student who writes their own verbs is credited
just as the model answer is. A weak answer gets told which structures are still
available to them, which is a nudge rather than a mark.

The writing itself still reaches you: it is saved, and it goes into the download
for you to mark.

## Where the content came from

Your document, section by section:

| In the document | On the pages |
|---|---|
| PEEL table (P/E/E/L) | The header table on both pages; the whole shape of both A* tasks |
| Indicative Content, cards 1–7 | Exercices 1–4 of *Maîtriser le contenu* |
| Vocabulary Support, all cards | Exercice 5 — 12 items |
| The connector list (*Chacun peut constater que…*) | Exercice 2 of the atelier — the seven-gap paragraph |
| *Structures to Use* + the second column (*Afin que + SUBJ, ne…guère, se réjouir, l'instauration de, avantages fiscaux, avoir recours à, ce qui / ce que*) | Exercice 3 of the atelier — 11 gaps |
| The full PEEL model on the *condition féminine* card | Exercice 1 of the atelier, in French, cut up and shuffled |
| The seven statements, *Vous devez considérer* bullets and compulsory questions | The reference panel at the foot of *Maîtriser le contenu* |
| The blank writing grids after each card | Replaced by the A* boxes |

Two typos in the document, worth fixing in your copy too. The connector list reads
*Ajouton à cela*; it should be *Ajoutons*, and that is the form the pages use and
mark. And the caption under the second image reads *Comment la famille traditionelle
a-t-elle changée* — *traditionnelle* takes two n's, and the participle after *avoir*
does not agree with the subject, so it is *a-t-elle changé*. That sentence does not
appear on the pages.

## Things you should decide

**The teacher-marked boxes.** The true/false exercise asks for a written correction
under each false statement, and the version-choosing exercise asks *pourquoi* in one
line. Neither is auto-marked — they come to you in the download. If you would rather
they were not there, say so and I will take them out.

**The dropdowns start blank.** They said *— choisissez —* at first, but the kit read
that as a wrong answer, so pressing *Vérifier* without answering handed out a free
clue on every question. Blank makes them count as *vides* instead, which is honest.

**Outstanding student codes will read as stale.** Adding two activities at the top of
unit 1.1 shifts every later activity by two positions, so the catalogue fingerprint
moves from `78fe22` to `8f4b78`. A code a student exported before today will be
flagged in the teacher dashboard as made against an older list. Nothing is lost —
scores are stored under the file name, not the position — and the next code a
student sends is correct. If it is easier for you, I can put the pair at the *end*
of unit 1.1 instead, which changes nothing.

## Verified

- Every one of the 72 marked questions answered correctly → **42 / 42** and **30 / 30**.
- Alternatives accepted as intended: *famille nucléaire* without the article, *la GPA*
  for *la gestation pour autrui*, *3.5* for *3,5*, *2 000* for *2000*, *la parité* for
  *la parité hommes-femmes*.
- Accent slips flagged but not failed (*la famille elargie*, *les taches menageres*);
  a real misspelling (*le plafon de verre*) failed.
- A wrong first attempt gives a clue and does not leak the answer; the box stays live.
- Filled, reloaded, resumed: **42 / 42** and **30 / 30** restored, name included.
- Download carries the student's name, the score and the breakdown.
- The score reaches `bba-scores`, the hub counts it, and the teacher dashboard names
  it: *SP1 · Maîtriser le contenu — 50 %*, class average row included.
- iPhone width (390 px): no sideways scroll, no field under 16 px on either page.
- Whole site re-swept afterwards: **98 pages, 0 JavaScript errors, 0 external requests.**

## One thing I noticed while testing

The paste box on `teacher.html` still lists `DOSFR1. DOSES1.` in its help text and
does not mention `DOSFR2.` The code *is* accepted — I pasted one and it read fine —
so this is only the wording. Say the word and I will fix the line.
