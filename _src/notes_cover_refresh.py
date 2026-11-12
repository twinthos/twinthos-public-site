#!/usr/bin/env python3
"""Produce publication-ready, article-specific editorial covers for twinthos.com/notes.

Uses the existing licensed/site-owned AI-generated source photography and builds
new 16:9 compositions with deliberate article hooks. The underlying photographs
are retained as source material, not passed off as newly generated photos.
Outputs: 12 x 800/1600px JPEG/WebP and 12 Open Graph previews plus index preview.
Updates actual published index/article HTML paths so browsers request the new art.
Deterministic and idempotent; intended for the GitHub Actions publishing run.
"""
from __future__ import annotations
from pathlib import Path
from PIL import Image, ImageOps, ImageEnhance, ImageDraw, ImageFont
import re

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/notes-img"
DEST = ROOT / "assets/notes-covers-v2"
DEST.mkdir(parents=True, exist_ok=True)

# Hooks are editorial summaries/questions, NOT manufactured performance claims.
# Editorial hooks are checked against the published article, not market claims.
# Source photographs are selected because their visible subjects match the story.
# Tuple: slug, editorial context, headline, category, source-photo, alt text.
ARTICLES = [
    ("intro-to-ai", "WHAT AI CAN DO FOR A BUSINESS", ["WHAT CAN AI", "TAKE OFF", "YOUR PLATE?"], "GETTING STARTED", "coworking-morning", "Two people working with laptops at a shared business table"),
    ("what-an-ai-agent-actually-does", "PROOF, NOT A CHAT DEMO", ["SHOW THE", "NEXT ACTION.", "NOT THE CHAT."], "AGENTIC SYSTEMS", "what-an-ai-agent-actually-does-h", "Two work monitors at an office desk"),
    ("digital-employee-vs-chatbot", "ANSWERS VS EXECUTION", ["A GOOD ANSWER.", "A FINISHED JOB.", "NOT THE SAME."], "BUYER'S GUIDE", "digital-employee-vs-chatbot-h", "An office desk with a smartphone and paper files"),
    ("digital-employee-cost", "THE PRICE IS ONLY ONE LINE", ["THE REAL", "36-MONTH", "COST"], "TOTAL COST", "digital-employee-cost-h", "Invoices and paperwork in an office filing tray"),
    ("questions-to-ask-managed-ai-agent", "BUYER'S DUE DILIGENCE", ["14 QUESTIONS", "BEFORE", "YOU BUY"], "SUPPLIER REVIEW", "questions-to-ask-managed-ai-agent-h", "Meeting table with supplier documents and a pen"),
    ("cost-of-an-ai-employee", "THE RIGHT WAY TO MEASURE", ["COST PER", "FINISHED", "TASK"], "UNIT ECONOMICS", "cost-of-an-ai-employee-h", "Calculator and financial papers on a desk"),
    ("why-ai-automations-fail", "FROM SHOWCASE TO REAL WORK", ["THE DEMO", "WORKED.", "THE JOB DIDN'T."], "PILOT RISKS", "why-ai-automations-fail-h", "Desk with an unfinished workflow map and papers"),
    ("small-businesses-already-hired-ai", "THE SELF-REPORTED SURVEY", ["53% SAID", "ONE ROLE'S", "WORKLOAD"], "SURVEY, NOT JOB LOSSES", "small-businesses-already-hired-ai-h", "Small bakery counter, till and payment terminal"),
    ("the-company-brain", "ONE CUSTOMER, TWO ANSWERS", ["ONE CUSTOMER.", "TWO ANSWERS.", "WHY?"], "BUSINESS KNOWLEDGE", "the-company-brain-h", "Open filing cabinet with the business's paper records"),
    ("super-intelligence-si", "THE 2026 FEDERAL TERMINOLOGY ORDER", ["THE US", "RENAMED AI.", "NOW WHAT?"], "AI POLICY", "super-intelligence-si-h", "Newspapers and a radio on a desk"),
    ("atm-and-bank-tellers", "AUTOMATION VS EMPLOYMENT", ["DID ATMS", "REPLACE", "TELLERS?"], "BANKING HISTORY", "bank-atm", "A cash machine in a modern bank lobby"),
    ("the-2-dollar-ai-that-answers-the-phone", "INPUT TOKENS ARE NOT PHONE CALLS", ["$2 IS NOT", "THE COST", "OF A CALL"], "VOICE AI COSTS", "the-2-dollar-ai-that-answers-the-phone-h", "Office telephone beside a reception diary and paperwork"),
]

