#!/usr/bin/env python3
"""Build /notes/questions-to-ask-managed-ai-agent/ — a buyer's due-diligence
checklist. Distinct from the ten-question section inside
/notes/what-an-ai-agent-actually-does/: this one is standalone, scored, and
written for procurement rather than orientation."""
import os
import sys
sys.path.insert(0, os.environ.get("TWINTHOS_SRC", "/root/twinthos_live/_src"))
from note_shell import build

TITLE = ("Nineteen questions to ask a managed AI agent supplier, and the answers that should end the meeting")
DESC = ("A due-diligence list you can run in half an hour: the job, the memory, the access, the safety, the "
        "money and the exit. For every question there is an acceptable answer and a tell. If you hear two tells, "
        "stop the meeting.")

FAQ = [
    ("How many of these questions should a supplier be able to answer on the first call?",
     "Most of them. The job, the memory, the access and the accountability questions are the product, so a serious "
     "supplier answers them without preparation. The ones that legitimately need a follow-up are pricing specifics "
     "and anything about your own systems."),
    ("What is the single strongest signal of a real implementation?",
     "A log of one completed task, end to end, with the records it touched. It is hard to fake, quick to read, and "
     "it tells you more about the design than any demo."),
    ("Should we ask for references?",
     "Yes, and ask what went wrong in the first month. A supplier with no live clients can still be credible if they "
     "say so plainly and offer a measured pilot instead; a supplier who invents a case study cannot be trusted about "
     "anything else."),
    ("What if our software has no API?",
     "That is the normal case, not the exception. The question is whether the agent works through the screens a person "
     "uses. If it needs an API and you do not have one, the project is an integration project with a two-year horizon."),
    ("How do we score the answers?",
     "One point for an answer you can verify, half a point for an answer with a date attached, nothing for an "
     "adjective. A supplier scoring under ten out of nineteen is not ready to be a dependency."),
]

TOC = [
    ("run-it", "How to run this in half an hour"),
    ("job", "The job (1 to 4)"),
    ("memory", "The memory (5 to 8)"),
    ("access", "The access and the permissions (9 to 11)"),
    ("safety", "The safety and the accountability (12 to 15)"),
    ("money", "The money and the exit (16 to 19)"),
    ("flags", "Five answers that are always a red flag"),
    ("score", "How to score it"),
]

QUESTIONS = [
    ("job", "The job", [
        ("What is the exact job, written down, including what it must never do?",
         "A document with inputs, outputs, prohibitions and an escalation rule. Ask to see it before you see the demo."),
        ("How often does that job happen, and who does it today?",
         "A frequency and a person. If nobody does it today, it is not a job, it is a hope."),
        ("What does the output look like, and who receives it?",
         "A named artefact: a filed return, a chased document, a closed case, a written summary with a timestamp."),
        ("What is the number that proves it worked, agreed before we start?",
         "One measurable outcome on your own material, small enough to check by hand."),
    ]),
    ("memory", "The memory", [
        ("Where does what it learns about our business live?",
         "A named store, isolated per client, with an owner inside your organisation."),
        ("Can two clients' data ever end up in the same memory?",
         "No, and the answer should be structural rather than a promise about good behaviour."),
        ("What does it do when it does not know something?",
         "It says so and asks, or escalates. An agent that fills the gap with a plausible sentence is a liability."),
        ("How is the memory corrected when it is wrong?",
         "A named person can edit it, and the correction persists. If corrections only last one conversation, it has no memory."),
    ]),
    ("access", "The access and the permissions", [
        ("Which systems does it touch, and with whose credentials?",
         "Your own accounts, your own permissions, scoped to the job. Never a shared superuser."),
        ("What can it read that it does not need?",
         "Nothing. Least privilege is a design decision, and it should be visible in the setup."),
        ("Does it need an API or a migration?",
         "No. It works through the screens a person uses, which is why it can be live in days rather than years."),
    ]),
    ("safety", "The safety and the accountability", [
        ("What is it not allowed to do without a human?",
         "A written list: anything irreversible, anything that reaches a client or a regulator, anything above a value threshold."),
        ("Who is accountable when the output is wrong?",
         "A named person in your organisation, with the authority to stop the job. 'The model' is not an answer."),
        ("Show me the log of one completed task, end to end.",
         "What it touched, in what order, what it changed, and when. This is the hardest thing to fake and the fastest way to judge the design."),
        ("How fast does it escalate, and to whom, when it stops?",
         "A named queue and a stated time. Silent failure is worse than a slow agent."),
    ]),
    ("money", "The money and the exit", [
        ("What does the three-year total look like, not just the monthly fee?",
         "Definition, run, oversight, failure and exit, on one page."),
        ("How much of a person's day will the approvals take?",
         "Half an hour or less, batched. Two hours of checking is a design fault, not a saving."),
        ("What do we own at the end, and in what format?",
         "The job definition, the memory and the log, exportable. Ask for the format by name."),
        ("Can we run the same job on a different model, or with another supplier?",
         "Yes, because the value is the memory and the job, not the model."),
    ]),
]

