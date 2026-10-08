
// FurnitureShow — shared site behavior
const FS = {
  cart(){ try{return JSON.parse(localStorage.getItem("fs_cart")||"[]")}catch(e){return[]} },
  save(c){ localStorage.setItem("fs_cart", JSON.stringify(c)); FS.badge(); },
  add(id, qty, color){
    const p = PRODUCTS.find(x=>x.id===id); if(!p) return;
    const c = FS.cart();
    const key = id + "|" + (color||p.colors[0]);
    const found = c.find(i=>i.key===key);
    if(found) found.qty += qty; else c.push({key,id,qty,color:color||p.colors[0]});
    FS.save(c); FS.toast(p.name + " added to cart");
  },
  badge(){ const n = FS.cart().reduce((s,i)=>s+i.qty,0);
    document.querySelectorAll(".cart-count").forEach(el=>el.textContent=n); },
  toast(msg){ let t = document.querySelector(".toast");
    if(!t){ t=document.createElement("div"); t.className="toast"; document.body.appendChild(t); }
    t.textContent = msg; t.style.display="block";
    clearTimeout(t._to); t._to = setTimeout(()=>t.style.display="none", 2600); },
  stars(r){ return "★".repeat(r) + "☆".repeat(5-r); }
};

function productCard(p){
  const badge = p.badge ? `<span class="badge ${p.badge==="Senior Favorite"?"green":""}">${p.badge}</span>` : "";
  const old = p.old ? `<span class="old-price">${money(p.old)}</span>` : "";
  return `<div class="card">
    <div class="card-img"><a href="product.html?id=${p.id}" aria-label="${p.name}">${badge}<img src="${p.img}" alt="${p.name}" loading="lazy"></a></div>
    <div class="card-body">
      <span class="meta">${CATS[p.cat]}</span>
      <h3><a href="product.html?id=${p.id}">${p.name}</a></h3>
      <div class="stars" aria-label="Rated ${p.rating} of 5">${FS.stars(p.rating)} <span class="meta">(${p.reviews})</span></div>
      <p class="small muted">${p.short}</p>
      <div class="price-row"><span class="price">${money(p.price)}</span>${old}</div>
      <button class="btn btn-dark btn-block" onclick="FS.add('${p.id}',1)">Add to Cart</button>
    </div></div>`;
}

// Cart badge on every page
document.addEventListener("DOMContentLoaded", () => {
  FS.badge();
  const y = document.querySelector("[data-year]"); if(y) y.textContent = new Date().getFullYear();
});
