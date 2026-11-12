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
