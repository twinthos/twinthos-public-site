/* Twinthos timeline helper: one Web Animations track per element, one shared clock. No dependencies. */
(function(W){
'use strict';
var EO='cubic-bezier(.16,1,.3,1)',EI='cubic-bezier(.65,0,.35,1)',ES='cubic-bezier(.33,1,.68,1)';
/* closed-form spring step response (zeta .6, ~9% overshoot) as a CSS linear() easing; falls back to EO where unsupported */
var SP=(function(){
  try{if(!(W.CSS&&CSS.supports&&CSS.supports('animation-timing-function','linear(0,1)')))return EO;}catch(e){return EO;}
  var z=.6,w=12,wd=w*Math.sqrt(1-z*z),n=26,pts=[];
  for(var i=0;i<=n;i++){var t=i/n,v=1-Math.exp(-z*w*t)*(Math.cos(wd*t)+z/Math.sqrt(1-z*z)*Math.sin(wd*t));pts.push(i===n?'1':(+v.toFixed(4)).toString());}
  return 'linear('+pts.join(',')+')';
})();
function TL(dur){this.dur=dur;this.a=[];this.master=null;this.bm=new Map();}
TL.prototype.clear=function(){this.a.forEach(function(x){try{x.cancel();}catch(e){}});this.a=[];this.master=null;this.bm.clear();};
/* read layout once, before any animation is created, to avoid layout thrash */
TL.prototype.prime=function(els){var m=this.bm;els.forEach(function(el){if(el)m.set(el,[el.offsetLeft,el.offsetTop]);});};
/* keys: [[t,{X,Y (absolute, via element base), x,y (raw px), r, s, sx, o, cp},ease]]; ease belongs to the segment ARRIVING at the key */
TL.prototype.mk=function(el,keys){
  if(!el)return null;
  var DUR=this.dur,bl=0,bt=0,need=keys.some(function(k){return k[1]&&(k[1].X!=null||k[1].Y!=null);});
  if(need){var b=this.bm.get(el);if(!b){b=[el.offsetLeft,el.offsetTop];this.bm.set(el,b);}bl=b[0];bt=b[1];}
  keys=keys.slice();
  if(keys[0][0]>0)keys.unshift([0,{},null]);
  if(keys[keys.length-1][0]<DUR)keys.push([DUR,{},null]);
  var cur={x:0,y:0,r:0,s:1,sx:1,sy:1,o:null,cp:null,bl:undefined},fr=[],lastT=0;
  keys.forEach(function(k){
    k=[Math.max(lastT,k[0]),k[1],k[2]];lastT=k[0];
    var s=k[1]||{};
    if(s.X!=null)cur.x=s.X-bl; if(s.Y!=null)cur.y=s.Y-bt;
    if(s.x!=null)cur.x=s.x; if(s.y!=null)cur.y=s.y;
    ['r','s','sx','sy','o','cp','bl'].forEach(function(f){if(s[f]!==undefined)cur[f]=s[f];});
    var f={offset:Math.max(0,Math.min(1,k[0]/DUR))};
    f.transform='translate3d('+cur.x+'px,'+cur.y+'px,0) rotate('+cur.r+'deg) scale('+(cur.sx*cur.s)+','+(cur.sy*cur.s)+')';
    if(cur.o!==null)f.opacity=cur.o;
    if(cur.cp!==null)f.clipPath=cur.cp;
    if(cur.bl!==undefined)f.filter='blur('+cur.bl+'px)';
    fr.push(f);
  });
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=el.animate(fr,{duration:DUR*1000,fill:'both',easing:'linear'});
  a.pause();this.a.push(a);
  if(!this.master)this.master=a;
  return a;
};
/* opacity windows with a small rise/settle. wins: [[t0,t1],...]; t1>=dur holds to the end. */
TL.prototype.win=function(el,wins,o){
  o=o||{};var inn=o.in==null?.35:o.in,out=o.out==null?.3:o.out,dy=o.dy==null?10:o.dy,s0=o.s==null?1:o.s,DUR=this.dur;
  var keys=[],first=true;
  wins.forEach(function(w){
    var t0=w[0],t1=w[1];
    if(t0<=0){keys.push([0,{o:1,y:0,s:1}]);}
    else{
      if(first)keys.push([0,{o:0,y:dy,s:s0}]);
      keys.push([t0,{o:0,y:dy,s:s0}],[t0+inn,{o:1,y:0,s:1},o.sp?SP:EO]);
    }
    first=false;
    if(t1<DUR){keys.push([t1,{o:1,y:0,s:1}],[t1+out,{o:0,y:-dy*.5,s:s0===1?1:(1+s0)/2+.01},ES]);}
  });
  if(keys[0][0]>0)keys.unshift([0,{o:0,y:dy,s:s0}]);
  return this.mk(el,keys);
};
/* clip-path reveal */
TL.prototype.reveal=function(el,t0,t1,from,ease){
  from=from||'inset(0 100% 0 0)';
  return this.mk(el,[[0,{cp:from}],[t0,{cp:from}],[t1,{cp:'inset(0 0 0 0)'},ease||EO]]);
};
/* edge-light bumps on a glass surface when an action becomes available */
TL.prototype.bump=function(el,times,base){
  base=base==null?.28:base;var keys=[[0,{o:base}]];
  times.forEach(function(t,i){var nx=times[i+1],end=nx!=null?Math.min(t+1.3,nx-.05):t+1.3;keys.push([t,{o:base}],[t+.22,{o:1},EO],[Math.max(t+.3,end),{o:base},ES]);});
  return this.mk(el,keys);
};
/* camera: individual transform properties (translate/scale) so the element's own transform stays intact. keys: [[t,{x,y,s},ease]] */
TL.prototype.cam=function(el,keys){
  if(!el||!(W.CSS&&CSS.supports&&CSS.supports('scale','1')))return null;
  var DUR=this.dur;keys=keys.slice();
  if(keys[0][0]>0)keys.unshift([0,keys[0][1],null]);
  if(keys[keys.length-1][0]<DUR)keys.push([DUR,keys[keys.length-1][1],null]);
  var fr=keys.map(function(k){var v=k[1];return{offset:Math.max(0,Math.min(1,k[0]/DUR)),translate:(v.x||0).toFixed(2)+'px '+(v.y||0).toFixed(2)+'px',scale:String(v.s==null?1:v.s)};});
  for(var i=0;i<fr.length-1;i++)fr[i].easing=keys[i+1][2]||'linear';
  var a=el.animate(fr,{duration:DUR*1000,fill:'both',easing:'linear'});a.pause();this.a.push(a);return a;
};
TL.prototype.seek=function(t){var ms=Math.max(0,Math.min(this.dur,t))*1000;this.a.forEach(function(x){x.currentTime=ms;});};
TL.prototype.time=function(){return this.master?(this.master.currentTime||0)/1000:0;};
TL.prototype.play=function(){this.a.forEach(function(x){x.play();});};
TL.prototype.pause=function(){this.a.forEach(function(x){x.pause();});};
W.TWTL={TL:TL,EO:EO,EI:EI,ES:ES,SP:SP};
})(window);
