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
