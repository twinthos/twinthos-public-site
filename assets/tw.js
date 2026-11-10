/* Twinthos v8 site script. No dependencies. Nav, mobile menu, sticky CTA, enquiry form. */
(function(){
'use strict';
var d=document, W=window;
var STQ=W.matchMedia('(min-width: 900px)');

/* nav */
var nav=d.querySelector('.nav'), tog=d.querySelector('.nav-toggle'), links=d.getElementById('navLinks');
function onS(){nav&&nav.classList.toggle('scrolled',W.scrollY>8);}
W.addEventListener('scroll',onS,{passive:true});onS();
if(tog){
  var setNav=function(o){tog.setAttribute('aria-expanded',o);tog.setAttribute('aria-label',o?'Close menu':'Open menu');links.classList.toggle('open',o);};
  tog.addEventListener('click',function(){setNav(tog.getAttribute('aria-expanded')!=='true');});
  links.addEventListener('click',function(e){if(e.target.closest('a'))setNav(false);});
  d.addEventListener('keydown',function(e){if(e.key==='Escape'&&tog.getAttribute('aria-expanded')==='true'){setNav(false);tog.focus();}});
  STQ.addEventListener&&STQ.addEventListener('change',function(){setNav(false);});
}

/* mobile sticky call-to-action: appears once the hero button has scrolled away, hides at pricing and the closing call */
var stick=d.querySelector('.stick'), prime=d.querySelector('.rh-primary');
if(stick&&prime&&'IntersectionObserver' in W){
  var vis={hero:true,end:false};
  var upd=function(){stick.classList.toggle('on',!vis.hero&&!vis.end);};
  new IntersectionObserver(function(e){vis.hero=e[0].isIntersecting;upd();},{rootMargin:'-68px 0px 0px 0px'}).observe(prime);
  var endEl=d.querySelector('#close');
  if(endEl)new IntersectionObserver(function(e){vis.end=e[0].isIntersecting;upd();},{threshold:.2}).observe(endEl);
}

/* ── enquiry form ── */
d.querySelectorAll('form[data-form]').forEach(function(f){
  var done=d.getElementById(f.dataset.done), fail=f.querySelector('.form-fail'), btn=f.querySelector('[type=submit]');
  var subj=f.querySelector('[name=_subject]');
  var LBL={security:'AI security review',fit:'Discovery call',audit:'Operations audit (£999)',managed:'Managed digital employee (£3,500 per month)',unsure:'Not sure yet'};
  var sel=f.querySelector('.interest');
  var sync=function(){var c=f.querySelector('[name=interest]:checked');if(!c)return;
    subj.value='Twinthos enquiry: '+LBL[c.value];
    d.querySelectorAll('[data-for]').forEach(function(e){e.hidden=e.dataset.for!==c.value;});};
  if(sel){
    var want=new URLSearchParams(location.search).get('interest');
    var r=Object.prototype.hasOwnProperty.call(LBL,want)&&f.querySelector('[name=interest][value="'+want+'"]');
    if(r)r.checked=true;
    sel.addEventListener('change',sync);sync();
  }
  var check=function(i){
    var w=i.closest('.fld'),v=i.value.trim(),bad=!v||(i.type==='email'&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v));
    w.classList.toggle('err',bad);i.setAttribute('aria-invalid',bad?'true':'false');return !bad;
  };
  f.querySelectorAll('[required]').forEach(function(i){
    i.addEventListener('blur',function(){if(i.value.trim()||i.closest('.fld').classList.contains('err'))check(i);});
    i.addEventListener('input',function(){if(i.closest('.fld').classList.contains('err'))check(i);});
  });
  f.addEventListener('submit',function(e){
    e.preventDefault();var first=null;
    f.querySelectorAll('[required]').forEach(function(i){if(!check(i)&&!first)first=i;});
    var sum=f.querySelector('.form-sum');
    if(first){if(sum){sum.hidden=false;}first.focus();return;}
    if(sum)sum.hidden=true;
    if(f.querySelector('[name=_honey]').value)return;
    var o={};new FormData(f).forEach(function(v,k2){o[k2]=v;});
    if(o.interest)o.interest=LBL[o.interest]||o.interest;
    btn.disabled=true;var old=btn.innerHTML;btn.textContent='Sending…';fail.hidden=true;
    var ctrl=new AbortController(), timer=setTimeout(function(){ctrl.abort();},15000);
    fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(o),signal:ctrl.signal})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||j.success===false||j.success==='false'||j.success===undefined)throw 0;});})
      .then(function(){f.hidden=true;done.hidden=false;var h=done.querySelector('h2');h.setAttribute('tabindex','-1');h.focus();})
      .catch(function(){fail.hidden=false;btn.disabled=false;btn.innerHTML=old;fail.focus();})
      .finally(function(){clearTimeout(timer);});
  });
});
})();

