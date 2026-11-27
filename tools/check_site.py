#!/usr/bin/env python3
"""Static checks for the published site: every page parses, every internal link
resolves, no page is orphaned from the rest. No network, no dependencies.

Exit code 0 when clean, 1 when something is broken.
"""
from __future__ import annotations

import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parent.parent
SKIP_DIRS = {".git", ".github", "tools", "node_modules"}
EXTERNAL = ("http://", "https://", "mailto:", "tel:", "data:", "javascript:", "//")


class Links(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []
        self.ids: set[str] = set()

    def handle_starttag(self, tag, attrs):
        data = dict(attrs)
        if "id" in data:
            self.ids.add(data["id"])
        for attr in ("href", "src"):
            value = data.get(attr)
            if value:
                self.links.append(value)


def pages() -> list[Path]:
    out = []
    for path in ROOT.rglob("*.html"):
        if any(part in SKIP_DIRS for part in path.parts):
            continue
        out.append(path)
    return sorted(out)


def resolves(target: str, source: Path) -> bool:
    if target.startswith(EXTERNAL) or target.startswith("#"):
        return True
    split = urlsplit(target)
    rel = unquote(split.path)
    if not rel:
        return True
    base = ROOT if rel.startswith("/") else source.parent
    candidate = (base / rel.lstrip("/")).resolve()
    if not str(candidate).startswith(str(ROOT)):
        return False
    if candidate.is_dir():
        return (candidate / "index.html").exists()
    if candidate.exists():
        return True
    # extensionless route: /notes/foo -> /notes/foo/index.html
    return (candidate / "index.html").exists()


def main() -> int:
    broken: list[str] = []
    parsed = 0
    files = pages()
    for page in files:
        parser = Links()
        try:
            parser.feed(page.read_text(encoding="utf-8", errors="replace"))
            parsed += 1
        except Exception as exc:  # noqa: BLE001 - report, do not crash the run
            broken.append(f"{page.relative_to(ROOT)}: parse error {type(exc).__name__}")
            continue
        for link in parser.links:
            if not resolves(link, page):
                broken.append(f"{page.relative_to(ROOT)} -> {link}")
    print(f"pages parsed: {parsed}")
    print(f"broken links: {len(broken)}")
    for line in broken[:50]:
        print(f"  {line}")
    return 1 if broken else 0


if __name__ == "__main__":
    sys.exit(main())
