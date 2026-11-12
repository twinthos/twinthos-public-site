#!/usr/bin/env python3
"""Check committed public files before the canonical source rebuild.

This is an offline static-file check. It cannot establish CDN availability,
external destination behaviour, actual form delivery or dynamic browser safety.
"""
from __future__ import annotations

from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit
import sys

ROOT = Path(__file__).resolve().parents[1]
PUBLIC = [
    p for p in ROOT.rglob("*.html")
    if "_src" not in p.relative_to(ROOT).parts
    and ".github" not in p.relative_to(ROOT).parts
]
TAGS = {"a": ("href",), "img": ("src",), "script": ("src",),
        "link": ("href",), "video": ("src", "poster"),
        "source": ("src",), "iframe": ("src",)}
SKIP_SCHEMES = {"mailto", "tel", "sms", "javascript", "data", "blob"}
FAILED = []


class Links(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []

    def handle_starttag(self, tag, attrs):
        # Canonicals, alternate pages and preconnects are metadata, not local
        # navigation or asset requests. Validate actual executable links.
        attr_map = dict(attrs)
        rel = set((attr_map.get("rel") or "").lower().split())
        if tag == "link" and rel.intersection({"canonical", "alternate", "preconnect", "dns-prefetch"}):
            return
        for key, value in attrs:
            if key in TAGS.get(tag, ()) and value:
                self.links.append((tag, value))


def local_target(page: Path, raw: str) -> Path | None:
    url = urlsplit(raw.strip())
    if url.scheme in SKIP_SCHEMES:
        return None
    if url.scheme and url.scheme not in {"http", "https"}:
        return None
    if url.netloc and url.netloc.lower() not in {"twinthos.com", "www.twinthos.com"}:
        return None
    if not url.path:
        return None
    # Reject encoded traversals in output HTML and keep all paths under ROOT.
    route = unquote(url.path)
    if chr(0) in route:
        raise ValueError("NUL in link")
    relative = route.lstrip("/") if route.startswith("/") else str(page.parent.relative_to(ROOT) / route)
    candidate = (ROOT / relative).resolve()
    if not candidate.is_relative_to(ROOT.resolve()):
        raise ValueError("path escapes published root")
    if route.endswith("/") or not candidate.suffix:
        candidate = candidate / "index.html"
    return candidate


def audit():
    if not PUBLIC:
        FAILED.append("no published HTML discovered")
    for page in PUBLIC:
        parser = Links()
        parser.feed(page.read_text(encoding="utf-8", errors="replace"))
        for tag, raw in parser.links:
            try:
                path = local_target(page, raw)
            except ValueError as exc:
                FAILED.append(f"{page.relative_to(ROOT)}: unsafe {tag} link ({exc})")
                continue
            if path is not None and not path.is_file():
                FAILED.append(f"{page.relative_to(ROOT)}: missing {tag} target {raw.split('?')[0]}")
    # This folder is a legacy redirect, not a Python code hosting endpoint.
    for p in (ROOT / "audit").glob("*"):
        if p.suffix.lower() in {".py", ".json", ".md", ".txt", ".log"}:
            FAILED.append(f"legacy audit file published as a URL: {p.relative_to(ROOT)}")
    css_names = ("site.css", "brand-2027.css", "motion-notes.css", "silver-motion.css", "zz-luminous.css", "zzz-gate.css", "zzzz-sitewide.css")
    js_names = ("10-tw.js", "60-site.js", "70-motion.js", "80-scroll.js", "90-luminous.js", "95-gate.js")
    css = "".join((ROOT / "_src/css" / name).read_text() for name in css_names)
    js = "\n".join((ROOT / "_src/js" / name).read_text() for name in js_names)
    if css != (ROOT / "assets/tw.css").read_text():
        FAILED.append("compiled CSS differs from canonical source")
    if js != (ROOT / "assets/tw.js").read_text():
        FAILED.append("compiled JavaScript differs from canonical source")
    if FAILED:
        for issue in FAILED[:80]:
            print("FAIL:", issue)
        if len(FAILED) > 80:
            print(f"... plus {len(FAILED)-80} more failures")
        return 1
    print(f"PASS: {len(PUBLIC)} committed HTML pages, local targets, source-asset parity and no public legacy audit files")
    return 0


if __name__ == "__main__":
    sys.exit(audit())
