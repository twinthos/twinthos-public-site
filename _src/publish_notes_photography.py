#!/usr/bin/env python3
"""Publish article-specific photographic Notes covers.

Uses real, freely usable Unsplash photographs when available, with the site's
existing photographic sources as explicit fallbacks. This is photo editing and
art direction, NOT AI-generated photography. No illustrations, added text,
pretend interfaces, invented statistics, or remote runtime images.

Run from repository root: python3 _src/publish_notes_photography.py
"""
from __future__ import annotations
from io import BytesIO
from pathlib import Path
import json
import re
import urllib.request
from PIL import Image, ImageOps, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets" / "notes-img"
DEST = ROOT / "assets" / "notes-photo-2026"
NOTES_FILE = ROOT / "_src" / "notes.json"
DEST.mkdir(parents=True, exist_ok=True)
BASE_URL = "https://twinthos.com/assets/notes-photo-2026"

# Image IDs are fixed, not randomly searched at build time.
# Each description is a concrete photographic subject relevant to its story.
# Source photo: https://images.unsplash.com/photo-<id> (Unsplash License).
ART = {
 "ai-agents-2027-security": dict(id="1558494949-ef010cbdcc31", fallback="chip", alt="Photograph of computing hardware and infrastructure for connected AI systems", crop=(.48,.5)),
 "questions-to-ask-managed-ai-agent": dict(id="1758611972678-bc3b29b4718f", fallback="questions-to-ask-managed-ai-agent-h", alt="Two colleagues reviewing a business document together at a laptop", crop=(.49,.50)),
 "the-company-brain": dict(id=None, fallback="the-company-brain-h", alt="Open filing cabinet containing business records and documents", crop=(.64,.49)),
 "what-an-ai-agent-actually-does": dict(id="1768483538267-fce52de424d5", fallback="what-an-ai-agent-actually-does-h", alt="Person working with organised task columns on a laptop in an office", crop=(.52,.51)),
 "why-ai-automations-fail": dict(id="1484480974693-6ca0a78fb36b", fallback="why-ai-automations-fail-h", alt="Paperwork and a task checklist beside a keyboard", crop=(.53,.52)),
 "digital-employee-vs-chatbot": dict(id="1423666639041-f56000c27a9a", fallback="digital-employee-vs-chatbot-h", alt="A smartphone and a laptop being used for everyday work", crop=(.51,.52)),
 "intro-to-ai": dict(id="1553877522-43269d4ea984", fallback="coworking-morning", alt="Professionals collaborating at a table in a contemporary office", crop=(.50,.50)),
 "digital-employee-cost": dict(id="1554224155-6726b3ff858f", fallback="digital-employee-cost-h", alt="A calculator and financial documents used to evaluate business costs", crop=(.50,.50)),
 "cost-of-an-ai-employee": dict(id="1695668548342-c0c1ad479aee", fallback="cost-of-an-ai-employee-h", alt="Photograph of server racks and cables showing the infrastructure behind running AI systems", crop=(.45,.49)),
 "small-businesses-already-hired-ai": dict(id=None, fallback="small-businesses-already-hired-ai-h", alt="Independent bakery counter with card payment terminal and pastries", crop=(.52,.49)),
 "the-2-dollar-ai-that-answers-the-phone": dict(id="1758876022783-8d6ea0842840", fallback="the-2-dollar-ai-that-answers-the-phone-h", alt="Businesswoman handling a customer phone call beside a laptop", crop=(.50,.50)),
 "atm-and-bank-tellers": dict(id=None, fallback="bank-atm", alt="Cash machine inside a bright modern bank lobby", crop=(.60,.50)),
 "super-intelligence-si": dict(id="1518770660439-4636190af475", fallback="chip", alt="Close-up photograph of a semiconductor and surrounding circuitry", crop=(.50,.49)),
}

def photo(n, spec):
    """Return a source photograph and honest source attribution."""
    remote = spec["id"]
    if remote:
        url = ("https://images.unsplash.com/photo-" + remote
               + "?fit=crop&w=2200&q=88")
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "TwinthosNotesEditorial/1.0"})
            with urllib.request.urlopen(request, timeout=18) as response:
                if not response.headers.get("Content-Type", "").startswith("image/"):
                    raise ValueError("Image CDN returned non-image data")
                data = response.read(14_000_000)
            im = Image.open(BytesIO(data)).convert("RGB")
            if im.width < 1200 or im.height < 650:
                raise ValueError("Downloaded image resolution too small")
            return im, {"provider": "Unsplash", "photo_url": "https://images.unsplash.com/photo-"+remote,
                        "license": "https://unsplash.com/license"}
        except Exception as exc:
            print(f"WARN {n['slug']}: remote photo unavailable ({type(exc).__name__}); using existing site-owned photograph")
    fallback = SOURCE / (spec["fallback"] + "-1600.jpg")
    if not fallback.is_file():
        raise FileNotFoundError(f"Missing fallback photograph: {fallback}")
    im = Image.open(fallback).convert("RGB")
    if im.width < 1200 or im.height < 650:
        raise ValueError(f"Fallback photograph too small: {fallback}")
    return im, {"provider": "Existing Twinthos photographic source", "path": str(fallback.relative_to(ROOT))}

