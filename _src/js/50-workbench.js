/* A local, deterministic demonstration. No network calls or customer data. */
(function(){
  'use strict';
  var root=document.querySelector('[data-workbench]');
  if(!root)return;
  var tabs=Array.from(root.querySelectorAll('[data-wb-step]'));
  var panels=Array.from(root.querySelectorAll('[role="tabpanel"]'));
  var next=root.querySelector('[data-wb-next]');
  var index=0;
  function select(value,focus){
    index=(value+tabs.length)%tabs.length;
    tabs.forEach(function(tab,i){
      tab.setAttribute('aria-selected',String(i===index));
      tab.tabIndex=i===index?0:-1;
      panels[i].hidden=i!==index;
    });
    root.querySelector('[data-wb-count]').textContent='0'+(index+1)+' / 04';
    next.firstChild.textContent=index===3?'Replay example ':'Next step ';
    if(focus)tabs[index].focus();
  }
  tabs.forEach(function(tab,i){
    tab.addEventListener('click',function(){select(i,false);});
    tab.addEventListener('keydown',function(event){
      var value;
      if(event.key==='ArrowRight')value=index+1;
      else if(event.key==='ArrowLeft')value=index-1;
      else if(event.key==='Home')value=0;
      else if(event.key==='End')value=tabs.length-1;
      else return;
      event.preventDefault();select(value,true);
    });
  });
  next.addEventListener('click',function(){select(index+1,true);});
})();
