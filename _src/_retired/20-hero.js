/* Hero scene: "The work between the work". 28 s presentation timing, live HTML, recomposed for wide and narrow. */
(function(W){
'use strict';
var d=document,root=d.querySelector('.hs'),T=W.TWTL;
if(!root||!T||!root.animate)return;
var st=root.querySelector('[data-stage]'),btn=root.querySelector('[data-ctl]'),DUR=28;
var EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,steps=function(n){return 'steps('+n+',end)';};
var NARROW=W.matchMedia('(max-width: 1279.98px)'),RM=W.matchMedia('(prefers-reduced-motion: reduce)');
var tl=new T.TL(DUR),mode=null,userPaused=false,started=false,viewable=false,finished=false;
function $(s){return st.querySelector(s);}

/* size the world on wide screens */
function fit(){
  if(NARROW.matches){['--k','--cx','--wt'].forEach(function(p){root.style.removeProperty(p);});return;}
  var vw=root.clientWidth,hh=root.clientHeight,nav=68;
  var cp=root.querySelector('.hs-copy').getBoundingClientRect(),zl=cp.right+32,zw=vw-zl;
  var k=Math.min(zw/830,(hh-nav-40)/620,1.45);k=Math.max(k,.86);
  var wt=nav+Math.max(6,(hh-nav-610*k)/2-4);
  root.style.setProperty('--k',k.toFixed(3));
  root.style.setProperty('--cx',(zl+zw/2).toFixed(1)+'px');
  root.style.setProperty('--wt',wt.toFixed(1)+'px');
}

function common(wide){
  var q=function(s){return $(s);};
  /* master clock: progress bar */
  tl.mk(root.querySelector('.hs-prog i'),[[0,{sx:0}],[DUR,{sx:1},'linear']]);
  /* captions (same for both) */
  var caps=[['.c1',.3,2.8],['.c2',3.1,5.1],['.c3',9.4,13.9],['.c4',14.2,18.4],['.c4b',18.6,20.5],['.c5',22.5,24.4],['.c6',24.5,26.2]];
  caps.forEach(function(c){tl.win(q(c[0]),[[c[1],c[2]]],{dy:12,in:.45,out:.35});});
  tl.win(q('.lock'),[[26.4,DUR+1]],{dy:12,in:.7});
  /* Operational Drag */
  q('.sc-drag').style.opacity=1;
  tl.win(q('.dg-t'),[[6.5,9.0]],{dy:16,in:.6,out:.4});
  tl.win(q('.dg-d'),[[7.2,9.0]],{dy:12,in:.6,out:.4});
  /* delay labels */
  var dl=wide?[['.d1',5.2,9.2],['.d2',5.8,9.2],['.d3',6.4,9.2]]:[['.d1',5.3,5.95],['.d2',6.0,6.65],['.d3',6.7,9.0]];
  dl.forEach(function(x){tl.win(q(x[0]),[[x[1],x[2]]],{dy:8,in:.4,out:.35});});
  /* bridges and nodes: gaps connect as the work moves */
  [['.b1',14.2,14.9],['.b2',16.4,17.1],['.b3',20.5,21.1]].forEach(function(b){
    tl.mk(q(b[0]),[[0,{sx:0}],[b[1],{}],[b[2],{sx:1},EO]]);});
  [['.n1',14.0],['.n2',16.0],['.n3',18.2],['.n4',21.8]].forEach(function(n){
    tl.win(q(n[0]+' .on'),[[n[1],DUR+1]],{dy:0,in:.3});});
  /* work item state: Waiting > In progress > Ready for review > Completed within scope */
  var c1='.chip1 ',c2='.chip2 ',z={dy:0,in:.25,out:.25};
  tl.win(q(c1+'.dw'),[[1.2,14.0]],z);
  tl.win(q(c1+'.s-w'),[[1.2,14.0]],z);
  tl.win(q(c1+'.dp'),[[14.0,18.7],[20.4,22.0]],z);
  tl.win(q(c1+'.s-p'),[[14.0,18.7],[20.4,22.0]],z);
  tl.win(q(c1+'.s-r'),[[18.7,20.4]],z);
  tl.win(q(c1+'.dd'),[[22.0,DUR+1]],{dy:0,in:.3});
  tl.win(q(c1+'.s-d'),[[22.0,DUR+1]],{dy:0,in:.3});
  tl.win(q(c2+'.dw'),[[0,23.6]],z);
  tl.win(q(c2+'.s-w'),[[0,23.6]],z);
  tl.win(q(c2+'.dp'),[[23.6,DUR+1]],{dy:0,in:.3});
  tl.win(q(c2+'.s-p'),[[23.6,DUR+1]],{dy:0,in:.3});
  /* one action at a time above the work item */
  [['.a1',14.0,15.2],['.a2',15.2,16.4],['.a3',16.4,18.0],['.a4',18.0,19.3],['.a5',20.6,22.0]].forEach(function(a){
    tl.win(q(a[0]),[[a[1],a[2]]],{dy:8,in:.3,out:.25});});
  /* surface content: the same task, the same facts, visibly changing */
  tl.win(q('.sf-mail .hl-a'),[[0,9.4]],{dy:0,in:.2,out:.3});
  tl.win(q('.sf-mail .hl-b'),[[9.2,DUR+1]],{dy:0,in:.4});
  tl.win(q('.sf-rec .hl-a'),[[0,9.4]],{dy:0,in:.2,out:.3});
  tl.win(q('.sf-rec .hl-b'),[[9.2,DUR+1]],{dy:0,in:.4});
  tl.win(q('.sf-mail .mk'),[[9.0,DUR+1]],{dy:0,in:.5});
  tl.win(q('.sf-rec .mk'),[[9.0,DUR+1]],{dy:0,in:.5});
  tl.win(q('.ml-in'),[[0,17.9]],{dy:0,in:.2,out:.3});
  tl.reveal(q('.ml-re'),17.9,18.8,'inset(0 0 100% 0)');
  tl.win(q('.ml-ap'),[[18.8,20.9]],{dy:6,in:.4,out:.4});
  tl.win(q('.ap-b1'),[[0,20.0]],{dy:0,in:.1,out:.15});
  tl.win(q('.ap-b2'),[[20.0,DUR+1]],{dy:0,in:.2});
  tl.win(q('.ml-sent'),[[20.6,DUR+1]],{dy:4,in:.4});
  tl.mk(q('.ptr'),[[0,{x:170,y:320,o:0,s:1}],[19.0,{}],[19.35,{x:150,y:312,o:1},EO],[19.95,{x:67,y:260},EI],[20.1,{s:.8},ES],[20.35,{s:1.15,o:.6},EO],[20.7,{o:0,s:1.4},ES]]);
  tl.win(q('.rc>div:nth-child(3) .miss'),[[0,16.9]],{dy:0,in:.2,out:.2});
  tl.win(q('.rc>div:nth-child(4) .miss'),[[0,21.0]],{dy:0,in:.2,out:.2});
  tl.reveal(q('.sd'),16.9,17.6,null,steps(10));
  tl.reveal(q('.ns'),21.0,21.8,null,steps(14));
  tl.win(q('.v1'),[[0,17.8]],{dy:0,in:.2,out:.25});
  tl.win(q('.v2'),[[17.8,DUR+1]],{dy:0,in:.3});
  tl.win(q('.rs-a'),[[0,17.7]],{dy:0,in:.2,out:.25});
  tl.win(q('.rs-b'),[[17.7,DUR+1]],{dy:0,in:.3});
  tl.win(q('.tk-a'),[[0,17.7]],{dy:0,in:.2,out:.3});
  tl.win(q('.tk-m'),[[17.7,21.0]],{dy:0,in:.3,out:.3});
  tl.win(q('.tk-b'),[[21.0,DUR+1]],{dy:0,in:.4});
  /* glass edge catches light when an action becomes available */
  tl.bump(q('.sf-rec .sf-edge'),[10.0,16.4,21.0]);
  tl.bump(q('.sf-phone .sf-edge'),[11.0,20.8]);
  tl.bump(q('.sf-mail .sf-edge'),[12.4,14.2,18.2,18.9]);
  tl.bump(q('.sf-ctx .sf-edge'),[13.2,15.3]);
  tl.bump(q('.sf-task .sf-edge'),[1.9,21.0]);
  tl.bump(q('.sf-out .sf-edge'),[23.2]);
}


/* camera: a slow push-in that follows the work (wide only). Individual translate/scale, so the world's own scale(k) is untouched. */
function camera(){
  var k=parseFloat(root.style.getPropertyValue('--k'))||1,cx=parseFloat(root.style.getPropertyValue('--cx'))||0,wt=parseFloat(root.style.getPropertyValue('--wt'))||0,vw=root.clientWidth;
  var cp=root.querySelector('.hs-copy').getBoundingClientRect(),lim=cp.right+14,rim=vw-12,smax=Math.max(1,(rim-lim)/(746*k));
  function f(fx,fy,s){
    s=Math.min(s,smax);
    var x=(1-s)*k*(fx-380),y=(1-s)*k*fy;if(wt+y<78)y=78-wt;
    var xr=cx+x+s*k*366;if(xr>rim)x-=xr-rim;
    var xl=cx+x-s*k*380;if(xl<lim)x+=lim-xl;
    return{x:x,y:y,s:s};
  }
  var CE='cubic-bezier(.45,0,.2,1)';
  tl.cam(st.querySelector('.hs-cl'),[
    [0,f(380,300,1)],[5,f(380,300,1.035),'linear'],[9.4,f(380,300,1),CE],[14.2,f(380,300,1)],[15.4,f(330,170,1.09),CE],[16.8,f(330,170,1.09)],
    [18.0,f(160,220,1.14),CE],[20.9,f(160,220,1.14)],[22.1,f(330,150,1.08),CE],[22.9,f(330,150,1.08)],[24.3,f(380,260,1),CE]]);
}

function buildWide(){
  var q=function(s){return $(s);};
  var mail=q('.sf-mail'),rec=q('.sf-rec'),task=q('.sf-task'),phone=q('.sf-phone'),ctx=q('.sf-ctx'),out=q('.sf-out');
  tl.prime([mail,rec,task,phone,ctx,out,q('.chip1'),q('.chip2')]);
  /* 0-5 work arrives: three separate surfaces, slightly out of true. 5-9 they recede. 9-14 they align into one workspace. */
  tl.mk(mail,[[0,{X:0,Y:86,r:-1.4,o:0,s:.985,bl:0}],[.1,{}],[1.0,{Y:60,o:1,s:1},SP],[5,{}],[5.7,{Y:76,r:-2.4,o:.16,bl:4},EI],[9,{}],[10.4,{X:0,Y:40,r:0,o:1,bl:0},EI],[22.2,{}],[23.1,{o:0,Y:52},ES]]);
  tl.mk(rec,[[0,{X:236,Y:48,r:.8,o:0,s:.985,bl:0}],[.4,{}],[1.3,{Y:24,o:1,s:1},SP],[5,{}],[5.7,{Y:36,r:1.8,o:.16,bl:4},EI],[9,{}],[10.4,{X:244,Y:0,r:0,o:1,bl:0},EI],[22.4,{}],[23.7,{X:0,Y:96},EI]]);
  tl.mk(task,[[0,{X:548,Y:122,r:1.6,o:0,s:.985,bl:0}],[.7,{}],[1.6,{Y:100,o:1,s:1},SP],[5,{}],[5.7,{Y:114,r:2.6,o:.16,bl:4},EI],[9,{}],[10.4,{X:532,Y:300,r:0,o:1,bl:0},EI],[22.2,{}],[23,{o:0,Y:312},ES]]);
  tl.mk(phone,[[0,{X:586,Y:26,o:0}],[10.6,{}],[11.5,{Y:0,o:1},SP],[22.2,{}],[23,{o:0,Y:12},ES]]);
  tl.mk(ctx,[[0,{X:256,Y:272,o:0}],[12.8,{}],[13.6,{Y:254,o:1},SP],[22.2,{}],[23,{o:0,Y:266},ES]]);
  tl.mk(out,[[0,{X:348,Y:114,o:0}],[22.6,{}],[23.7,{Y:96,o:1},SP]]);
  tl.win(q('.bub.out'),[[20.8,DUR+1]],{dy:6,in:.4});
  /* the work item rides the path. It reaches a gap and stops; a second task queues behind it. */
  tl.mk(q('.chip1'),[[0,{X:-340,o:0}],[.6,{}],[.75,{o:1}],[2.4,{X:-126},EO],[2.7,{X:-138},ES],[16.0,{}],[17.0,{X:122},EI],[17.2,{}],[18.2,{X:346},EI],[21.1,{}],[22.0,{X:432},EI]]);
  tl.mk(q('.chip2'),[[0,{X:-460,o:0}],[2.0,{}],[3.1,{X:-394,o:.9},EO],[23.0,{}],[24.2,{X:170},EI]]);
  common(true);
  camera();
}

function buildNarrow(){
  var q=function(s){return $(s);};
  var S={dy:14,s:.98,in:.4,out:.25};
  tl.win(q('.sf-mail'),[[.3,2.0],[14.0,15.3],[18.4,20.8]],S);
  tl.win(q('.sf-rec'),[[2.3,3.7],[9.2,10.4],[16.6,18.1],[21.1,22.6]],S);
  tl.win(q('.sf-task'),[[4.0,5.0]],S);
  tl.win(q('.sf-phone'),[[10.6,11.8]],S);
  tl.win(q('.sf-ctx'),[[12.0,13.7],[15.5,16.4]],S);
  tl.win(q('.sf-out'),[[22.9,DUR+1]],S);
  tl.win(q('.bub.out'),[[20.8,DUR+1]],{dy:6,in:.4});
  /* the camera follows the work along the path; the chip stays in view at the left */
  tl.mk(q('.pp'),[[0,{x:-136}],[5.0,{}],[5.7,{x:-130},EI],[5.9,{}],[6.4,{x:-370},EI],[6.6,{}],[7.1,{x:-610},EI],[9.1,{}],[10.3,{x:-136},EI],[15.0,{}],[16.0,{x:-376},EI],[17.2,{}],[18.2,{x:-616},EI],[21.1,{}],[22.0,{x:-688},EI]]);
  tl.mk(q('.chip1'),[[0,{x:-120,o:0}],[1.2,{}],[1.35,{o:1}],[2.9,{x:8},EO],[3.2,{x:0},ES]]);
  tl.mk(q('.chip2'),[[0,{x:12,y:-80,o:0}],[2.8,{}],[3.6,{o:.55},EO],[23.0,{}],[24.2,{x:0,y:0,o:.9},EI]]);
  common(false);
}

function build(){
  var t=tl.time(),live=tl.master&&tl.master.playState==='running';
  tl.clear();fit();mode=NARROW.matches?'narrow':'wide';
  root.classList.remove('is-static');root.classList.add('is-live','has-js');
  if(mode==='wide')buildWide();else buildNarrow();
  tl.master.onfinish=onEnd;
  tl.seek(t);
  if(live)tl.play();
}


/* your turn: once per run the scene stops on the approval and waits for the visitor's click (auto-continues after a few seconds) */
var ASK_T=19.25,ASK_MAX=4200,asking=false,asked=false,askLeft=0,askTick=null,apb=null,hint=null;
function askSetup(){
  apb=root.querySelector('.ap-b');if(!apb)return;
  if(!hint){hint=d.createElement('span');hint.className='ap-hint';hint.textContent='Your turn: tap Approve';apb.parentNode.appendChild(hint);}
  apb.addEventListener('click',function(){if(asking)endAsk(true);});
  apb.addEventListener('keydown',function(e){if(asking&&(e.key==='Enter'||e.key===' ')){e.preventDefault();endAsk(true);}});
}
function startAsk(){
  asking=true;asked=true;tl.pause();tl.seek(ASK_T);root.classList.add('is-ask');root.classList.remove('is-playing');label('play');
  apb.setAttribute('role','button');apb.setAttribute('tabindex','0');apb.setAttribute('aria-label','Approve the reply');
  askLeft=ASK_MAX;clearInterval(askTick);
  askTick=setInterval(function(){if(viewable&&!d.hidden){askLeft-=100;if(askLeft<=0)endAsk(false);}},100);
}
function endAsk(byUser){
  if(!asking)return;asking=false;clearInterval(askTick);root.classList.remove('is-ask');
  apb.removeAttribute('role');apb.removeAttribute('tabindex');apb.removeAttribute('aria-label');
  if(byUser){apb.classList.remove('tap');void apb.offsetWidth;apb.classList.add('tap');root.classList.add('is-you');tl.seek(20.45);}
  userPaused=false;tl.play();root.classList.add('is-playing');label('pause');
}
function askWatch(){
  if(!asking&&!asked&&root.classList.contains('is-playing')&&apb){var t=tl.time();if(t>=ASK_T-.02&&t<ASK_T+.6)startAsk();}
  W.requestAnimationFrame(askWatch);
}

/* controls */
function label(s){
  btn.className='hs-btn is-'+s+(s==='replay'&&finished?' done':'');
  var t={pause:['Pause','Pause animation'],play:['Play','Play animation'],replay:['Replay','Replay animation']}[s];
  btn.querySelector('span').textContent=t[0];btn.setAttribute('aria-label',t[1]);
}
function onEnd(){finished=true;root.classList.remove('is-playing');root.classList.add('is-done');label('replay');}
function run(){
  if(finished||!started)return;
  tl.play();root.classList.add('is-playing');label('pause');
}
function freeze(){tl.pause();root.classList.remove('is-playing');}
function restart(){asked=false;root.classList.remove('is-you');if(asking){asking=false;clearInterval(askTick);root.classList.remove('is-ask');}finished=false;userPaused=false;started=true;root.classList.remove('is-done','is-static');root.classList.add('is-live');tl.seek(0);tl.play();root.classList.add('is-playing');label('pause');}
function staticPoster(){
  started=true;finished=true;tl.seek(DUR);tl.pause();root.classList.add('is-static');root.classList.remove('is-live');root.classList.remove('is-playing');label('play');
}
btn.addEventListener('click',function(){
  if(asking){endAsk(false);return;}
  if(root.classList.contains('is-static')||finished){restart();return;}
  if(root.classList.contains('is-playing')){userPaused=true;freeze();label('play');}
  else{userPaused=false;run();}
});
function sync(){
  if(asking)return;
  if(!started||finished||root.classList.contains('is-static'))return;
  var go=viewable&&!d.hidden&&!userPaused;
  if(go&&!root.classList.contains('is-playing')){tl.play();root.classList.add('is-playing');label('pause');}
  else if(!go&&root.classList.contains('is-playing')){freeze();if(!userPaused)label('play');}
}
d.addEventListener('visibilitychange',sync);

/* go */
fit();build();askSetup();
if(!RM.matches)W.requestAnimationFrame(askWatch);
if(RM.matches){staticPoster();}
else{tl.seek(0);label('pause');}
if('IntersectionObserver' in W){
  new IntersectionObserver(function(e){
    viewable=e[0].isIntersecting;
    if(viewable&&!started&&!RM.matches){started=true;tl.play();root.classList.add('is-playing');}
    sync();
  },{threshold:.3}).observe(st);
}else if(!RM.matches){started=true;viewable=true;tl.play();root.classList.add('is-playing');}
var rz;W.addEventListener('resize',function(){cancelAnimationFrame(rz);rz=requestAnimationFrame(function(){
  var m=NARROW.matches?'narrow':'wide';
  if(m!==mode){var was=root.classList.contains('is-static');build();if(was)staticPoster();}
  else fit();
});});
W.__hs={seek:function(t){if(asking){asking=false;clearInterval(askTick);root.classList.remove('is-ask');}asked=true;freeze();tl.seek(t);},ask:function(){asked=false;},tl:tl,play:run,restart:restart,poster:staticPoster};
})(window);
