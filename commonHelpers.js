import{s as $,a as g,i as c}from"./assets/vendor-91385636.js";(function(){const o=document.createElement("link").relList;if(o&&o.supports&&o.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();const q=document.querySelector(".form"),v=document.querySelector("#input"),h=document.querySelector(".gallery"),n=document.querySelector(".loader");n.style.display="none";let w=new $("ul.gallery a",{captionDelay:250,captionsData:"alt"}),f=1;const d=40,l=document.querySelector(".load-more");l.style.display="none";let b="";q.addEventListener("submit",async s=>{s.preventDefault(),f=1,h.innerHTML="",l.style.display="none",b=v.value.trim(),n.style.display="block",v.value="",g.defaults.baseURL="https://pixabay.com";try{const o=await g.get("/api/",{params:{key:"41494285-2be0c6d487dc7750955372a82",q:b,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:1}});n.style.display="none";const r=o.data;if(r.hits.length===0)throw c.show({message:"Sorry, there are no images matching your search query. Please try again!",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",position:"topRight"});const i=r.hits.reduce((e,{webformatURL:t,largeImageURL:a,tags:p,likes:y,views:m,comments:u,downloads:k})=>e+`<li class="gallery-item">
        <div class="card">
          <a class="gallery-link" href="${a}">
           <img class="gallery-image"
           src="${t}"
           alt="${p}"
           />
          </a>
          </div>          
          <div class="description">
          <p>Likes:<span>${y}</span></p>
          <p>Views:<span>${m}</span></p>
          <p>Comments:<span>${u}</span></p>
          <p>Downloads:<span>${k}</span></p>
          </div> 
        </li>`,"");h.insertAdjacentHTML("beforeend",i),r.hits.length>=d&&(l.style.display="block"),w.refresh()}catch(o){n.style.display="none",c.error({message:o.message,color:"red",position:"topCenter"}),console.error("Error fetching data:",o)}});l.addEventListener("click",async()=>{n.style.display="block";try{const s=await g.get("/api/",{params:{key:"41494285-2be0c6d487dc7750955372a82",q:b,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:++f}});n.style.display="none";const o=s.data;if(o.totalHits<=d*f)throw l.style.display="none",c.show({message:"We're sorry, but you've reached the end of search results.",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",position:"topRight"});const r=o.hits.reduce((i,{webformatURL:e,largeImageURL:t,tags:a,likes:p,views:y,comments:m,downloads:u})=>i+`<li class="gallery-item"><div class="card">
          <a class="gallery-link" href="${t}">
           <img class="gallery-image"
           src="${e}"
           alt="${a}"
           />
          </a></div>         
          <div class="description">
            <p>Likes:<span>${p}</span></p>
            <p>Views:<span>${y}</span></p>
            <p>Comments:<span>${m}</span></p>
            <p>Downloads:<span>${u}</span></p>
          </div> 
        </li>`,"");h.insertAdjacentHTML("beforeend",r),L(),w.refresh()}catch(s){n.style.display="none",c.error({message:s.message,color:"red",position:"topCenter"}),console.error("Error fetching more data:",s)}});const L=()=>{const o=document.querySelector(".gallery-item").getBoundingClientRect().height;window.scrollBy({top:o*2,behavior:"smooth"})};document.addEventListener("DOMContentLoaded",()=>{L()});
//# sourceMappingURL=commonHelpers.js.map
