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

/* Luminous layer: hero window field, headline rise, spotlight, step signal. No dependencies. */
(function(){'use strict';
var d=document,W=window,root=d.documentElement,RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches;
root.classList.add('lum');
var hero=d.querySelector('.editorial-hero');
/* 1. Headline: split words into masked lines */
if(hero&&!RM){
 var h1=hero.querySelector('h1'),n=0;
 if(h1&&!h1.dataset.lum){h1.dataset.lum='1';h1.setAttribute('aria-label',h1.innerHTML.replace(/<br\s*\/?>/gi,' ').replace(/<[^>]+>/g,'').replace(/\s+/g,' ').trim());
  (function walk(el){Array.from(el.childNodes).forEach(function(node){
   if(node.nodeType===3){var parts=node.textContent.split(/(\s+)/),frag=d.createDocumentFragment();
    parts.forEach(function(p){if(!p)return;if(/^\s+$/.test(p)){frag.appendChild(d.createTextNode(p));return;}
     var w=d.createElement('span');w.className='lw';var i=d.createElement('i');i.textContent=p;i.style.setProperty('--d',(0.18+n*0.11).toFixed(2)+'s');n++;w.appendChild(i);frag.appendChild(w);});
    node.parentNode.replaceChild(frag,node);}
   else if(node.nodeType===1&&node.tagName!=='BR')walk(node);});})(h1);
  
 }
}
/* 2. live dot */
var foot=d.querySelector('.editorial-hero-foot>span');if(foot)foot.classList.add('lum-live');
/* 3. Spotlight on dark sections (fine pointers only) */
if(W.matchMedia&&W.matchMedia('(pointer:fine)').matches){
 d.querySelectorAll('.statement,.operating-logic,.editorial-cases,.close').forEach(function(s){s.classList.add('lum-spot');
  s.addEventListener('pointermove',function(e){var r=s.getBoundingClientRect();s.style.setProperty('--sx',(e.clientX-r.left)+'px');s.style.setProperty('--sy',(e.clientY-r.top)+'px');s.style.setProperty('--so','1');},{passive:true});
  s.addEventListener('pointerleave',function(){s.style.setProperty('--so','0');});});
}
/* 4. Steps light up when they enter view */
var steps=d.querySelector('.operating-steps');
if(steps){if('IntersectionObserver' in W&&!RM){var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){steps.classList.add('is-lit');io.disconnect();}},{threshold:.25});io.observe(steps);}else steps.classList.add('is-lit');}
/* 5. Vanish band: strike-through draws as the word passes centre */
var band=d.querySelector('.lum-vanish');
if(band&&!RM){var strikes=band.querySelectorAll('s'),bv=false;
 if('IntersectionObserver' in W)new IntersectionObserver(function(e){bv=e[0].isIntersecting;if(bv)tick();}).observe(band);
 function tick(){if(!bv)return;var mid=W.innerWidth*.5;for(var i=0;i<strikes.length;i++){var r=strikes[i].getBoundingClientRect(),c=r.left+r.width/2,k=Math.min(1,Math.max(0,(mid+W.innerWidth*.15-c)/(W.innerWidth*.3)));strikes[i].style.setProperty('--k',k.toFixed(3));}W.requestAnimationFrame(tick);}
}
})();

(function(){var b=document.querySelector('.article-body');if(!b||window.matchMedia('(prefers-reduced-motion: reduce)').matches)return;var r=document.createElement('div');r.className='read-rail';r.setAttribute('aria-hidden','true');document.body.appendChild(r);var tk=0;function u(){tk=0;var a=b.getBoundingClientRect(),h=a.height-window.innerHeight*.6,k=Math.min(1,Math.max(0,(-a.top+window.innerHeight*.3)/Math.max(1,h)));r.style.transform='scaleX('+k.toFixed(4)+')';}window.addEventListener('scroll',function(){if(!tk)tk=requestAnimationFrame(u);},{passive:true});u();})();

/* THE GATE. ~80k GPU points: tangled work enters, crosses a lit gate, leaves as straight calm lanes.
   Pure function of (seed, time): no feedback buffers. Hero = chaos->order. Close = all calm. */
