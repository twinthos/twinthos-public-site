/* Home hero film "One employee". 18 s on one clock (TWTL), four chapters:
   1 the drag: the headline, then routine work piling up around it
   2 one employee: an inbox, a phone, a computer, fused into one mark
   3 the work: every task handled into the mark; the one that matters stops at the Authority Line for the visitor's own click
   4 time returned: the promise, then the resting hero (base CSS = this final frame)
   Sound is synthesised with Web Audio and strictly opt-in (the Sound button). */
(function(W){
'use strict';
var d=document,root=d.querySelector('.kn'),T=W.TWTL;
if(!root||!T||!root.animate)return;
if(W.matchMedia('(prefers-reduced-motion: reduce)').matches)return;
var DUR=18,EO=T.EO,EI=T.EI,ES=T.ES,SP=T.SP,CH=[0,4.2,9.2,14.6],ASK_T=13.4,ASK_MAX=5000;
var fx=root.querySelector('.kn-fx'),mk=root.querySelector('.kn-mk'),st=root.querySelector('.kn-st'),
  h1=root.querySelector('.kn-h'),sub=root.querySelector('.kn-sub'),
  cta=root.querySelector('.kn-cta'),desc=root.querySelector('.kn-desc'),words=[].slice.call(h1.querySelectorAll('.w>i')),
  pp=root.querySelector('.kn-pp'),ppT=pp.querySelector('.t'),snd=root.querySelector('.kn-snd'),
  chs=[].slice.call(root.querySelectorAll('.kn-ch button'));
if(!fx||!mk||!pp)return;

/* ---------- film elements (built once, decorative) ---------- */
var TASKS=[['Reply to Maya about the quote','2d'],['Chase invoice #2041','9d'],['Update the CRM','3d'],['Book the site visit','1d'],
  ['Send the contract','4d'],['Call back the supplier','2d'],['Confirm Monday\u2019s start','1d'],['Request missing documents','6d'],
  ['Follow up the new enquiry','3d'],['Send the weekly report','2d']];
var CHECK='<svg viewBox="0 0 10 10"><path d="M1.5 5.2l2.3 2.3 4.7-5" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
var ICONS=[['An inbox.','<svg viewBox="0 0 64 64"><rect x="6" y="13" width="52" height="38" rx="6" pathLength="1"/><path d="M8 17l24 18 24-18" pathLength="1"/></svg>'],
  ['A phone.','<svg viewBox="0 0 64 64"><rect x="19" y="5" width="26" height="54" rx="7" pathLength="1"/><path d="M28.5 51h7" pathLength="1"/></svg>'],
  ['A computer.','<svg viewBox="0 0 64 64"><rect x="6" y="10" width="52" height="34" rx="4" pathLength="1"/><path d="M32 44v10M22 54h20" pathLength="1"/></svg>']];
function el(tag,cls,html){var e=d.createElement(tag);e.className=cls;if(html)e.innerHTML=html;e.setAttribute('aria-hidden','true');fx.appendChild(e);return e;}
var glow=el('i','kn-glow');
var chips=TASKS.map(function(t){return el('span','kn-chip','<i><span class="ck">'+CHECK+'</span></i>'+t[0]+'<em>'+t[1]+'</em>');});
var xchip=el('span','kn-chip x','<i></i>Refund \u00a31,200<em>needs you</em>');
var ics=ICONS.map(function(c){return el('div','kn-ic',c[1]+'<b>'+c[0]+'</b>');});
var ring=el('i','kn-ring');
var caps=[el('p','kn-cap','Work waiting for someone to remember.'),el('p','kn-cap l','Not three tools. One employee.'),
  el('p','kn-cap','Routine work, handled.'),el('p','kn-cap l','Anything that matters waits for you.')];
var al=el('div','kn-al');
var card=el('div','kn-card','<div><small>Refund request</small><p>\u00a31,200 to Harbour &amp; Co</p></div><button type="button" class="kn-ap" tabindex="-1"><span class="b1">Approve</span><span class="b2">Approved</span></button><span class="kn-ok"></span><span class="kn-hint">Your turn</span>');
var ap=card.querySelector('.kn-ap');
var pr=el('p','kn-pr','<span><span class="w"><i>Work</i></span> <span class="w"><i>handled.</i></span></span><span class="g"><span class="w"><i>Time</i></span> <span class="w"><i>returned.</i></span></span>');
var prw=[].slice.call(pr.querySelectorAll('.w>i'));
root.classList.add('is-film');

/* ---------- layout ---------- */
function off(e){var x=0,y=0,n=e;while(n&&n!==root){x+=n.offsetLeft;y+=n.offsetTop;n=n.offsetParent;}return {x:x,y:y,w:e.offsetWidth,h:e.offsetHeight};}
function rng(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
var tl=new T.TL(DUR),M=null,cues=[],absorb=[];

function measure(){
  var w=root.clientWidth,h=root.clientHeight,nar=w<641;
  root.style.setProperty('--is',nar?'72px':'116px');
  var m={W:w,H:h,nar:nar,cx:w/2,gut:nar?20:Math.max(28,w*.04)};
  m.nav=(d.querySelector('.nav')||{offsetHeight:68}).offsetHeight||68;
  m.cy=Math.round((m.nav+h-96)/2);m.SC=nar?1.25:1.3;m.mC={x:m.cx,y:m.cy-(nar?104:124)};
  m.mk=off(mk);m.mc={x:m.mk.x+m.mk.w/2,y:m.mk.y+m.mk.h/2};m.st=off(st);
  m.h1=off(h1);m.wh=words[0].offsetHeight;
  m.chip=chips.concat([xchip]).map(function(c){return [c.offsetWidth,c.offsetHeight];});m.NX=chips.length;
  m.ic=[ics[0].offsetWidth,ics[0].offsetHeight];m.is=nar?72:116;
  m.cap=caps.map(function(c){return c.offsetHeight;});
  m.card=[card.offsetWidth,card.offsetHeight];m.pr=pr.offsetHeight;m.prwh=prw[0].offsetHeight;
  return m;
}
function place(m){
  /* chapter 3 stack: mark (scaled SC) at mC, status under it, Authority Line, card, caption */
  m.stC=Math.round(m.mC.y+m.mk.h*m.SC/2+14);
  m.alY=Math.round(m.stC+m.st.h+(m.nar?50:58));
  m.cardX=Math.round(m.cx-m.card[0]/2);m.cardY=m.alY+(m.nar?52:48);
  m.cardC={x:m.cardX+m.card[0]/2,y:m.cardY+m.card[1]/2};
  m.capC=Math.round(m.cardY+m.card[1]+(m.nar?32:46));
  /* chips: best-candidate scatter around the headline, never over it, its caption, the chapter-3 mark and caption, the nav or the controls */
  var cw3=Math.min(m.W,640),ex=[{x:m.h1.x-18,y:m.h1.y-14,w:m.h1.w+36,h:m.h1.h+28},
    {x:m.cx-Math.min(m.W,640)/2,y:m.h1.y+m.h1.h+14,w:Math.min(m.W,640),h:m.cap[0]+24},
    {x:m.cx-150,y:m.mC.y-m.mk.h*m.SC/2-16,w:m.nar?0:300,h:m.stC+m.st.h+18-(m.mC.y-m.mk.h*m.SC/2-16)}],
    top=m.nav+16,bot=m.H-112,r=rng(11+Math.round(m.W/40)),done=[],all=[xchip].concat(chips);
  all.forEach(function(c,ci){
    var sz=ci===0?m.chip[m.NX]:m.chip[ci-1],cw=sz[0],ch=sz[1],best=null,bd=-1,found=0;
    for(var k=0;k<600&&found<28;k++){
      var q={x:m.gut+r()*Math.max(1,m.W-2*m.gut-cw),y:top+r()*Math.max(1,bot-top-ch),w:cw,h:ch},bad=false,i,o;
      for(i=0;i<ex.length+done.length;i++){o=i<ex.length?ex[i]:done[i-ex.length];
        if(q.x<o.x+o.w+18&&q.x+q.w+18>o.x&&q.y<o.y+o.h+14&&q.y+q.h+14>o.y){bad=true;break;}}
      if(bad)continue;found++;
      var dm=1e9;for(i=0;i<done.length;i++){o=done[i];var dx=(q.x+q.w/2)-(o.x+o.w/2),dy=((q.y+q.h/2)-(o.y+o.h/2))*1.6;dm=Math.min(dm,dx*dx+dy*dy);}
      if(!done.length)dm=-Math.abs(q.x+q.w/2-m.cx)+r()*200;
      if(dm>bd){bd=dm;best=q;}
    }
    c._p=best;if(best)done.push(best);
  });
  /* writes */
  chips.concat([xchip]).forEach(function(c){if(c._p){c.style.left=Math.round(c._p.x)+'px';c.style.top=Math.round(c._p.y)+'px';c.style.display='';}else c.style.display='none';});
  var gap=m.nar?Math.min(124,(m.W-24)/3):Math.min(290,m.W*.21);
  ics.forEach(function(e,i){e._x=m.cx+(i-1)*gap;e._y=m.cy-m.is/2-14;e.style.left=Math.round(e._x)+'px';e.style.top=Math.round(e._y)+'px';});
  ring.style.left=m.cx+'px';ring.style.top=m.cy+'px';
  glow.style.left=Math.round(m.mc.x)+'px';glow.style.top=Math.round(m.mc.y)+'px';
  var S=m.nar?1.9:2.2;m.S=S;
  var alW=m.nar?m.W*.92:Math.min(m.W*.66,920);
  al.style.left=Math.round(m.cx-alW/2)+'px';al.style.width=Math.round(alW)+'px';al.style.top=m.alY+'px';al.style.setProperty('--in',Math.max(0,Math.round((alW-m.card[0])/2))+'px');
  card.style.left=m.cardX+'px';card.style.top=m.cardY+'px';
  caps[0].style.top=Math.round(m.h1.y+m.h1.h+26)+'px';
  caps[1].style.top=Math.round(m.cy+m.mk.h*S/2+34)+'px';
  caps[2].style.top=caps[3].style.top=m.capC+'px';
  pr.style.top=Math.round(m.cy-m.pr/2+(m.nar?16:34))+'px';
}

/* ---------- the score ---------- */
function prop(e,name,keys){
  keys=keys.slice();if(keys[0][0]>0)keys.unshift([0,keys[0][1]]);if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1]]);
  var fr=keys.map(function(k){var f={offset:Math.min(1,Math.max(0,k[0]/DUR))};f[name]=k[1];return f;});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=e.animate(fr,{duration:DUR*1000,fill:'both'});a.pause();tl.a.push(a);return a;
}
var PENTA=[587.33,659.25,739.99,880,987.77,1174.66,1318.51,1479.98,1760,1975.53,2349.32,2637.02,2959.96];
function score(m){
  tl.clear();cues=[];absorb=[];
  var dxm=m.cx-m.mc.x,dym=m.cy-m.mc.y,S=m.S,SC=m.SC,cxm=m.mC.x-m.mc.x,cym=m.mC.y-m.mc.y,sdy=m.stC-m.st.y,T3=m.mC;
  /* master track first: the headline, which spans the whole clock */
  tl.mk(h1,[[0,{o:1,y:0}],[3.95,{o:1,y:0}],[4.4,{o:0,y:-16},ES],[16.9,{o:0,y:0}],[16.95,{o:1,y:0}]]);
  var wh=Math.round(m.wh*1.12);
  words.forEach(function(w,i){var a=.15+i*.075,b=16.98+i*.055;
    tl.mk(w,[[0,{y:wh}],[a,{y:wh}],[a+.95,{y:0},SP],[4.45,{y:0}],[4.5,{y:wh}],[b,{y:wh}],[b+.95,{y:0},SP]]);});
  tl.win(sub,[[17.3,DUR]],{dy:14});tl.win(cta,[[17.5,DUR]],{dy:14});tl.win(desc,[[17.65,DUR]],{dy:8});
  /* the drag: chips pile up; the frame leans in; the room goes quiet at 4.2 */
  tl.cam(fx,[[0,{s:1}],[4.15,{s:1.035}],[4.7,{s:1},EO]]);
  var list=chips.filter(function(c){return c._p;}),n=list.length;
  list.forEach(function(c,j){c._a=1.0+j*.16;cues.push([c._a+.04,'tick']);});
  if(xchip._p){xchip._a=1.0+n*.16;cues.push([xchip._a+.04,'tick']);}
  cues.push([2.35,'riser']);
  tl.win(caps[0],[[2.1,3.95]],{dy:10});
  /* absorption order: nearest to the mark first */
  var order=list.slice().sort(function(a,b){var pa=a._p,pb=b._p;
    return Math.hypot(pa.x+pa.w/2-m.mc.x,pa.y+pa.h/2-m.mc.y)-Math.hypot(pb.x+pb.w/2-m.mc.x,pb.y+pb.h/2-m.mc.y);});
  order.forEach(function(c,k){c._c=10.1+k*.15;absorb.push(c._c+.62);cues.push([c._c,'pluck',k]);});
  list.forEach(function(c){var p=c._p,dx=T3.x-(p.x+p.w/2),dy=T3.y-(p.y+p.h/2);
    tl.mk(c,[[0,{o:0,y:10,s:.85}],[c._a,{o:0,y:10,s:.85}],[c._a+.5,{o:1,y:0,s:1},SP],[4.2,{o:1,s:1}],[4.6,{o:0,s:.96},ES],
      [c._c-.2,{o:0,s:.96}],[c._c,{o:1,s:1},EO],[c._c+.2,{o:1,x:0,y:0,s:1}],[c._c+.7,{o:0,x:dx,y:dy,s:.25},EI]]);
    tl.mk(c.querySelector('.ck'),[[0,{o:0,s:.4}],[c._c+.02,{o:0,s:.4}],[c._c+.2,{o:1,s:1},SP]]);
  });
  if(xchip._p){var p=xchip._p;
    tl.mk(xchip,[[0,{o:0,y:10,s:.85}],[xchip._a,{o:0,y:10,s:.85}],[xchip._a+.5,{o:1,y:0,s:1},SP],[4.2,{o:1,s:1}],[4.6,{o:0,s:.96},ES],
      [11.75,{o:0,s:.96}],[12.0,{o:1,s:1},EO],[12.2,{o:1,x:0,y:0,s:1}],[12.7,{o:0,x:m.cardC.x-(p.x+p.w/2),y:m.cardC.y-(p.y+p.h/2),s:1.25},EI]]);}
  /* one employee */
  ics.forEach(function(e,i){var t0=4.6+i*.7,dx=m.cx-e._x,dy=m.cy-(e._y+m.is/2);
    tl.mk(e,[[0,{o:0,y:18}],[t0,{o:0,y:18}],[t0+.6,{o:1,y:0},SP],[6.9,{o:1,x:0,y:0,s:1}],[7.5,{o:0,x:dx,y:dy,s:.3},EI]]);
    [].slice.call(e.querySelectorAll('svg *')).forEach(function(s){prop(s,'strokeDashoffset',[[0,1],[t0,1],[t0+.95,0,EO]]);});
    tl.win(e.querySelector('b'),[[t0+.25,6.75]],{dy:10});
    cues.push([t0,'bell',i]);
  });
  cues.push([6.92,'whoosh']);cues.push([7.48,'merge']);
  tl.mk(ring,[[0,{o:0,s:.5}],[7.48,{o:0,s:.5}],[7.52,{o:.9,s:.6}],[8.7,{o:0,s:3.4},EO]]);
  tl.mk(mk,[[0,{o:0,x:dxm,y:dym,s:S*.6}],[7.42,{o:0,x:dxm,y:dym,s:S*.6}],[7.95,{o:1,s:S},SP],[9.3,{o:1,x:dxm,y:dym,s:S}],[10.1,{o:1,x:cxm,y:cym,s:SC},EI],[14.55,{o:1,x:cxm,y:cym,s:SC}],[15.25,{o:1,x:0,y:0,s:1},EI]]);
  tl.mk(glow,[[0,{o:0,x:dxm,y:dym,s:.5}],[7.4,{o:0,s:.5}],[7.85,{o:1,s:1.15},EO],[8.9,{o:.65,s:1},ES],[9.3,{o:.65,x:dxm,y:dym}],[10.1,{o:.5,x:cxm,y:cym,s:.75},EI],
    [13.6,{o:.5,s:.75}],[13.85,{o:.95,s:.9},EO],[14.55,{o:.45,s:.75,x:cxm,y:cym},ES],[15.25,{o:.45,x:0,y:0},EI],[16.4,{o:.45}],[17.2,{o:0,s:.6},ES]]);
  tl.win(caps[1],[[8.05,9.3]],{dy:12});
  /* the work */
  tl.mk(st,[[0,{o:0,y:sdy+8}],[10.0,{o:0,y:sdy+8}],[10.35,{o:1,y:sdy},EO],[14.55,{o:1,y:sdy}],[15.25,{o:1,y:0},EI]]);cues.push([9.32,'whoosh']);
  tl.mk(card,[[0,{o:0,s:.92,y:10}],[12.45,{o:0,s:.92,y:10}],[12.95,{o:1,s:1,y:0},SP],[14.1,{o:1,s:1,x:0,y:0}],[14.6,{o:0,s:.3,x:T3.x-m.cardC.x,y:T3.y-m.cardC.y},EI]]);
  cues.push([12.5,'low']);
  tl.mk(al,[[0,{o:0,cp:'inset(-40px 50% -40px 50%)'}],[12.55,{o:1,cp:'inset(-40px 50% -40px 50%)'}],[13.15,{o:1,cp:'inset(-40px 0% -40px 0%)'},EO],[14.2,{o:1}],[14.6,{o:0},ES]]);
  tl.win(caps[3],[[12.95,14.4]],{dy:10});
  tl.mk(ap,[[0,{s:1}],[13.55,{s:1}],[13.62,{s:.94}],[13.9,{s:1},SP]]);
  tl.win(ap.querySelector('.b2'),[[13.62,DUR]],{in:.18,dy:0});
  tl.win(card.querySelector('.kn-ok'),[[13.62,14.15]],{in:.2,dy:0});
  cues.push([13.6,'approve']);cues.push([14.42,'pluck',12]);
  /* time returned */
  tl.mk(pr,[[0,{o:0}],[14.78,{o:0}],[14.8,{o:1,y:0}],[16.45,{o:1,y:0}],[16.9,{o:0,y:-24},ES]]);
  var pwh=Math.round(m.prwh*1.12);
  prw.forEach(function(w,i){var b=14.85+i*.13+(i>1?.25:0);tl.mk(w,[[0,{y:pwh}],[b,{y:pwh}],[b+1,{y:0},SP]]);});
  cues.push([14.85,'pad']);cues.push([17.0,'end']);
  /* chapter bars */
  chs.forEach(function(b,i){tl.mk(b.querySelector('i'),[[0,{sx:0}],[CH[i],{sx:0}],[CH[i+1]||DUR,{sx:1}]]);});
  cues.sort(function(a,b){return a[0]-b[0];});
}