def grade(im, n, spec):
    # Purely photographic colour grading: no fake UI, labels, 3D or illustration.
    canvas = ImageOps.fit(im, (1600, 900), method=Image.Resampling.LANCZOS,
                          centering=spec["crop"]).convert("RGB")
    category = n["category"]
    settings = {
        "AI security": (.86, 1.09, .96),
        "Agents & tools": (.93, 1.08, .99),
        "Business decisions": (.94, 1.07, 1.00),
    }
    saturation, contrast, brightness = settings[category]
    canvas = ImageEnhance.Color(canvas).enhance(saturation)
    canvas = ImageEnhance.Contrast(canvas).enhance(contrast)
    canvas = ImageEnhance.Brightness(canvas).enhance(brightness)
    return canvas.filter(ImageFilter.UnsharpMask(radius=1.3, percent=92, threshold=3))

def write_set(slug, high):
    low = high.resize((800,450), Image.Resampling.LANCZOS)
    for size, im in [(1600, high), (800, low)]:
        im.save(DEST / f"{slug}-{size}.jpg", quality=88, optimize=True, progressive=True, subsampling=0)
        im.save(DEST / f"{slug}-{size}.webp", quality=84, method=6)
    og = ImageOps.fit(high, (1200,630), method=Image.Resampling.LANCZOS)
    og.save(DEST / f"og-{slug}.jpg", quality=88, optimize=True, progressive=True)
    assert all((DEST/f"{slug}-{size}.{ext}").is_file() for size in (800,1600) for ext in ("webp","jpg"))
    assert (DEST/f"og-{slug}.jpg").is_file()

def patch_page(contents, n, alt):
    slug, old = n["slug"], n["image"]
    new = f"/assets/notes-photo-2026/{slug}-"
    for old_prefix in (f"/assets/notes-img/{old}-",
                       f"/assets/notes-covers-v2/{slug}-",
                       f"/assets/notes-covers/{slug}-"):
        contents = contents.replace(old_prefix, new)
    og = f"{BASE_URL}/og-{slug}.jpg"
    contents = re.sub(r'(<meta property="og:image" content=")[^"]*(")',
                      lambda m: m.group(1)+og+m.group(2), contents, count=1)
    contents = re.sub(r'(<meta name="twitter:image" content=")[^"]*(")',
                      lambda m: m.group(1)+og+m.group(2), contents, count=1)
    # Update the hero's meaningful alt text only, leaving other article figures unchanged.
    contents = contents.replace('alt="'+n["alt"]+'"', 'alt="'+alt+'"')
    contents = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")',
                      lambda m:m.group(1)+alt+m.group(2), contents, count=1)
    if new+"1600.webp" not in contents or new+"800.webp" not in contents:
        raise AssertionError(f"Missing article images after rewrite: {slug}")
    if og not in contents:
        raise AssertionError(f"Missing article social image after rewrite: {slug}")
    return contents

def main():
    notes = json.loads(NOTES_FILE.read_text())
    slugs = {n["slug"] for n in notes}
    if len(notes)<13 or slugs != set(ART):
        raise AssertionError("Every published article must have one curated photograph")
    index = ROOT / "notes" / "index.html"
    listing = index.read_text()
    provenance = {}
    for note in notes:
        slug, original_alt = note["slug"], note["alt"]
        spec = ART[slug]
        image, source = photo(note, spec)
        resolved_alt = spec["alt"] if source["provider"] == "Unsplash" or spec["fallback"] != note["image"] else original_alt
        high = grade(image, note, spec)
        write_set(slug, high)
        old_base = note["image"]
        for old_prefix in (f"/assets/notes-img/{old_base}-",
                           f"/assets/notes-covers-v2/{slug}-",
                           f"/assets/notes-covers/{slug}-"):
            listing = listing.replace(old_prefix, f"/assets/notes-photo-2026/{slug}-")
        listing = listing.replace('alt="'+original_alt+'"', 'alt="'+resolved_alt+'"')
        page_path = ROOT/"notes"/slug/"index.html"
        if page_path.exists():
            page_path.write_text(patch_page(page_path.read_text(), note, resolved_alt))
        note["alt"] = resolved_alt
        provenance[slug] = {"title": note["title"], "subject": resolved_alt, **source}
        print(f"PASS {slug}: {source['provider']} / cover, card and social preview")
    listing = re.sub(r'(<meta property="og:image" content=")[^"]*(")',
                     lambda m:m.group(1)+BASE_URL+"/og-questions-to-ask-managed-ai-agent.jpg"+m.group(2),
                     listing, count=1)
    for note in notes:
        p = f"/assets/notes-photo-2026/{note['slug']}-"
        if note["slug"] == "ai-agents-2027-security":
            continue  # The site builder creates its first index card after image generation.
        if p+"1600.webp" not in listing or p+"800.webp" not in listing:
            raise AssertionError(f"Index is missing article image: {note['slug']}")
    index.write_text(listing)
    NOTES_FILE.write_text(json.dumps(notes, indent=2, ensure_ascii=False)+"\n")
    (DEST/"SOURCES.json").write_text(json.dumps(provenance, indent=2, ensure_ascii=False)+"\n")
    print(f"PASS: {len(notes)} photographic covers, {len(notes)*4} responsive images, {len(notes)} OG previews")

if __name__ == "__main__":
    main()
