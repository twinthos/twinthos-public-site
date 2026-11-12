(function(){
"use strict";
function getTitle(){var h=document.querySelector("h1");return h?h.textContent.trim():document.title;}
document.addEventListener("click",function(ev){
 var b=ev.target.closest&&ev.target.closest("[data-nx-share]");
 if(!b)return;
 var url=window.location.href,initial=b.getAttribute("data-original-label")||b.textContent.trim();
 if(!b.hasAttribute("data-original-label"))b.setAttribute("data-original-label",initial);
 if(navigator.share){navigator.share({title:getTitle(),url:url}).catch(function(){ /* user cancelled share */ });return;}
 if(navigator.clipboard&&navigator.clipboard.writeText){
  navigator.clipboard.writeText(url).then(function(){b.textContent="Link copied ✓";}).catch(function(){b.textContent="Copy the page URL";});
 }else{b.textContent="Copy the page URL";b.setAttribute("title",url);}
});
})();