/* ---------- status line under the mark ---------- */
var stTxt='';
function status(t){
  var n=absorb.length,k=0,s;for(var i=0;i<n;i++)if(absorb[i]<=t)k++;
  if(t<12.45)s=(n-k)+' waiting \u00b7 '+k+' handled';
  else if(t<13.62)s=n+' handled \u00b7 1 needs you';
  else if(t<16.85)s=(n+1)+' handled \u00b7 approved by you';
  else s='Your digital employee<span class="kn-st2"> \u00b7 all caught up</span>';
  if(s!==stTxt){stTxt=s;st.innerHTML=s;}
}

/* ---------- sound (Web Audio, synthesised, opt-in) ---------- */
var A=null,out=null,bedG=null,on=false;
function ac(){
  if(!A){var C=W.AudioContext||W.webkitAudioContext;if(!C)return null;A=new C();
    var comp=A.createDynamicsCompressor();comp.threshold.value=-18;comp.ratio.value=4;comp.connect(A.destination);
    out=A.createGain();out.gain.value=0;out.connect(comp);
    var lp=A.createBiquadFilter();lp.type='lowpass';lp.frequency.value=520;lp.Q.value=.4;bedG=A.createGain();bedG.gain.value=0;lp.connect(bedG);bedG.connect(out);
    [[73.42,0],[110,3],[146.83,-4]].forEach(function(f){var o=A.createOscillator();o.type='sine';o.frequency.value=f[0];o.detune.value=f[1];
      var g=A.createGain();g.gain.value=f[0]>140?.35:1;o.connect(g);g.connect(lp);o.start();});
    var lfo=A.createOscillator(),lg=A.createGain();lfo.frequency.value=.11;lg.gain.value=160;lfo.connect(lg);lg.connect(lp.frequency);lfo.start();}
  if(A.state==='suspended')A.resume();
  return A;
}
function tone(f,type,peak,att,dec,at){var t0=A.currentTime+(at||0),o=A.createOscillator(),g=A.createGain();o.type=type;o.frequency.value=f;
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+att);g.gain.exponentialRampToValueAtTime(.0001,t0+att+dec);
  o.connect(g);g.connect(out);o.start(t0);o.stop(t0+att+dec+.05);return o;}
