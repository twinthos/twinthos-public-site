#!/usr/bin/env python3
"""Rebuild every Twinthos note from a strict JSON spec + a documentary photo.

Usage: python3 _src/rebuild_notes_v2.py [slug ...]

For each slug it:
  1. builds 1600/800 jpg+webp plus a 1200x630 og crop from the source PNG
  2. rewrites the page body using the site's own classes
  3. rewrites title, description, og/twitter tags and the JSON-LD graph
     (Article + FAQPage + BreadcrumbList + Organization), fixing the stale
     twitter:* tags that were copied between articles
"""
import json, re, sys, pathlib, html, os
from PIL import Image

SITE = pathlib.Path(os.environ.get("TWINTHOS_SITE_ROOT", pathlib.Path(__file__).resolve().parents[1]))
SPEC = pathlib.Path(os.environ.get("TWINTHOS_NOTES_SPEC", SITE / "_src" / "notes-specs"))
IMG = SITE / "assets" / "notes-img"
GEN = pathlib.Path(os.environ.get("TWINTHOS_IMAGE_SOURCE", SITE / "_src" / "notes-originals"))
DATE = os.environ.get("TWINTHOS_NOTE_DATE", "2026-10-21")
DATE_HUMAN = os.environ.get("TWINTHOS_NOTE_DATE_HUMAN", "21 October 2026")

# slug -> generated png
PHOTOS = {
    "intro-to-ai": "krea_krea-2-medium-turbo_20261021_163832_0a45933b.png",
    "what-an-ai-agent-actually-does": "krea_krea-2-medium-turbo_20261021_164003_64a25d7f.png",
    "digital-employee-vs-chatbot": "krea_krea-2-medium-turbo_20261021_164038_94322744.png",
    "digital-employee-cost": "krea_krea-2-medium-turbo_20261021_164038_d0948622.png",
    "questions-to-ask-managed-ai-agent": "krea_krea-2-medium-turbo_20261021_163805_8d81ad79.png",
    "cost-of-an-ai-employee": "krea_krea-2-medium-turbo_20261021_163805_6574929c.png",
    "why-ai-automations-fail": "krea_krea-2-medium-turbo_20261021_164103_077e702a.png",
    "small-businesses-already-hired-ai": "krea_krea-2-medium-turbo_20261021_163856_c961a999.png",
    "the-company-brain": "krea_krea-2-medium-turbo_20261021_163719_1cb9dcdd.png",
    "super-intelligence-si": "krea_krea-2-medium-turbo_20261021_163832_aaa6b790.png",
    "atm-and-bank-tellers": "krea_krea-2-medium-turbo_20261021_163851_960a28b0.png",
    "the-2-dollar-ai-that-answers-the-phone": "krea_krea-2-medium-turbo_20261021_163827_779b84d5.png",
}

CAPTION = {
    "intro-to-ai": "The office kettle, mid-boil. Most of what AI is asked to do looks like the work around it.",
    "what-an-ai-agent-actually-does": "An inbox on one screen, a spreadsheet on the other. That gap is where an agent is supposed to work.",
    "digital-employee-vs-chatbot": "A phone with a chat window, and a paper file that has to be finished.",
    "digital-employee-cost": "The invoice tray. The work that costs you is the work nobody counts.",
    "questions-to-ask-managed-ai-agent": "The document pack, the pen, the chair pulled back. Procurement is a meeting, not a demo.",
    "cost-of-an-ai-employee": "A payslip, a calculator, a cup of tea. The comparison is with a person, not a licence.",
    "why-ai-automations-fail": "The desk where the project stopped. The tool was never the problem.",
    "small-businesses-already-hired-ai": "A counter in a small bakery. The rota, the till, the card reader.",
    "the-company-brain": "A filing cabinet, open. Your business already keeps memory. It is just in metal.",
    "super-intelligence-si": "The paper, the tea, the morning. The name changed; the work did not.",
    "atm-and-bank-tellers": "A cash machine in a brick wall. It took the counting, not the job.",
    "the-2-dollar-ai-that-answers-the-phone": "A reception desk telephone and a paper diary. The cheapest part is the model.",
}


def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return s[:60]


