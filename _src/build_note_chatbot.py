#!/usr/bin/env python3
"""Build the /notes/digital-employee-vs-chatbot/ article from the site's own
article shell, so nav, footer and CSS are identical to every other note."""
import os
import re, json, pathlib

ROOT = pathlib.Path(os.environ.get("TWINTHOS_SITE_ROOT", pathlib.Path(__file__).resolve().parents[1]))
SHELL = (ROOT / "notes/the-company-brain/index.html").read_text(encoding="utf-8")
HEAD_END = SHELL.index("</head>")
TAIL = SHELL[SHELL.index("</main>"):]

SLUG = "digital-employee-vs-chatbot"
URL = f"https://twinthos.com/notes/{SLUG}/"
TITLE = ("A chatbot answers the question. A digital employee closes the file. "
         "Five differences, and only one of them is technical.")
DESC = ("A chatbot and a digital employee are not the same product at different prices. "
        "One has no job, no memory and no audit trail. The other is priced against the salary "
        "it absorbs. Here is the comparison, the arithmetic, and seven questions to ask before buying either.")
DATE = "2026-10-21"
SECTION = "Business"
HERO = "chatbot-vs-employee"
HERO_ALT = ("Two stone doorways in a bare concrete wall: the left filled with flat white light, "
            "the right opening onto a small lit room with a chair, a desk and a tall orderly column of files")
FIG2 = "employee-desk"
FIG2_ALT = ("A single block of black polished granite shaped like a desk, standing alone in an empty hall, "
            "with one neat stack of pale folders and a shaft of daylight")

TOC = [
    ("what-this-is", "What the two things actually are"),
    ("the-five", "The five differences"),
    ("the-money", "The money, and why it is priced differently"),
    ("three-confusions", "Three ways the pair get confused"),
    ("when-a-chatbot", "When a chatbot is the right answer"),
    ("seven-questions", "Seven questions to ask before buying either"),
    ("what-we-wont", "What we will not claim"),
]

def table(head, rows):
    out = ['<div class="nx-table"><table><thead><tr>' + "".join(f"<th>{c}</th>" for c in head) + "</tr></thead><tbody>"]
    for r in rows:
        out.append("<tr>" + "".join(f"<td>{c}</td>" for c in r) + "</tr>")
    out.append("</tbody></table></div>")
    return "".join(out)

FIVE = table(
    ["", "Chatbot or general assistant", "Digital employee"],
    [
        ("<b>Memory</b>", "Starts again each session. Knows only what is in the window in front of it.",
         "One persistent, isolated memory per company: rules, prices, exceptions, past decisions."),
        ("<b>The job</b>", "Answers whatever it is asked. No scope, so no way to finish.",
         "One written job: what goes in, what comes out, what it must never do, when it stops."),
        ("<b>Access</b>", "You paste text in, or it reads what you hand it.",
         "Works through the client's existing screens, under the client's own permissions."),
        ("<b>Audit</b>", "Nothing recorded by default.",
         "Every action logged, attributable and reversible."),
        ("<b>Accountability</b>", "The person who typed the prompt.",
         "A named human approves anything consequential, in writing."),
        ("<b>Price logic</b>", "Per seat, because it is a tool.",
         "Against the salary it absorbs, because it is cover for work."),
    ],
)

FAQ = [
    ("Is a digital employee just a chatbot with a better prompt?",
     "No. A prompt changes how an assistant talks. A digital employee changes what it is allowed to do. "
     "It has a written job definition, scoped permissions, a log of every action and a named human who signs "
     "off consequential ones. Strip those four things out and you are back to a chatbot, whatever it is called."),
    ("Do we need an API or a migration?",
     "No. The desk works through the screens a person already uses: the case management system, the broking "
     "platform, the payroll software, the insurer portal, email. That is why a first job can be live in about "
     "two hours rather than in a two-year integration project."),
    ("What happens when it gets something wrong?",
     "The job is scoped so that mistakes are caught by a rule rather than by luck, and the pilot measures the "
     "error rate on the client's own material before anything is committed. Anything consequential stops and "
     "waits for approval. An employee that escalates is worth more than one that guesses confidently."),
    ("Which model does it run on?",
     "The model is fuel and it is swappable. The value is the memory, the job definition, the permissions and "
     "the audit trail around the model, not the model itself."),
    ("Can we start with one job?",
     "That is the only way it is sold. One job, one desk, measured on a countable outcome over a short pilot. "
     "If the job cannot be counted, it is not a good first job."),
]

