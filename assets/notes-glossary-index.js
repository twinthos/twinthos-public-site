(function(){
'use strict';
var section=document.getElementById('plain-english-glossary');
if(!section)return;
var details=section.querySelector('.nx-decoder-details');
function reveal(){
 var hash=location.hash.slice(1);
 if(hash==='plain-english-glossary'||hash.indexOf('glossary-')===0){
  details.open=true;
  if(hash.indexOf('glossary-')===0){
   var term=document.getElementById(hash);
   if(term)requestAnimationFrame(function(){term.scrollIntoView({block:'center'});});
  }
 }
}
window.addEventListener('hashchange',reveal);
reveal();
})();