var NB=null;function noiseBuf(){if(!NB){NB=A.createBuffer(1,A.sampleRate*2,A.sampleRate);var c=NB.getChannelData(0);for(var i=0;i<c.length;i++)c[i]=Math.random()*2-1;}return NB;}
function sweep(dur,f0,f1,peak,q,cut){var t0=A.currentTime,s=A.createBufferSource(),bp=A.createBiquadFilter(),g=A.createGain();s.buffer=noiseBuf();s.loop=true;
  bp.type='bandpass';bp.Q.value=q||1.2;bp.frequency.setValueAtTime(f0,t0);bp.frequency.exponentialRampToValueAtTime(f1,t0+dur);
  g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(peak,t0+dur*(cut?.97:.5));g.gain.exponentialRampToValueAtTime(.0001,t0+dur+(cut?.03:dur*.6));
  s.connect(bp);bp.connect(g);g.connect(out);s.start(t0);s.stop(t0+dur*1.7+.1);}
function bell(f,p){tone(f,'sine',p,.006,2.2);tone(f*2,'sine',p*.3,.004,1.1);tone(f*3.01,'sine',p*.1,.003,.6);}
var SFX={
  tick:function(){tone(1700+Math.random()*900,'sine',.022,.002,.045);tone(240,'sine',.02,.002,.06);},
  riser:function(){sweep(1.85,300,3200,.05,1.4,true);},
  bell:function(i){bell([293.66,369.99,440][i],.11);},
  whoosh:function(){sweep(.55,1800,260,.035,.8);},
  merge:function(){[146.83,220,293.66,369.99].forEach(function(f){bell(f,.06);});
    var t0=A.currentTime,o=A.createOscillator(),g=A.createGain();o.frequency.setValueAtTime(92,t0);o.frequency.exponentialRampToValueAtTime(38,t0+.9);
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(.32,t0+.02);g.gain.exponentialRampToValueAtTime(.0001,t0+1.5);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+1.6);
    tone(1760,'sine',.02,.01,1.4,.05);tone(2637,'sine',.012,.01,1.2,.12);},
  pluck:function(k){var f=PENTA[Math.min(k,PENTA.length-1)];tone(f,'triangle',.05,.004,.32);tone(f*2,'sine',.012,.003,.18);},
  low:function(){tone(146.83,'sine',.08,.25,.9);},
  approve:function(){bell(1318.51,.07);setTimeout(function(){if(on)bell(1975.53,.06);},90);},
  pad:function(){[146.83,220,369.99,587.33].forEach(function(f,i){var t0=A.currentTime,o=A.createOscillator(),g=A.createGain();o.type='sine';o.frequency.value=f;o.detune.value=(i%2?4:-4);
    g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(i>2?.018:.035,t0+.9);g.gain.setValueAtTime(i>2?.018:.035,t0+1.6);g.gain.exponentialRampToValueAtTime(.0001,t0+3.6);
    o.connect(g);g.connect(out);o.start(t0);o.stop(t0+3.7);});},
  end:function(){bell(587.33,.05);}
};
function fire(c){if(!on||!A||A.state!=='running')return;try{SFX[c[1]](c[2]);}catch(e){}}
var bedV=-1;function bed(t){if(!A)return;var duck=t>4.15&&t<4.6,v=(on&&playing&&!duck&&t<16.7)?.05:0;if(v===bedV)return;bedV=v;bedG.gain.setTargetAtTime(v,A.currentTime,v?.5:(duck?.04:.3));}

