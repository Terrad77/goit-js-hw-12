import{s as L,a as y,i as p}from"./assets/vendor-91385636.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))l(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const a of t.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&l(a)}).observe(document,{childList:!0,subtree:!0});function r(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerpolicy&&(t.referrerPolicy=e.referrerpolicy),e.crossorigin==="use-credentials"?t.credentials="include":e.crossorigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function l(e){if(e.ep)return;e.ep=!0;const t=r(e);fetch(e.href,t)}})();const $=document.querySelector(".form"),v=document.querySelector("#input"),f=document.querySelector(".gallery"),n=document.querySelector(".loader");n.style.display="none";let w=new L("ul.gallery a",{captionDelay:250,captionsData:"alt"}),b=1;const d=40,i=document.querySelector(".load-more");i.style.display="none";let c="";y.defaults.baseURL="https://pixabay.com";y.defaults.headers.common.key="41494285-2be0c6d487dc7750955372a82";$.addEventListener("submit",async o=>{if(o.preventDefault(),f.innerHTML="",b=1,i.style.display="none",c=v.value.trim(),c!==""){n.style.display="block",v.value="";try{const s=await y.get("/api/",{params:{q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:1}});n.style.display="none";const r=s.data;if(r.hits.length===0)throw p.show({message:"Sorry, there are no images matching your search query. Please try again!",theme:"dark",backgroundColor:"#EF4040",titleColor:"white",position:"topRight"});const l=r.hits.reduce((e,{webformatURL:t,largeImageURL:a,tags:m,likes:u,views:g,comments:h,downloads:k})=>e+`<li class="gallery-item">
        <div class="card">
          <a class="gallery-link" href="${a}">
           <img class="gallery-image"
           src="${t}"
           alt="${m}"
           />
          </a>
          </div>          
          <div class="description">
          <p>Likes:<span>${u}</span></p>
          <p>Views:<span>${g}</span></p>
          <p>Comments:<span>${h}</span></p>
          <p>Downloads:<span>${k}</span></p>
          </div> 
        </li>`,"");f.insertAdjacentHTML("beforeend",l),r.hits.length>=d&&(i.style.display="block"),w.refresh()}catch(s){n.style.display="none",p.error({message:s.message,color:"red",position:"topCenter"}),console.error("Error fetching data:",s)}}});i.addEventListener("click",async()=>{n.style.display="block";try{const o=await y.get("/api/",{params:{key:"41494285-2be0c6d487dc7750955372a82",q:c,image_type:"photo",orientation:"horizontal",safesearch:!0,per_page:d,page:++b}});n.style.display="none";const s=o.data;if(s.totalHits<=d*b)throw i.style.display="none",p.show({message:"We're sorry, but you've reached the end of search results.",theme:"dark",backgroundColor:"navy",titleColor:"white",position:"topRight"});const r=s.hits.reduce((l,{webformatURL:e,largeImageURL:t,tags:a,likes:m,views:u,comments:g,downloads:h})=>l+`<li class="gallery-item"><div class="card">
          <a class="gallery-link" href="${t}">
           <img class="gallery-image"
           src="${e}"
           alt="${a}"
           />
          </a></div>         
          <div class="description">
            <p>Likes:<span>${m}</span></p>
            <p>Views:<span>${u}</span></p>
            <p>Comments:<span>${g}</span></p>
            <p>Downloads:<span>${h}</span></p>
          </div> 
        </li>`,"");f.insertAdjacentHTML("beforeend",r),q(),w.refresh()}catch(o){n.style.display="none",p.error({message:o.message,color:"red",position:"topCenter"}),console.error("Error fetching more data:",o)}});const q=()=>{const s=document.querySelector(".gallery-item").getBoundingClientRect().height;window.scrollBy({top:s*2,behavior:"smooth"})};
//# sourceMappingURL=commonHelpers.js.map
