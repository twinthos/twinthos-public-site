#!/usr/bin/env python3
"""Notes reading, filter, search and image checks in real Chromium."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
import json
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def main():
 notes=json.loads((ROOT/'_src/notes.json').read_text());server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
   for width in [320,390,768,1440]:
    page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce');errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
    page.goto(base+'/notes/',wait_until='networkidle');expect(page.locator('[data-note]')).to_have_count(len(notes))
    page.get_by_role('button',name='AI security',exact=True).click();expect(page.locator('[data-note]:visible')).to_have_count(sum(n['category']=='AI security' for n in notes))
    page.get_by_role('searchbox').fill('nonsense-no-match');expect(page.locator('#notes-empty')).to_be_visible();expect(page.locator('#notes-count')).to_have_text('0 field notes')
    page.get_by_role('searchbox').fill('');page.get_by_role('button',name='All notes',exact=True).click();expect(page.locator('[data-note]:visible')).to_have_count(len(notes))
    page.get_by_role('searchbox').fill('memory');expect(page.locator('[data-note]:visible')).to_have_count(1)
    for n in notes:
     response=page.goto(base+'/notes/'+n['slug']+'/',wait_until='networkidle');assert response.status==200
     expect(page.locator('h1')).to_have_text(n['title']);assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(n['slug'],width)
     assert page.locator('.article-hero img').evaluate('(x)=>x.complete&&x.naturalWidth>0'),n['slug']
     expect(page.locator('.field-visual .field-step')).to_have_count(4)
     expect(page.locator('.insight-figure')).to_have_count(1)
     expect(page.locator('.insight-side')).to_have_count(2)
     expect(page.locator('.insight-term')).to_have_count(1)
     assert '/assets/notes-photo-2026/'+n['slug']+'-1600.webp' in page.locator('.article-hero img').get_attribute('src'),n['slug']
     assert n['caption'] in page.locator('.article-hero figcaption').inner_text(),n['slug']
     page.locator('.insight-term summary').click()
     expect(page.locator('.insight-term>p')).to_be_visible()
     page.locator('.insight-term summary').click()
     expect(page.locator('.article-brief')).to_have_count(1)
     expect(page.locator('.article-extra')).to_have_count(2)
     expect(page.locator('.article-question')).to_have_count(1)
     expect(page.locator('.field-practice')).to_have_count(1)
     expect(page.locator('.article-sources')).to_be_attached();expect(page.locator('.article-takeaway')).to_be_attached()
     assert page.locator('link[rel=stylesheet]').count()==1
     assert not errors,errors
    page.close();print('PASS Notes width',width,'all',len(notes),'articles and filters')
   browser.close()
 finally:server.shutdown()
if __name__=='__main__':main()