def variants(slug):
    src = GEN / PHOTOS[slug]
    im = Image.open(src).convert("RGB")
    w, h = im.size
    base = slug + "-h"
    im.resize((1600, round(1600 * h / w)), Image.LANCZOS).save(IMG / f"{base}-1600.jpg", quality=86, optimize=True, progressive=True)
    im.resize((800, round(800 * h / w)), Image.LANCZOS).save(IMG / f"{base}-800.jpg", quality=86, optimize=True, progressive=True)
    im.resize((1600, round(1600 * h / w)), Image.LANCZOS).save(IMG / f"{base}-1600.webp", quality=82, method=6)
    im.resize((800, round(800 * h / w)), Image.LANCZOS).save(IMG / f"{base}-800.webp", quality=82, method=6)
    # 1200x630 centre crop for social
    tr = 1200 / 630
    if w / h > tr:
        nw = round(h * tr); x = (w - nw) // 2; box = (x, 0, x + nw, h)
    else:
        nh = round(w / tr); y = (h - nh) // 2; box = (0, y, w, y + nh)
    im.crop(box).resize((1200, 630), Image.LANCZOS).save(IMG / f"og-{base}.jpg", quality=86, optimize=True, progressive=True)
    return f"{base}"


def build_main(d, herobase):
    slug = d["slug"]
    words = len((d["answer"] + " " + " ".join(" ".join(s["p"]) for s in d["sections"]) + " " + d["takeaway"] +
                 " " + " ".join(q["a"] for q in d["faq"])).split())
    mins = max(3, round(words / 250))
    toc = "".join(f'<li><a href="#{slugify(s["h"])}">{html.escape(s["h"])}</a></li>' for s in d["sections"])

    body = []
    for i, s in enumerate(d["sections"]):
        body.append(f'<h2 id="{slugify(s["h"])}">{html.escape(s["h"])}</h2>')
        for p in s["p"]:
            body.append(f"<p>{html.escape(p)}</p>")
        if i == 0 and d.get("table"):
            rows = [r.strip() for r in d["table"].strip().split("\n") if r.strip()]
            head = [c.strip() for c in rows[0].strip("|").split("|")]
            out = ['<div class="nx-table"><table><thead><tr>' + "".join(f"<th>{c}</th>" for c in head) + "</tr></thead><tbody>"]
            for r in rows[2:]:
                cells = [c.strip() for c in r.strip("|").split("|")]
                out.append("<tr>" + "".join(f"<td>{c}</td>" for c in cells) + "</tr>")
            out.append("</tbody></table></div>")
            body.append("\n".join(out))
    faq = "".join(
        f'<details><summary>{html.escape(q["q"])}</summary><div class="nx-faq-body"><p>{html.escape(q["a"])}</p></div></details>'
        for q in d["faq"])

    return f"""<body class="notes">
<main><article>
<header class="nx-hero"><div class="wrap">
<p class="nx-meta"><a href="/notes/">Notes</a> <span>/</span> <span>Business</span> <span>/</span> <span>Plain English</span></p>
<h1>{html.escape(d["title"])}</h1>
<p class="nx-dek">{html.escape(d["description"])}</p>
<div class="nx-byline">
<span><b>Twinthos Research</b></span>
<span class="nx-byline-role">Product</span>
<span class="nx-byline-stat"><span class="nx-byline-read">{mins} min read</span> <span class="nx-byline-words">{words:,} words</span></span>
<span><b><time datetime="{DATE}">{DATE}</time></b></span>
<span>Updated {DATE_HUMAN}</span>
</div>
<figure class="nx-fig"><picture>
<source type="image/webp" srcset="/assets/notes-img/{herobase}-800.webp 800w, /assets/notes-img/{herobase}-1600.webp 1600w" sizes="(max-width:900px) 100vw, 900px">
<img src="/assets/notes-img/{herobase}-1600.jpg" srcset="/assets/notes-img/{herobase}-800.jpg 800w, /assets/notes-img/{herobase}-1600.jpg 1600w" sizes="(max-width:900px) 100vw, 900px" width="1600" height="900" alt="{html.escape(d["image_alt"])}" fetchpriority="high">
</picture><figcaption>{html.escape(CAPTION[slug])}</figcaption></figure>
</div></header>
<div class="wrap nx-layout">
<aside class="nx-toc"><p>On this page</p><ol>{toc}</ol></aside>
<div class="nx-article">
<section class="nx-take"><h2>The short answer</h2><p><b>{html.escape(d["answer"])}</b></p></section>
{chr(10).join(body)}
<h2 id="what-this-means">What this means for you</h2>
<p>{html.escape(d["takeaway"])}</p>
<p class="small">{html.escape(d["sources"])}</p>
<section><h2 id="faq">Questions people actually ask</h2><div class="nx-faq">{faq}</div></section>
</div></div>
</article></main>"""


