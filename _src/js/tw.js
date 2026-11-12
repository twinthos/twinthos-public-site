/* Twinthos v3 site script. No dependencies.
   The Workflow Wheel: one renderer, driven by a single progress value p (0..1).
   Every visual state is a pure function of p, so scrolling back reverses cleanly. */
(function(){
'use strict';
var d=document, H=d.documentElement, W=window;
var GEO=/*GEO*/{};
var RMQ=W.matchMedia('(prefers-reduced-motion: reduce)');
var STQ=W.matchMedia('(min-width: 900px)');

/* ── nav ── */
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

/* ── maths ── */
function cl(x){return x<0?0:x>1?1:x;}
function ez(t){return t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;}
function lp(a,b,t){return a+(b-a)*t;}
var BEATS=[[0,.14],[.14,.25],[.25,.47],[.47,.61],[.61,.74],[.74,.89],[.89,1]];
function win(b,a,z){var s=BEATS[b][0],L=BEATS[b][1]-s;return [s+a*L,s+z*L];}
function k(p,b,a,z){var w=win(b,a,z);return ez(cl((p-w[0])/(w[1]-w[0])));}
function at(p,b,t){return p>=win(b,t,t)[0];}
function beatOf(p){for(var i=0;i<BEATS.length;i++)if(p<BEATS[i][1]||i===BEATS.length-1)return [i,cl((p-BEATS[i][0])/(BEATS[i][1]-BEATS[i][0]))];}
var CIRC=2*Math.PI*(GEO.R||300);
function pt(deg,r){var a=deg*Math.PI/180;r=r||GEO.R;return [GEO.C+r*Math.sin(a),GEO.C-r*Math.cos(a)];}
function sArc(deg){return (((deg-90)%360)+360)%360/360*CIRC;}

/* ── the wheel renderer ── */
function Wheel(svg){
  var q=function(s){return svg.querySelector(s);}, qa=function(s){return svg.querySelectorAll(s);};
  this.svg=svg;
  this.ring=q('.w-ring');this.done=q('.w-done');this.mk=q('.w-mk');this.mtag=q('.w-mtag');
  this.chord=q('.w-chord');this.branch=q('.w-branch');this.bound=q('.w-bound');this.boundL=q('.w-bound-l');
  this.team=q('.w-team');this.cust=q('.w-cust');this.clock=q('.w-clock');this.attn=q('.w-attn');
  this.pkt=q('.w-pkt');this.ghosts=qa('.w-ghosts>g');this.ticks=q('.w-ticks');
  this.later=q('.w-later');this.lead=q('.w-lead');this.email=q('.w-email');this.emailL=q('.w-email-l');
  this.late=[q('.l-D'),q('.n-D'),q('.w-bound')];this.lE=q('.l-E');
  this.labs=qa('.w-lab:not(.w-bound-l)');
  this.teth=qa('.w-teth');
  var OFF=[[-18,-196,-5],[292,128,4],[-240,105,-3]];
  this.frags=[].map.call(qa('.w-frag'),function(g,i){
    var r=g.querySelector('.w-chip');
    var x=+r.getAttribute('x'),y=+r.getAttribute('y'),w=+r.getAttribute('width'),h=+r.getAttribute('height');
    return {g:g,chip:r,cx:x+w/2,cy:y+h/2,o:OFF[i]};
  });
  this.chordL=this.chord.getTotalLength();this.branchL=this.branch.getTotalLength();
  this.mtag.style.opacity=0;
}
Wheel.prototype.set=function(p){
  var S=this, E=GEO.ang;
  var scatter=1-k(p,0,.08,.72), attn=1-k(p,1,0,.22), late=k(p,0,.5,.95);
  var out=k(p,6,0,.5);
  /* beat 1: loose fragments, a broken path, everything tethered to one person */
  var gap=64*scatter, seg=CIRC/3;
  if(gap<.5){S.ring.removeAttribute('stroke-dasharray');S.ring.removeAttribute('stroke-dashoffset');}
  else{S.ring.setAttribute('stroke-dasharray',(seg-gap)+' '+gap);S.ring.setAttribute('stroke-dashoffset',seg-gap/2-sArc(20));}
  S.frags.forEach(function(f,i){
    var dx=f.o[0]*scatter,dy=f.o[1]*scatter,r=f.o[2]*scatter;
    f.g.setAttribute('transform','translate('+dx.toFixed(1)+' '+dy.toFixed(1)+') rotate('+r.toFixed(2)+' '+f.cx+' '+f.cy+')');
    f.chip.style.opacity=scatter;
    var t=S.teth[i];t.setAttribute('x1',500);t.setAttribute('y1',500);t.setAttribute('x2',(f.cx+dx).toFixed(1));t.setAttribute('y2',(f.cy+dy).toFixed(1));
    t.style.opacity=scatter;
  });
  S.attn.style.opacity=attn;
  S.late.forEach(function(e){e.style.opacity=late;});
  [S.lead,S.email,S.emailL,S.later,S.cust].forEach(function(e){e.style.opacity=late*(1-out*.7);});
  /* marker path: lead-in, then the circle, forward only */
  var mkOp=k(p,1,.12,.3), lead=k(p,1,.2,.62);
  var ang=E.A+48*k(p,2,0,.22)+115*k(p,3,0,.35)+35*k(p,4,0,.28)+35*k(p,4,.5,.7)+67*k(p,5,0,.3);
  var x,y;
  if(lead<1){x=lp(GEO.email[0],pt(E.A)[0],lead);y=pt(E.A)[1];}
  else{var q=pt(ang);x=q[0];y=q[1];}
  S.mk.setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');
  S.mk.style.opacity=mkOp;
  var dl=lead<1?0:sArc(ang)-sArc(E.A);if(dl<0)dl+=CIRC;if(ang-E.A>=359.9)dl=CIRC;
  S.done.setAttribute('stroke-dasharray',dl.toFixed(1)+' '+CIRC);
  S.done.style.opacity=1-out*.55;
  var bt=beatOf(p),b=bt[0],t=bt[1];
  var wait=(b===2&&t>=.36&&t<.74)||(b===4&&t>=.28&&t<.66);
  var amber=at(p,5,.3);
  S.mk.classList.toggle('wait',wait&&!amber);S.mk.classList.toggle('amber',amber);
  /* customer: request out, the wait, reply back */
  S.chord.style.opacity=(b===2)?.9:.35*late;
  var clk=k(p,2,.3,.38)*(1-k(p,2,.74,.8));
  S.clock.style.opacity=clk;
  S.clock.setAttribute('transform','rotate('+(540*cl((t-.36)/.38)*(b===2?1:0)).toFixed(1)+' '+GEO.cust[0]+' '+GEO.cust[1]+')');
  var pk=null;
  if(b===2&&t>=.12&&t<.34){pk=[S.chord,S.chordL,cl((t-.12)/.22)];}
  else if(b===2&&t>=.62&&t<.8){pk=[S.chord,S.chordL,1-cl((t-.62)/.18)];}
  else if((b===5&&t>=.5)||b===6){pk=[S.branch,S.branchL,b===6?1:ez(cl((t-.5)/.3))];}
  if(pk){var P2=pk[0].getPointAtLength(pk[1]*pk[2]);S.pkt.setAttribute('transform','translate('+P2.x.toFixed(1)+' '+P2.y.toFixed(1)+')');S.pkt.style.opacity=b===6?1-out:1;}
  else S.pkt.style.opacity=0;
  /* the later date notch */
  S.later.classList.toggle('on',b===4);
  /* the approval branch */
  S.bound.classList.toggle('on',amber);
  var bl=k(p,5,.3,.45);S.boundL.style.opacity=bl*(1-out*.8);S.lE.style.opacity=late*(1-bl)*(1-out*.8);
  S.branch.setAttribute('stroke-dasharray',k(p,5,.3,.55).toFixed(3)+' 1');
  S.team.style.opacity=k(p,5,.44,.56);
  /* other enquiries keep moving while this one waits for a person */
  var gs=cl((p-BEATS[5][0])/(BEATS[6][1]-BEATS[5][0])), gop=k(p,5,.35,.5)*(1-out);
  [[300,70],[462,58]].forEach(function(g,i){var c=pt(g[0]+g[1]*gs),e=S.ghosts[i];e.setAttribute('transform','translate('+c[0].toFixed(1)+' '+c[1].toFixed(1)+')');e.style.opacity=gop;});
  /* the outro simplifies the wheel into a map */
  S.ticks.style.opacity=1-out;
  S.labs.forEach(function(e){if(e.closest('.w-attn'))return;if(e.classList.contains('l-E'))return;var lt=e.classList.contains('l-D')?late:1;e.style.opacity=lt*(1-out*.8);});
  return bt;
};

/* ── specimen stack (live stage only) ── */
function Spec(root){
  this.root=root;this.lv={};var S=this;
  root.querySelectorAll('.lv').forEach(function(e){S.lv[e.dataset.l]=e;});
  this.rr=root.querySelector('.lv-rr');
  this.reply=root.querySelector('.rr-reply');this.rec=root.querySelector('.rr-rec');
  this.team=root.querySelector('.rec-team');
  this.toks=[].slice.call(root.querySelectorAll('.tok'));
  this.days=root.querySelectorAll('.day span');
  this.measure();
}
Spec.prototype.measure=function(){
  var R=this.rr.getBoundingClientRect(),S=this;
  this.path=this.toks.map(function(tk){
    var a=S.reply.querySelector('.slot[data-k="'+tk.dataset.k+'"]').getBoundingClientRect();
    var b=S.rec.querySelector('.slot[data-k="'+tk.dataset.k+'"]').getBoundingClientRect();
    return [a.left-R.left,a.top-R.top,b.left-R.left,b.top-R.top];
  });
  this.rr.style.height='';
  this.hA=this.reply.offsetHeight;this.hB=this.rec.offsetHeight;
  this.pad=this.rr.offsetHeight-Math.max(this.hA,this.hB);
  this.last=-1;
};
Spec.prototype.set=function(p,b,t){
  var L=null,m=0,S=this,out=k(p,6,0,.35);
  if(b===1&&t>=.3)L='msg';
  else if(b===2)L=t<.66?'req':'rr';
  else if(b===3){L='rr';m=k(p,3,.12,.62);}
  else if(b===4){L=t<.28?'rr':'fup';m=1;}
  else if(b===5)L='disc';
  else if(b===6&&out<1)L='disc';
  if(b===4&&L==='rr')m=1;
  for(var n in S.lv)S.lv[n].classList.toggle('on',n===L);
  S.lv.req.classList.toggle('card-wait',b===2&&t>=.36);
  S.lv.disc.style.opacity=b===6?1-out:'';
  S.lv.fup.classList.toggle('card-wait',b===4&&t<.62);S.lv.fup.classList.toggle('sent',!(b===4&&t<.62));
  S.rr.style.height=(S.pad+lp(S.hA,S.hB,ez(cl((m-.1)/.6)))).toFixed(1)+'px';
  S.reply.style.opacity=1-cl(m/.3);
  var shown=cl((m-.3)/.35);
  S.rec.querySelectorAll('.card-h,dt').forEach(function(e){e.style.opacity=shown;});
  S.team.style.opacity=cl((m-.7)/.25);
  S.toks.forEach(function(tk,i){var q=S.path[i],e=ez(cl((m-.08*i)/(.84)));
    tk.style.transform='translate('+lp(q[0],q[2],e).toFixed(1)+'px,'+lp(q[1],q[3],e).toFixed(1)+'px)';tk.style.fontSize=lp(1.14,1,e)+'em';});
  var day=(b>=1&&b<=3)||(b===4&&t<.3)?0:b===4?1:-1;
  S.days.forEach(function(e,i){e.classList.toggle('on',i===day);});
};

/* ── the film: a 15-second silent reel in the first screen ── */
var srcSvg=d.querySelector('#wheel-src svg');
var tpl=srcSvg?srcSvg.cloneNode(true):null;
var film=d.getElementById('film');
if(film){
  var v=film.querySelector('video'), tg=film.querySelector('.film-toggle'), tap=film.querySelector('.film-tap');
  var userPaused=false, inView=true;
  if(W.matchMedia('(max-width: 899px)').matches&&v.dataset.posterSm){v.poster=v.dataset.posterSm;
    var ps=v.querySelector('source[media]');if(ps&&v.currentSrc&&v.currentSrc.indexOf('portrait')<0){v.src=ps.getAttribute('src');v.load();}}
  var label=function(){var on=!v.paused&&!v.ended;var tx=on?'Pause':(v.ended?'Replay':'Play');tg.textContent=tx;tg.setAttribute('aria-label',on?'Pause the film':(v.ended?'Replay the film':'Play the film'));film.classList.toggle('is-paused',!on);};
  var go=function(){if(userPaused||RMQ.matches||!inView||v.ended)return;var pr=v.play();
    if(pr&&pr.catch)pr.then(function(){tap.classList.remove('on');}).catch(function(){tap.classList.add('on');label();});};
  ['play','pause','ended'].forEach(function(e){v.addEventListener(e,label);});
  ['loadeddata','canplay'].forEach(function(e){v.addEventListener(e,go);});
  tg.addEventListener('click',function(){if(v.paused){userPaused=false;inView=true;var pr=v.play();pr&&pr.catch&&pr.catch(function(){});}else{userPaused=true;v.pause();}});
  tap.addEventListener('click',function(){userPaused=false;var pr=v.play();pr&&pr.then&&pr.then(function(){tap.classList.remove('on');});});
  var once=function(e){if(e.target.closest&&e.target.closest('a,button,input,select,textarea,label'))return;
    if(v.paused&&!userPaused&&!RMQ.matches){var pr=v.play();pr&&pr.then&&pr.then(function(){tap.classList.remove('on');});}
    d.removeEventListener('touchstart',once);d.removeEventListener('click',once);};
  d.addEventListener('touchstart',once,{passive:true});d.addEventListener('click',once);
  if('IntersectionObserver' in W){new IntersectionObserver(function(en){inView=en[0].isIntersecting;if(inView)go();else if(!v.paused)v.pause();},{threshold:.2}).observe(film);}
  var rm=function(){if(RMQ.matches){v.pause();v.removeAttribute('autoplay');}else go();};
  RMQ.addEventListener&&RMQ.addEventListener('change',rm);
  rm();label();
}

/* ── static figures: the same wheel, fixed at one moment ── */
if(tpl){
  d.querySelectorAll('.beat-fig[data-p]').forEach(function(f){
    var box=d.createElement('div');box.className='fig';var s=tpl.cloneNode(true);box.appendChild(s);
    f.insertBefore(box,f.firstChild);new Wheel(s).set(parseFloat(f.dataset.p));
  });
}

/* ── offer maps: the managed map makes one lap, once ── */
var mm=d.querySelector('.map-managed');
if(mm&&!RMQ.matches&&'IntersectionObserver' in W){
  mm.classList.add('armed');
  var io=new IntersectionObserver(function(en){en.forEach(function(x){if(x.isIntersecting){requestAnimationFrame(function(){mm.classList.add('run');});io.disconnect();}});},{threshold:.55});
  io.observe(mm);
}

/* ── v7: scroll-told sections (all progressive; content is visible without JS) ── */
(function(){
  var IO='IntersectionObserver' in W;
  /* the pile-up: bubbles drop in, the counter climbs */
  var chat=d.querySelector('[data-chat]');
  if(chat){
    var bs=chat.querySelectorAll('.bub'),cnt=chat.querySelector('[data-count]');
    var run=function(){
      if(RMQ.matches||!IO){bs.forEach(function(b){b.classList.add('in');});return;}
      if(cnt)cnt.textContent='0';
      bs.forEach(function(b,i){setTimeout(function(){b.classList.add('in');if(cnt)cnt.textContent=String(i+1);},350+i*520);});
    };
    if(IO){var o1=new IntersectionObserver(function(en){if(en[0].isIntersecting){o1.disconnect();run();}},{threshold:.35});o1.observe(chat);}else run();
  }
  /* the ledger: each job ticks off in order as it scrolls into view */
  var lg=d.querySelector('[data-ledger]');
  if(lg){
    var rows=[].slice.call(lg.querySelectorAll('.lg-r'));
    if(RMQ.matches||!IO){rows.forEach(function(r,i){r.classList.add('on');if(i<rows.length-1)r.classList.add('nx');});}
    else{
      var lit=function(){
        var vh=W.innerHeight,n=0;
        rows.forEach(function(r){var b=r.getBoundingClientRect();if(b.top<vh*.72){if(!r.classList.contains('on'))r.classList.add('on');n++;}});
        rows.forEach(function(r,i){var nx=rows[i+1];r.classList.toggle('nx',!!nx&&nx.classList.contains('on'));});
      };
      var tk=false,onS=function(){if(tk)return;tk=true;requestAnimationFrame(function(){tk=false;lit();});};
      W.addEventListener('scroll',onS,{passive:true});W.addEventListener('resize',onS);lit();
    }
  }
  /* the Authority Line draws itself, then the two halves settle */
  var al=d.querySelector('[data-al]');
  if(al){
    if(RMQ.matches||!IO)al.classList.add('in');
    else{var o3=new IntersectionObserver(function(en){if(en[0].isIntersecting){o3.disconnect();al.classList.add('in');}},{threshold:.3});o3.observe(al);}
  }
  /* sticky call-to-action on phones: appears once the hero has gone, hides at the end */
  var st=d.getElementById('stick'),hero=d.querySelector('.h7'),fin=d.querySelector('.final');
  if(st&&hero&&IO){
    var seenHero=true,seenFin=false;
    var upd=function(){var on=!seenHero&&!seenFin;st.classList.toggle('on',on);st.setAttribute('aria-hidden',on?'false':'true');
      var a=st.querySelector('a');if(a)a.tabIndex=on?0:-1;};
    new IntersectionObserver(function(en){seenHero=en[0].isIntersecting;upd();},{threshold:.0,rootMargin:'0px 0px -40% 0px'}).observe(hero);
    if(fin)new IntersectionObserver(function(en){seenFin=en[0].isIntersecting;upd();},{threshold:.15}).observe(fin);
  }
})();

/* ── enquiry form ── */
d.querySelectorAll('form[data-form]').forEach(function(f){
  var done=d.getElementById(f.dataset.done), fail=f.querySelector('.form-fail'), btn=f.querySelector('[type=submit]');
  var subj=f.querySelector('[name=_subject]');
  var LBL={fit:'15-minute fit call',audit:'Operations audit (£999)',managed:'Managed workflow (£3,500 per month)',unsure:'Not sure yet'};
  var sel=f.querySelector('.interest');
  var sync=function(){var c=f.querySelector('[name=interest]:checked');if(!c)return;
    subj.value='Twinthos enquiry: '+LBL[c.value];
    d.querySelectorAll('[data-for]').forEach(function(e){e.hidden=e.dataset.for!==c.value;});};
  if(sel){
    var want=new URLSearchParams(location.search).get('interest');
    var r=want&&f.querySelector('[name=interest][value="'+want+'"]');
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
    fetch(f.action,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(o)})
      .then(function(r){return r.json().catch(function(){return {};}).then(function(j){if(!r.ok||String(j.success)==='false')throw 0;});})
      .then(function(){f.hidden=true;done.hidden=false;var h=done.querySelector('h2');h.setAttribute('tabindex','-1');h.focus();})
      .catch(function(){fail.hidden=false;btn.disabled=false;btn.innerHTML=old;fail.focus();});
  });
});
})();
