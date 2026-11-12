#!/usr/bin/env python3
"""Twinthos static build. Source: _src/. Output: repo root. Run: python3 _src/build.py
PREVIEW=1 marks every page noindex (private review builds)."""
import os, re, json, glob, html, hashlib, sys
SRC = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.dirname(SRC)
SITE = "https://twinthos.com"
PREVIEW = os.environ.get("PREVIEW") == "1"

# One design system for every service page and field note.
ACTIVE_CSS = ("site.css", "brand-2027.css", "motion-notes.css", "silver-motion.css", "zz-luminous.css", "zzz-gate.css", "zzzz-sitewide.css")
css = "".join(open(f"{SRC}/css/{name}", encoding="utf-8").read() for name in ACTIVE_CSS)
# Use one navigation controller. Legacy js/tw.js also toggled the menu.
ACTIVE_JS = ("10-tw.js", "60-site.js", "70-motion.js", "80-scroll.js", "90-luminous.js", "95-gate.js")
js = "\n".join(open(f"{SRC}/js/{name}", encoding="utf-8").read() for name in ACTIVE_JS)
os.makedirs(f"{OUT}/assets", exist_ok=True)
open(f"{OUT}/assets/tw.css", "w").write(css)
open(f"{OUT}/assets/tw.js", "w").write(js)
HERO_JS = ""  # Retire blocking animated film and its duplicate controllers.
VER = hashlib.sha1((css + js + HERO_JS).encode()).hexdigest()[:8]

# Full-company name is the logo, not initial letters.
MARK = '<span class="brand-wordmark">TWINTHOS</span>'
ARROW = '<svg class="ar" viewBox="0 0 14 14" aria-hidden="true"><path d="M1 7h11M8 3l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>'
NAV = None


import json, html as _h
IND = json.load(open(f"{SRC}/industries.json"))
def ind_tabs():
    out = ['<div class="ind-tabs" role="tablist" aria-label="Industry">']
    for g in IND["groups"]:
        first = g["id"] == "agencies"
        out.append(f'<button type="button" role="tab" class="ind-tab" id="it-{g["id"]}" data-g="{g["id"]}" aria-selected="{"true" if first else "false"}" aria-controls="ip-{g["id"] if "sub" not in g else g["sub"][0]}" tabindex="{0 if first else -1}">{_h.escape(g["label"])}</button>')
    out.append('</div>')
    sub = next(g for g in IND["groups"] if "sub" in g)["sub"]
    out.append('<div class="ind-tabs ind-sub" role="tablist" aria-label="Professional services" hidden>')
    for i, k in enumerate(sub):
        out.append(f'<button type="button" role="tab" class="ind-tab" id="it-{k}" data-g="{k}" aria-selected="{"true" if i == 0 else "false"}" aria-controls="ip-{k}" tabindex="{0 if i == 0 else -1}">{_h.escape(IND["items"][k]["tab"])}</button>')
    out.append('</div>')
    return "".join(out)
def ind_panels():
    out = []
    for k, v in IND["items"].items():
        hid = "" if k == "agencies" else " hidden"
        x = ""
        if v.get("extra"):
            x = f'<details class="ind-x"><summary>For agencies with clients of their own</summary><p>{_h.escape(v["extra"])}</p></details>'
        out.append(f'''<div class="ind-panel" id="ip-{k}" role="tabpanel" aria-labelledby="it-{k}"{hid}>
<h3 class="ind-h3">{_h.escape(v["head"])}</h3>
<dl class="ind-dl"><div><dt>Where it gets stuck</dt><dd>{_h.escape(v["pain"])}</dd></div><div><dt>What Twinthos could take on</dt><dd>{_h.escape(v["role"])}</dd></div><div><dt>What your team gets back</dt><dd>{_h.escape(v["impl"])}</dd></div></dl>
<p class="ind-note">{_h.escape(v["note"])}</p>{x}</div>''')
    return "".join(out)
def ind_data():
    d = {k: {kk: vv for kk, vv in v.items() if kk in ("stage", "caps", "cards", "outs")} for k, v in IND["items"].items()}
    return '<script type="application/json" id="ind-data">' + json.dumps(d, ensure_ascii=False).replace("</", "<\\/") + '</script>'

PARTS = {"hero_js": lambda: "<script>" + HERO_JS.replace("</", "<\\/") + "</script>", "mark": lambda: MARK, "ind_tabs": ind_tabs, "ind_panels": ind_panels, "ind_data": ind_data}

def partial(name):
    if name in PARTS:
        return PARTS[name]()
    body = open(f"{SRC}/partials/{name}.html").read()
    return re.sub(r"\{\{(\w+)\}\}", lambda x: partial(x.group(1)), body)

