import{s as L,a as h,i as p}from"./assets/vendor-91385636.js";(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))i(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function o(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function i(e){if(e.ep)return;e.ep=!0;const t=o(e);fetch(e.href,t)}})();const $=document.querySelector(".form"),v=document.querySelector("#input"),f=document.querySelector(".gallery"),n=document.querySelector(".loader");n.style.display="none";let w=new L("ul.gallery a",{captionDelay:250,captionsData:"alt"}),b=1;const d=40,l=document.querySelector(".load-more");l.style.display="none";let c="";$.addEventListener("submit",async s=>{if(s.preventDefault(),b=1,f.innerHTML="",l.style.display="none",c=v.value.trim(),c!==""){n.style.display="block",v.value="",h.defaults.baseURL="https://pixabay.com";try{const r=await h.get("/api/",{params:{key:"41494285-2be0c6d487dc7750955372a82",q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:1}});n.style.display="none";const o=r.data;if(o.hits.length===0)throw p.show({message:"Sorry, there are no images matching your search query. Please try again!",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",position:"topRight"});const i=o.hits.reduce((e,{webformatURL:t,largeImageURL:a,tags:y,likes:u,views:m,comments:g,downloads:k})=>e+`<li class="gallery-item">
        <div class="card">
          <a class="gallery-link" href="${a}">
           <img class="gallery-image"
           src="${t}"
           alt="${y}"
           />
          </a>
          </div>          
          <div class="description">
          <p>Likes:<span>${u}</span></p>
          <p>Views:<span>${m}</span></p>
          <p>Comments:<span>${g}</span></p>
          <p>Downloads:<span>${k}</span></p>
          </div> 
        </li>`,"");f.insertAdjacentHTML("beforeend",i),o.hits.length>=d&&(l.style.display="block"),w.refresh()}catch(r){n.style.display="none",p.error({message:r.message,color:"red",position:"topCenter"}),console.error("Error fetching data:",r)}}});l.addEventListener("click",async()=>{n.style.display="block";try{const s=await h.get("/api/",{params:{key:"41494285-2be0c6d487dc7750955372a82",q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:++b}});n.style.display="none";const r=s.data;if(r.totalHits<=d*b)throw l.style.display="none",p.show({message:"We're sorry, but you've reached the end of search results.",theme:"dark",backgroundColor:"navy",titleColor:"white",position:"topRight"});const o=r.hits.reduce((i,{webformatURL:e,largeImageURL:t,tags:a,likes:y,views:u,comments:m,downloads:g})=>i+`<li class="gallery-item"><div class="card">
          <a class="gallery-link" href="${t}">
           <img class="gallery-image"
           src="${e}"
           alt="${a}"
           />
          </a></div>         
          <div class="description">
            <p>Likes:<span>${y}</span></p>
            <p>Views:<span>${u}</span></p>
            <p>Comments:<span>${m}</span></p>
            <p>Downloads:<span>${g}</span></p>
          </div> 
        </li>`,"");f.insertAdjacentHTML("beforeend",o),q(),w.refresh()}catch(s){n.style.display="none",p.error({message:s.message,color:"red",position:"topCenter"}),console.error("Error fetching more data:",s)}});const q=()=>{const r=document.querySelector(".gallery-item").getBoundingClientRect().height;window.scrollBy({top:r*2,behavior:"smooth"})};
//# sourceMappingURL=commonHelpers.js.map