FLAGS = """<div class="nx-table"><table><thead><tr><th>The answer</th><th>What it usually means</th></tr></thead><tbody>
<tr><td>"It is basically ChatGPT with our wrapper."</td><td>No job, no permissions, no log. You are buying a seat with a logo on it.</td></tr>
<tr><td>"Our memory is the conversation history."</td><td>It forgets by design. Every session starts from zero.</td></tr>
<tr><td>"It learns automatically, so there is nothing to maintain."</td><td>Nobody can correct it, which means nobody can trust it.</td></tr>
<tr><td>"We will need an API or a data migration."</td><td>You have bought an integration project with a two-year horizon and a change programme attached.</td></tr>
<tr><td>"We have clients you can speak to" followed by silence.</td><td>Either the clients are not real or the permission is not. Both matter.</td></tr>
</tbody></table></div>"""

body = ['<section class="nx-take"><h2>The answer in forty words</h2><ul>',
        '<li>Six groups: the job, the memory, the access, the safety, the money, the exit.</li>',
        '<li>Every question has an acceptable answer and a tell. Two tells and you stop.</li>',
        '<li>The strongest evidence is a log of one completed task, end to end.</li>',
        '<li>The weakest is a demo. Demos are conversations; jobs are queues.</li>',
        '</ul></section>',
        '<p>Most AI buying conversations fail for a boring reason: nobody asked what the thing actually does, in writing, before the demo started. This page is the list to take into the room. It takes about thirty minutes to run and it will separate a product from a presentation.</p>',
        '<h2 id="run-it">How to run this in half an hour</h2>',
        '<p>Ask the supplier to answer in writing before the call, then use the call to test the answers. Written answers are harder to perform and easier to forward to the person who has to approve the spend.</p>',
        '<p>Score as you go: <b>one point</b> for an answer you can verify, <b>half a point</b> for an answer with a date or a name attached, <b>nothing</b> for an adjective. Nineteen points available. Fourteen or more is a supplier worth a pilot; under ten is a supplier who has not built the thing yet.</p>']

for qid, qtitle, qs in QUESTIONS:
    body.append(f'<h2 id="{qid}">{qtitle}</h2><ol>')
    for q, a in qs:
        body.append(f'<li><b>{q}</b><br>{a}</li>')
    body.append('</ol>')

body.append('<h2 id="flags">Five answers that are always a red flag</h2>')
body.append(FLAGS)
body.append("""<p>Any single one of those is survivable in a bad call. Two is a pattern. The pattern matters more than the individual answer, because it tells you the supplier has not thought about what happens after the demo ends.</p>
<h2 id="score">How to score it</h2>
<p>Add the points, then ask one more question that is not on the list: <b>what would you tell us not to buy?</b> A supplier who can name the jobs they are wrong for has a defined product. A supplier who says yes to everything has a prompt and an invoice template.</p>
<p>Then do the only test that really counts. Pick one job, put a number on it, and run two weeks on your own material. Every question above is a proxy for that; the pilot is the thing itself.</p>

<section class="nx-twinthos"><h2>How we answer these nineteen</h2>
<p>We sell one job at a time, defined in writing, run through the screens you already own. The memory is yours and exportable. The model is swappable fuel. A named person in your business approves anything consequential, and every action is logged and reversible.</p>
<p>No client has bought this as paid work yet, so we have no case study to show you and we will not invent one. What we can offer instead is the job definition written with you, and a short pilot measured on your own documents.</p>
<h3 class="nx-twinthos-cta-h">Run the nineteen on us.</h3>
<p class="nx-twinthos-cta"><a class="btn btn-ink" href="/book/?interest=fit">Book a discovery call</a><a class="btn btn-line" href="/operations-audit/">See the operations audit</a></p>
<p class="nx-twinthos-note">Bring the list. If we score badly on it, you will know inside half an hour.</p></section>

<p>Related reading: <a href="/notes/digital-employee-vs-chatbot/">the five differences between a chatbot and a digital employee</a>, <a href="/notes/digital-employee-cost/">the three-year total cost, including the hidden lines</a>, and <a href="/notes/the-company-brain/">why company memory is the part everyone skips</a>.</p>

<section><h2 id="faq">Questions people actually ask</h2><div class="nx-faq">""")
for q, a in FAQ:
    body.append(f'<details><summary>{q}</summary><div class="nx-faq-body"><p>{a}</p></div></details>')
body.append("</div></section>")

out, words = build(
    slug="questions-to-ask-managed-ai-agent",
    title=TITLE, desc=DESC, date="2026-10-21",
    hero="questions-cards", hero_alt=("Overhead view of a long dark table with a neat row of identical blank white cards "
                                      "fading into shadow, one card turned face down"),
    fig2="chatbot-vs-employee", fig2_alt=("Two stone doorways in a bare concrete wall: the left filled with flat white "
                                          "light, the right opening onto a small lit room with a chair, a desk and files"),
    toc=TOC, body="".join(body), faq=FAQ, section="Business",
    read_label="8 min read", words_label="1,700 words",
    about=["Digital employee", "Procurement", "Artificial intelligence governance"],
    sources_line=("Written 21 October 2026 as a buying checklist, not a product specification. The scoring method is "
                  "our own and deliberately simple: verifiable answers score, adjectives do not. Cross-checked against "
                  "the questions we are asked on discovery calls, and against what our own product can actually show."),
)
print("wrote", out, "words", words)
