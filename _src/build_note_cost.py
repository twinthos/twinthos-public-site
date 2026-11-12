#!/usr/bin/env python3
"""Build /notes/digital-employee-cost/ — the three-year total cost page.
Distinct from /notes/cost-of-an-ai-employee/ (hourly running cost): this one is
TCO, including the lines suppliers leave out."""
import os
import sys
sys.path.insert(0, os.environ.get("TWINTHOS_SRC", "/root/twinthos_live/_src"))
from note_shell import build

TITLE = ("The three-year cost of a digital employee, including the three lines suppliers leave out")
DESC = ("The monthly fee is the least interesting number in the deal. Setup, the human who still has to "
        "approve the work, the cost of a job that fails, and the exit all sit outside it. Here is the whole "
        "sum, with the arithmetic shown so you can run it on your own figures.")

FAQ = [
    ("What does a digital employee cost to set up?",
     "Setup is the cost of writing the job down properly: what goes in, what comes out, what it must never do, "
     "and who it escalates to. That work is the product, and it is priced once. A supplier who charges nothing "
     "for setup has usually skipped the definition, which is where most failures start."),
    ("Is there a hidden cost in the human who approves the work?",
     "Yes, and it is the one buyers forget. Every consequential action needs a person to sign it off, and that "
     "person's attention is the real running cost. Budget half an hour a day, and treat an approval queue longer "
     "than that as a design fault rather than a staffing problem."),
    ("What happens if the job changes?",
     "The job definition changes with it, and that is a small, scoped piece of work rather than a rebuild, because "
     "the memory and the permissions stay in place. Ask for the change process in writing before you sign: what "
     "counts as a change, how long it takes, and whether it is charged."),
    ("Can we move to another supplier?",
     "Only if you can take the memory with you. Ask what format the company memory is exported in, and whether the "
     "job definition is a document you own or something locked in a vendor console. A supplier who cannot answer "
     "that is charging rent, not building an asset."),
    ("Why not just compare the monthly figure?",
     "Because the monthly figure says nothing about what you keep. Two quotes at the same price are not the same "
     "deal if one includes the job definition, the audit trail and the export, and the other charges for each. "
     "Compare the three-year total, then compare what you still own at the end of it."),
]

TOC = [
    ("why-monthly", "Why the monthly fee is the least interesting number"),
    ("five-lines", "The five lines of a three-year total"),
    ("worked", "A worked example, on illustrative numbers"),
    ("approver", "The line everyone forgets: the approver"),
    ("failure", "The cost of a job that fails"),
    ("exit", "The exit, and what you keep"),
    ("ask", "Four questions that expose the real total"),
]

RED = """<div class="nx-table"><table><thead><tr><th>Line</th><th>What it covers</th><th>How it is usually hidden</th></tr></thead><tbody>
<tr><td><b>1. Definition</b></td><td>Writing the job down: inputs, outputs, prohibitions, escalation, the number that proves it worked.</td><td>Folded into "onboarding" or left out entirely, then billed later as a change request.</td></tr>
<tr><td><b>2. Run</b></td><td>The monthly fee, including inference, hosting and support.</td><td>Quoted as a base fee, with usage, seats or "premium" models charged on top.</td></tr>
<tr><td><b>3. Oversight</b></td><td>A named person approving consequential actions. Half an hour a day is about £6,000 a year of attention.</td><td>Never mentioned. It is the largest recurring cost in most implementations and it belongs to the client.</td></tr>
<tr><td><b>4. Failure</b></td><td>The first job that goes wrong: the rework, the apology, the client who noticed.</td><td>Called "change management" and priced per incident, or absorbed silently until the renewal.</td></tr>
<tr><td><b>5. Exit</b></td><td>Getting the memory and the job definition out, and running the job yourself or elsewhere.</td><td>Not offered. The memory lives in a vendor console and leaves with the contract.</td></tr>
</tbody></table></div>"""

