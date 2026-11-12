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