(function(){'use strict';
var W=window,d=document,RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches;
var VS=[
'precision highp float;',
'attribute vec4 aS;',
'uniform float uT,uGate,uCalm,uDpr,uIntro,uScroll,uAsp,uAmp,uL,uRot,uDim;','uniform vec3 uTone;',
'uniform vec2 uMouse,uTilt;',
'varying vec4 vC;',
'void main(){',
' float sp=.045+aS.z*.03;',
' float u=fract(aS.x+uT*sp);',
' float x0=-1.3,x1=1.35;',
' float x=mix(x0,x1,u);',
' float L=uL;',
' float li=floor(aS.y*L);',
' float lf=li/(L-1.);',
' float laneY=(lf*2.-1.)*.8;',
' float laneZ=(fract(li*.618)-.5)*.5*(1.-uCalm*.95);',
' float s=clamp((x-x0)/(uGate-x0),0.,1.);',
' float conv=max(smoothstep(.34,1.,s),uCalm);',
' float t=uT;',
' float sy1=sin(x*2.6+li*1.7+t*.42)*.50+sin(x*4.7-li*2.9+t*.7)*.34+sin(x*9.1+li*5.3-t*.6)*.16;',
' float sz1=cos(x*2.9-li*2.3+t*.4)*.6+sin(x*5.3+li*3.1-t*.55)*.4;',
' float amp=uAmp*1.45*pow(1.-conv,1.1);',
' float th=mix(.035,.0045,conv)*(1.-uCalm*.8);',
' float ny=(aS.z-.5)*2.*th,nz=(aS.w-.5)*2.*th*3.;',
' float y=laneY+sy1*amp*4.2+ny;',
' float z=laneZ+sz1*amp*3.6+nz;',
' y+=sin(x*2.2+uT*.45+li*.7)*.006*conv*(1.-uCalm);',
' vec2 dm=vec2(x,y)-uMouse;',
' float md=length(dm*vec2(uAsp,1.));',
' float pf=exp(-md*md*6.)*(1.-conv);',
' vec2 push=dm/(md+.07)*pf*.14;',
' x+=push.x;y+=push.y;z+=pf*.25;',
' float gd=x-uGate;',
' float flare=exp(-gd*gd*520.)*(1.-uCalm);',
' float cy=cos(uTilt.x),sy=sin(uTilt.x);',
' float x2=x*cy+z*sy,z2=-x*sy+z*cy;',
' float cx=cos(uTilt.y),sx=sin(uTilt.y);',
' float y2=y*cx-z2*sx,z3=y*sx+z2*cx;',
' y2+=uScroll*.35;z3-=uScroll*.5;',
' float w=1.+z3*.38;',
' vec2 P=vec2(x2,y2)/w;',
' gl_Position=uRot>.5?vec4(P.y*1.05,-P.x,0.,1.):vec4(P,0.,1.);',
' float fadeEnd=1.-smoothstep(1.02,1.3,x);',
' float fadeIn=smoothstep(-1.3,-1.0,x);',
' float bright=.7+1.6*pf;',
' float chaosA=(.9+aS.z*.9)*(1.-conv);',
' float laneA=(.34+aS.w*.30*(1.-uCalm*.8))*conv*(1.+uCalm*1.1);',
' float a=(chaosA+laneA)*fadeEnd*fadeIn*bright;',
' a+=flare*1.1;',
' float intro=smoothstep(0.,1.,uIntro*1.7-aS.y*.7);',
' a*=intro*(1.-uScroll*.9)*uDim;',
' float size=mix(2.4+aS.z*2.8,1.3+aS.w*.8+uCalm*.9,conv)+flare*6.+pf*3.;',
' gl_PointSize=max(1.,size*uDpr/w);',
' vec3 cc=mix(vec3(.62,.72,.95),vec3(1.,.62,.38),step(.66,aS.w));',
' vec3 cl=uTone;',
' vec3 ce=vec3(.25,.62,1.);',
' vec3 col=mix(cc,cl,conv);',
' col=mix(col,ce,clamp(flare*1.2+pf*.5,0.,1.));',
' col+=vec3(.5)*flare*flare;',
' vC=vec4(col,a);',
'}'].join('\n');
var FS=['precision mediump float;','varying vec4 vC;','void main(){vec2 p=gl_PointCoord-.5;float r=length(p);if(r>.5)discard;float f=1.-r*2.;f*=f;gl_FragColor=vec4(vC.rgb,vC.a*f);}'].join('\n');

function sh(gl,t,src){var s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s));}return s;}

