(function(){
  var d=document, rm=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  // reading progress
  var bar=d.querySelector('.nx-progress'), art=d.querySelector('.nx-article');
  if(bar&&art){
    var tick=false;
    function upd(){
      var r=art.getBoundingClientRect(), h=r.height-innerHeight*.6;
      var p=Math.min(1,Math.max(0,(-r.top+innerHeight*.2)/Math.max(h,1)));
      bar.style.transform='scaleX('+p+')'; tick=false;
    }
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
    upd();
  }
  // TOC highlighting
  var links=[].slice.call(d.querySelectorAll('.nx-toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){
      es.forEach(function(e){
        if(e.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a)a.classList.add('on')}
      });
    },{rootMargin:'-20% 0px -70% 0px'});
    Object.keys(map).forEach(function(id){var el=d.getElementById(id);if(el)io.observe(el)});
  }
  // desk-nav highlighting on the notes index.
  //
  // ONE decision function, dpick(), is the only thing that chooses a group.
  // IntersectionObserver is used purely as a "something moved, recompute"
  // trigger, never as the decision itself: the 1px band can only ever be
  // crossed by exactly one group (the three sections are flush, gap 0), so an
  // IO that calls dpick() on every change can never disagree with the scroll
  // path. A previous version made the IO callback choose directly, which let
  // the two paths disagree.
  //
  // Do NOT remove the initial dpick() call. Without it a restored scroll
  // position or a /notes/#desk-now load shows no active group until the user
  // scrolls, and the scroll listener alone would never have fired.
  //
  // Do NOT wrap the scroll handler in a requestAnimationFrame guard: if rAF is
  // throttled (hidden tab) the guard latches and the nav freezes for good.
  // Three getBoundingClientRect reads per scroll event is cheap enough.
  var dtoc=[].slice.call(d.querySelectorAll('.nx-desk-toc a'));
  var dgroups=[].slice.call(d.querySelectorAll('.nx-desk'));
  if(dtoc.length&&dgroups.length){
    var dset=function(hit){
      for(var j=0;j<dtoc.length;j++){
        if(hit&&dtoc[j].getAttribute('href')==='#'+hit){
          dtoc[j].setAttribute('aria-current','true');
        }else{
          dtoc[j].removeAttribute('aria-current');
        }
      }
    };
    // A group is current once its heading has risen to the sticky bar.
    // scroll-margin-top is nav+56 = 124px and browsers add the desk header's
    // own leading on top of that, so a group you have just jumped to always
    // lands at exactly 208px -- measured identical at 1920/1440/1024/768/390.
    // Cut above that line with headroom, then take the LAST group under it, so
    // the group you just arrived at wins and keeps it until the next passes.
    // The comparison is on a fractional float, so never test equality.
    var dcut=240;
    var dpick=function(){
      var hit=null;
      for(var i=0;i<dgroups.length;i++){
        if(dgroups[i].getBoundingClientRect().top<=dcut){hit=dgroups[i]}else{break}
      }
      dset(hit?hit.id:null);
    };
    if('IntersectionObserver' in window){
      // The bar sticks at top:var(--nav) and is ~50px tall. Do NOT read its
      // offsetTop: for a position:sticky element that returns the stuck
      // position, which collapses the band to nothing. Derive the strip from
      // the nav height plus 172px of headroom so it sits just below the bar.
      var dnav=d.querySelector('.nx-desk-toc');
      var dbar=68+Math.round(dnav.getBoundingClientRect().height)+172;
      var dio=new IntersectionObserver(dpick,{
        rootMargin:'-'+dbar+'px 0px -'+(window.innerHeight-dbar-1)+'px 0px',
        threshold:0
      });
      dgroups.forEach(function(g){dio.observe(g)});
    }
    window.addEventListener('scroll',dpick,{passive:true});
    window.addEventListener('resize',dpick,{passive:true});
    dpick();
  }
  // chart reveal
  var charts=[].slice.call(d.querySelectorAll('.nx-chart'));
  if(charts.length&&'IntersectionObserver' in window&&!rm){
    charts.forEach(function(c){c.classList.add('js-arm')});
    var cio=new IntersectionObserver(function(es){
      es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');cio.unobserve(e.target)}});
    },{threshold:.25});
    charts.forEach(function(c){cio.observe(c)});
  }
  // calculator
  var calc=d.querySelector('[data-calc]');
  if(calc){
    var h=calc.querySelector('[name=hours]'), v=calc.querySelector('[name=rate]');
    var fmt=new Intl.NumberFormat('en-GB',{maximumFractionDigits:0});
    function run(){
      var hrs=Math.max(0,parseFloat(h.value)||0), rate=Math.max(0,parseFloat(v.value)||0);
      var yr=hrs*52, cost=yr*rate;
      calc.querySelector('[data-o=year]').textContent=fmt.format(yr);
      calc.querySelector('[data-o=days]').textContent=fmt.format(yr/8);
      calc.querySelector('[data-o=cost]').textContent='£'+fmt.format(cost);
    }
    [h,v].forEach(function(i){i.addEventListener('input',run)});run();
  }
})();