def head_patch(head, d, herobase):
    url = f"https://twinthos.com/notes/{d['slug']}/"
    title = f'{d["title"]} | Twinthos'
    head = re.sub(r"<title>.*?</title>", f"<title>{html.escape(title)}</title>", head, flags=re.S)
    head = re.sub(r'(<meta name="description" content=")[^"]*(")', lambda m: m.group(1) + html.escape(d["description"]) + m.group(2), head, count=1)
    head = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + html.escape(title) + m.group(2), head, count=1)
    head = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + html.escape(d["description"]) + m.group(2), head, count=1)
    head = re.sub(r'(<meta property="og:image" content=")[^"]*(")', f'\\g<1>https://twinthos.com/assets/notes-img/og-{herobase}.jpg\\g<2>', head, count=1)
    head = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', lambda m: m.group(1) + html.escape(d["image_alt"]) + m.group(2), head, count=1)
    head = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")', f'\\g<1>https://twinthos.com/assets/notes-img/og-{herobase}.jpg\\g<2>', head, count=1)
    head = re.sub(r'(<meta name="twitter:title" content=")[^"]*(")', lambda m: m.group(1) + html.escape(title) + m.group(2), head, count=1)
    head = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', lambda m: m.group(1) + html.escape(d["description"]) + m.group(2), head, count=1)

    graph = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": url + "#article", "headline": d["title"], "description": d["description"],
         "datePublished": DATE, "dateModified": DATE, "inLanguage": "en-GB",
         "author": {"@type": "Organization", "name": "Twinthos Research", "url": "https://twinthos.com/about/"},
         "publisher": {"@id": "https://twinthos.com/#org"}, "mainEntityOfPage": {"@id": url + "#webpage"},
         "image": {"@type": "ImageObject", "url": f"https://twinthos.com/assets/notes-img/og-{herobase}.jpg", "width": 1200, "height": 630}},
        {"@type": "Organization", "@id": "https://twinthos.com/#org", "name": "Twinthos", "url": "https://twinthos.com/",
         "description": "Twinthos is a managed digital-employee company. A digital employee does one named job inside the software a business already runs, with memory, permissions, an audit trail and a named human who signs off consequential actions."},
        {"@type": "BreadcrumbList", "@id": url + "#breadcrumb", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Twinthos", "item": "https://twinthos.com/"},
            {"@type": "ListItem", "position": 2, "name": "Notes", "item": "https://twinthos.com/notes/"},
            {"@type": "ListItem", "position": 3, "name": d["title"], "item": url}]},
        {"@type": "FAQPage", "@id": url + "#faq", "mainEntity": [
            {"@type": "Question", "name": q["q"],
             "acceptedAnswer": {"@type": "Answer", "text": q["a"]}} for q in d["faq"]]},
        {"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": d["title"], "inLanguage": "en-GB",
         "isPartOf": {"@id": "https://twinthos.com/#website"}, "breadcrumb": {"@id": url + "#breadcrumb"}},
    ]}
    block = '<script type="application/ld+json">' + json.dumps(graph, ensure_ascii=False, separators=(",", ":")) + "</script>"
    head = re.sub(r'<script type="application/ld\+json">.*?</script>', lambda m: block, head, count=1, flags=re.S)
    return head


def main(slugs):
    for slug in slugs:
        spec = json.loads((SPEC / f"{slug}.json").read_text(encoding="utf-8"))
        spec["slug"] = slug
        page = SITE / "notes" / slug / "index.html"
        src = page.read_text(encoding="utf-8")
        head_end = src.index("</head>")
        head = src[:head_end]
        tail = src[src.index("</main>") + len("</main>"):]
        herobase = variants(slug)
        newhead = head_patch(head, spec, herobase)
        new_main = build_main(spec, herobase)
        # Retain independently reviewed source disclosures when rebuilding an article.
        reviewed = re.search(r'<section class="nx-verified-sources"[^>]*>.*?</section>', src, re.S)
        if reviewed:
            new_main = new_main.replace("</article>", reviewed.group(0) + "</article>", 1)
        out = newhead + "</head>" + new_main + tail
        page.write_text(out, encoding="utf-8")
        print(f"built {slug}: {len(out):,} bytes, hero {herobase}")


if __name__ == "__main__":
    all_slugs = list(PHOTOS)
    main(sys.argv[1:] or all_slugs)
