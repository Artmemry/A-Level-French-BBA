# Identities — one student, several spellings

Updated 17 September 2026. Touches `teacher.html` and `index.html` only.

## The problem

A code carries a name the student typed and, optionally, a candidate number.
Four codes from the same student read `ÇA`, `C Ackermann`, `CAC`, `2435` — four
rows, four histories, and nothing in the data that connects them. A code **with**
a number and a code **without** one do not merge either, because the number is
the only stable handle there is.

Fusing two real students is far worse than showing one twice, so nothing merges
by guesswork. The mapping is stated by the teacher and stored with the roster.

## index.html — the candidate number is optional, and stays optional

The field invites, it never blocks. The code is always generated, **Send via MS
Forms** and **Copy the code** always work, nothing on the page is ever disabled.
A one-line note under the code says what the number buys — everything you have
done stays joined together across a change of computer or a change of name
spelling — and disappears as soon as the number is there. The field is remembered
on the device, so a student who takes up the offer types it once.

### MS Forms prefill

**Send via MS Forms** opens the form with the name and the code already filled
in, and the student can correct the name there. Three details:

* the name is prefilled as typed; if the box is empty the form field is left
  empty rather than being filled with the literal `(no name)`.
* `CFG.formsSid` is an empty slot. Add a candidate-number question to the form,
  take its field token out of the pre-filled URL Forms generates (the
  `&rXXXXXXXX=` part), paste it into `formsSid`, and the number prefills too.
* if the assembled URL would exceed 1900 characters — a very full dossier — the
  button falls back to copying the code to the clipboard and opening the blank
  form, because a silently truncated code in a URL is worse than a paste.

## teacher.html — two ways in

### 1. Class list and matching (the window)

Button in the Identities card. Paste the register once, one student per line:

```
2435	Charbel A Ackermann
3190, Herbert Karajan
Sophie Kowalski = 4417
9001  Zoe Miller
```

Number and name in either order, separated by a tab, two or more spaces, a
comma, a semicolon or `=` — a two-column paste out of a spreadsheet works as is.

**Save the class list** does two things at once. Every code that already carried
a number is relabelled with the register name rather than whatever the student
typed. And every spelling still unfiled appears in the table below with a
dropdown of the class list: a suggestion is pre-selected where the names look
related (`ÇA` → 2435, `Sophie K.` → 4417), and anything with no resemblance —
a nickname like `Ziggy` — is left blank for you to choose, because only you know.

**File the ones I have chosen** writes those lines into the Identities box and
applies them. That is how a name that arrived without a number gets one.

### 2. The Identities box (the same thing, by hand)

```
2435 = C Ackermann | ÇA | CAC | Charbel Ackermann
```

Left of `=` the canonical identity — use the candidate number. First token after
it, the name printed in every table and every CSV export. The rest, every
spelling seen. **Apply identities** parses, saves and re-renders; malformed lines
are listed rather than dropped, and a spelling claimed by two identities is an
error rather than a coin toss. Hovering a merged name shows `sent as: …`.

**Suggest merges** works without a class list at all: it groups related
spellings transitively, so four forms arrive as one group with the reason and
the number of codes behind them. Ticking a group writes a line into the box and
nothing else — the merge happens only when Apply is pressed. It never proposes a
candidate number against a name; nothing in the data supports that link.

### Storage

`roster.aliases` and `roster.classList`, two plain strings inside
`localStorage["bba-teacher-roster-v1"]`. Both travel in **Back up roster
(.json)**. A restore adopts either one only if this machine has none, so
restoring onto a laptop that already has a register never wipes it. **Empty
roster** keeps both — they are your work, not student data.

## Still to do

The same changes apply to the Spanish dossier hub (`DOSES2.`) and the two
vocabulary sites (`LEXFR2.` / `LEXES2.`), which have their own `index.html` and
their own copy of the dashboard. Not done here.

## Verified

54 end-to-end checks in headless Chromium against a local copy of the site.
Among them: a code issued with both fields blank and nothing on the page
disabled; the Forms URL carrying the typed name; ten codes including a legacy
`DOSFR1.`; the four Ackermann spellings and the three Karajan ones collapsing in
all three tables (dossier, marks grid, Le Lexique) and doubling in none; the four
class-list paste formats; a code with a number taking the register name; a
suggestion pre-selected but nothing filed until the button is pressed; a nickname
left blank and then attached by hand; the register and the filing surviving a
reload and an **Empty roster**.
