"""Notes use the same layout, navigation and design tokens as the service pages."""
import json,html,math,re
from pathlib import Path
from datetime import date,datetime

def readable_date(iso):return date.fromisoformat(iso).strftime('%-d %B %Y')
def feed_date(iso):return date.fromisoformat(iso).strftime('%a, %d %b %Y 12:00:00 GMT')
E=html.escape

def build_notes(layout,out,src):
 root=Path(out); notes=json.loads((Path(src)/'notes.json').read_text())
 visuals={v["slug"]:v for v in json.loads((Path(src)/"notes_visuals.json").read_text())}
 depth={v["slug"]:v for v in json.loads((Path(src)/"notes_depth.json").read_text())}
 if set(visuals)!={n["slug"] for n in notes}:raise ValueError("Missing Notes visual data")
 if set(depth)!={n["slug"] for n in notes}:raise ValueError("Missing Notes editorial depth")
 def visual(n):
  v=visuals[n["slug"]]
  stages="".join(f'<div class="field-step"><span class="mono">{i:02d} / STAGE</span><strong>{E(item[0])}</strong><p>{E(item[1])}</p></div>' for i,item in enumerate(v["steps"],1))
  return f'<figure class="field-visual" id="decision-map" data-tone="{E(v["tone"])}" aria-labelledby="visual-{E(n["slug"])}"><p class="eyebrow">TWINTHOS / EXPLAINED VISUALLY</p><h2 id="visual-{E(n["slug"])}">{E(v["title"])}</h2><p>{E(v["intro"])}</p><div class="field-trace" aria-label="Four stages in this conceptual diagram">{stages}</div><div class="field-practice"><span class="mono">APPLY IT / ONE PRACTICAL TEST</span><p>{E(v["practice"])}</p></div><figcaption class="field-caption">Conceptual decision framework, not measured results or live telemetry.</figcaption></figure>'
 def insight_figure(n):
  v=visuals[n["slug"]]["insight"]
  return f'''<figure class="insight-figure" id="visual-contrast" aria-labelledby="insight-{E(n["slug"])}">
  <div class="insight-heading"><p class="eyebrow">SEE THE DIFFERENCE / {E(n["category"])}</p><h3 id="insight-{E(n["slug"])}">{E(v["title"])}</h3></div>
  <div class="insight-compare" role="group" aria-label="Two situations compared">
    <div class="insight-side insight-left"><span class="insight-label">{E(v["left_label"])}</span><p>{E(v["left"])}</p></div>
    <span class="insight-not-equal" aria-hidden="true">≠</span>
    <div class="insight-side insight-right"><span class="insight-label">{E(v["right_label"])}</span><p>{E(v["right"])}</p></div>
  </div>
  <p class="insight-lesson"><strong>THE POINT</strong> {E(v["lesson"])}</p>
  <details class="insight-term"><summary>What does {E(v["term"])} mean?</summary><p>{E(v["definition"])}</p></details>
  <figcaption>Conceptual explanation, not a recorded result or performance claim.</figcaption>
  </figure>'''
 def photo(n,lazy=True):
  k=n['slug'];sizes='(max-width:600px) 100vw, (max-width:900px) 50vw, 33vw' if lazy else '100vw';return f'<img src="/assets/notes-photo-2026/{k}-1600.webp" srcset="/assets/notes-photo-2026/{k}-800.webp 800w, /assets/notes-photo-2026/{k}-1600.webp 1600w" sizes="{sizes}" width="1600" height="900" alt="{E(n["alt"])}" loading="{"lazy" if lazy else "eager"}" decoding="async">'
 def minutes(n):return max(1,math.ceil(sum(len(x.split()) for pair in n['sections'] for x in pair)/200))
 cards=''
 for n in notes[1:]+notes[:1]:
  cards+=f'<article class="note-card" data-note data-category="{E(n["category"])}"><a href="/notes/{n["slug"]}/"><span class="note-no" aria-hidden="true">{notes.index(n)+1:02d}</span>{photo(n)}<p class="eyebrow">{E(n["category"])}</p><h2>{E(n["title"])}</h2><p class="deck">{E(n["deck"])}</p><p class="note-meta">Updated {readable_date(n["modified"])} · {minutes(n)} min read ↗</p></a></article>'
 n=notes[0]
 paths=[('PATH 01','Before you buy.','Three notes to read before anyone signs anything.',['intro-to-ai','digital-employee-vs-chatbot','questions-to-ask-managed-ai-agent']),
  ('PATH 02','What it really costs.','The price on the page is rarely the whole bill.',['digital-employee-cost','cost-of-an-ai-employee','the-2-dollar-ai-that-answers-the-phone']),
  ('PATH 03','Keeping it in check.','Why good demos fail, and what makes a deployment safe.',['why-ai-automations-fail','the-company-brain','ai-agents-2027-security'])]
 byslug={x['slug']:x for x in notes}
 def path_card(pp):
  items=''.join(f'<li><a href="/notes/{s}/"><span>{E(byslug[s]["title"])}</span><em>{minutes(byslug[s])} min</em></a></li>' for s in pp[3])
  total=sum(minutes(byslug[s]) for s in pp[3])
  return f'<article class="path"><span class="mono">{pp[0]} / {len(pp[3])} NOTES / {total} MIN</span><h2>{E(pp[1])}</h2><p>{E(pp[2])}</p><ol>{items}</ol></article>'
 path_html='<section class="note-paths" aria-label="Reading paths"><p class="eyebrow">NOT SURE WHERE TO START? PICK THE QUESTION YOU HAVE</p><div class="paths">'+''.join(path_card(pp) for pp in paths)+'</div></section>'
 total_min=sum(minutes(x) for x in notes)
 body=f'''<section class="notes-stage"><div class="wrap"><div class="notes-head"><p class="eyebrow">THE TWINTHOS JOURNAL</p><h1>Field notes.</h1><div class="split"><p class="lede">Plain answers on what AI agents do, what they cost and how to keep them in check. {len(notes)} notes, about {total_min} minutes to read them all.</p><p class="mono">REVISED 08.11.2026 / {len(notes):02} NOTES</p></div></div></div></section><div class="wrap">{path_html}<a class="notes-feature" href="/notes/{n['slug']}/"><div class="feature-image">{photo(n,False)}</div><div class="feature-copy"><p class="eyebrow">START HERE / AI SECURITY</p><h2>{E(n['title'])}</h2><p>{E(n['deck'])}</p><span class="text-link">Read the field note ↗</span></div></a><section aria-label="Browse field notes"><div class="notes-controls"><div class="note-filters" role="group" aria-label="Filter by topic">'''
 for c in ['all','AI security','Agents & tools','Business decisions']:
  body+=f'<button type="button" data-category-filter="{E(c)}" aria-pressed="{str(c=="all").lower()}">{E("All notes" if c=="all" else c)}</button>'
 body+=f'''</div><label class="notes-search" for="notes-search">Search field notes<input id="notes-search" type="search" placeholder="Search a topic…" autocomplete="off"></label></div><p class="notes-count" id="notes-count" role="status">{len(notes)} field notes</p><div class="notes-grid">{cards}</div><p class="notes-empty" id="notes-empty" hidden>No notes match. Try another search or choose All notes.</p></section></div>'''
 listing=layout(dict(title='Field notes · Twinthos',desc='Practical writing on AI security, agents, company knowledge and business decisions.',path='notes/',nav='notes',body='notes'),body)
 listing=listing.replace('https://twinthos.com/assets/notes-img/office-lit-windows-1600.jpg','https://twinthos.com/assets/notes-photo-2026/og-'+notes[0]['slug']+'.jpg')
 (root/'notes/index.html').write_text(listing)
 for idx,n in enumerate(notes):
  toc='<a href="#quick-answer">Quick answer</a><a href="#decision-map">Visual framework</a><a href="#visual-contrast">What changes</a>'+''.join(f'<a href="#section-{i}">{E(h)}</a>' for i,(h,p) in enumerate(n['sections'],1))+'<a href="#field-example">Practical example</a><a href="#field-analysis">How to decide</a><a href="#reader-question">A question answered</a>'
  sections=''
  for i,(h,p) in enumerate(n['sections'],1):
   sections+=f'<section><h2 id="section-{i}">{E(h)}</h2><p>{E(p)}</p></section>'
   if i==2: sections+=insight_figure(n)
  extra=depth[n["slug"]]
  sections+=f'<section class="article-extra" id="field-example"><p class="eyebrow">IN PRACTICE / ILLUSTRATIVE SCENARIO</p><h2>{E(extra["scenario_heading"])}</h2><p>{E(extra["scenario"])}</p></section>'
  sections+=f'<section class="article-extra" id="field-analysis"><p class="eyebrow">THE OPERATING DECISION</p><h2>{E(extra["analysis_heading"])}</h2><p>{E(extra["analysis"])}</p></section>'
  sections+=f'<section class="article-question" id="reader-question"><p class="eyebrow">DIRECT ANSWER</p><h2>{E(extra["question"])}</h2><p>{E(extra["answer"])}</p></section>'
  sources=''.join(f'<li><a href="{E(url)}"'+(' target="_blank" rel="noopener noreferrer"' if not url.startswith('https://twinthos.com') else '')+f'>{E(label)} ↗</a></li>' for label,url in n['sources'])
  nxt=notes[(idx+1)%len(notes)]
  quick=f'<section class="article-brief" id="quick-answer" aria-labelledby="quick-heading"><p class="eyebrow">THE SHORT ANSWER</p><h2 id="quick-heading">In brief</h2><p>{E(n["takeaway"])}</p></section>'
  figure=visual(n)
  safe_title=E(n['title']).replace('Superintelligence','Super<wbr>intelligence') if n['slug']=='super-intelligence-si' else E(n['title'])
  body=f'''<div class="article-stage" data-tone="{E(n['category'])}"><header class="article-head wrap"><a class="eyebrow" href="/notes/">← FIELD NOTES / {E(n['category'])}</a><h1>{safe_title}</h1><p class="lede">{E(n['deck'])}</p><p class="article-meta">Twinthos · Published {readable_date(n['published'])} · Updated <time datetime="{n['modified']}">{readable_date(n["modified"])}</time> · {minutes(n)} min read</p></header></div><figure class="article-hero wrap">{photo(n,False)}<figcaption>{E(n["caption"])} <span>Editorial photograph · not a client deployment.</span></figcaption></figure><div class="article-layout wrap"><aside class="article-toc" aria-label="In this note"><p class="eyebrow">IN THIS NOTE</p>{toc}<a href="#sources">Sources & context</a></aside><article class="article-body" data-category="{E(n['category'])}">{quick}{figure}{sections}<aside class="article-takeaway"><p class="eyebrow">THE PRACTICAL TEST</p><p>{E(visuals[n["slug"]]["practice"])}</p></aside><section class="article-sources" id="sources"><h2>Sources & context</h2><p>This is Twinthos’s practical guidance. The links below provide technical background or our current service scope; they do not verify a client outcome or certify a deployment.</p><ul>{sources}</ul><p>{'First published ' + readable_date(n['published']) + '. The 2027 outlook is an evidence-led analysis, not a prediction of measured future outcomes.' if n['slug']=='ai-agents-2027-security' else 'Updated ' + readable_date(n["modified"]) + '. The guidance distinguishes supported facts, examples and current deployment limitations.'}</p></section><div class="article-cta"><p>Got a job in mind, a tool you're unsure about or a security worry? Bring it.</p><a class="btn btn-ink" href="/book/?interest={'security' if n['category']=='AI security' else 'fit'}">Talk to Twinthos ↗</a><a class="next-note" href="/notes/{nxt['slug']}/"><span class="mono">NEXT NOTE / {minutes(nxt)} MIN</span><strong>{E(nxt['title'])}</strong><span>{E(nxt['deck'])}</span></a></div></article></div>'''
  # An editorial soft break is needed at 320px without altering title text or metadata.
  meta=dict(title=n['title']+' · Twinthos Notes',desc=n['deck'],path='notes/'+n['slug']+'/',nav='notes',body='article')
  result=layout(meta,body)
  ld={'@context':'https://schema.org','@type':'Article','headline':n['title'],'description':n['deck'],'datePublished':n['published'],'dateModified':n['modified'],'author':{'@type':'Organization','name':'Twinthos','url':'https://twinthos.com/'},'image':'https://twinthos.com/assets/notes-photo-2026/'+n['slug']+'-1600.webp','mainEntityOfPage':'https://twinthos.com/'+meta['path']}
  ld.update({'@id':'https://twinthos.com/'+meta['path']+'#article','inLanguage':'en-GB','articleSection':n['category'],'publisher':{'@id':'https://twinthos.com/#org'},'isAccessibleForFree':True,'about':{'@type':'Thing','name':n['category']}})
  breadcrumb={'@context':'https://schema.org','@type':'BreadcrumbList','@id':'https://twinthos.com/'+meta['path']+'#breadcrumb','itemListElement':[{'@type':'ListItem','position':1,'name':'Twinthos','item':'https://twinthos.com/'},{'@type':'ListItem','position':2,'name':'Field notes','item':'https://twinthos.com/notes/'},{'@type':'ListItem','position':3,'name':n['title'],'item':'https://twinthos.com/'+meta['path']}]}
  result=result.replace('</head>','<script type="application/ld+json">'+json.dumps(ld,ensure_ascii=False).replace('</','<\\/')+'</script>\n</head>')
  result=result.replace('</head>','<script type="application/ld+json">'+json.dumps(breadcrumb,ensure_ascii=False).replace('</','<\\/')+'</script>\n</head>')
  result=result.replace('https://twinthos.com/assets/notes-img/office-lit-windows-1600.jpg','https://twinthos.com/assets/notes-photo-2026/og-'+n['slug']+'.jpg').replace('property="og:type" content="website"','property="og:type" content="article"')
  (root/'notes'/n['slug']).mkdir(parents=True,exist_ok=True)
  (root/'notes'/n['slug']/'index.html').write_text(result)
 items=''.join(f'<item><title>{E(n["title"])}</title><link>https://twinthos.com/notes/{n["slug"]}/</link><guid isPermaLink="true">https://twinthos.com/notes/{n["slug"]}/</guid><description>{E(n["deck"])}</description><pubDate>{feed_date(n["published"])}</pubDate></item>' for n in notes)
 (root/'notes/feed.xml').write_text('<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Twinthos field notes</title><link>https://twinthos.com/notes/</link><description>AI security, agents and practical automation.</description><lastBuildDate>Sun, 08 Nov 2026 12:00:00 GMT</lastBuildDate>'+items+'</channel></rss>')
 print(f'Built {len(notes)} Notes with distinct editorial content, diagrams and source metadata')
