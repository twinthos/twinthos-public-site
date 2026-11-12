#!/usr/bin/env python3
"""Validate generated Notes, attribution, dates and canonical source coverage."""
from pathlib import Path
from html.parser import HTMLParser
import json,re,html,xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
def main():
 notes=json.loads((ROOT/'_src/notes.json').read_text());assert len(notes)==13
 slugs=[n['slug'] for n in notes];assert len(slugs)==len(set(slugs))
 visuals=json.loads((ROOT/'_src/notes_visuals.json').read_text());assert {v['slug'] for v in visuals}==set(slugs)
 depth=json.loads((ROOT/'_src/notes_depth.json').read_text());assert {d['slug'] for d in depth}==set(slugs)
 assert all(len(d['scenario'].split())>=70 and len(d['analysis'].split())>=65 and len(d['answer'].split())>=18 for d in depth)
 assert all(len(v['steps'])==4 and v['practice'] and v['intro'] for v in visuals)
 assert all(v.get('insight') and all(v['insight'].get(key) for key in ('title','left_label','left','right_label','right','lesson','term','definition')) for v in visuals)
 assert set(slugs)=={p.parent.name for p in (ROOT/'notes').glob('*/index.html')}
 index=(ROOT/'notes/index.html').read_text();assert index.count('data-note ')==len(notes)
 for n in notes:
  page=(ROOT/'notes'/n['slug']/'index.html').read_text()
  assert len(n['sections'])>=4 and n['sources']
  assert sum(len(p.split()) for h,p in n['sections'])>=150
  assert n['published']<=n['modified']
  assert 'id="sources"' in page and 'article-takeaway' in page
  assert page.count('class="field-step"')==4 and 'id="decision-map"' in page and 'id="quick-answer"' in page
  assert page.count('class="insight-figure"')==1 and page.count('class="insight-side')==2 and 'id="visual-contrast"' in page
  assert 'class="brand-wordmark">TWINTHOS</span>' in page and 'class="silver-mark"' not in page
  assert n['caption'] in html.unescape(page) and n['alt'] in html.unescape(page)
  assert '/assets/notes-photo-2026/'+n['slug']+'-1600.webp' in page
  assert page.count('class="article-extra"')==2 and 'class="article-question"' in page
  assert 'data-category="'+html.escape(n['category'], quote=True)+'"' in page
  assert 'assets/gunmetal.css' not in page and 'notes-motion.css' not in page
  assert page.count('<h1>')==1
  assert '<time datetime="'+n['modified']+'">' in page
  assert all(url in page.replace('&amp;','&') for _,url in n['sources'])
  for size in [800,1600]:assert (ROOT/'assets/notes-photo-2026'/f'{n["slug"]}-{size}.webp').is_file()
  articles=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',page)]
  article=next(a for a in articles if a.get('@type')=='Article');assert article['dateModified']==n['modified'] and article['headline']==n['title']
  assert article['author']['name']=='Twinthos' and article['mainEntityOfPage']=='https://twinthos.com/notes/'+n['slug']+'/'
  crumb=next(a for a in articles if a.get('@type')=='BreadcrumbList');assert len(crumb['itemListElement'])==3
  assert 'https://twinthos.com/notes/'+n['slug']+'/' in (ROOT/'sitemap.xml').read_text()
 feed=ET.parse(ROOT/'notes/feed.xml');assert len(feed.findall('.//item'))==len(notes)
 print(f'PASS: {len(notes)} Notes, source links, readable content, imagery, dates, structured data, sitemap and RSS')
if __name__=='__main__':main()