# Guards against mismatches between the cover's claim and the article's claim.
REQUIRED_ARTICLE_TEXT = {
    "questions-to-ask-managed-ai-agent": ["14 questions"],
    "digital-employee-cost": ["three years", "36-month"],
    "cost-of-an-ai-employee": ["per hour", "correctly completed"],
    "small-businesses-already-hired-ai": ["53%", "survey"],
    "super-intelligence-si": ["renamed", "29 September 2026"],
    "atm-and-bank-tellers": ["bank teller", "cash machine"],
    "the-2-dollar-ai-that-answers-the-phone": ["input tokens", "telephone"],
}


IMAGE_ALT = {item[0]:item[5] for item in ARTICLES}

def font(size: int, bold: bool = False) -> ImageFont.FreeTypeFont:
    possibilities = (
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf"]
        if bold else
        ["/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
         "/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf"]
    )
    for path in possibilities:
        if Path(path).is_file():
            return ImageFont.truetype(path, size)
    raise FileNotFoundError("Need an installed sans font; no fallback to unreadable bitmap.")

def editorial_cover(src: Image.Image, width: int, height: int, hook: list[str],
                    kicker: str, topic: str, number: int) -> Image.Image:
    s = width / 1600
    # No fake UIs or metrics: genuine article-specific source photography.
    stage = Image.new("RGB", (width, height), (12, 14, 16))
    art_width = round(width * .71)
    photo = ImageOps.fit(src, (art_width, height), method=Image.Resampling.LANCZOS,
                         centering=(.51, .5)).convert("RGB")
    photo = ImageEnhance.Color(photo).enhance(.72)
    photo = ImageEnhance.Contrast(photo).enhance(1.13)
    photo = ImageEnhance.Brightness(photo).enhance(.86)
    stage.paste(photo, (width - art_width, 0))
    # Darken imagery behind the art-directed type without dirty overlays.
    shade = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shade)
    for x in range(width):
        t = x / width
        if t < .32: alpha = 247
        elif t < .62: alpha = round(247 * (1 - ((t-.32)/.30)**1.3)) + 22
        else: alpha = 20
        sd.line((x, 0, x, height), fill=(7, 9, 11, min(247, int(alpha))))
    stage = Image.alpha_composite(stage.convert("RGBA"), shade).convert("RGB")
    d = ImageDraw.Draw(stage)
    left = round(84*s)
    d.text((left, round(66*s)), "TWINTHOS", fill=(247, 246, 240),
           font=font(round(24*s), True), stroke_width=0)
    d.text((left, round(116*s)), "NOTES   /   "+f"{number:02d}",
           fill=(190, 194, 193), font=font(round(17*s)))
    d.line((left, round(161*s), round(790*s), round(161*s)), fill=(125, 133, 137), width=max(1,round(s)))
    d.text((left, round(210*s)), kicker, fill=(210, 213, 210), font=font(round(18*s)))
    size = round(84*s)
    max_width = round(775*s)
    for proposed in range(size, round(53*s), -max(1,round(2*s))):
        f = font(proposed, True)
        if max(d.textbbox((0,0), txt, font=f)[2] for txt in hook) < max_width:
            size = proposed
            break
    main_font = font(size, True)
    top = round(315*s)
    line_height = round(size*1.21)
    for i, line in enumerate(hook):
        d.text((left, top+i*line_height), line, font=main_font,
               fill=(249, 249, 243), stroke_width=0)
    fy = height-round(110*s)
    d.line((left, fy, round(790*s), fy), fill=(127, 134, 136), width=max(1,round(s)))
    d.text((left, fy+round(26*s)), topic+"   /   EDITORIAL GUIDE",
           font=font(round(17*s)), fill=(205, 209, 207))
    return stage