/* ---------- playback ---------- */
var playing=false,userPaused=false,viewable=false,finished=false,asking=false,asked=false,askLeft=0,askTick=null,prevT=0;
function ui(){
  root.classList.toggle('is-paused',!playing&&!finished&&!asking);root.classList.toggle('is-done',finished);
  var l=finished?'Replay':(playing||asking)?'Pause':'Play';
  if(ppT.textContent!==l){ppT.textContent=l;pp.setAttribute('aria-label',l+' the film');}
}
function sync(){
  if(asking){ui();return;}
  var go=viewable&&!d.hidden&&!userPaused&&!finished;
  if(go&&!playing){tl.play();playing=true;}else if(!go&&playing){tl.pause();playing=false;}
  ui();
}
function jump(t){if(asking)stopAsk();finished=t>=DUR;asked=t>ASK_T;tl.pause();playing=false;tl.seek(t);prevT=t;status(t);sync();}
function startAsk(){
  asking=true;asked=true;tl.pause();playing=false;tl.seek(ASK_T);prevT=ASK_T;root.classList.add('is-ask');
  card.removeAttribute('aria-hidden');ap.tabIndex=0;ap.setAttribute('aria-label','Approve the refund');
  askLeft=ASK_MAX;clearInterval(askTick);askTick=setInterval(function(){if(viewable&&!d.hidden&&!userPaused){askLeft-=100;if(askLeft<=0)endAsk(false);}},100);ui();
}
function stopAsk(){asking=false;clearInterval(askTick);root.classList.remove('is-ask');card.setAttribute('aria-hidden','true');ap.tabIndex=-1;ap.removeAttribute('aria-label');}
function endAsk(byUser){
  if(!asking)return;stopAsk();
  if(byUser){ap.classList.remove('tap');void ap.offsetWidth;ap.classList.add('tap');tl.seek(13.55);prevT=13.55;userPaused=false;}
  sync();
}
ap.addEventListener('click',function(){if(asking)endAsk(true);});
pp.addEventListener('click',function(){
  if(finished){jump(0);userPaused=false;sync();return;}
  if(asking){userPaused=!userPaused;ui();return;}
  userPaused=!userPaused;sync();
});
chs.forEach(function(b,i){b.addEventListener('click',function(){userPaused=false;jump(CH[i]);});});
snd.addEventListener('click',function(){
  on=!on;snd.setAttribute('aria-pressed',on?'true':'false');snd.querySelector('.t').textContent=on?'Sound on':'Sound off';
  if(on){if(!ac()){on=false;snd.setAttribute('aria-pressed','false');snd.querySelector('.t').textContent='Sound off';return;}
    out.gain.cancelScheduledValues(A.currentTime);out.gain.setTargetAtTime(.9,A.currentTime,.05);SFX.tick();
    if(finished){userPaused=false;jump(0);}else if(userPaused){userPaused=false;sync();}
  }else if(A){out.gain.setTargetAtTime(0,A.currentTime,.06);}
});

