(function(){
"use strict";
var entries=[{"id":"ai","label":"AI","description":"Software trained to recognise patterns and produce useful answers or actions. It can be wrong and still needs checks.","aliases":["artificial intelligence","AI"]},{"id":"ai-agent","label":"AI agent","description":"Software that can take steps towards a goal by choosing and using tools within its permissions.","aliases":["AI agent","AI agents","agentic AI"]},{"id":"digital-employee","label":"Digital employee","description":"An AI system configured to handle a defined business role or workflow with rules and human oversight.","aliases":["digital employee","digital employees"]},{"id":"chatbot","label":"Chatbot","description":"A chat-based assistant. Some chatbots can remember context or connect to tools, depending on how they are set up.","aliases":["chatbot","chatbots"]},{"id":"automation","label":"Automation","description":"A repeatable task or process handled by software instead of a person doing every step.","aliases":["automation","automations","automated"]},{"id":"workflow","label":"Workflow","description":"The sequence of steps that takes work from an incoming request to a completed result.","aliases":["workflow","workflows"]},{"id":"llm","label":"Large language model (LLM)","description":"The language-processing model that helps an AI system read, write, reason and respond.","aliases":["large language model","large language models","LLM","LLMs"]},{"id":"generative-ai","label":"Generative AI","description":"AI that creates content such as text, images or audio in response to instructions.","aliases":["generative AI","GenAI"]},{"id":"machine-learning","label":"Machine learning","description":"A way to develop software by learning patterns from examples rather than writing every rule by hand.","aliases":["machine learning"]},{"id":"prompt","label":"Prompt","description":"The instruction or context given to an AI system, for example a task description or a question.","aliases":["prompt","prompts"]},{"id":"prompt-injection","label":"Prompt injection","description":"When untrusted content tries to trick an AI agent into ignoring instructions or misusing its tools.","aliases":["prompt injection"]},{"id":"hallucination","label":"Hallucination","description":"When AI gives an answer that sounds convincing but is false or unsupported.","aliases":["hallucination","hallucinations","hallucinate"]},{"id":"api","label":"API","description":"A defined way for one piece of software to request data or an action from another.","aliases":["API","APIs","application programming interface"]},{"id":"integration","label":"Integration","description":"Connecting separate tools so information or tasks can move between them.","aliases":["integration","integrations"]},{"id":"token","label":"Token","description":"A small piece of text that an AI model processes. Providers often charge based on token use.","aliases":["token","tokens"]},{"id":"context-window","label":"Context window","description":"The amount of text and other information a model can work with in one request.","aliases":["context window"]},{"id":"inference","label":"Inference","description":"Using a trained model to generate a response or decision for a new input.","aliases":["inference"]},{"id":"rag","label":"Retrieval-augmented generation (RAG)","description":"Giving an AI model relevant documents or search results as evidence before it answers.","aliases":["retrieval-augmented generation","RAG"]},{"id":"knowledge-base","label":"Knowledge base","description":"A managed collection of documents and answers people or software can look up.","aliases":["knowledge base","knowledge bases"]},{"id":"memory","label":"Business memory","description":"The stored context an agent is allowed to retrieve, such as current rules and approved records.","aliases":["business memory","persistent memory"]},{"id":"permissions","label":"Permissions","description":"Rules that define which files, tools and actions someone or an AI agent is allowed to access.","aliases":["permissions","access controls"]},{"id":"audit-trail","label":"Audit trail","description":"A dated record showing what happened, what changed and sometimes who approved it.","aliases":["audit trail","action log","audit logs"]},{"id":"human-in-loop","label":"Human in the loop","description":"A workflow where a person checks or approves important steps before they finish.","aliases":["human in the loop","human-in-the-loop","human oversight"]},{"id":"escalation","label":"Escalation","description":"Passing an unusual, sensitive or uncertain case to a person who can decide what happens next.","aliases":["escalation","escalate","escalates"]},{"id":"pilot","label":"Pilot","description":"A limited trial used to test whether an approach works in real conditions before expanding it.","aliases":["pilot","pilots"]},{"id":"deployment","label":"Deployment","description":"Making a piece of software available for real users or business work.","aliases":["deployment","deploying","deployed"]},{"id":"roi","label":"Return on investment (ROI)","description":"A comparison of the value gained from an investment against what it cost.","aliases":["return on investment","ROI"]},{"id":"p-and-l","label":"Profit and loss (P&L)","description":"A financial summary showing a business's income, expenses and profit or loss.","aliases":["profit and loss","P&L","profit-and-loss"]},{"id":"uptime","label":"Uptime","description":"The time a service is available. It does not say how much useful work it completed.","aliases":["uptime"]},{"id":"latency","label":"Latency","description":"How long a system takes to respond to a request.","aliases":["latency"]},{"id":"transcription","label":"Transcription","description":"Turning spoken words from a call or recording into written text.","aliases":["transcription","speech-to-text"]},{"id":"webhook","label":"Webhook","description":"An automatic message sent from one app to another when a specified event happens.","aliases":["webhook","webhooks"]},{"id":"gdpr","label":"UK GDPR","description":"Rules governing how organisations handle people's personal information in the UK.","aliases":["UK GDPR","GDPR"]},{"id":"personal-data","label":"Personal data","description":"Information that identifies someone, or could reasonably help identify them.","aliases":["personal data"]},{"id":"data-retention","label":"Data retention","description":"The rules for how long information is kept, when it is deleted and who controls it.","aliases":["data retention"]},{"id":"encryption","label":"Encryption","description":"Scrambling data so it cannot be read without the right key.","aliases":["encryption","encrypted"]},{"id":"fine-tuning","label":"Fine-tuning","description":"Additional training that adapts an existing AI model for a specific task or style.","aliases":["fine-tuning","fine tuning"]},{"id":"guardrails","label":"Guardrails","description":"Checks and restrictions intended to stop an AI system taking unsafe or unauthorised actions.","aliases":["guardrails","guardrail"]},{"id":"vendor-lock-in","label":"Vendor lock-in","description":"A situation where changing software suppliers becomes expensive or difficult because of dependencies.","aliases":["vendor lock-in"]},{"id":"concurrency","label":"Concurrency","description":"More than one task being processed during the same period; this does not mean every task finishes correctly.","aliases":["concurrent","concurrency"]},{"id":"structured-data","label":"Structured data","description":"Machine-readable information added to a page to describe its subject and relationships.","aliases":["structured data"]},{"id":"sla","label":"Service-level agreement (SLA)","description":"A contract that defines expected service performance, support and remedies for failures.","aliases":["service-level agreement","SLA"]},{"id":"model","label":"AI model","description":"The trained software component that processes inputs and produces predictions or outputs.","aliases":["AI model","AI models","language model","language models"]}];
var glossary=document.querySelector('.nx-article');
if(!glossary)return;
var max=24,hitCount=0,seen={},last=null;
var entriesLong=[];
entries.forEach(function(e){e.aliases.forEach(function(a){entriesLong.push({entry:e,alias:a});});});
entriesLong.sort(function(a,b){return b.alias.length-a.alias.length;});
var escaped=entriesLong.map(function(x){return x.alias.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');});
var rex=new RegExp('\\b(?:'+escaped.join('|')+')\\b','gi');
var pop=document.createElement('div');
pop.id='nx-term-popover';pop.className='nx-term-popover';pop.setAttribute('role','tooltip');pop.hidden=true;
document.body.appendChild(pop);
function currentMatch(word){var low=word.toLowerCase();for(var i=0;i<entriesLong.length;i++){if(entriesLong[i].alias.toLowerCase()===low)return entriesLong[i].entry;}return null;}
function emit(type,key){window.dispatchEvent(new CustomEvent('twinthos:notes-interaction',{detail:{type:type,value:key||null,page:location.pathname}}));}
function close(){if(!last)return;pop.hidden=true;last.setAttribute('aria-expanded','false');last=null;}
function open(btn){
 if(last===btn&& !pop.hidden)return;
 var e=entries.find(function(x){return x.id===btn.dataset.nxTerm;});if(!e)return;
 if(last)last.setAttribute('aria-expanded','false');
 last=btn;btn.setAttribute('aria-expanded','true');
 pop.replaceChildren();
 var top=document.createElement('strong');top.textContent=e.label;
 var desc=document.createElement('span');desc.textContent=e.description;
 var link=document.createElement('a');link.href='/notes/#glossary-'+e.id;link.textContent='Full glossary ↗';
 pop.append(top,desc,link);pop.hidden=false;
 var rect=btn.getBoundingClientRect(),width=Math.min(340,innerWidth-28);
 if(innerWidth<650){pop.style.left='14px';pop.style.top='auto';pop.style.bottom='14px';pop.style.width='calc(100vw - 28px)';}
 else{
  pop.style.width=width+'px';pop.style.bottom='auto';
  pop.style.left=Math.max(12,Math.min(rect.left,innerWidth-width-12))+'px';
  var up=rect.bottom+14+145>innerHeight;pop.style.top=(up?Math.max(12,rect.top-160):rect.bottom+12)+'px';
 }
 emit('glossary_open',e.id);
}
var iterator=document.createTreeWalker(glossary,NodeFilter.SHOW_TEXT,{acceptNode:function(n){
 if(hitCount>=max||!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
 var p=n.parentElement;if(!p||p.closest('a,button,code,pre,svg,script,style,textarea,h1,h2,h3,h4,.nx-data-viz,.nx-table,.nx-field-test,.nx-toc,.nx-term'))return NodeFilter.FILTER_REJECT;
 rex.lastIndex=0;
 return rex.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;
 }});
var nodes=[];while(iterator.nextNode())nodes.push(iterator.currentNode);
nodes.forEach(function(n){
 if(hitCount>=max)return;
 var value=n.nodeValue,parts=[],cursor=0,found=false;rex.lastIndex=0;
 var match;
 while((match=rex.exec(value))&&hitCount<max){
  var e=currentMatch(match[0]);if(!e||seen[e.id])continue;
  if(match.index>cursor)parts.push(document.createTextNode(value.slice(cursor,match.index)));
  var b=document.createElement('button');b.type='button';b.className='nx-term';b.dataset.nxTerm=e.id;
  b.setAttribute('aria-controls','nx-term-popover');b.setAttribute('aria-expanded','false');
  b.setAttribute('aria-label',match[0]+': '+e.description);
  b.title=e.description;b.textContent=match[0];
  parts.push(b);seen[e.id]=true;hitCount++;found=true;cursor=rex.lastIndex;
 }
 if(found){if(cursor<value.length)parts.push(document.createTextNode(value.slice(cursor)));n.replaceWith.apply(n,parts);}
});
var hint=document.querySelector('.nx-glossary-hint-count');if(hint)hint.textContent=hitCount+' term'+(hitCount===1?'':'s')+' explained';
document.addEventListener('pointerover',function(ev){var b=ev.target.closest&&ev.target.closest('.nx-term');if(b && window.matchMedia('(hover:hover)').matches)open(b);});
document.addEventListener('pointerout',function(ev){var b=ev.target.closest&&ev.target.closest('.nx-term');if(b&&!(ev.relatedTarget&&ev.relatedTarget.closest&&ev.relatedTarget.closest('.nx-term-popover')))close();});
document.addEventListener('focusin',function(ev){var b=ev.target.closest&&ev.target.closest('.nx-term');if(b)open(b);});
document.addEventListener('focusout',function(ev){if(last&&!ev.relatedTarget?.closest?.('.nx-term-popover'))close();});
document.addEventListener('click',function(ev){var b=ev.target.closest&&ev.target.closest('.nx-term');if(b){open(b);}else if(!pop.contains(ev.target))close();});
document.addEventListener('keydown',function(ev){if(ev.key==='Escape'&&last){var btn=last;close();btn.focus();}});
window.addEventListener('scroll',function(){if(last)close();},{passive:true});
var article=document.querySelector('.nx-article'),bar=document.querySelector('.nx-reader-bar'),val=document.querySelector('.nx-progress-value');
if(article&&bar){
 var pending=false, milestones={};
 function update(){
  var r=article.getBoundingClientRect(),maxScroll=Math.max(1,article.offsetHeight-innerHeight*.45);
  var amount=Math.max(0,Math.min(100,Math.round((-r.top+innerHeight*.25)/maxScroll*100)));
  bar.style.transform='scaleX('+(amount/100)+')';if(val)val.textContent=amount+'% read';[25,50,75,100].forEach(function(m){if(amount>=m&&!milestones[m]){milestones[m]=true;emit('reading_milestone',String(m));}});pending=false;
 }
 window.addEventListener('scroll',function(){if(!pending){pending=true;requestAnimationFrame(update);}},{passive:true});
 window.addEventListener('resize',update);update();
}

// Events are exposed only to an explicit listener; they are not sent to an external service.
document.addEventListener('click',function(ev){
 var next=ev.target.closest&&ev.target.closest('a.nx-next-card');
 if(next)emit('related_story_open',next.getAttribute('href'));
 var share=ev.target.closest&&ev.target.closest('button[data-nx-share]');
 if(share)emit('share_action',null);
 var source=ev.target.closest&&ev.target.closest('.nx-data-viz figcaption a');
 if(source)emit('chart_source_open',null);
});
if('IntersectionObserver' in window){
 var data=[].slice.call(document.querySelectorAll('.nx-data-viz'));
 if(data.length){
  var obs=new IntersectionObserver(function(entries){
   entries.forEach(function(e){if(e.isIntersecting){emit('chart_view',e.target.querySelector('h3')?.id||'chart');obs.unobserve(e.target);}});
  },{threshold:.45});
  data.forEach(function(x){obs.observe(x);});
 }
}
})();