BODY = f"""<section class="nx-take"><h2>The answer in forty words</h2><ul>
<li>A digital employee has five cost lines: definition, run, oversight, failure and exit.</li>
<li>Most quotes show you the second one and nothing else.</li>
<li>Compare the three-year total, then compare what you still own at the end of it.</li>
<li>A cheap monthly fee that cannot be exported is not cheap, it is a subscription with a lock on it.</li>
</ul></section>

<p>Every conversation about the cost of an AI employee starts with the same question: what is the monthly fee? It is the easiest number to compare and the least useful. Two quotes at the same monthly figure can differ by a factor of three over three years, because the monthly fee is the only line most suppliers put on the page.</p>

<h2 id="why-monthly">Why the monthly fee is the least interesting number</h2>
<p>A monthly fee buys you a running cost. What it does not tell you is whether the job was ever defined properly, who is accountable when it goes wrong, how much of a person's day the approvals will consume, or whether you can leave. Those four things decide whether the implementation survives its second year, and none of them appear on the invoice.</p>
<p>The comparison that matters is against the work as it is currently paid for, not against other software. One UK administrator on &pound;28,000, loaded at 25% for employer National Insurance, pension and the overhead of a desk, costs about <b>&pound;35,000 a year</b>. That is &pound;2,917 a month and roughly <b>&pound;17.95 an hour</b> across 1,950 productive hours. Any three-year total should be judged against three years of that, not against a subscription.</p>

<h2 id="five-lines">The five lines of a three-year total</h2>
{RED}
<p>Read that table again as a list of questions rather than costs. Can the supplier show you the job definition as a document? Is the monthly fee all-in? How many approvals a day will the job generate? What happens the first time it is wrong? And what exactly do you get to keep if you leave?</p>

<h2 id="worked">A worked example, on illustrative numbers</h2>
<p>The figures below are <b>illustrative</b>, chosen to show the method rather than to quote a price. Put your own numbers in the same five rows and the comparison becomes obvious.</p>
<div class="wk"><span class="r"></span><b>Work being replaced: four administrators on &pound;29,375 loaded = &pound;117,500 a year, &pound;352,500 over three years.</b><b>Digital employee, illustrative: &pound;3,000 definition once, &pound;60,000 a year run, oversight 0.5 hours a day (&pound;6,000 a year of attention), one failure event budgeted at &pound;5,000. Three-year total: &pound;206,000. Retained saving: &pound;146,500.</b></div>
<p>Two things fall out of that arithmetic. First, the definition fee is noise: &pound;3,000 against &pound;206,000 is 1.5%, which is why arguing about setup cost is usually a distraction from the number that matters. Second, oversight is not noise. Half an hour a day is &pound;6,000 a year, and if the job needs two hours a day of approvals the case weakens quickly. That is a design question, not a pricing one.</p>
<p>A quote that only shows the &pound;60,000 line looks cheaper than it is. A quote that shows all five lines is the one to take seriously, even if the monthly figure is higher.</p>

<h2 id="approver">The line everyone forgets: the approver</h2>
<p>Anything consequential needs a person to sign it off. That is not a limitation to be engineered away; it is the reason the work can be delegated at all. But it has a cost, and it belongs to the client.</p>
<p>The discipline is to design the job so approvals are batched and rare. A job that produces forty small decisions a day has not removed work, it has moved work from doing to checking, which is often worse. A job that produces one exception report at 4pm, with three items on it, has genuinely returned time. When you are shown a demo, count the approvals, not the tasks.</p>

<h2 id="failure">The cost of a job that fails</h2>
<p>Every first implementation has a failure. The question is whether it is cheap and visible or expensive and silent. Cheap and visible means a rule catches it, it stops, it escalates, and the log shows exactly which record was wrong. Expensive and silent means it ran for three weeks and nobody noticed.</p>
<p>Budget for it rather than pretending it will not happen. A short pilot on real documents, with the error rate measured before full commitment, is the cheapest insurance in the whole deal: it converts an unknown liability into a number you can accept or reject.</p>

<h2 id="exit">The exit, and what you keep</h2>
<p>Ask what you own at the end. Three things should be yours: the job definition, the company memory, and the audit log. If any of those lives only in a vendor console, the monthly fee is rent on your own operating knowledge.</p>
<p>Model portability matters for the same reason. The model underneath is fuel and should be swappable; if a supplier's value disappears when the model changes, they were reselling a model, not running a job.</p>

<h2 id="ask">Four questions that expose the real total</h2>
<ol>
<li><b>Show me the five lines.</b> Definition, run, oversight, failure, exit. A supplier who can only produce one has not priced the work.</li>
<li><b>How many approvals a day will this generate?</b> Multiply by the approver's hourly cost. If the answer is vague, the job is not designed yet.</li>
<li><b>What is the export format for the memory and the job definition?</b> "It stays in our platform" is the answer that costs you the most.</li>
<li><b>What is the number that proves this worked, and when will we see it?</b> It should be agreed before the pilot, measured on your documents, and small enough to be checked by hand.</li>
</ol>

<section class="nx-twinthos"><h2>How Twinthos prices, in one paragraph</h2>
<p>One job, defined in writing, run through the screens you already own, with a named person approving anything consequential. The definition is a document you keep. The memory is yours and exportable. The model is swappable fuel. Every engagement starts with a short pilot measured on your own material, and if the job cannot be counted we say so rather than selling it.</p>
<p>We do not publish a price list, because a number without a job attached is a guess. What we will do is write the job down with you first, then price that job.</p>
<p>No client has bought this as paid work yet, so this page claims no savings and no case study. The arithmetic above is checkable on your own figures, which is the point of it.</p>
<h3 class="nx-twinthos-cta-h">Bring your five lines. We will fill in ours.</h3>
<p class="nx-twinthos-cta"><a class="btn btn-ink" href="/book/?interest=fit">Book a discovery call</a><a class="btn btn-line" href="/operations-audit/">See the operations audit</a></p>
<p class="nx-twinthos-note">One call, one job, one number. If it is not a fit, we will say so on the call.</p></section>

<p>Related reading: <a href="/notes/cost-of-an-ai-employee/">what a digital employee costs to run, hour by hour</a>, <a href="/notes/digital-employee-vs-chatbot/">the five differences between a chatbot and a digital employee</a>, and <a href="/notes/why-ai-automations-fail/">why automations fail after the first month</a>.</p>

<section><h2 id="faq">Questions people actually ask</h2><div class="nx-faq">"""

