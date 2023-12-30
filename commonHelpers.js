import{s as g,i as l}from"./assets/vendor-87ec4f81.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))r(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const s of t.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function r(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const L=document.querySelector(".form"),c=document.querySelector("#input"),u=document.querySelector(".gallery"),n=document.querySelector(".loader");n.style.display="none";let b=new g("ul.gallery a",{captionDelay:250,captionsData:"alt"});L.addEventListener("submit",i=>{i.preventDefault();const o=c.value.trim();u.innerHTML="",c.value="",n.style.display="block";const a=new URLSearchParams({key:"41494285-2be0c6d487dc7750955372a82",q:o,image_type:"photo",orientation:"horizontal",safesearch:!0});fetch(`https://pixabay.com/api/?${a}`).then(r=>{if(n.style.display="none",!r.ok)throw new Error(r.status);return r.json()}).then(r=>{if(r.hits.length===0)throw l.show({message:"Sorry, there are no images matching your search query. Please try again!",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",position:"topRight"});const e=r.hits.reduce((t,{webformatURL:s,largeImageURL:d,tags:p,likes:m,views:y,comments:f,downloads:h})=>t+`<li class="gallery-item">
          <a class="gallery-link" href="${d}">
           <img class="gallery-image"
           src="${s}"
           alt="${p}"
           />
          </a>          
          <div class="description">
          <p>Likes:<span>${m}</span></p>
          <p>Views:<span>${y}</span></p>
          <p>Comments:<span>${f}</span></p>
          <p>Downloads:<span>${h}</span></p>
          </div> 
        </li>`,"");u.insertAdjacentHTML("beforeend",e),b.refresh()}).catch(r=>{n.style.display="none",l.error({message:r.message,color:"red",position:"topCenter"}),console.error("Error fetching data:",r)})});
//# sourceMappingURL=commonHelpers.js.map