body = []
body.append(f"""<main><article>
<header class="nx-hero"><div class="wrap">
<p class="nx-meta"><a href="/notes/">Notes</a><span>·</span><span>{SECTION}</span><span>·</span><span>21 October 2026</span></p>
<h1>{TITLE}</h1>
<p class="nx-dek">{DESC}</p>
<div class="nx-byline"><span><b>Twinthos Research</b></span><span class="nx-byline-role">Product</span>
<span class="nx-byline-stat"><span class="nx-byline-read">7 min read</span><span class="nx-byline-words">1,500 words</span></span>
<span><b><time datetime="{DATE}">{DATE}</time></b></span><span>Updated 21 October 2026</span></div>
</div></header>
<figure class="nx-fig"><picture>
<source type="image/webp" srcset="/assets/notes-img/{HERO}-800.webp 800w, /assets/notes-img/{HERO}-1600.webp 1600w" sizes="(max-width:760px) 100vw, 1100px">
<img src="/assets/notes-img/{HERO}-1600.jpg" srcset="/assets/notes-img/{HERO}-800.jpg 800w, /assets/notes-img/{HERO}-1600.jpg 1600w" sizes="(max-width:760px) 100vw, 1100px" width="1600" height="893" alt="{HERO_ALT}" fetchpriority="high">
</picture><figcaption>Two doorways, same wall. One leads to an answer. The other leads to a desk with a job on it.</figcaption></figure>
<div class="wrap nx-layout">
<aside class="nx-toc"><p>On this page</p><ol>""")
for i, (aid, label) in enumerate(TOC, 1):
    body.append(f'<li><a href="#{aid}">{label}</a></li>')