def layout(meta, body):
    title = meta["title"]; desc = meta["desc"]; path = meta["path"]; key = meta.get("nav", "")
    home = path == ""
    pricing = "#pricing" if home else "/pricing/"
    cur = lambda k: ' aria-current="page"' if k == key else ""
    ind = "#industries" if home else "/#industries"
    links = ''.join(f'<a href="/{route}/"{cur(k)}>{label}</a>' for route,k,label in [("workforce","agent","The agent"),("brain","brain","Company Brain"),("security","security","AI security"),("pricing","pricing","Pricing"),("notes","notes","Notes")])
    robots = '<meta name="robots" content="noindex, nofollow">\n' if (meta.get("noindex") or PREVIEW) else ""
    # Consistent, grounded entities for search engines and answer engines.
    org = {"@type":"Organization","@id":"https://twinthos.com/#org","name":"Twinthos","url":"https://twinthos.com/","description":"Twinthos focuses on AI security and managed digital employees, combining company knowledge, approved tools, activity records and human escalation.","logo":{"@type":"ImageObject","url":"https://twinthos.com/assets/twinthos-wordmark.svg"}}
    website = {"@type":"WebSite","@id":"https://twinthos.com/#website","url":"https://twinthos.com/","name":"Twinthos","inLanguage":"en-GB","publisher":{"@id":"https://twinthos.com/#org"}}
    graph = [org]
    if home:
        graph += [website] + [{"@type":"Service","@id":"https://twinthos.com/#managed","name":"Managed digital employee","serviceType":"Managed AI agent for an agreed business workflow","provider":{"@id":"https://twinthos.com/#org"},"description":"One agreed recurring workflow, configured with approved tools, access boundaries, activity records and human escalation. Three-month minimum.","offers":{"@type":"Offer","price":"3500","priceCurrency":"GBP","url":"https://twinthos.com/pricing/"}},{"@type":"Service","@id":"https://twinthos.com/#audit","name":"Operations Audit","serviceType":"Business operations workflow assessment","provider":{"@id":"https://twinthos.com/#org"},"description":"One-off written assessment and plan; production deployment is not included.","offers":{"@type":"Offer","price":"999","priceCurrency":"GBP","url":"https://twinthos.com/operations-audit/"}}]
    elif path == "faq/":
        qas = re.findall(r'<details class="qa"[^>]*>\s*<summary>\s*<h2>(.*?)</h2>\s*</summary>\s*<div class="qa-a"><p>(.*?)</p>', body, re.S)
        answers = [{"@type": "Question", "name": html.unescape(re.sub(r"<[^>]+>", "", q)), "acceptedAnswer": {"@type": "Answer", "text": html.unescape(re.sub(r"<[^>]+>", "", a))}} for q, a in qas]
        graph.append({"@type": "FAQPage", "@id": SITE + "/faq/#webpage", "url": SITE + "/faq/", "name": "Twinthos frequently asked questions", "inLanguage": "en-GB", "isPartOf": {"@id": SITE + "/#website"}, "mainEntity": answers})
    else:
        graph.append({"@type": "WebPage", "@id": SITE + "/" + path + "#webpage", "url": SITE + "/" + path, "name": title, "inLanguage": "en-GB", "isPartOf": {"@id": SITE + "/#website"}})
    ld = '<script type="application/ld+json">' + json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False) + '</script>' if not (meta.get("noindex") or path == "404") else ""
    body = body.replace('<span class="ar">→</span>', ARROW)
    # One cacheable stylesheet; never inline the entire CSS into the homepage.
    css_tag = f'<link rel="stylesheet" href="/assets/tw.css?v={VER}">'
    return f'''<!DOCTYPE html>
<html lang="en-GB" class="no-js">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
{robots}<link rel="canonical" href="{SITE}/{path}">
<meta name="theme-color" content="#05070B">
<meta name="color-scheme" content="dark">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Twinthos">
<meta property="og:url" content="{SITE}/{path}">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:image" content="{SITE}/assets/notes-img/office-lit-windows-1600.jpg">
<meta name="twitter:card" content="summary_large_image">
<link rel="preload" href="/assets/fonts/InterTight-normal-400-700.woff2" as="font" type="font/woff2" crossorigin>
{css_tag}
<script>document.documentElement.classList.replace('no-js','js')</script>
<script src="/assets/tw.js?v={VER}" defer></script>
{ld}
</head>
<body class="pg-{meta.get('body', 'page')}">
<a class="skip" href="#main">Skip to content</a>
<header class="nav">
  <div class="wrap nav-in">
    <a class="brand" href="/" aria-label="Twinthos home"><span class="brand-wordmark">TWINTHOS</span></a>
    <a class="nav-price" href="{pricing}"{cur('pricing')}>Pricing</a>
    <nav class="nav-links" id="navLinks" aria-label="Main">{links}<a class="nav-book" href="/book/?interest=fit">Book a call</a></nav>
    <a class="btn btn-ink btn-sm nav-cta" href="/book/?interest=fit">Book a call</a>
    <button class="nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="navLinks"><span></span></button>
  </div>
</header>
<main id="main">
{body}
</main>
<footer class="foot">
  <div class="wrap">
    <div class="foot-grid">
      <div class="foot-brand">
        <a class="brand" href="/" aria-label="Twinthos home"><span class="brand-wordmark">TWINTHOS</span></a>
        <p class="foot-line">Intelligence at work.<br>Security at its core.</p>
      </div>
      <div><h2 class="foot-h">Service</h2><ul><li><a href="/workforce/">The agent & tools</a></li><li><a href="/brain/">Company Brain</a></li><li><a href="/how-it-works/">How it works</a></li><li><a href="/pricing/">Pricing</a></li><li><a href="/operations-audit/">Operations audit</a></li></ul></div>
      <div><h2 class="foot-h">Company</h2><ul><li><a href="/about/">About</a></li><li><a href="/notes/">Notes</a></li><li><a href="/security/">Security and data</a></li><li><a href="/faq/">Questions</a></li></ul></div>
      <div><h2 class="foot-h">Start</h2><ul><li><a href="/book/?interest=fit">Book a discovery call</a></li><li><a href="mailto:twinthos@agentmail.to">twinthos@agentmail.to</a></li></ul></div>
    </div>
    <div class="foot-base"><span>© 2026 Twinthos</span><span><a href="/privacy/">Privacy</a> · <a href="/terms/">Terms</a></span></div>
  </div>
</footer>
</body>
</html>
'''

