(function(){
'use strict';
var input=document.getElementById('nx-search'),buttons=[].slice.call(document.querySelectorAll('[data-nx-filter]')),
groups=[].slice.call(document.querySelectorAll('.nx-desk')),counter=document.getElementById('nx-results'),
empty=document.querySelector('.nx-empty'),deskNav=document.querySelector('.nx-desk-toc');
if(!input||!buttons.length||!groups.length)return;
var active='all';
function refresh(){
 var term=input.value.trim().toLowerCase().replace(/\s+/g,' '),found=0;
 groups.forEach(function(g){
  var inGroup=active==='all'||active===g.id,has=0;
  [].slice.call(g.querySelectorAll('a.nx-card')).forEach(function(c){
   var text=c.textContent.replace(/\s+/g,' ').toLowerCase(),ok=inGroup&&(!term||text.indexOf(term)!==-1);
   c.hidden=!ok;if(ok){has++;found++;}
  });
  g.hidden=!has;
 });
 if(deskNav)deskNav.hidden=!!term||active!=='all';
 if(counter)counter.textContent=found+' '+(found===1?'article':'articles');
 if(empty)empty.hidden=found!==0;
}
buttons.forEach(function(b){b.addEventListener('click',function(){
 active=b.getAttribute('data-nx-filter');
 buttons.forEach(function(o){o.setAttribute('aria-pressed',o===b?'true':'false');});
 refresh();
});});
input.addEventListener('input',refresh);
refresh();
})();