body.append("""</ol></aside>
<div class="nx-article">
<section class="nx-take"><h2>The answer in forty words</h2><ul>
<li>A chatbot answers questions. A digital employee does one named job, inside the systems you already own.</li>
<li>The difference is not intelligence. It is memory, scope, permissions, a log, and a person who signs off.</li>
<li>That is why one is sold per seat and the other is priced against the salary it absorbs.</li>
<li>If a supplier cannot tell you which of the two they are selling, they are selling the first one.</li>
</ul></section>

<p>Almost every business conversation about AI this year has collapsed two different products into one word, and the collapse is expensive. It is the reason a managing director can come out of a demo impressed and still be unable to say what they bought. So this note does the boring thing properly: it puts the two objects side by side and takes them apart.</p>

<h2 id="what-this-is">What the two things actually are</h2>
<p>A <b>chatbot</b> is an interface over a large language model. You type, it answers. Modern versions are genuinely good at drafting, summarising, rewriting, explaining a policy, or turning a page of notes into an email. Sold per seat, usually monthly, priced like software because that is what it is: a tool that a person operates.</p>
<p>A <b>digital employee</b> is a different object. It has a job, a name, a place in the workflow, a definition of what it must never do, and a human who is accountable for its output. It does not wait to be asked. It picks up work from a queue, does one repeating sequence inside the software the business already runs, records what it did, and stops when something falls outside its scope.</p>
<p>The distinction is not philosophical. It changes what you can delegate. You cannot delegate a job to something that has no job description, and you cannot be accountable for output from something that keeps no record.</p>

<h2 id="the-five">The five differences</h2>
""")
body.append(FIVE)
body.append("""
<p>Read that table as a list of things that have to exist before work can leave a person's desk. A tool can be excellent and still have none of them, because none of them are intelligence problems. They are design decisions about scope, records and authority.</p>

<h2 id="the-money">The money, and why it is priced differently</h2>
<p>This is where the comparison stops being academic. A tool is priced against other tools, which is why the subscription column of a software bill is full of small numbers. A job is priced against the person doing it, which is why the number is larger and why the argument is different.</p>
<p>Take one UK administrator on £28,000. Add 25% for employer National Insurance, pension and the overhead of a desk, a laptop and management time, and the real annual cost is about <b>£35,000</b>. Divide by twelve: <b>£2,917 a month</b>. Divide by roughly 1,950 productive hours: <b>£17.95 an hour</b>.</p>
<p>That is the comparator. Not a software licence. Not a competitor's price list. The cost of the work as it is currently being paid for.</p>
<div class="wk"><span class="r"></span><b>£28,000 salary → £35,000 loaded → £2,917 a month → £17.95 an hour</b><b>A monthly workflow at £750 is 26% of that hire. A full desk at £5,000 is £60,000 a year, and has to replace about 1.7 salaries or add £60,000 of revenue.</b></div>
<p>Two consequences follow, and both are uncomfortable. First, a cheap implementation that only drafts text is competing with a £20 subscription, and it will lose. Second, an expensive implementation that does not displace countable work is competing with a salary it cannot beat. The only defensible price sits between those two, and it can only be found by naming the job and counting what it costs today.</p>

<h2 id="three-confusions">Three ways the pair get confused</h2>
<p><b>The demo effect.</b> A chatbot demo is a conversation, so it always looks impressive. A digital employee demo is a queue emptying, which looks like admin. Buyers consistently choose the more exciting demo and then wonder why nothing changed.</p>
<p><b>The wrapper problem.</b> Some suppliers put a job-shaped wrapper around a general assistant: a prompt, a name, a friendly avatar. It answers questions about invoices. It cannot open one, because it has no access, no permission and no record. The wrapper is the tell, not the product.</p>
<p><b>The accountability gap.</b> Ask who is responsible when the output is wrong and you will hear a version of "the model". That answer means nobody. A digital employee has a person's name against consequential actions, and a log that says exactly what happened and when.</p>

<h2 id="when-a-chatbot">When a chatbot is the right answer</h2>
<p>Often, honestly. If the need is to draft, summarise, translate, explain or brainstorm, buy a seat and stop there. If the work is genuinely a tool for a person to operate, a digital employee is an expensive way to solve it.</p>
<p>The test is simple: can you name the repeating task, say how often it happens, and count what it costs now? If yes, it is a job and it can be delegated. If the answer is a shrug, the need is a tool, or it is nothing at all.</p>

<h2 id="seven-questions">Seven questions to ask before buying either</h2>
<ol>
<li><b>What exactly does it produce, and who receives it?</b> An answer, or a file, a booking, a chased document, a closed case. Vague output means vague scope.</li>
<li><b>Where does it keep what it learns about us?</b> If the answer is "in the conversation", it has no memory, whatever the marketing says.</li>
<li><b>What is it not allowed to do?</b> A supplier who cannot list prohibitions has not thought about the job.</li>
<li><b>Show me the log of one completed task, end to end.</b> Not a dashboard. A record of what it touched, in what order, and what it changed.</li>
<li><b>When it stops, who does it escalate to, and how fast?</b> The escalation rule is the safety design. If it has none, the failure is silent.</li>
<li><b>What does it cost per month, and what job does that replace?</b> Any answer that does not name the job is a software sale dressed up.</li>
<li><b>How do we prove it worked in two weeks?</b> There should be a number, agreed in advance, measured on your own material.</li>
</ol>

<section class="nx-twinthos"><h2>What Twinthos sells, in one paragraph</h2>
<p>A digital employee has three parts. A <b>Brain</b>: the company's own rules and history, isolated per client, never invented. A <b>job definition</b>: one repeating task, written down, with its prohibitions and its escalation rule. A <b>desk</b>: it works through the screens you already own, so there is no API to build and no migration to survive.</p>
<p>The model underneath is fuel and it is swappable. The value is the memory, the scope, the permissions and the record.</p>
<p>Every engagement starts with one job and one number, measured on the client's own documents. If it cannot be measured, we say so and do not sell it.</p>
<p>No client has bought this as paid work yet, so this page claims no results, no savings and no case study. What it can offer is a short, countable pilot and the arithmetic above, which anyone can check.</p>
<h3 class="nx-twinthos-cta-h">Name the job you would hand over first.</h3>
<p class="nx-twinthos-cta"><a class="btn btn-ink" href="/book/?interest=fit">Book a discovery call</a><a class="btn btn-line" href="/operations-audit/">See the operations audit</a></p>
<p class="nx-twinthos-note">One call, one job, one number. If it is not a fit, we will say so on the call.</p></section>

<p>Related reading: <a href="/notes/the-company-brain/">why company memory is the part everyone skips</a>, <a href="/notes/why-ai-automations-fail/">why automations fail after the first month</a>, and <a href="/notes/what-an-ai-agent-actually-does/">a plain description of what an agent does all day</a>.</p>

<figure class="nx-fig"><picture>
<source type="image/webp" srcset="/assets/notes-img/{FIG2}-800.webp 800w, /assets/notes-img/{FIG2}-1600.webp 1600w" sizes="(max-width:760px) 100vw, 1100px">
<img src="/assets/notes-img/{FIG2}-1600.jpg" srcset="/assets/notes-img/{FIG2}-800.jpg 800w, /assets/notes-img/{FIG2}-1600.jpg 1600w" sizes="(max-width:760px) 100vw, 1100px" width="1600" height="893" alt="{FIG2_ALT}" loading="lazy">
</picture><figcaption>One desk, one queue, one record. That is the whole proposition, and it is why the price is a salary line rather than a subscription.</figcaption></figure>

<section><h2 id="faq">Questions people actually ask</h2><div class="nx-faq">""")
for q, a in FAQ:
    body.append(f"<details><summary>{q}</summary><div class=\"nx-faq-body\"><p>{a}</p></div></details>")