/* Shared, progressively enhanced tool explorer, permission example and Notes search. */
(function(){'use strict';
document.querySelectorAll('[data-explorer]').forEach(function(root){
 var tabs=Array.from(root.querySelectorAll('[role=tab]'));
 function select(tab,focus){tabs.forEach(function(t){var yes=t===tab;t.setAttribute('aria-selected',String(yes));t.tabIndex=yes?0:-1;document.getElementById(t.getAttribute('aria-controls')).hidden=!yes;});if(focus)tab.focus();}
 tabs.forEach(function(t,i){t.addEventListener('click',function(){select(t,false);});t.addEventListener('keydown',function(e){var n;if(e.key==='ArrowRight'||e.key==='ArrowDown')n=(i+1)%tabs.length;if(e.key==='ArrowLeft'||e.key==='ArrowUp')n=(i+tabs.length-1)%tabs.length;if(e.key==='Home')n=0;if(e.key==='End')n=tabs.length-1;if(n!==undefined){e.preventDefault();select(tabs[n],true);}});});select(tabs[0],false);
});
var results={allow:['Within scope','Access matches the job.','The agent can read the approved policy source. The permission is limited to the information needed for this task.'],review:['Human review','Prepare it. Ask before sending.','The agent may draft a customer reply, but a named person must approve the message before it leaves the business.'],deny:['Outside scope','The request crosses a boundary.','A full customer export is not part of the agreed job. The application should deny this action and record the attempt for review.']};
document.querySelectorAll('[data-boundary]').forEach(function(root){root.querySelectorAll('[data-outcome]').forEach(function(b){b.addEventListener('click',function(){var r=results[b.dataset.outcome];root.querySelectorAll('[data-outcome]').forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});root.querySelector('[data-result]').textContent=r[0];root.querySelector('[data-result-title]').textContent=r[1];root.querySelector('[data-result-copy]').textContent=r[2];});});});
var search=document.getElementById('notes-search');if(search){var category='all',cards=Array.from(document.querySelectorAll('[data-note]')),filters=Array.from(document.querySelectorAll('[data-category-filter]'));
 function filter(){var q=search.value.trim().toLowerCase(),count=0;cards.forEach(function(card){var show=(category==='all'||card.dataset.category===category)&&card.textContent.toLowerCase().includes(q);card.hidden=!show;if(show)count++;});document.getElementById('notes-count').textContent=count+' field note'+(count===1?'':'s');document.getElementById('notes-empty').hidden=count!==0;}
 filters.forEach(function(b){b.addEventListener('click',function(){category=b.dataset.categoryFilter;filters.forEach(function(x){x.setAttribute('aria-pressed',String(x===b));});filter();});});search.addEventListener('input',filter);filter();}
})();

