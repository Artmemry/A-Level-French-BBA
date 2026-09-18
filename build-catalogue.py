#!/usr/bin/env python3
"""Regenerates bba-catalogue.js for BOTH hubs from their index.html.
Run whenever activities are added to either hub — a code carries activity
positions, and this is what turns position 71 back into a title. Run from
anywhere; it finds the two repositories beside this one."""
import json, re, os
here = os.path.dirname(os.path.abspath(__file__)); root = os.path.dirname(here)
REPOS = {"FR": os.path.join(root, "A-Level-French-BBA"), "ES": os.path.join(root, "A-Level-Spanish-BBA")}

def fingerprint(ids):
    h = 0x811c9dc5
    for ch in "|".join(ids):
        h ^= ord(ch)
        h = (h + ((h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24))) & 0xFFFFFFFF
    return ("00000000" + format(h, "x"))[-8:][:6]

for lang, repo in REPOS.items():
    html = open(os.path.join(repo, "index.html"), encoding="utf-8").read()
    data = json.loads(re.search(r"^var DATA = (\[.*\]);$", html, re.M).group(1))
    items = [{"id": it["id"], "f": it["file"], "t": it["title"], "s": sec["label"], "sn": sec["name"], "u": u["u"]}
             for sec in data for u in sec["units"] for it in u["items"]]
    cat = {"lang": lang, "fingerprint": fingerprint([i["id"] for i in items]), "items": items}
    js = ("/* The activity catalogue, generated from index.html by build-catalogue.py.\n"
          "   A code carries activity positions, not names; this is how the\n"
          "   dashboard turns position 71 back into an activity title.\n"
          "   Regenerate whenever activities are added to the hub.\n"
          "   Registers itself under window.BBA_CATALOGUES." + lang + " so the single\n"
          "   teacher dashboard can load the French and the Spanish catalogue side\n"
          "   by side; window.BBA_CATALOGUE is kept for anything older. */\n"
          "(function(){\n  var cat = " + json.dumps(cat, ensure_ascii=False) + ";\n"
          "  window.BBA_CATALOGUES = window.BBA_CATALOGUES || {};\n"
          "  window.BBA_CATALOGUES[cat.lang] = cat;\n  window.BBA_CATALOGUE = cat;\n})();\n")
    open(os.path.join(repo, "bba-catalogue.js"), "w", encoding="utf-8", newline="\n").write(js)
    print(lang, len(items), "activities, fingerprint", cat["fingerprint"])