for q, a in FAQ:
    BODY += f'<details><summary>{q}</summary><div class="nx-faq-body"><p>{a}</p></div></details>'
BODY += "</div></section>"

out, words = build(
    slug="digital-employee-cost",
    title=TITLE, desc=DESC, date="2026-10-21",
    hero="cost-balance", hero_alt=("An old bronze balance scale on a concrete plinth in a dark room: one pan holds a "
                                   "paper folder, the other a small matte black cube, and the beam is level"),
    fig2="employee-desk", fig2_alt=("A single block of black polished granite shaped like a desk, standing alone in an "
                                    "empty hall, with one neat stack of pale folders and a shaft of daylight"),
    toc=TOC, body=BODY, faq=FAQ, section="Business",
    read_label="7 min read", words_label="1,600 words",
    about=["Digital employee", "Total cost of ownership", "Business process automation"],
    sources_line=("Figures are illustrative and labelled as such; the salary arithmetic uses &pound;28,000 + 25% employer "
                  "on-cost (&pound;35,000), &divide;12 (&pound;2,917) and &divide;1,950 hours (&pound;17.95). Salary "
                  "benchmark: ONS Annual Survey of Hours and Earnings, April 2025, median full-time gross &pound;39,039. "
                  "Built 21 October 2026."),
)
print("wrote", out, "words", words)