def read_page(files):
    raw = "".join(open(f).read() for f in files)
    m = re.match(r"\s*<!--(\{.*?\})-->", raw, re.S)
    meta = json.loads(m.group(1)); body = raw[m.end():]
    body = re.sub(r"\{\{(\w+)\}\}", lambda x: partial(x.group(1)), body)
    return meta, body

groups = {}
for f in sorted(glob.glob(f"{SRC}/pages/*.html")):
    groups.setdefault(os.path.basename(f).split("~")[0].replace(".html", ""), []).append(f)

built = []
for name, files in groups.items():
    meta, body = read_page(files)
    dest = f"{OUT}/{meta['path']}index.html" if meta["path"] != "404" else f"{OUT}/404.html"
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    open(dest, "w").write(layout(meta, body))
    built.append(meta)

REDIRECTS = {"services/": "/how-it-works/", "audit/": "/operations-audit/", "questions/": "/faq/",
             "contact/": "/book/", "thankyou/": "/book/", "demo/": "/workforce/"}
for src, to in REDIRECTS.items():
    os.makedirs(f"{OUT}/{src}", exist_ok=True)
    open(f"{OUT}/{src}index.html", "w").write(
        f'<!DOCTYPE html><html lang="en-GB"><head><meta charset="utf-8"><title>Twinthos</title>'
        f'<meta name="robots" content="noindex"><link rel="canonical" href="{SITE}{to}">'
        f'<meta http-equiv="refresh" content="0; url={to}"></head>'
        f'<body style="background:#090B0E;color:#FAFBFC;font-family:sans-serif"><a href="{to}">Continue</a></body></html>')

from build_notes import build_notes
build_notes(layout, OUT, SRC)

urls = [m["path"] for m in built if not m.get("noindex") and m["path"] != "404"]
# Static pages not generated from templates


# Notes share the build; their modification dates come from the editorial source.
NOTES_LASTMOD = {}
try:
    import subprocess as _sp
    _out = _sp.run(["git", "log", "-1", "--format=%cI", "--", "notes"],
                   capture_output=True, text=True, cwd=OUT).stdout.strip()
    if _out:
        NOTES_LASTMOD = {"notes/": _out}
        for _d in sorted(os.listdir(f"{OUT}/notes")):
            _p = f"{OUT}/notes/{_d}"
            if not os.path.isdir(_p):
                continue
            _t = _sp.run(["git", "log", "-1", "--format=%cI", "--", f"notes/{_d}"],
                         capture_output=True, text=True, cwd=OUT).stdout.strip()
            if _t:
                NOTES_LASTMOD[f"notes/{_d}/"] = _t
except Exception:
    pass

NOTES_LASTMOD = {"notes/": "2026-11-08", **{f"notes/{n['slug']}/": n["modified"] for n in json.load(open(f"{SRC}/notes.json"))}}

def _notes_block():
    # Discover live notes pages from disk, not only from git history.
    if not os.path.isdir(f"{OUT}/notes"):
        return ""
    found = ["notes/"] if os.path.isfile(f"{OUT}/notes/index.html") else []
    found += [f"notes/{p}/" for p in sorted(os.listdir(f"{OUT}/notes"))
              if os.path.isfile(f"{OUT}/notes/{p}/index.html")]
    return "".join("<url><loc>" + SITE + "/" + u + "</loc>" +
                   ("<lastmod>" + NOTES_LASTMOD[u][:10] + "</lastmod>" if u in NOTES_LASTMOD else "") +
                   "</url>\n" for u in found)

open(f"{OUT}/sitemap.xml", "w").write('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    "".join(f"<url><loc>{SITE}/{u}</loc></url>\n" for u in sorted(urls, key=lambda u: (u != "", u))) +
    _notes_block() + "</urlset>\n")
print(f"built {len(built)} pages, {len(REDIRECTS)} redirects, {len(NOTES_LASTMOD)} notes urls, css {len(css)}B js {len(js)}B v={VER} preview={PREVIEW}")
