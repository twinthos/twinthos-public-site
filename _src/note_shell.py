#!/usr/bin/env python3
"""Shared shell for Twinthos Notes articles.

Takes a content spec and writes notes/<slug>/index.html using the site's own
article shell (nav, footer, CSS, fonts), so a new note is structurally identical
to every existing one. Handles head meta rewrites and the JSON-LD graph.
"""
import json
import os
import pathlib
import re

ROOT = pathlib.Path(os.environ.get("TWINTHOS_SITE_ROOT", pathlib.Path(__file__).resolve().parents[1]))
NOTE_DATE_HUMAN = os.environ.get("TWINTHOS_NOTE_DATE_HUMAN", "21 October 2026")

SHELL_PATH = ROOT / "notes/the-company-brain/index.html"


def build(slug, title, desc, date, hero, hero_alt, fig2, fig2_alt, toc, body,
          faq, section="Business", words_label="", read_label="", about=None,
          sources_line=""):
    shell = SHELL_PATH.read_text(encoding="utf-8")
    head_end = shell.index("</head>")
    tail = shell[shell.index("</main>"):]
    url = f"https://twinthos.com/notes/{slug}/"

    body = (body.replace("{HERO}", hero).replace("{FIG2}", fig2)
                .replace("{HERO_ALT}", hero_alt).replace("{FIG2_ALT}", fig2_alt))

    page = [f'<main><article><header class="nx-hero"><div class="wrap">',
            f'<p class="nx-meta"><a href="/notes/">Notes</a><span>·</span><span>{section}</span>'
            f'<span>·</span><span>{date}</span></p>',
            f'<h1>{title}</h1><p class="nx-dek">{desc}</p>',
            '<div class="nx-byline"><span><b>Twinthos Research</b></span>'
            '<span class="nx-byline-role">Product</span>'
            f'<span class="nx-byline-stat"><span class="nx-byline-read">{read_label}</span>'
            f'<span class="nx-byline-words">{words_label}</span></span>'
            f'<span><b><time datetime="{date}">{date}</time></b></span>'
            f'<span>Updated {NOTE_DATE_HUMAN}</span></div></div></header>',
            f'<figure class="nx-fig"><picture>'
            f'<source type="image/webp" srcset="/assets/notes-img/{hero}-800.webp 800w, /assets/notes-img/{hero}-1600.webp 1600w" sizes="(max-width:760px) 100vw, 1100px">'
            f'<img src="/assets/notes-img/{hero}-1600.jpg" srcset="/assets/notes-img/{hero}-800.jpg 800w, /assets/notes-img/{hero}-1600.jpg 1600w" sizes="(max-width:760px) 100vw, 1100px" width="1600" height="893" alt="{hero_alt}" fetchpriority="high">'
            '</picture></figure>',
            '<div class="wrap nx-layout"><aside class="nx-toc"><p>On this page</p><ol>']
    for aid, label in toc:
        page.append(f'<li><a href="#{aid}">{label}</a></li>')
    page.append('</ol></aside><div class="nx-article">')
    page.append(body)
    if sources_line:
        page.append(f'<p class="nx-src">{sources_line}</p>')
    page.append('</div></div></article></main>')
    content = "".join(page)

    head = shell[:head_end]
    head = re.sub(r"<title>.*?</title>", f"<title>{title} | Twinthos</title>", head, flags=re.S)
    head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{desc}">', head)
    head = head.replace("https://twinthos.com/notes/the-company-brain/", url)
    head = head.replace("company-brain", hero)
    head = head.replace("the-company-brain", slug)
    head = re.sub(r'<meta property="article:published_time" content="[^"]*">', f'<meta property="article:published_time" content="{date}T09:00:00+00:00">', head)
    head = re.sub(r'<meta property="article:modified_time" content="[^"]*">', f'<meta property="article:modified_time" content="{date}T09:00:00+00:00">', head)
    for attr in ("og:title", "twitter:title"):
        head = re.sub(rf'(<meta property="{attr}" content=")[^"]*(")',
                      lambda m: m.group(1) + title + " | Twinthos" + m.group(2), head)
    for attr in ("og:description", "twitter:description"):
        head = re.sub(rf'(<meta (?:property|name)="{attr}" content=")[^"]*(")',
                      lambda m: m.group(1) + desc + m.group(2), head)
    head = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")',
                  lambda m: m.group(1) + hero_alt + m.group(2), head)
    head = re.sub(r'<meta property="article:section" content="[^"]*">',
                  f'<meta property="article:section" content="{section}">', head)

    ld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "@id": url + "#article", "headline": title, "description": desc,
         "image": [f"https://twinthos.com/assets/notes-img/{hero}-1600.jpg",
                   f"https://twinthos.com/assets/notes-img/og-{hero}.jpg"],
         "datePublished": date, "dateModified": date, "inLanguage": "en-GB",
         "author": {"@type": "Organization", "name": "Twinthos Research", "url": "https://twinthos.com/notes/"},
         "publisher": {"@id": "https://twinthos.com/#org"},
         "mainEntityOfPage": url, "articleSection": section,
         "about": [{"@type": "Thing", "name": a} for a in (about or ["Digital employee"])]},
        {"@type": "FAQPage", "@id": url + "#faq",
         "mainEntity": [{"@type": "Question", "name": q,
                         "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in faq]},
        {"@type": "BreadcrumbList", "@id": url + "#crumbs", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://twinthos.com/"},
            {"@type": "ListItem", "position": 2, "name": "Notes", "item": "https://twinthos.com/notes/"},
            {"@type": "ListItem", "position": 3, "name": title}]},
    ]}
    head = re.sub(r'<script type="application/ld\+json">.*?</script>',
                  '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script>",
                  head, flags=re.S)

    prefix = shell[head_end + len("</head>"): shell.index("<main")]
    out = ROOT / "notes" / slug / "index.html"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(head + "</head>" + prefix + content + tail, encoding="utf-8")
    plain = re.sub(r"<[^>]+>", " ", content)
    return out, len(plain.split())