function stage(host,cfg){
 var cv=d.createElement('canvas');cv.className='gate-cv';cv.setAttribute('aria-hidden','true');
 host.insertBefore(cv,host.firstChild);if(!cfg.calm){var bm=d.createElement('div');bm.className='gate-beam';bm.setAttribute('aria-hidden','true');host.insertBefore(bm,cv.nextSibling);}
 var gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'});
 if(!gl){cv.remove();return null;}
 var pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl,gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error('link');}catch(e){cv.remove();return null;}
 gl.useProgram(pr);
 var small=W.innerWidth<700,N=cfg.count*(small?(cfg.calm?.5:.32):1)|0;
 var seeds=new Float32Array(N*4);for(var i=0;i<N;i++){seeds[i*4]=Math.random();seeds[i*4+1]=Math.random();seeds[i*4+2]=Math.random();seeds[i*4+3]=Math.random();}
 var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,seeds,gl.STATIC_DRAW);
 var loc=gl.getAttribLocation(pr,'aS');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,4,gl.FLOAT,false,0,0);
 var U={};['uT','uGate','uCalm','uDpr','uIntro','uScroll','uAsp','uAmp','uL','uMouse','uTilt','uRot','uDim','uTone'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);
 gl.clearColor(5/255,7/255,11/255,1);
 var tone=cfg.tone||[.86,.93,1.];var dpr=Math.min(W.devicePixelRatio||1,1.75),w=1,h=1,mx=2,my=2,tx=0,ty=0,sx=0,sy=0,vis=true,raf=0,t0=performance.now(),forceT=null,scroll=0;
 function size(){var r=cv.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);cv.width=w*dpr|0;cv.height=h*dpr|0;gl.viewport(0,0,cv.width,cv.height);}
 function anchorGate(){var a=cfg.anchor&&host.querySelector(cfg.anchor);if(!a)return cfg.gateP!==undefined?cfg.gateP:-.1;var py=a.getBoundingClientRect().top-cv.getBoundingClientRect().top-(cfg.anchorGap||22);return Math.max(-.7,Math.min(.8,2*py/h-1));}
 function ease(k){k=Math.min(1,Math.max(0,k));return 1-Math.pow(1-k,3);}
 function frame(now){
  raf=0;if(!vis)return;
  var el=forceT!==null?forceT:(now-t0)/1000;
  sx+=(tx-sx)*.06;sy+=(ty-sy)*.06;
  var phone=W.innerWidth<=760,port=phone||w<h*.9,rot=phone;
  var gateFinal=rot?(cfg.calm?cfg.gate:anchorGate()):port?.55:cfg.gate;
  var intro=cfg.intro?ease(el/cfg.intro):1;
  var gate=cfg.calm?-1.5:(cfg.intro?1.45+(gateFinal-1.45)*intro:gateFinal);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(U.uT,el+(cfg.t0||0));gl.uniform1f(U.uGate,gate);gl.uniform1f(U.uCalm,cfg.calm?1:0);
  gl.uniform1f(U.uDpr,dpr);gl.uniform1f(U.uIntro,cfg.intro?Math.min(1,el/1.4):1);gl.uniform1f(U.uScroll,scroll);
  gl.uniform1f(U.uAsp,w/h);gl.uniform1f(U.uL,cfg.calm?(port?9:13):(phone?15:port?22:34));gl.uniform1f(U.uAmp,phone?.15:port?.17:.2);
  gl.uniform1f(U.uRot,rot?1:0);gl.uniform1f(U.uDim,rot?(cfg.dimP||cfg.dim||1):(cfg.dim||1));gl.uniform3f(U.uTone,tone[0],tone[1],tone[2]);
  host.style.setProperty('--gx',(((cfg.calm?-2:gate)+1)/2*cv.offsetWidth+cv.offsetLeft).toFixed(1)+'px');host.style.setProperty('--gy',(((cfg.calm?-2:gate)+1)/2*cv.offsetHeight+cv.offsetTop).toFixed(1)+'px');
  gl.uniform2f(U.uMouse,mx,my);gl.uniform2f(U.uTilt,sx*.16,-sy*.09);
  gl.drawArrays(gl.POINTS,0,N);
  if(!RM&&forceT===null)raf=W.requestAnimationFrame(frame);
 }
 function kick(){if(!raf&&vis)raf=W.requestAnimationFrame(frame);}
 size();
 if(RM){forceT=cfg.still||9;frame(0);}else kick();
 if(W.ResizeObserver)new ResizeObserver(function(){size();if(RM||forceT!==null)frame(0);}).observe(host);
 if('IntersectionObserver' in W)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)kick();}).observe(host);
 d.addEventListener('visibilitychange',function(){vis=!d.hidden;if(vis)kick();});
 if(!RM&&W.matchMedia('(pointer:fine)').matches){
  host.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=((e.clientX-r.left)/r.width)*2-1;my=-(((e.clientY-r.top)/r.height)*2-1);tx=mx;ty=my;},{passive:true});
  host.addEventListener('pointerleave',function(){mx=my=2;tx=ty=0;});
 }
 if(cfg.scroll){W.addEventListener('scroll',function(){var k=Math.min(1,Math.max(0,W.scrollY/(h*.9)));scroll=k;},{passive:true});}
 host.classList.add('gate-on');
 return {set:function(t){forceT=t;frame(0);},n:N,canvas:cv};
}

var TONES={'AI security':[1.,.80,.80],'Agents & tools':[.80,.88,1.],'Business decisions':[1.,.90,.72]};
var hero=d.querySelector('.editorial-hero');
if(hero){W.__gateHero=stage(hero,{count:80000,gate:.46,intro:3.6,scroll:true,still:9,anchor:'.editorial-hero-bottom',anchorGap:20,dimP:1.45});}
else if(!/^\/(privacy|terms|404)/.test(location.pathname)){
 var ph=d.querySelector('.phead,.notes-stage,.article-stage');
 if(ph){var hs=0,pth=location.pathname;for(var i=0;i<pth.length;i++)hs=(hs*31+pth.charCodeAt(i))>>>0;
  var tn=TONES[ph.getAttribute('data-tone')]||void 0;
  W.__gateHero=stage(ph,{count:46000,gate:.4+(hs%21)/100,gateP:.2,intro:2.4,scroll:true,still:9,t0:2+hs%23,tone:tn,dim:.7,dimP:1.0});}}
var close=d.querySelector('.gate-close');
if(close){W.__gateClose=stage(close,{count:46000,calm:true,gate:-1.5,t0:6,still:3,dim:1,dimP:.8});}
})();