body.append("""</div></section>

<h2 id="what-we-wont">What we will not claim</h2>
<p>That a digital employee replaces a team. It replaces a job, and jobs are smaller than teams. That it never makes mistakes: it will, which is why the job is scoped so a rule catches them and why the pilot measures the rate. That the model matters more than the design around it: it does not, and any supplier arguing otherwise is selling you a seat.</p>
<p class="nx-src">Built from Twinthos product material, 21 October 2026. Arithmetic: £28,000 + 25% employer on-cost = £35,000; ÷12 = £2,917; ÷1,950 hours = £17.95. Salary benchmark: ONS Annual Survey of Hours and Earnings, April 2025, median full-time gross £39,039. Automated decisions touching people's rights carry obligations under UK GDPR Article 22, which is one reason consequential actions in our design require a named human.</p>
</div></div></article></main>""")

content = "".join(body).replace("{HERO_ALT}", HERO_ALT).replace("{FIG2_ALT}", FIG2_ALT).replace("{FIG2}", FIG2)

# ---- head: reuse the shell's head, swap everything article-specific
head = SHELL[:HEAD_END]
head = re.sub(r"<title>.*?</title>", f"<title>{TITLE} | Twinthos</title>", head, flags=re.S)
head = re.sub(r'<meta name="description" content="[^"]*">', f'<meta name="description" content="{DESC}">', head)
head = head.replace("https://twinthos.com/notes/the-company-brain/", URL)
head = head.replace("company-brain", HERO)
head = head.replace("the-company-brain", SLUG)
head = re.sub(r'<meta property="article:published_time" content="[^"]*">', f'<meta property="article:published_time" content="{DATE}T09:00:00+00:00">', head)
head = re.sub(r'<meta property="article:modified_time" content="[^"]*">', f'<meta property="article:modified_time" content="{DATE}T09:00:00+00:00">', head)
head = re.sub(r'(<meta property="og:title" content=")[^"]*(")', lambda m: m.group(1) + TITLE + " | Twinthos" + m.group(2), head)
head = re.sub(r'(<meta property="twitter:title" content=")[^"]*(")', lambda m: m.group(1) + TITLE + " | Twinthos" + m.group(2), head)
head = re.sub(r'(<meta property="og:description" content=")[^"]*(")', lambda m: m.group(1) + DESC + m.group(2), head)
head = re.sub(r'(<meta name="twitter:description" content=")[^"]*(")', lambda m: m.group(1) + DESC + m.group(2), head)
head = re.sub(r'(<meta property="og:image:alt" content=")[^"]*(")', lambda m: m.group(1) + HERO_ALT + m.group(2), head)

ld = {"@context": "https://schema.org", "@graph": [
    {"@type": "Article", "@id": URL + "#article", "headline": TITLE, "description": DESC,
     "image": [f"https://twinthos.com/assets/notes-img/{HERO}-1600.jpg", f"https://twinthos.com/assets/notes-img/og-{HERO}.jpg"],
     "datePublished": DATE, "dateModified": DATE, "inLanguage": "en-GB",
     "author": {"@type": "Organization", "name": "Twinthos Research", "url": "https://twinthos.com/notes/"},
     "publisher": {"@id": "https://twinthos.com/#org"},
     "mainEntityOfPage": URL, "articleSection": SECTION,
     "about": [{"@type": "Thing", "name": "Digital employee"}, {"@type": "Thing", "name": "AI chatbot"},
               {"@type": "Thing", "name": "Business process automation"}]},
    {"@type": "FAQPage", "@id": URL + "#faq",
     "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in FAQ]},
    {"@type": "BreadcrumbList", "@id": URL + "#crumbs", "itemListElement": [
        {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://twinthos.com/"},
        {"@type": "ListItem", "position": 2, "name": "Notes", "item": "https://twinthos.com/notes/"},
        {"@type": "ListItem", "position": 3, "name": TITLE}]},
]}
head = re.sub(r'<script type="application/ld\+json">.*?</script>',
              '<script type="application/ld+json">' + json.dumps(ld, ensure_ascii=False) + "</script>", head, flags=re.S)

prefix = SHELL[HEAD_END + len("</head>"): SHELL.index("<main")]
out = ROOT / "notes" / SLUG / "index.html"
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text(head + "</head>" + prefix + content + TAIL, encoding="utf-8")
print("wrote", out, out.stat().st_size, "bytes")
words = len(re.sub(r"<[^>]+>", " ", content).split())
print("words in body:", words)
