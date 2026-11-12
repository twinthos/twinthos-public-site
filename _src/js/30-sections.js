/* Industry stage (one reusable scene), workspace highlights, reveal-on-view for the quieter sections. */
(function(W){
'use strict';
var d=document,T=W.TWTL;
var RM=W.matchMedia('(prefers-reduced-motion: reduce)');
function esc(s){return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}

/* ---------- industry stage ---------- */
var root=d.querySelector('[data-is]'),dataEl=d.getElementById('ind-data');
if(root&&dataEl&&T&&root.animate){
  var DATA=JSON.parse(dataEl.textContent),DUR=11.5;
  var body=root.querySelector('[data-is-body]'),outs=root.querySelector('[data-is-outs]'),nameEl=root.querySelector('[data-is-name]');
  var tabs=[].slice.call(d.querySelectorAll('.ind-tab')),sub=d.querySelector('.ind-sub'),panels=[].slice.call(d.querySelectorAll('.ind-panel'));
  var tl=new T.TL(DUR),cur=null,viewable=false,started=false,lastSub='consultancies',EO=T.EO,EI=T.EI,ES=T.ES;
  var steps=function(n){return 'steps('+n+',end)';};

  var cardHTML=function(c,i,n){
    var h='<div class="ic'+(c.flag?' flag':'')+'"><span class="ic-node"><i class="n0"></i><i class="n1"></i></span>';
    if(i<n-1)h+='<span class="ic-line'+(i===1?' gap':'')+'"><i class="l0"></i><i class="l1"></i></span>';
    h+='<div class="ic-h"><span class="ic-app">'+esc(c.app)+'</span><span class="ic-st"><span class="s0">'+esc(c.st[0])+'</span>'+(c.st[1]?'<span class="s1">'+esc(c.st[1])+'</span>':'')+'</span></div>';
    if(c.from)h+='<span class="ic-from">'+esc(c.from)+'</span>';
    if(c.t)h+='<p class="ic-t">'+esc(c.t)+'</p>';
    if(c.rows){h+='<dl class="ic-r">';c.rows.forEach(function(r){
      h+='<div><dt>'+esc(r[0])+'</dt><dd'+(r[2]?' class="rv"':'')+'>'+(r[2]?'<span class="miss">'+esc(r[1])+'</span><b class="fill">'+esc(r[2])+'</b>':esc(r[1]))+'</dd></div>';});h+='</dl>';}
    if(c.slots){h+='<div class="ic-slots">';c.slots.forEach(function(s,k){h+='<span>'+esc(s)+(k===c.pick?'<u class="ring"></u>':'')+'</span>';});h+='</div>';}
    if(c.reply)h+='<p class="ic-reply">'+esc(c.reply)+'</p>';
    return h+'<i class="ic-act" aria-hidden="true"></i></div>';
  };

  function build(id){
    var it=DATA[id];if(!it)return;cur=id;tl.clear();
    nameEl.textContent=it.stage;
    var h='<div class="is-caps">'+it.caps.map(function(c){return '<p class="is-cap">'+esc(c)+'</p>';}).join('')+'</div>';
    h+=it.cards.map(function(c,i){return cardHTML(c,i,it.cards.length);}).join('');
    body.innerHTML=h;
    outs.innerHTML=it.outs.map(function(o){return '<li>'+esc(o)+'</li>';}).join('');
    var $a=function(s,c){return [].slice.call((c||body).querySelectorAll(s));};
    var caps=$a('.is-cap'),cards=$a('.ic'),times=[.2,1.7,3.5,7.2],capT=[[.2,1.6],[1.7,3.4],[3.5,5.4],[5.5,7.1],[7.2,DUR+1]];
    var R=5.6; /* the dependency resolves */
    tl.mk(root.querySelector('.is-top'),[[0,{o:1}]]);
    caps.forEach(function(c,i){tl.win(c,[capT[i]],{dy:10,in:.4,out:.25});});
    cards.forEach(function(c,i){
      /* upcoming steps are already on stage as faint ghosts; the spring activates each one in turn */
      var SPR=T.SP||EO;
      if(i===0)tl.mk(c,[[0,{o:0,y:16}],[times[0],{}],[times[0]+.7,{o:1,y:0},SPR]]);
      else tl.mk(c,[[0,{o:.14,y:0}],[times[i],{}],[times[i]+.7,{o:1,y:0},SPR]]);
      tl.win($a('.n1',c)[0],[[times[i]+.25,DUR+1]],{dy:0,in:.3});
      /* the step being worked on now carries the emerald edge */
      tl.win($a('.ic-act',c)[0],[[times[i]+.15,i<times.length-1?times[i+1]+.1:DUR+1]],{dy:0,in:.35,out:.4});
      var s1=$a('.s1',c)[0],s0=$a('.s0',c)[0];
      if(s1){var ts=i===1?R+.3:i===2?R:i===3?times[3]+1.1:R;tl.win(s0,[[0,ts]],{dy:0,in:.01,out:.2});tl.win(s1,[[ts,DUR+1]],{dy:0,in:.25});}
    });
    /* path: draws as the work moves; the dependency is a visible gap until it resolves */
    var ln=$a('.ic-line .l1');
    var lt=[[1.5,2.1],[R,R+.7],[7.0,7.6]];
    ln.forEach(function(l,i){var t=lt[i]||[7,7.6];tl.mk(l,[[0,{sy:0}],[t[0],{}],[t[1],{sy:1},EO]]);});
    /* the dependency: a missing value, then the supplied one */
    var miss=$a('.miss'),fill=$a('.fill');
    miss.forEach(function(m){tl.win(m,[[0,R+.3]],{dy:0,in:.2,out:.2});});
    fill.forEach(function(f){tl.reveal(f,R+.3,R+1.1,null,steps(10));});
    $a('.ic-reply').forEach(function(r){tl.win(r,[[R-.4,DUR+1]],{dy:6,in:.45});});
    $a('.ring').forEach(function(r){tl.win(r,[[R-.2,DUR+1]],{dy:0,in:.3});});
    $a('.ic-slots .ring').forEach(function(r){r.style.cssText='position:absolute;inset:-1px;border:1.5px solid var(--green);border-radius:999px;pointer-events:none';r.parentNode.style.position='relative';});
    $a('.ic-st .s1').forEach(function(){});
    $a('li',outs).length;
    [].slice.call(outs.children).forEach(function(li,i){tl.win(li,[[8.6+i*.55,DUR+1]],{dy:6,in:.4});});
    tl.mk(root.querySelector('.is-top'),[[0,{o:1}]]);
    tl.master.onfinish=function(){root.classList.add('is-done');};
    root.classList.remove('is-done');
    if(RM.matches){tl.seek(DUR);tl.pause();root.classList.add('is-static');}
    else{root.classList.remove('is-static');tl.seek(0);if(viewable||started){tl.play();started=true;}}
  }

  function show(id,fromTab){
    panels.forEach(function(p){p.hidden=(p.id!=='ip-'+id);});
    tabs.forEach(function(t){
      var sel=(t.dataset.g===id)||(t.dataset.g==='professional'&&['consultancies','legal','insurance'].indexOf(id)>-1);
      t.setAttribute('aria-selected',sel?'true':'false');t.tabIndex=sel?0:-1;
    });
    var isPro=['consultancies','legal','insurance'].indexOf(id)>-1;if(isPro)lastSub=id;
    sub.hidden=!isPro;
    build(id);
    if(fromTab&&!RM.matches){tl.seek(0);started=true;tl.play();}
  }
  tabs.forEach(function(t,i){
    t.addEventListener('click',function(){
      var g=t.dataset.g;if(g==='professional')g=lastSub;
      show(g,true);
    });
    t.addEventListener('keydown',function(e){
      var list=t.closest('.ind-tabs').querySelectorAll('.ind-tab'),k=[].indexOf.call(list,t),n=null;
      if(e.key==='ArrowRight')n=list[(k+1)%list.length];else if(e.key==='ArrowLeft')n=list[(k-1+list.length)%list.length];
      else if(e.key==='Home')n=list[0];else if(e.key==='End')n=list[list.length-1];
      if(n){e.preventDefault();n.focus();n.click();}
    });
  });
  root.querySelector('[data-is-replay]').addEventListener('click',function(){started=true;tl.seek(0);root.classList.remove('is-static','is-done');tl.play();});
  show('agencies',false);
  if('IntersectionObserver' in W){
    new IntersectionObserver(function(e){
      viewable=e[0].isIntersecting;
      if(viewable&&!started&&!RM.matches){started=true;tl.seek(0);tl.play();}
      else if(started&&!root.classList.contains('is-done')&&!RM.matches){if(viewable&&!d.hidden)tl.play();else tl.pause();}
    },{threshold:.35}).observe(root);
  }
  d.addEventListener('visibilitychange',function(){if(!started||root.classList.contains('is-done'))return;if(d.hidden)tl.pause();else if(viewable)tl.play();});
  W.__is={show:show,seek:function(t){tl.pause();tl.seek(t);},tl:tl};
}

/* ---------- workspace: link the six annotations to the illustration ---------- */
var ws=d.querySelector('.ws');
if(ws){
  var items=[].slice.call(ws.querySelectorAll('.ws-list li'));
  var setHi=function(n,on){[].slice.call(ws.querySelectorAll('[data-n="'+n+'"]')).forEach(function(e){e.classList.toggle('hi',on);});};
  items.forEach(function(li){
    var n=li.dataset.n;
    li.addEventListener('mouseenter',function(){setHi(n,true);});
    li.addEventListener('mouseleave',function(){setHi(n,false);});
    li.addEventListener('click',function(){var on=!li.classList.contains('hi');items.forEach(function(x){setHi(x.dataset.n,false);});if(on)setHi(n,true);});
  });
}
/* quiet reveal for the workspace and deployment sections (content is readable without it) */
if('IntersectionObserver' in W&&!RM.matches){
  [].slice.call(d.querySelectorAll('.ws,.dep,.kit,.vs')).forEach(function(s){
    s.classList.add('pre');
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){s.classList.remove('pre');o.disconnect();}},{threshold:.18}).observe(s);
  });
}
})(window);
/* key words light up once, with a single sweep of light, the first time they scroll into view */
(function(W){
var d=document,gs=[].slice.call(d.querySelectorAll('.gl')).filter(function(g){return !g.closest('.kn');});
if(!gs.length||!('IntersectionObserver' in W)||W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
gs.forEach(function(g){g.classList.add('lt');});
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('lit');io.unobserve(e.target);}});},{threshold:1,rootMargin:'0px 0px -12% 0px'});
gs.forEach(function(g){io.observe(g);});
})(window);
