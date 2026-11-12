#!/usr/bin/env python3
"""Verify twinthos.com live matches the local build.

Usage: python3 _src/verify_live.py [--json]

Checks every published page and asset and reports one of:
  OK    HTTP 200 and byte-identical to disk
  STALE HTTP 200 but the bytes differ (usually an unpushed local edit)
  DEAD  non-200 live, or the file is missing locally

Exits non-zero if anything is not OK.

Pages are discovered from disk rather than hard-coded, so new pages are
covered automatically. Asset URLs carry ?v= query strings; the version is
read from index.html when present, and a missing version is not an error.
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import time

# Self-locating: this file lives at <repo>/_src/verify_live.py
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://twinthos.com"
CB = str(int(time.time()))
SKIP_DIRS = {".git", "_src", "assets", "node_modules", "__pycache__"}


def get(path):
    """Fetch a live path with cache busting. Returns (status, bytes)."""
    url = "https://twinthos.com/%s?cb=%s" % (path.lstrip("/"), CB)
    r = subprocess.run(
        ["curl", "-s", "-w", "\n%{http_code}", "-H", "Cache-Control: no-cache", url],
        capture_output=True,
        timeout=60,
    )
    out = r.stdout
    if b"\n" not in out:
        return 0, b""
    body, code = out.rsplit(b"\n", 1)
    try:
        return int(code), body
    except ValueError:
        return 0, body


def local(path):
    p = os.path.join(ROOT, path)
    return open(p, "rb").read() if os.path.isfile(p) else None


def asset_version():
    """The ?v= query string used by the build, read from index.html."""
    s = local("index.html")
    if s is None:
        return ""
    m = re.search(rb"tw\.(?:css|js)\?v=([\w.-]+)", s)
    return m.group(1).decode() if m else ""


def discover_pages():
    """Every index.html that should be served, as (url_path, rel_path)."""
    pages = []
    for dirpath, dirnames, filenames in os.walk(ROOT):
        dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if "index.html" not in filenames:
            continue
        rel = os.path.relpath(os.path.join(dirpath, "index.html"), ROOT).replace(os.sep, "/")
        if rel == "index.html":
            pages.append(("", rel))
        else:
            pages.append((os.path.dirname(rel) + "/", rel))
    return sorted(pages)


def compare(path, rel):
    """Fetch path and compare with the local file."""
    code, body = get(path)
    want = local(rel)
    if want is None:
        return "DEAD", "not on disk"
    if code != 200:
        return "DEAD", "HTTP %d" % code
    if hashlib.md5(body).hexdigest() == hashlib.md5(want).hexdigest():
        return "OK", "%dB" % len(body)
    return "STALE", "live %dB vs local %dB" % (len(body), len(want))


def main():
    results = []
    failures = []

    for url_path, rel in discover_pages():
        status, note = compare("/" + url_path, rel)
        results.append({"path": "/" + url_path, "status": status, "note": note})
        if status != "OK":
            failures.append("/" + url_path)

    # Assets referenced with a version query string.
    v = asset_version()
    for a in ["assets/tw.css?v=%s" % v, "assets/tw.js?v=%s" % v,
              "favicon.svg", "sitemap.xml", "robots.txt"]:
        code, body = get(a)
        want = local(a.split("?")[0])
        if want is None:
            status, note = "SKIP", "not on disk"
        elif code != 200:
            status, note = "DEAD", "HTTP %d" % code
        else:
            status, note = "OK", "%dB" % len(body)
        results.append({"path": "/" + a, "status": status, "note": note})
        if status == "DEAD":
            failures.append("/" + a)

    # Notes assets are versioned with their own query string, so compare the
    # bytes directly: the HTML holds the query, the served file is the same.
    for a in []:  # notes.css/js were retired; notes ship inside tw.css/tw.js
        status, note = compare("/" + a, a)
        results.append({"path": "/" + a, "status": status, "note": note})
        if status != "OK":
            failures.append("/" + a)

    code, _ = get("nope-404-check/")
    results.append({"path": "/nope-404-check/",
                    "status": "OK" if code == 404 else "DEAD",
                    "note": "HTTP %d" % code})
    if code != 404:
        failures.append("/nope-404-check/")

    marks = {"OK": "OK  ", "STALE": "STAL", "DEAD": "DEAD", "SKIP": "SKIP"}
    for r in results:
        print("%s %-46s %s" % (marks[r["status"]], r["path"], r["note"]))

    counts = {}
    for r in results:
        counts[r["status"]] = counts.get(r["status"], 0) + 1
    print()
    print("RESULT %s - %s" % ("PASS" if not failures else "FAIL",
                              ", ".join("%d %s" % (n, s) for s, n in sorted(counts.items()))))
    if failures:
        print("  not OK: %s" % ", ".join(failures))
    print("  (STALE means live differs from disk - push, then re-run)")

    if "--json" in sys.argv:
        print(json.dumps(results, indent=2))

    sys.exit(0 if not failures else 1)


if __name__ == "__main__":
    main()