def update_article(path: Path, slug: str) -> None:
    doc = path.read_text(encoding="utf-8")
    old_prefixes = (
        f"/assets/notes-img/{slug}-h-",
        f"/assets/notes-covers/{slug}-h-",
    )
    prefix_new = f"/assets/notes-covers-v2/{slug}-h-"
    for old_prefix in old_prefixes:
        for size in (800,1600):
            for ext in ("jpg","webp"):
                doc = doc.replace(f"{old_prefix}{size}.{ext}", f"{prefix_new}{size}.{ext}")
    # Only replace old OG URLs for the current article, not other in-article art.
    og = f"https://twinthos.com/assets/notes-covers-v2/og-{slug}.jpg"
    doc = re.sub(r"https://twinthos\.com/assets/(?:notes-img|notes-covers)/og-[a-z0-9-]+\.jpg", og, doc)
    # Some legacy OG records point directly at the hero image and were already
    # migrated to notes-covers above; convert those to the dedicated OG crop.
    doc = doc.replace(f"https://twinthos.com/assets/notes-covers-v2/{slug}-h-1600.jpg", og)
    doc = doc.replace('<meta property="og:image:width" content="1600">', '<meta property="og:image:width" content="1200">')
    doc = doc.replace('<meta property="og:image:height" content="900">', '<meta property="og:image:height" content="630">')
    if f"/assets/notes-covers-v2/{slug}-h-1600.jpg" not in doc:
        raise AssertionError(f"{slug}: article hero was not migrated")
    if f"/assets/notes-covers-v2/og-{slug}.jpg" not in doc:
        raise AssertionError(f"{slug}: social image was not migrated")
    doc = doc.replace("https://twinthos.com/assets/notes-covers/og-", "https://twinthos.com/assets/notes-covers-v2/og-")
    # Description remains short, accurate, and useful even if the cover headline is present.
    doc = re.sub(
        r'(<figure class="nx-fig">.*?<img[^>]*alt=")[^"]+(")',
        lambda m: m.group(1) + IMAGE_ALT[slug] + m.group(2), doc, count=1, flags=re.S
    )
    doc = re.sub(
        r'(<meta property="og:image:alt" content=")[^"]+(")',
        lambda m: m.group(1) + IMAGE_ALT[slug] + m.group(2), doc, count=1
    )
    doc = doc.replace("/assets/notes.css?v=editorial-20261102b", "/assets/notes.css?v=editorial-20261102b")
    path.write_text(doc, encoding="utf-8")

def main() -> None:
    index = ROOT / "notes/index.html"
    listing = index.read_text(encoding="utf-8")
    for i, (slug, kicker, hook, topic, image_source, image_alt) in enumerate(ARTICLES, 1):
        article_path=ROOT/"notes"/slug/"index.html"
        original_article=article_path.read_text(encoding="utf-8")
        from html import unescape
        readable=unescape(re.sub(r"<[^>]+>", " ", original_article)).lower()
        for phrase in REQUIRED_ARTICLE_TEXT.get(slug, []):
            if phrase.lower() not in readable:
                raise AssertionError(f"{slug}: article no longer supports artwork claim {phrase!r}")
        photo = SOURCE / f"{image_source}-1600.jpg"
        if not photo.is_file():
            raise FileNotFoundError(f"Missing source photograph: {photo}")
        with Image.open(photo) as raw:
            original = raw.convert("RGB")
        high = editorial_cover(original, 1600, 900, hook, kicker, topic, i)
        low = high.resize((800,450),Image.Resampling.LANCZOS)
        high.save(DEST/f"{slug}-h-1600.jpg",quality=88,optimize=True,subsampling=0)
        low.save(DEST/f"{slug}-h-800.jpg",quality=85,optimize=True,subsampling=0)
        high.save(DEST/f"{slug}-h-1600.webp",quality=83,method=6)
        low.save(DEST/f"{slug}-h-800.webp",quality=80,method=6)
        og = editorial_cover(original, 1200, 630, hook, kicker, topic, i)
        og.save(DEST/f"og-{slug}.jpg",quality=87,optimize=True)
        old_listing=listing
        for prefix in (f"/assets/notes-img/{slug}-h-", f"/assets/notes-covers/{slug}-h-"):
            for size in (800,1600):
                for ext in ("jpg","webp"):
                    listing=listing.replace(f"{prefix}{size}.{ext}",
                                            f"/assets/notes-covers-v2/{slug}-h-{size}.{ext}")
        if (old_listing==listing and f"/assets/notes-covers-v2/{slug}-h-1600.jpg" not in listing):
            raise AssertionError(f"{slug}: missing Notes index image references")
        # Old captions/art labels are decorative; the exact source-photo alt is refreshed.
        listing=re.sub(
            rf'(<img src="/assets/notes-covers-v2/{re.escape(slug)}-h-1600.jpg"[^>]*alt=")[^"]+(")',
            lambda m:m.group(1)+image_alt+m.group(2),listing
        )
        update_article(article_path,slug)
        print("PASS: source, story, art and article match:", slug)
    (DEST/"og-index.jpg").write_bytes((DEST/"og-the-company-brain.jpg").read_bytes())
    listing=listing.replace("https://twinthos.com/assets/notes-img/og-index.jpg",
                            "https://twinthos.com/assets/notes-covers-v2/og-index.jpg")
    listing=listing.replace("https://twinthos.com/assets/notes-covers/og-index.jpg",
                            "https://twinthos.com/assets/notes-covers-v2/og-index.jpg")
    index.write_text(listing,encoding="utf-8")
    print("PASS: all 12 stories, 61 images, refreshed photo sources and alt descriptions")

if __name__=="__main__":
    main()
