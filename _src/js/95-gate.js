/* THE GATE. ~80k GPU points: tangled work enters, crosses a lit gate, leaves as straight calm lanes.
   Pure function of (seed, time): no feedback buffers. Hero = chaos->order. Close = all calm. */
(function(){'use strict';
var W=window,d=document,RM=W.matchMedia&&W.matchMedia('(prefers-reduced-motion: reduce)').matches;
var VS=[
'precision highp float;',
'attribute vec4 aS;',
'uniform float uT,uGate,uCalm,uDpr,uIntro,uScroll,uAsp,uAmp,uL,uRot,uDim;','uniform vec3 uTone;',
'uniform vec2 uMouse,uTilt;',
'varying vec4 vC;',
'void main(){',
' float sp=.045+aS.z*.03;',
' float u=fract(aS.x+uT*sp);',
' float x0=-1.3,x1=1.35;',
' float x=mix(x0,x1,u);',
' float L=uL;',
' float li=floor(aS.y*L);',
' float lf=li/(L-1.);',
' float laneY=(lf*2.-1.)*.8;',
' float laneZ=(fract(li*.618)-.5)*.5*(1.-uCalm*.95);',
' float s=clamp((x-x0)/(uGate-x0),0.,1.);',
' float conv=max(smoothstep(.34,1.,s),uCalm);',
' float t=uT;',
' float sy1=sin(x*2.6+li*1.7+t*.42)*.50+sin(x*4.7-li*2.9+t*.7)*.34+sin(x*9.1+li*5.3-t*.6)*.16;',
' float sz1=cos(x*2.9-li*2.3+t*.4)*.6+sin(x*5.3+li*3.1-t*.55)*.4;',
' float amp=uAmp*1.45*pow(1.-conv,1.1);',
' float th=mix(.035,.0045,conv)*(1.-uCalm*.8);',
' float ny=(aS.z-.5)*2.*th,nz=(aS.w-.5)*2.*th*3.;',
' float y=laneY+sy1*amp*4.2+ny;',
' float z=laneZ+sz1*amp*3.6+nz;',
' y+=sin(x*2.2+uT*.45+li*.7)*.006*conv*(1.-uCalm);',
' vec2 dm=vec2(x,y)-uMouse;',
' float md=length(dm*vec2(uAsp,1.));',
' float pf=exp(-md*md*6.)*(1.-conv);',
' vec2 push=dm/(md+.07)*pf*.14;',
' x+=push.x;y+=push.y;z+=pf*.25;',
' float gd=x-uGate;',
' float flare=exp(-gd*gd*520.)*(1.-uCalm);',
' float cy=cos(uTilt.x),sy=sin(uTilt.x);',
' float x2=x*cy+z*sy,z2=-x*sy+z*cy;',
' float cx=cos(uTilt.y),sx=sin(uTilt.y);',
' float y2=y*cx-z2*sx,z3=y*sx+z2*cx;',
' y2+=uScroll*.35;z3-=uScroll*.5;',
' float w=1.+z3*.38;',
' vec2 P=vec2(x2,y2)/w;',
' gl_Position=uRot>.5?vec4(P.y*1.05,-P.x,0.,1.):vec4(P,0.,1.);',
' float fadeEnd=1.-smoothstep(1.02,1.3,x);',
' float fadeIn=smoothstep(-1.3,-1.0,x);',
' float bright=.7+1.6*pf;',
' float chaosA=(.9+aS.z*.9)*(1.-conv);',
' float laneA=(.34+aS.w*.30*(1.-uCalm*.8))*conv*(1.+uCalm*1.1);',
' float a=(chaosA+laneA)*fadeEnd*fadeIn*bright;',
' a+=flare*1.1;',
' float intro=smoothstep(0.,1.,uIntro*1.7-aS.y*.7);',
' a*=intro*(1.-uScroll*.9)*uDim;',
' float size=mix(2.4+aS.z*2.8,1.3+aS.w*.8+uCalm*.9,conv)+flare*6.+pf*3.;',
' gl_PointSize=max(1.,size*uDpr/w);',
' vec3 cc=mix(vec3(.62,.72,.95),vec3(1.,.62,.38),step(.66,aS.w));',
' vec3 cl=uTone;',
' vec3 ce=vec3(.25,.62,1.);',
' vec3 col=mix(cc,cl,conv);',
' col=mix(col,ce,clamp(flare*1.2+pf*.5,0.,1.));',
' col+=vec3(.5)*flare*flare;',
' vC=vec4(col,a);',
'}'].join('\n');
var FS=['precision mediump float;','varying vec4 vC;','void main(){vec2 p=gl_PointCoord-.5;float r=length(p);if(r>.5)discard;float f=1.-r*2.;f*=f;gl_FragColor=vec4(vC.rgb,vC.a*f);}'].join('\n');

function sh(gl,t,src){var s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){throw new Error(gl.getShaderInfoLog(s));}return s;}

function stage(host,cfg){
 var cv=d.createElement('canvas');cv.className='gate-cv';cv.setAttribute('aria-hidden','true');
 host.insertBefore(cv,host.firstChild);if(!cfg.calm){var bm=d.createElement('div');bm.className='gate-beam';bm.setAttribute('aria-hidden','true');host.insertBefore(bm,cv.nextSibling);}
 var gl=cv.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'});
 if(!gl){cv.remove();return null;}
 var pr;try{pr=gl.createProgram();gl.attachShader(pr,sh(gl,gl.VERTEX_SHADER,VS));gl.attachShader(pr,sh(gl,gl.FRAGMENT_SHADER,FS));gl.linkProgram(pr);if(!gl.getProgramParameter(pr,gl.LINK_STATUS))throw new Error('link');}catch(e){cv.remove();return null;}
 gl.useProgram(pr);
 var small=W.innerWidth<700,N=cfg.count*(small?(cfg.calm?.5:.32):1)|0;
 var seeds=new Float32Array(N*4);for(var i=0;i<N;i++){seeds[i*4]=Math.random();seeds[i*4+1]=Math.random();seeds[i*4+2]=Math.random();seeds[i*4+3]=Math.random();}
 var buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,seeds,gl.STATIC_DRAW);
 var loc=gl.getAttribLocation(pr,'aS');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,4,gl.FLOAT,false,0,0);
 var U={};['uT','uGate','uCalm','uDpr','uIntro','uScroll','uAsp','uAmp','uL','uMouse','uTilt','uRot','uDim','uTone'].forEach(function(n){U[n]=gl.getUniformLocation(pr,n);});
 gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE);gl.disable(gl.DEPTH_TEST);
 gl.clearColor(5/255,7/255,11/255,1);
 var tone=cfg.tone||[.86,.93,1.];var dpr=Math.min(W.devicePixelRatio||1,1.75),w=1,h=1,mx=2,my=2,tx=0,ty=0,sx=0,sy=0,vis=true,raf=0,t0=performance.now(),forceT=null,scroll=0;
 function size(){var r=cv.getBoundingClientRect();w=Math.max(1,r.width);h=Math.max(1,r.height);cv.width=w*dpr|0;cv.height=h*dpr|0;gl.viewport(0,0,cv.width,cv.height);}
 function anchorGate(){var a=cfg.anchor&&host.querySelector(cfg.anchor);if(!a)return cfg.gateP!==undefined?cfg.gateP:-.1;var py=a.getBoundingClientRect().top-cv.getBoundingClientRect().top-(cfg.anchorGap||22);return Math.max(-.7,Math.min(.8,2*py/h-1));}
 function ease(k){k=Math.min(1,Math.max(0,k));return 1-Math.pow(1-k,3);}
 function frame(now){
  raf=0;if(!vis)return;
  var el=forceT!==null?forceT:(now-t0)/1000;
  sx+=(tx-sx)*.06;sy+=(ty-sy)*.06;
  var phone=W.innerWidth<=760,port=phone||w<h*.9,rot=phone;
  var gateFinal=rot?(cfg.calm?cfg.gate:anchorGate()):port?.55:cfg.gate;
  var intro=cfg.intro?ease(el/cfg.intro):1;
  var gate=cfg.calm?-1.5:(cfg.intro?1.45+(gateFinal-1.45)*intro:gateFinal);
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.uniform1f(U.uT,el+(cfg.t0||0));gl.uniform1f(U.uGate,gate);gl.uniform1f(U.uCalm,cfg.calm?1:0);
  gl.uniform1f(U.uDpr,dpr);gl.uniform1f(U.uIntro,cfg.intro?Math.min(1,el/1.4):1);gl.uniform1f(U.uScroll,scroll);
  gl.uniform1f(U.uAsp,w/h);gl.uniform1f(U.uL,cfg.calm?(port?9:13):(phone?15:port?22:34));gl.uniform1f(U.uAmp,phone?.15:port?.17:.2);
  gl.uniform1f(U.uRot,rot?1:0);gl.uniform1f(U.uDim,rot?(cfg.dimP||cfg.dim||1):(cfg.dim||1));gl.uniform3f(U.uTone,tone[0],tone[1],tone[2]);
  host.style.setProperty('--gx',(((cfg.calm?-2:gate)+1)/2*cv.offsetWidth+cv.offsetLeft).toFixed(1)+'px');host.style.setProperty('--gy',(((cfg.calm?-2:gate)+1)/2*cv.offsetHeight+cv.offsetTop).toFixed(1)+'px');
  gl.uniform2f(U.uMouse,mx,my);gl.uniform2f(U.uTilt,sx*.16,-sy*.09);
  gl.drawArrays(gl.POINTS,0,N);
  if(!RM&&forceT===null)raf=W.requestAnimationFrame(frame);
 }
 function kick(){if(!raf&&vis)raf=W.requestAnimationFrame(frame);}
 size();
 if(RM){forceT=cfg.still||9;frame(0);}else kick();
 if(W.ResizeObserver)new ResizeObserver(function(){size();if(RM||forceT!==null)frame(0);}).observe(host);
 if('IntersectionObserver' in W)new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)kick();}).observe(host);
 d.addEventListener('visibilitychange',function(){vis=!d.hidden;if(vis)kick();});
 if(!RM&&W.matchMedia('(pointer:fine)').matches){
  host.addEventListener('pointermove',function(e){var r=cv.getBoundingClientRect();mx=((e.clientX-r.left)/r.width)*2-1;my=-(((e.clientY-r.top)/r.height)*2-1);tx=mx;ty=my;},{passive:true});
  host.addEventListener('pointerleave',function(){mx=my=2;tx=ty=0;});
 }
 if(cfg.scroll){W.addEventListener('scroll',function(){var k=Math.min(1,Math.max(0,W.scrollY/(h*.9)));scroll=k;},{passive:true});}
 host.classList.add('gate-on');
 return {set:function(t){forceT=t;frame(0);},n:N,canvas:cv};
}

var TONES={'AI security':[1.,.80,.80],'Agents & tools':[.80,.88,1.],'Business decisions':[1.,.90,.72]};
var hero=d.querySelector('.editorial-hero');
if(hero){W.__gateHero=stage(hero,{count:80000,gate:.46,intro:3.6,scroll:true,still:9,anchor:'.editorial-hero-bottom',anchorGap:20,dimP:1.45});}
else if(!/^\/(privacy|terms|404)/.test(location.pathname)){
 var ph=d.querySelector('.phead,.notes-stage,.article-stage');
 if(ph){var hs=0,pth=location.pathname;for(var i=0;i<pth.length;i++)hs=(hs*31+pth.charCodeAt(i))>>>0;
  var tn=TONES[ph.getAttribute('data-tone')]||void 0;
  W.__gateHero=stage(ph,{count:46000,gate:.4+(hs%21)/100,gateP:.2,intro:2.4,scroll:true,still:9,t0:2+hs%23,tone:tn,dim:.7,dimP:1.0});}}
var close=d.querySelector('.gate-close');
if(close){W.__gateClose=stage(close,{count:46000,calm:true,gate:-1.5,t0:6,still:3,dim:1,dimP:.8});}
})();