/* Twinthos editorial tools. One real interface, progressive enhancement, no external scripts. */
(function(){'use strict';
document.querySelectorAll('[data-folio]').forEach(function(root){
 var controls=Array.from(root.querySelectorAll('[data-folio-option]'));
 var stage=root.querySelector('.folio-stage');
 var title=root.querySelector('[data-folio-title]');
 var detail=root.querySelector('[data-folio-detail]');
 var boundary=root.querySelector('[data-folio-boundary]');
 var icon=root.querySelector('[data-folio-icon]');
 var photo=root.querySelector('[data-folio-photo-display]');
 var counter=root.querySelector('[data-folio-count]');
 var allowed=['memory','email','phone','computer','files','card','security'];
 function activate(button,focus){
  var key=button.getAttribute('data-folio-option');
  if(allowed.indexOf(key)<0)return;
  controls.forEach(function(el){var current=el===button;el.classList.toggle('is-current',current);el.setAttribute('aria-pressed',String(current));});
  title.textContent=button.dataset.title;
  detail.textContent=button.dataset.detail;
  boundary.textContent=button.dataset.boundary;
  if(icon)icon.setAttribute('href','#folio-'+key);
  if(photo && button.dataset.folioPhoto && photo.getAttribute('src')!==button.dataset.folioPhoto){
    photo.src=button.dataset.folioPhoto;
    photo.alt=button.dataset.folioAlt||'Real working environment';
  }
  counter.textContent=String(allowed.indexOf(key)+1).padStart(2,'0');
  if(focus)button.focus();
  if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: no-preference)').matches&&stage.animate){
    stage.animate([{opacity:.65,transform:'translateY(6px)'},{opacity:1,transform:'translateY(0px)'}],{duration:320,easing:'ease-out'});
  }
 }
 controls.forEach(function(button,index){
  button.addEventListener('click',function(){activate(button,false)});
  button.addEventListener('keydown',function(event){
   var next=null;
   if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%controls.length;
   else if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index+controls.length-1)%controls.length;
   else if(event.key==='Home')next=0;
   else if(event.key==='End')next=controls.length-1;
   if(next!==null){event.preventDefault();activate(controls[next],true);controls[next].scrollIntoView({block:'nearest',inline:'nearest'});}
  });
 });
});
})();
/* Lightweight scroll choreography. Information remains visible without JavaScript. */
(function(){'use strict';
 var doc=document, win=window, reduce=win.matchMedia&&win.matchMedia('(prefers-reduced-motion: reduce)').matches;
 var scene=doc.querySelector('[data-scroll-cinema]'),hero=doc.querySelector('.editorial-hero-photo');
 var progress=doc.createElement('div');progress.className='site-scroll-progress';progress.setAttribute('aria-hidden','true');doc.body.appendChild(progress);
 if('IntersectionObserver' in win&&!reduce){
  var targets=Array.from(doc.querySelectorAll('.cinema-intro,.statement-layout,.statement-rows,.folio-header,.operating-head,.security-editorial-inner,.notes-editorial-heading,.phead .wrap,.article-head,.notes-head'));
  targets.forEach(function(target){target.setAttribute('data-reveal','');});
  var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-visible');observer.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px',threshold:0});
  targets.forEach(function(target){observer.observe(target);});
  doc.documentElement.classList.add('motion-ready');
 }
 var chapters=scene?Array.from(scene.querySelectorAll('[data-cinema-chapter]')):[],label=scene&&scene.querySelector('[data-cinema-label]'),title=scene&&scene.querySelector('[data-cinema-title]'),counter=scene&&scene.querySelector('[data-cinema-counter]'),current=-1;
 var labels=['01 / KNOW','02 / ACT','03 / VERIFY'],titles=['Context with an owner.','Tools with a boundary.','Evidence over claims.'];
 var storyHeads=['Know the facts.','Prepare the reply.','A person decides.'];
 var storyCopies=[
   'Read the owner’s approved service information before answering the customer.',
   'Use the permitted inbox to prepare a response. Writing a draft is not sending it.',
   'The owner reviews the exact message and must approve any external send.'
 ];
 var storyNumber=scene&&scene.querySelector('[data-cinema-number]');
 var storyHead=scene&&scene.querySelector('[data-cinema-story-head]');
 var storyCopy=scene&&scene.querySelector('[data-cinema-story-copy]');
 var storySteps=scene?Array.from(scene.querySelectorAll('[data-story-step]')):[];

 function setChapter(index){
  if(!scene||index===current)return;current=index;
  scene.setAttribute('data-cinema-active',String(index));
  chapters.forEach(function(x,i){x.classList.toggle('is-active',i===index);});
  if(label)label.textContent=labels[index];
  if(title)title.textContent=titles[index];
  if(counter)counter.textContent=String(index+1).padStart(2,'0')+' / 03';
  if(storyNumber)storyNumber.textContent=String(index+1).padStart(2,'0');
  if(storyHead)storyHead.textContent=storyHeads[index];
  if(storyCopy)storyCopy.textContent=storyCopies[index];
  storySteps.forEach(function(step,i){step.classList.toggle('is-current',i===index);step.classList.toggle('is-complete',i<index);});
 }
 if(scene)setChapter(0);
 var ticking=false;
 function update(){
  ticking=false;
  if(!reduce){
   var root=doc.documentElement,available=Math.max(1,root.scrollHeight-win.innerHeight),percent=Math.min(1,Math.max(0,win.scrollY/available));
   progress.style.transform='scaleX('+percent.toFixed(5)+')';
   if(hero&&win.scrollY<win.innerHeight*1.5){
    hero.style.setProperty('--hero-shift',Math.min(55,Math.max(0,win.scrollY*.052)).toFixed(1)+'px');
   }
  }
  if(chapters.length){
   var middle=win.innerHeight*.52,index=0;
   chapters.forEach(function(chapter,i){if(chapter.getBoundingClientRect().top<=middle)index=i;});
   setChapter(index);
  }
 }
 function onScroll(){if(!ticking){ticking=true;win.requestAnimationFrame(update);}}
 win.addEventListener('scroll',onScroll,{passive:true});
 win.addEventListener('resize',onScroll,{passive:true});
 update();
})();
