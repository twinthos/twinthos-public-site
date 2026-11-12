#!/usr/bin/env python3
"""Browser regression checks for the unified site. Runs in CI against committed and rebuilt output."""
from pathlib import Path
from functools import partial
from http.server import SimpleHTTPRequestHandler,ThreadingHTTPServer
from threading import Thread
import json,re,subprocess
from playwright.sync_api import sync_playwright,expect
ROOT=Path(__file__).resolve().parents[1]; SHOTS=ROOT/'_src/qa-mobile'; SHOTS.mkdir(exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass

def main():
 home=(ROOT/'index.html').read_text(); css=(ROOT/'assets/tw.css').read_text(); js=(ROOT/'assets/tw.js').read_text()
 assert len(home.encode())<65000 and len(css.encode())<90000
 assert js.count("var nav=d.querySelector('.nav')")==1
 assert home.count('data-folio-option=') == 7 and 'data-folio' in home
 assert home.count('data-cinema-chapter=') == 3 and 'data-scroll-cinema' in home
 assert home.count('class="brand-wordmark"') >= 2 and '<span class="brand-wordmark">TWINTHOS</span>' in home
 assert 'class="silver-mark"' not in home
 assert home.index('id="tools"') < home.index('id="approach"') < home.index('id="architecture"')
 assert 'class="cinema-full-wordmark"' in home
 assert 'id="cinema-title"' in home and 'id="architecture"' in home
 assert '£999' in home and '£3,500' in home and 'Three-month minimum' in home
 data=[json.loads(x) for x in re.findall(r'<script type="application/ld\+json">(.*?)</script>',home)]
 managed=next(x for d in data for x in d.get('@graph',[]) if x.get('@id')=='https://twinthos.com/#managed')
 assert managed['offers']['price']=='3500'
 assert '"price": 3500' in (ROOT/'ai-catalog.json').read_text()
 subprocess.run(['node','--check',str(ROOT/'assets/tw.js')],check=True)
 assert '#9b8aff' not in css.split('/* Twinthos 2027: silver architecture')[-1].lower(), 'Legacy purple in active silver theme'
 server=ThreadingHTTPServer(('127.0.0.1',0),partial(Quiet,directory=str(ROOT)));Thread(target=server.serve_forever,daemon=True).start();base=f'http://127.0.0.1:{server.server_port}'
 routes=['/','/workforce/','/brain/','/security/','/how-it-works/','/about/','/pricing/','/book/','/operations-audit/','/faq/','/privacy/','/terms/','/notes/']
 try:
  with sync_playwright() as p:
   browser=p.chromium.launch(headless=True,args=['--no-sandbox'])
   for width in (320,375,390,768,1024,1440):
    page=browser.new_page(viewport={'width':width,'height':900},reduced_motion='reduce'); errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    for route in routes:
     response=page.goto(base+route,wait_until='networkidle');assert response.status==200
     expect(page.locator('main h1')).to_have_count(1);expect(page.locator('main h1')).to_be_visible()
     if not page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'):
      print('OVERFLOW DIAGNOSTIC',route,width,page.evaluate('''() => ({viewport:innerWidth,scroll:document.documentElement.scrollWidth,offenders:Array.from(document.querySelectorAll('body *')).map(e=>({tag:e.tagName,cls:typeof e.className==="string"?e.className:"",text:(e.textContent||"").slice(0,35),rect:e.getBoundingClientRect().right,width:e.getBoundingClientRect().width})).filter(x=>x.rect>innerWidth+1).slice(0,20)})'''),flush=True)
     assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(route,width,'overflow')
     assert page.locator('link[rel=stylesheet]').count()==1,(route,'competing themes')
     assert page.locator('.nav-links a[href="/workforce/"]').count()==1
     assert page.locator('.nav-links a[href="/security/"]').count()==1
     assert page.evaluate('getComputedStyle(document.body).backgroundColor') in ('rgb(5, 7, 11)','rgb(7, 9, 14)','rgb(6, 8, 10)')
     assert not errors,(route,width,errors)
     if route in ['/','/security/','/pricing/','/notes/']:page.screenshot(path=str(SHOTS/f'{route.strip("/") or "home"}-{width}.png'),full_page=True)
    page.goto(base+'/',wait_until='networkidle')
    expect(page.locator('[data-cinema-chapter]')).to_have_count(3)
    expect(page.locator('.brand .brand-wordmark').first).to_be_visible()
    expect(page.locator('.brand .brand-wordmark').first).to_have_text('TWINTHOS')
    expect(page.locator('[data-folio-option]')).to_have_count(7)
    card=page.locator('[data-folio-option=phone]');card.click();expect(card).to_have_attribute('aria-pressed','true');expect(page.locator('[data-folio-title]')).to_have_text('An available channel, when configured.')
    photo=page.locator('[data-folio-photo-display]')
    expect(photo).to_have_attribute('src','/assets/notes-photo-2026/the-2-dollar-ai-that-answers-the-phone-1600.webp')
    assert photo.evaluate('(img)=>img.complete && img.naturalWidth>0'),'Selected photograph did not load'
    assert page.locator('.cinema-hero-number').count()==1,'Editorial scroll numeral missing'
    assert page.evaluate('getComputedStyle(document.querySelector(".btn-ink")).backgroundColor') in ('rgb(228, 232, 236)','rgb(220, 226, 232)'), 'Blue CTA regression'

    assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),('editorial-folio',width,'overflow')
    if width<900:
     toggle=page.locator('.nav-toggle');expect(toggle).to_be_visible();toggle.click();expect(toggle).to_have_attribute('aria-expanded','true')
     expect(page.locator('.nav-links a[href="/security/"]')).to_be_visible();page.keyboard.press('Escape');expect(toggle).to_have_attribute('aria-expanded','false');expect(toggle).to_be_focused()
     toggle.click();page.locator('.nav-links a[href="/workforce/"]').click();expect(page).to_have_url(base+'/workforce/')
    else:expect(page.locator('.nav-toggle')).not_to_be_visible()
    page.goto(base+'/workforce/',wait_until='networkidle')
    for i in range(6):
     tab=page.get_by_role('tab').nth(i);tab.click();expect(tab).to_have_attribute('aria-selected','true');assert page.locator('[role=tabpanel]:visible').count()==1
     expect(page.locator('#'+tab.get_attribute('aria-controls'))).to_be_visible()
    page.get_by_role('tab').nth(5).press('Home');expect(page.get_by_role('tab').nth(0)).to_be_focused()
    page.get_by_role('tab').nth(0).press('ArrowRight');expect(page.get_by_role('tab').nth(1)).to_have_attribute('aria-selected','true')
    page.goto(base+'/security/',wait_until='networkidle');page.locator('[data-outcome=deny]').click();expect(page.locator('[data-result]')).to_have_text('Outside scope');page.locator('[data-outcome=review]').click();expect(page.locator('[data-result]')).to_have_text('Human review')
    page.goto(base+'/book/?interest=security',wait_until='networkidle');expect(page.locator('[name=interest][value=security]')).to_be_checked();expect(page.locator('[data-for=security]')).to_be_visible()
    page.locator('button[type=submit]').click();expect(page.locator('#f-name')).to_be_focused();expect(page.locator('.form-sum')).to_be_visible()
    # Never send a test enquiry to the actual provider. Simulate delivery outcomes.
    page.route('https://formsubmit.co/**',lambda route:route.fulfill(status=500,content_type='application/json',body='{"success":false}'))
    page.locator('#f-name').fill('Browser QA');page.locator('#f-email').fill('qa@example.test');page.locator('#f-msg').fill('Local intercepted test request.');page.locator('button[type=submit]').click();expect(page.locator('.form-fail')).to_be_visible();expect(page.locator('button[type=submit]')).to_be_enabled()
    page.unroute('https://formsubmit.co/**');page.route('https://formsubmit.co/**',lambda route:route.fulfill(status=200,content_type='application/json',body='{"success":true}'));page.locator('button[type=submit]').click();expect(page.locator('#bookDone')).to_be_visible();expect(page.locator('#bookDone h2')).to_be_focused()
    page.goto(base+'/book/?interest=%22%5D%5Bbad',wait_until='networkidle');expect(page.locator('[name=interest][value=fit]')).to_be_checked();assert not errors,errors
    page.close();print('PASS width',width,'all pages, menu, tools, boundaries, form validation and mocked delivery')
   context=browser.new_context(java_script_enabled=False,viewport={'width':390,'height':900});page=context.new_page();page.goto(base+'/workforce/')
   assert page.locator('[role=tabpanel]:visible').count()==6,'No-JS tool descriptions missing'
   expect(page.locator('.nav-links a[href="/security/"]')).to_be_visible();page.goto(base+'/notes/');assert page.locator('[data-note]:visible').count()==len(json.loads((ROOT/'_src/notes.json').read_text()))
   context.close()
   # Scroll-directed changes tested with motion enabled; never require animation for reading.
   for width in (390,1440):
    moving=browser.new_page(viewport={'width':width,'height':850},reduced_motion='no-preference')
    moving.goto(base+'/',wait_until='networkidle')
    moving.locator('[data-cinema-chapter="2"]').scroll_into_view_if_needed()
    expect(moving.locator('[data-scroll-cinema]')).to_have_attribute('data-cinema-active','2',timeout=7000)
    moving.locator('[data-cinema-chapter="0"]').scroll_into_view_if_needed()
    expect(moving.locator('[data-scroll-cinema]')).to_have_attribute('data-cinema-active','0',timeout=7000)
    assert moving.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),('motion-on',width)
    moving.close()
   browser.close()
 finally:server.shutdown()
if __name__=='__main__':main()