function loop(){
  var t=tl.time();
  if(playing){
    if(!asked&&t>=ASK_T-.02&&t<ASK_T+.5){startAsk();t=ASK_T;}
    else{for(var i=0;i<cues.length;i++){var c=cues[i];if(c[0]>prevT&&c[0]<=t)fire(c);}}
    if(t>=DUR-.005){finished=true;playing=false;tl.pause();tl.seek(DUR);t=DUR;ui();try{sessionStorage.setItem('kn-seen','1');}catch(e){}}
  }
  prevT=t;status(t);bed(t);
  W.requestAnimationFrame(loop);
}

/* ---------- build / rebuild ---------- */
var lastW=0,lastH=0;
function build(){
  var t=tl.time(),was=playing;M=measure();lastW=M.W;lastH=M.H;
  place(M);score(M);tl.seek(t);prevT=t;
  if(was){tl.play();}
  status(t);
}
build();
var seen=false;try{seen=sessionStorage.getItem('kn-seen')==='1';}catch(e){}
if(seen){finished=true;tl.seek(DUR);prevT=DUR;status(DUR);}
if('IntersectionObserver' in W){new IntersectionObserver(function(es){viewable=es[0].intersectionRatio>=.35;sync();},{threshold:[0,.35,.6]}).observe(root);}
else{viewable=true;}
d.addEventListener('visibilitychange',function(){if(A){d.hidden?A.suspend():(on&&A.resume());}sync();});
var rt=null;W.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){
  if(root.clientWidth!==lastW||Math.abs(root.clientHeight-lastH)>80)build();},180);});
if(d.fonts&&d.fonts.ready)d.fonts.ready.then(function(){var w=words[0].offsetHeight;if(M&&(w!==M.wh||root.clientWidth!==lastW))build();});
ui();sync();W.requestAnimationFrame(loop);
W.__kn={tl:tl,seek:function(t){userPaused=true;jump(t);},play:function(){userPaused=false;sync();},
  ask:function(){return asking;},M:function(){return M;},sound:function(){return on&&A?A.state:'off';}};
})(window);
