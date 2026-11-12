/* Home hero film "The why". 16.6 s on one clock (TWTL):
   1 Twinthos: a point of light, the mark drawn in emerald, the name rising letter by letter
   2 the why: UK business owners lose 11 hours a week to admin (Amex SME Barometer, Jul 2026); the work floods the screen
   3 the work: Twinthos pulls all of it in, unfolds into its tools and works through it, day and night
   4 time returned: an emerald field, the promise, then it folds into the mark of the resting hero
   Sound is synthesised with Web Audio and on by default. Browsers only start audio after the visitor's first tap,
   click or key anywhere, so the first gesture unlocks it; the Sound button carries only a very quiet hint until then. */
(function(W){
'use strict';
var d=document,root=d.querySelector('.kn'),T=W.TWTL;
if(!root||!T||!root.animate)return;
if(W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var DUR=16.6,EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,CH=[0,2.6,7.3,11.55],HRS=11,C0=2.95,C1=4.05;
var fx=root.querySelector('.kn-fx'),idb=root.querySelector('.kn-id'),
  h1=root.querySelector('.kn-h'),subEl=root.querySelector('.kn-sub'),
  cta=root.querySelector('.kn-cta'),desc=root.querySelector('.kn-desc'),words=[].slice.call(h1.querySelectorAll('.w>i')),
  h1au=[].slice.call(h1.querySelectorAll('.au')),
  pp=root.querySelector('.kn-pp'),ppT=pp&&pp.querySelector('.t'),snd=root.querySelector('.kn-snd'),
  chs=[].slice.call(root.querySelectorAll('.kn-ch button'));
if(!fx||!idb||!pp)return;

/* ---------- film elements (built once, decorative) ---------- */
var CHECK='<svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
function sv(b){return '<svg viewBox="0 0 64 64">'+b.replace(/\/>/g,' pathLength="1"/>')+'</svg>';}
var TOOLS=[['Computer',sv('<rect x="6" y="10" width="52" height="34" rx="4"/><path d="M32 44v10M22 54h20"/>')],
  ['Inbox',sv('<rect x="6" y="13" width="52" height="38" rx="6"/><path d="M8 17l24 18 24-18"/>')],
  ['Phone',sv('<rect x="19" y="5" width="26" height="54" rx="7"/><path d="M28.5 51h7"/>')],
  ['Memory',sv('<path d="M8 12h18a6 6 0 016 6v36a4 4 0 00-4-4H8z"/><path d="M56 12H38a6 6 0 00-6 6v36a4 4 0 014-4h20z"/>')],
  ['Team chat',sv('<path d="M12 12h40a5 5 0 015 5v22a5 5 0 01-5 5H30l-11 9v-9h-7a5 5 0 01-5-5V17a5 5 0 015-5z"/><path d="M21 28h.01M32 28h.01M43 28h.01"/>')]];
/* the work log runs round the clock: [time, text, tool] */
var ROWS=[['09:02','Chased invoice #2041 in Xero',0],['11:30','Answered 14 customer emails',1],['16:45','Texted the courier a new slot',2],
  ['23:10','Updated 38 records in the CRM',0],['02:30','Saved the new returns policy',3],['06:55','Briefed the team on Slack',4]];
var TA=[9.3,9.68,10.06,10.44,10.82,11.2];
var CHIPS=['Chase invoice #2041','Update the CRM','Reply to Sam','Book the courier','Send the quote','Copy data into Xero','Follow up the lead',
  'Rebook Tuesday','Answer the same question','Reconcile payments','Chase the signature','Update the rota','Send the reminder','Log the call',
  'File the receipts','Confirm the booking','Fix the spreadsheet','Email the supplier','Check the order','Renew the policy','Find that attachment',
  'Book the engineer','Upload the photos','Send the statement','Update stock levels','Ask for a review','Re-send the invoice','Tidy the inbox',
  'Prepare the report','Call back the client'];
function el(tag,cls,html){var e=d.createElement(tag);e.className=cls;if(html)e.innerHTML=html;e.setAttribute('aria-hidden','true');fx.appendChild(e);return e;}
function wds(txt,g){var p=txt.split(' '),h='';p.forEach(function(w,i){var s='<span class="w"><i>'+w+'</i></span>';
  if(g!=null&&i===g)h+='<span class="gl"><span class="au"></span>';h+=s+(i<p.length-1?' ':'');});if(g!=null)h+='</span>';return h;}
var glow=el('i','kn-glow'),rg=[el('i','kn-ring'),el('i','kn-ring')],dot=el('i','kn-dot');
var chips=CHIPS.map(function(c){return el('span','kn-chip2','<i></i>'+c);});
var MD=(idb.querySelector('.kn-mk path')||{getAttribute:function(){return '';}}).getAttribute('d');
var bm=el('div','kn-bm','<svg viewBox="8 8 48 48"><path class="f" d="'+MD+'"/><path class="o" d="'+MD+'" pathLength="1"/></svg>');
var bmO=bm.querySelector('.o'),bmF=bm.querySelector('.f');
var nm=el('p','kn-name','Twinthos'.split('').map(function(c){return '<span class="w"><i>'+c+'</i></span>';}).join('')),nmw=[].slice.call(nm.querySelectorAll('.w>i'));
var tag=el('p','kn-tag','<i></i>Your digital employee');
/* the why */
var wa=el('p','kn-hl s',wds('UK business owners lose')),wb=el('p','kn-hl s',wds('to admin.')),
  big=el('p','kn-big','<span class="w"><i><span class="od"><span class="c"><i>0</i><i>1</i></span><span class="c"><i>0</i><i>1</i><i>2</i><i>3</i><i>4</i><i>5</i><i>6</i><i>7</i><i>8</i><i>9</i><i>0</i><i>1</i></span></span></i></span><span class="w u"><i>hours a week</i></span>'),
  odc=big.querySelectorAll('.od .c'),bigw=[].slice.call(big.querySelectorAll('.w>i')),
  note=el('p','kn-note','Nearly twice the time they spend growing the business.'),
  src=el('p','kn-src','Source: American Express SME Business Barometer, July 2026');
var hl=[el('p','kn-hl',wds('Twinthos takes it all.',2)),el('p','kn-hl',wds('Day and night. 24/7.',3))];
var hlw=hl.map(function(e){return [].slice.call(e.querySelectorAll('.w>i'));}),waw=[].slice.call(wa.querySelectorAll('.w>i')),wbw=[].slice.call(wb.querySelectorAll('.w>i'));
var tools=TOOLS.map(function(t){return el('div','kn-tl','<span class="k">'+t[1]+'<span class="hot">'+t[1]+'</span></span><b>'+t[0]+'</b>');});
var rows=ROWS.map(function(r){return el('span','kn-row','<time>'+r[0]+'</time><i class="ck">'+CHECK+'</i><span>'+r[1]+'</span>');});
var wipe=el('div','kn-wipe');
var pr=el('p','kn-pr on','<span><span class="w"><i>Work</i></span> <span class="w"><i>handled.</i></span></span><span class="g"><span class="w"><i>Time</i></span> <span class="w"><i>returned.</i></span></span>');
var prw=[].slice.call(pr.querySelectorAll('.w>i')),pr2=el('p','kn-pr2','11 hours a week. Back.');
root.classList.add('is-film');

/* ---------- layout ---------- */
var tl=new T.TL(DUR),M=null,cues=[];
function rnd(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function measure(){
  var w=root.clientWidth,h=root.clientHeight,nar=w<641;
  var m={W:w,H:h,nar:nar,cx:w/2,gut:nar?16:Math.max(28,w*.04)};
  m.nav=(d.querySelector('.nav')||{offsetHeight:68}).offsetHeight||68;
  m.mid=Math.round((m.nav+h-96)/2);
  m.wh=words[0].offsetHeight;m.hlwh=hlw.map(function(a){return a[0].offsetHeight;});m.hl=hl.map(function(e){return e.offsetHeight;});
  m.wa=wa.offsetHeight;m.wb=wb.offsetHeight;m.big=big.offsetHeight;m.bigW=big.offsetWidth;m.note=note.offsetHeight;m.src=src.offsetHeight;m.swh=waw[0].offsetHeight;m.bwh=bigw[0].offsetHeight;
  m.chip=chips.map(function(c){return [c.offsetWidth,c.offsetHeight];});
  m.tl=[tools[0].offsetWidth,tools[0].offsetHeight];m.row=rows.map(function(r){return r.offsetWidth;});m.rh=nar?34:40;
  m.pr=pr.offsetHeight;m.prwh=prw[0].offsetHeight;m.pr2=pr2.offsetHeight;
  m.bm=bm.offsetWidth;m.nm=nm.offsetHeight;m.nmwh=nmw[0].offsetHeight;m.tag=tag.offsetHeight;
  var r=root.getBoundingClientRect(),k=idb.querySelector('.kn-mk').getBoundingClientRect();
  m.idm={x:Math.round(k.left-r.left+k.width/2),y:Math.round(k.top-r.top+k.height/2)};
  return m;
}
function place(m){
  var cx=m.cx;
  /* 1 the reveal group: mark, name and tag in the optical centre */
  var gH=m.bm+(m.nar?22:28)+m.nm+(m.nar?10:14)+m.tag,gy=Math.round(m.mid-gH/2-(m.nar?10:16));
  m.mc={x:cx,y:gy+m.bm/2};bm.style.left=Math.round(cx-m.bm/2)+'px';bm.style.top=gy+'px';
  nm.style.top=Math.round(gy+m.bm+(m.nar?22:28))+'px';tag.style.top=Math.round(gy+m.bm+(m.nar?22:28)+m.nm+(m.nar?10:14))+'px';
  rg.forEach(function(r){r.style.left=Math.round(cx)+'px';r.style.top=Math.round(m.mc.y)+'px';});
  /* 2 the why block, centred on the stage */
  var g=m.nar?[8,8,14,10]:[10,10,22,14],bH=m.wa+g[0]+m.big+g[1]+m.wb+g[2]+m.note+g[3]+m.src,by=Math.round(m.mid-bH/2);
  wa.style.top=by+'px';big.style.left=Math.round(cx-m.bigW/2)+'px';big.style.top=Math.round(by+m.wa+g[0])+'px';
  wb.style.top=Math.round(by+m.wa+g[0]+m.big+g[1])+'px';note.style.top=Math.round(by+m.wa+g[0]+m.big+g[1]+m.wb+g[2])+'px';
  src.style.top=Math.round(by+bH-m.src)+'px';
  m.bc={x:cx,y:Math.round(by+m.wa+g[0]+m.big/2)};dot.style.left=cx+'px';dot.style.top=m.bc.y+'px';
  var bw=Math.min(m.W-2*m.gut,Math.max(m.bigW,m.nar?m.W-32:760)),pad=m.nar?10:34;
  var B={x:cx-bw/2-pad,y:by-pad,r:cx+bw/2+pad,b:by+bH+pad};
  /* the flood: every chip in free space around the block, spread evenly */
  var R=rnd(7),done=[],x0=m.gut,x1=m.W-m.gut,y0=m.nav+6,y1=m.H-104;m.cc=[];
  var cap=m.nar?(m.H<760?15:18):30;
  chips.forEach(function(c,i){if(i>=cap){c.style.left='-999px';m.cc.push(null);return;}var w=m.chip[i][0],h=m.chip[i][1],best=null,bs=1e9;
    for(var k=0;k<90;k++){var x=x0+R()*Math.max(1,x1-x0-w),y=y0+R()*Math.max(1,y1-y0-h);
      if(x<B.r&&x+w>B.x&&y<B.b&&y+h>B.y)continue;
      var s=0;done.forEach(function(q){var ox=Math.max(0,Math.min(x+w,q[2])-Math.max(x,q[0])),oy=Math.max(0,Math.min(y+h,q[3])-Math.max(y,q[1]));s+=ox*oy;});
      if(s<bs){bs=s;best=[x,y];if(s===0&&k>6)break;}}
    if(!best){c.style.left='-999px';m.cc.push(null);return;}
    done.push([best[0],best[1],best[0]+w,best[1]+h]);c.style.left=Math.round(best[0])+'px';c.style.top=Math.round(best[1])+'px';
    m.cc.push({x:best[0]+w/2,y:best[1]+h/2,r:(R()-.5)*8});});
  /* 3 the work: caption, tools, log as one centred stack; while introduced, the tool row sits on the stage centre */
  var hlM=Math.max(m.hl[0],m.hl[1]),g1=m.nar?26:34,gT=m.nar?20:28,avail=m.H-96-m.nav,N=4,tot;
  for(;N>=2;N--){tot=hlM+g1+m.tl[1]+gT+N*m.rh;if(tot<=avail-30)break;}
  m.N=Math.max(2,N);tot=hlM+g1+m.tl[1]+gT+m.N*m.rh;
  var top=Math.round(m.nav+Math.max(6,(avail-tot)/2));
  hl.forEach(function(e,i){e.style.top=Math.round(top+(hlM-m.hl[i])/2)+'px';});
  var zy=top+hlM+g1,pitch=m.nar?Math.min(70,(m.W-20)/5):Math.min(124,(m.W-2*m.gut)/5);
  m.tc=[];tools.forEach(function(e,i){var l=Math.round(cx-m.tl[0]/2+(i-2)*pitch);e.style.left=l+'px';e.style.top=Math.round(zy)+'px';m.tc.push({x:l+m.tl[0]/2});});
  m.ry=Math.round(m.bc.y-(zy+m.tl[1]/2));
  /* while the mark is back on the stage centre, its caption sits just above it */
  hl[0].style.top=Math.max(m.nav+6,Math.round(m.bc.y-m.bm/2-(m.nar?30:44)-m.hl[0]))+'px';
  m.logY=Math.round(zy+m.tl[1]+gT);
  var lw=0;m.row.forEach(function(x){lw=Math.max(lw,x);});m.logX=Math.round(cx-lw/2);
  rows.forEach(function(r){r.style.left=m.logX+'px';r.style.top=m.logY+'px';r.style.height=m.rh+'px';});
  m.zc=Math.round(top+tot/2);glow.style.left=Math.round(cx)+'px';glow.style.top=m.zc+'px';
  /* 4 the emerald field */
  m.rad=Math.ceil(Math.hypot(m.W,m.H));
  var pH=m.pr+(m.nar?18:26)+m.pr2,py=Math.round(m.mid-pH/2);pr.style.top=py+'px';pr2.style.top=Math.round(py+m.pr+(m.nar?18:26))+'px';
}

/* ---------- the score ---------- */
function prop(e,name,keys){
  keys=keys.slice();if(keys[0][0]>0)keys.unshift([0,keys[0][1]]);if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1]]);
  var fr=keys.map(function(k){var f={offset:Math.min(1,Math.max(0,k[0]/DUR))};f[name]=k[1];return f;});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=e.animate(fr,{duration:DUR*1000,fill:'both'});a.pause();tl.a.push(a);return a;
}
/* a line of words: each rises through a mask, then leaves upwards */
function line(e,ws,wh,a,b,st){
  st=st||.07;
  tl.mk(e,[[0,{o:0}],[a-.02,{o:0}],[a,{o:1}],[b+.5,{o:1}],[b+.55,{o:0}]]);
  ws.forEach(function(w,i){var s=a+.05+i*st,o=b+i*.03;
    tl.mk(w,[[0,{y:wh}],[s,{y:wh}],[s+.9,{y:0},SP],[o,{y:0}],[o+.38,{y:-wh},EI]]);});
}
var PENTA=[587.33,659.25,739.99,880,987.77,1174.66,1318.51,1479.98,1760,1975.53,2349.32,2637.02,2959.96];
function score(m){
  tl.clear();cues=[];
  /* master track first: the resting headline, which spans the whole clock */
  tl.mk(h1,[[0,{o:0}],[14.3,{o:0}],[14.32,{o:1}]]);
  var wh=Math.round(m.wh*1.12);
  words.forEach(function(w,i){var b=14.35+i*.07;tl.mk(w,[[0,{y:wh}],[b,{y:wh}],[b+.95,{y:0},SP]]);});
  h1au.forEach(function(a){tl.mk(a,[[0,{o:0}],[15.0,{o:0}],[15.8,{o:1},EO]]);});
  tl.win(idb,[[14.1,DUR]],{dy:10});tl.win(subEl,[[14.85,DUR]],{dy:14});tl.win(cta,[[15.0,DUR]],{dy:14});tl.win(desc,[[15.15,DUR]],{dy:8});

  /* 1 Twinthos */
  var gdy=Math.round(m.mc.y-m.zc),bdy=Math.round(m.bc.y-m.zc),mdy=Math.round(m.bc.y-m.mc.y);
  tl.mk(glow,[[0,{o:0,s:.25,y:gdy}],[.05,{o:0,s:.25,y:gdy}],[1.0,{o:1,s:1,y:gdy},EO],[2.4,{o:1,s:1,y:gdy}],[3.0,{o:.35,s:.6,y:bdy},ES],
    [6.3,{o:.35,s:.6,y:bdy}],[7.2,{o:.6,s:.35,y:bdy},EI],[7.32,{o:1,s:1.5,y:bdy},EO],[8.4,{o:.9,s:1,y:bdy},ES],[9.0,{o:.9,s:1,y:bdy}],[9.6,{o:.85,s:1,y:0},ES],
    [11.4,{o:.85,s:1,y:0}],[11.8,{o:0,s:1.2,y:0},ES]]);
  tl.mk(bm,[[0,{o:1,s:.86}],[1.6,{o:1,s:1},EO],[2.4,{o:1,s:1}],[2.85,{o:0,s:.1,y:mdy},EI],
    [7.28,{o:0,s:.1,y:mdy}],[7.3,{o:1,s:.2,y:mdy}],[7.95,{o:1,s:1,y:mdy},SP],[8.25,{o:1,s:1,y:mdy}],[8.7,{o:0,s:.3,y:mdy},EI]]);
  prop(bmO,'strokeDashoffset',[[0,1],[.12,1],[1.3,0,EO]]);
  prop(bmO,'opacity',[[0,1],[1.25,1],[1.9,0,ES],[7.28,0],[7.3,1],[7.9,0,ES]]);
  prop(bmF,'opacity',[[0,0],[.95,0],[1.55,1,EO]]);
  rg.forEach(function(r,i){var a=1.0+i*.22,b=7.3+i*.2;
    tl.mk(r,[[0,{o:0,s:.6,y:0}],[a-.01,{o:0,s:.6,y:0}],[a,{o:.8,s:.6,y:0}],[a+1.1,{o:0,s:2.6,y:0},EO],[b-.01,{o:0,s:.6,y:mdy}],[b,{o:.9,s:.6,y:mdy}],[b+1.2,{o:0,s:3.6,y:mdy},EO]]);});
  cues.push([.12,'merge']);cues.push([1.05,'shimmer']);
  var nwh=Math.round(m.nmwh*1.1);
  tl.mk(nm,[[0,{o:1}],[2.9,{o:1}],[2.92,{o:0}]]);
  nmw.forEach(function(w,i){var b=1.05+i*.045,o=2.3+i*.02;tl.mk(w,[[0,{y:nwh}],[b,{y:nwh}],[b+.9,{y:0},SP],[o,{y:0}],[o+.36,{y:-nwh},EI]]);});
  tl.win(tag,[[1.6,2.4]],{dy:8,in:.4,out:.25});
  tl.mk(dot,[[0,{o:0,s:.4}],[2.7,{o:0,s:.4}],[2.9,{o:1,s:1},EO],[3.2,{o:0,s:.6},ES],[6.35,{o:0,s:.6}],[6.6,{o:1,s:1.2},EO],[7.2,{o:1,s:1.6}],[7.3,{o:0,s:3},EO]]);

  /* 2 the why */
  var sw=Math.round(m.swh*1.12),bw=Math.round(m.bwh*1.1);
  line(wa,waw,sw,2.95,6.15);
  tl.mk(big,[[0,{o:0}],[2.98,{o:0}],[3.0,{o:1,s:1}],[6.3,{o:1,s:1,bl:0}],[6.65,{o:0,s:.15,bl:6},EI]]);
  bigw.forEach(function(w,i){var s=3.0+i*.2;tl.mk(w,[[0,{y:bw}],[s,{y:bw}],[s+.9,{y:0},SP]]);});
  line(wb,wbw,sw,3.55,6.15);
  tl.win(note,[[4.2,6.2]],{dy:10,in:.5,out:.3});tl.win(src,[[4.5,6.2]],{dy:6,in:.5,out:.3});
  var n=chips.length,dm=1;m.cc.forEach(function(c){if(c)dm=Math.max(dm,Math.hypot(c.x-m.bc.x,c.y-m.bc.y));});
  chips.forEach(function(c,i){if(!m.cc[i])return;var t0=3.25+2.75*Math.pow(i/n,.62),cc=m.cc[i],dx=Math.round(m.bc.x-cc.x),dy=Math.round(m.bc.y-cc.y),
      dd=Math.hypot(dx,dy)/dm,ts=6.38+dd*.42,o=i<10?1:.82;
    tl.mk(c,[[0,{o:0,s:.6,r:cc.r,bl:0}],[t0,{o:0,s:.6,r:cc.r}],[t0+.45,{o:o,s:1,r:cc.r},SP],[ts,{o:o,s:1,x:0,y:-6,r:cc.r}],
      [ts+.5,{o:0,s:.05,x:dx,y:dy,r:cc.r+(cc.x<m.cx?-140:140),bl:5},EI]]);
    if(i%2===0)cues.push([t0+.02,'pop',i]);
  });
  cues.push([6.3,'suck']);cues.push([7.3,'boom']);

  /* 3 the work */
  line(hl[0],hlw[0],Math.round(m.hlwh[0]*1.12),7.45,8.85);
  tl.mk(hl[0].querySelector('.au'),[[0,{o:0}],[7.9,{o:0}],[8.5,{o:1},EO],[8.85,{o:1}],[9.2,{o:0},ES]]);
  line(hl[1],hlw[1],Math.round(m.hlwh[1]*1.12),9.0,11.3);
  tl.mk(hl[1].querySelector('.au'),[[0,{o:0}],[9.4,{o:0}],[10.0,{o:1},EO],[11.3,{o:1}],[11.6,{o:0},ES]]);
  var hot=[[],[],[],[],[]];
  tools.forEach(function(e,i){var t0=8.25+i*.07,dx=Math.round(m.cx-m.tc[i].x),ry=m.ry;
    tl.mk(e,[[0,{o:0,x:dx,y:ry,s:.3}],[t0,{o:0,x:dx,y:ry,s:.3}],[t0+.12,{o:1,x:dx*.9,y:ry,s:.38}],[t0+.85,{o:1,x:0,y:ry,s:1},SP],
      [9.0+i*.03,{o:1,x:0,y:ry,s:1}],[9.55+i*.03,{o:1,x:0,y:0,s:1},ES],[11.4,{o:1,x:0,y:0,s:1}],[11.75,{o:0,x:0,y:-8,s:1},ES]]);
    [].slice.call(e.querySelectorAll('.k>svg *')).forEach(function(s){prop(s,'strokeDashoffset',[[0,1],[t0+.15,1],[t0+1.05,0,EO]]);});
    cues.push([t0+.4,'pluck',i*2]);
  });
  ROWS.forEach(function(r,j){hot[r[2]].push(TA[j]);});
  tools.forEach(function(e,i){tl.bump(e.querySelector('.hot'),hot[i],0);});
  var N=m.N,rh=m.rh,nr=ROWS.length;
  rows.forEach(function(r,j){
    var s0=j<N?j:N-1,ky=[[0,{o:0,x:-12,y:s0*rh}],[TA[j],{o:0,x:-12,y:s0*rh}],[TA[j]+.36,{o:1,x:0,y:s0*rh},EO]],sl=s0;
    for(var q=j+1;q<nr;q++){if(q>=N){sl--;ky.push([TA[q],{o:sl+1>=0?1:0,x:0,y:(sl+1)*rh}]);ky.push([TA[q]+.34,{o:sl>=0?1:0,x:0,y:sl*rh},EO]);}}
    if(sl>=0){ky.push([11.4,{o:1,x:0,y:sl*rh}]);ky.push([11.75,{o:0,x:0,y:sl*rh-8},ES]);}
    tl.mk(r,ky);
    tl.mk(r.querySelector('.ck'),[[0,{o:0,s:.3}],[TA[j]+.1,{o:0,s:.3}],[TA[j]+.32,{o:1,s:1},SP]]);
    cues.push([TA[j]+.1,'pluck',j*2+1]);
  });

  /* 4 time returned: an emerald field grows from the centre, then folds into the resting mark */
  var c0='circle(0px at '+m.cx+'px '+m.mid+'px)',c1='circle('+m.rad+'px at '+m.cx+'px '+m.mid+'px)',c15='circle('+m.rad+'px at '+m.idm.x+'px '+m.idm.y+'px)',c2='circle(0px at '+m.idm.x+'px '+m.idm.y+'px)';
  tl.mk(wipe,[[0,{o:0,cp:c0}],[11.55,{o:0,cp:c0}],[11.56,{o:1,cp:c0}],[12.3,{o:1,cp:c1},EO],[13.7,{o:1,cp:c15}],[14.4,{o:1,cp:c2},EI],[14.42,{o:0,cp:c2}]]);
  tl.mk(pr,[[0,{o:0,bl:0}],[11.85,{o:0}],[11.87,{o:1,s:1}],[13.55,{o:1,s:1,bl:0}],[13.95,{o:0,s:.92,bl:4},EI]]);
  var pwh=Math.round(m.prwh*1.12);
  prw.forEach(function(w,i){var b=11.9+i*.11+(i>1?.22:0);tl.mk(w,[[0,{y:pwh}],[b,{y:pwh}],[b+.95,{y:0},SP]]);});
  tl.win(pr2,[[12.75,13.6]],{dy:12,in:.45,out:.3});
  cues.push([11.55,'rise']);cues.push([11.9,'pad']);cues.push([14.3,'end']);
  /* chapter bars */
  chs.forEach(function(b,i){tl.mk(b.querySelector('i'),[[0,{sx:0}],[CH[i],{sx:0}],[CH[i+1]||DUR,{sx:1}]]);});
  cues.sort(function(a,b){return a[0]-b[0];});
}

/* ---------- sound: one mastered score (assets/film16.mp3) kept in sync with the film clock ----------
   An <audio> element, not Web Audio: it plays through the iPhone silent switch and is mixed loud enough for laptop
   speakers. Browsers allow it only after the visitor's first tap, click or key, which starts it in sync. */
var au=null,on=true,unlocked=false;
function aud(){
  if(!au){au=new Audio();au.preload='auto';au.setAttribute('playsinline','');au.src='/assets/film16.mp3?v=1';
    au.addEventListener('playing',function(){unlocked=true;label();});}
  return au;
}
function want(){return on&&!finished&&playing;}
function aplay(t){var a=aud();try{if(Math.abs(a.currentTime-t)>.08)a.currentTime=t;}catch(e){}
  var q=a.play();if(q&&q.then)q.then(function(){unlocked=true;label();},function(){label();});}
function label(){
  if(!snd)return;var need=on&&!unlocked,l=!on?'Sound off':need?'Tap for sound':'Sound on';
  snd.setAttribute('aria-pressed',on&&!need?'true':'false');snd.classList.toggle('need',need);
  var t=snd.querySelector('.t');if(t&&t.textContent!==l)t.textContent=l;snd.setAttribute('aria-label',l);
}
/* the first tap, click or key anywhere starts the score at the film's current moment */
function unlock(e){if(unlocked||!on)return;if(e&&snd&&snd.contains(e.target))return;
  var a=aud();
  /* if the film has already finished, a tap on the hero (not on a link or button) plays it again, with sound */
  if(finished&&viewable&&!(e&&e.target&&e.target.closest&&e.target.closest('a,button,input,select,textarea,label,summary,[role=button]'))){userPaused=false;jump(0);aplay(0);return;}
  if(want()){aplay(tl.time());}else{a.muted=true;var q=a.play();if(q&&q.then)q.then(function(){a.pause();a.muted=false;unlocked=true;label();},function(){a.muted=false;});}}
['pointerdown','pointerup','touchend','click','keydown'].forEach(function(e){d.addEventListener(e,unlock,{capture:true,passive:true});});
function fire(){}
/* ---------- playback ---------- */
var playing=false,userPaused=false,viewable=false,finished=false,prevT=0,lastV=-1;
function ui(){
  root.classList.toggle('is-paused',!playing&&!finished);root.classList.toggle('is-done',finished);
  var l=finished?'Replay':playing?'Pause':'Play';
  if(ppT&&ppT.textContent!==l){ppT.textContent=l;pp.setAttribute('aria-label',l+' the film');}
}
function sync(){
  var go=viewable&&!d.hidden&&!userPaused&&!finished;
  if(go&&!playing){tl.play();playing=true;}else if(!go&&playing){tl.pause();playing=false;}
  ui();
}
function jump(t){finished=t>=DUR;tl.pause();playing=false;tl.seek(t);prevT=t;counter(t,false);sync();}
pp.addEventListener('click',function(){
  if(finished){jump(0);userPaused=false;sync();return;}
  userPaused=!userPaused;sync();
});
chs.forEach(function(b,i){b.addEventListener('click',function(){userPaused=false;jump(CH[i]);});});
if(snd)snd.addEventListener('click',function(){
  if(on&&!unlocked){if(finished){userPaused=false;jump(0);}else if(userPaused){userPaused=false;sync();}aplay(finished?0:tl.time());return;}
  on=!on;var a=aud();a.muted=!on;
  if(on){if(finished||userPaused){userPaused=false;jump(finished?0:prevT);}if(want())aplay(tl.time());}
  label();
});
function counter(t,sound){
  /* an odometer: the digits roll rather than swap, so no new text is painted */
  var p=Math.min(1,Math.max(0,(t-C0)/(C1-C0))),val=HRS*(1-Math.pow(1-p,3)),v=Math.floor(val+1e-6);
  odc[1].style.transform='translateY('+(-val).toFixed(4)+'em)';odc[0].style.transform='translateY('+(-Math.min(1,Math.max(0,val-9))).toFixed(4)+'em)';
  lastV=v;
}
function loop(){
  var t=tl.time();
  if(playing){
    if(t>=DUR-.005){finished=true;playing=false;tl.pause();tl.seek(DUR);t=DUR;ui();}
  }
  counter(t,playing);
  prevT=t;
  /* keep the score on the film clock; it rings on past the end of the film */
  if(au&&unlocked&&on){if(want()){if(au.paused)aplay(t);else if(Math.abs(au.currentTime-t)>.15){try{au.currentTime=t;}catch(e){}}}else if(!finished&&!au.paused)au.pause();}
  W.requestAnimationFrame(loop);
}

/* ---------- build / rebuild ---------- */
var lastW=0,lastH=0;
function build(){
  var t=tl.time(),was=playing;M=measure();lastW=M.W;lastH=M.H;
  place(M);score(M);tl.seek(t);prevT=t;
  if(was){tl.play();}
}
build();
var started=false,r0=root.getBoundingClientRect();viewable=r0.top<W.innerHeight*.65&&r0.bottom>W.innerHeight*.35;
function start(){if(started)return;started=true;W.__knStart=performance.now();if(M&&words[0].offsetHeight!==M.wh)build();
  /* try sound straight away: it plays where the browser allows it, otherwise the first gesture starts it */
  if(on){aplay(0);}
  label();sync();}
if('IntersectionObserver' in W){new IntersectionObserver(function(es){viewable=es[0].intersectionRatio>=.35;if(started)sync();},{threshold:[0,.35,.6]}).observe(root);}
else{viewable=true;}
if(d.fonts&&d.fonts.load){d.fonts.load('600 64px "Inter Tight"').then(start,start);setTimeout(start,60);}else start();
d.addEventListener('visibilitychange',function(){if(d.hidden&&au&&!au.paused)au.pause();sync();});
var rt=null;W.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){
  if(root.clientWidth!==lastW||Math.abs(root.clientHeight-lastH)>80)build();},180);});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){var w=words[0].offsetHeight;if(M&&(w!==M.wh||root.clientWidth!==lastW))build();});
ui();W.requestAnimationFrame(loop);
W.__kn={tl:tl,seek:function(t){userPaused=true;jump(t);},play:function(){userPaused=false;sync();},
  M:function(){return M;},sound:function(){return !on?'off':!unlocked?'blocked':au.paused?'paused':'playing';},at:function(){return au?au.currentTime:-1;}};
})(window);
