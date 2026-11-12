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