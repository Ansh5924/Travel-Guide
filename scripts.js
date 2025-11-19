const attractions = [
  {id:1,name:"Sunny Beach",tag:["nature","family"],desc:"Long sandy beach with calm water — good for families.",img:"https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=60",details:"Sunny Beach is the most popular spot in Sunnyvale. Lifeguard services are seasonal and there are several cafes along the promenade."},
  {id:2,name:"Harbor Cafe",tag:["food"],desc:"Popular cafe by the harbour — fresh seafood and coffee.",img:"https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=60",details:"Harbor Cafe is known for its seafood platters. Try the catch-of-the-day and the signature cold brew."},
  {id:3,name:"Old Town Museum",tag:["history"],desc:"Small museum that covers the town's maritime past.",img:"https://images.unsplash.com/photo-1531973968078-9bb02785f13d?auto=format&fit=crop&w=800&q=60",details:"The museum has free entry on Sundays. It includes maps, models of ships and a small audio tour."},
  {id:4,name:"Sunset Viewpoint",tag:["nature"],desc:"An easy walk up the hill gives spectacular sunset views.",img:"https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&w=800&q=60",details:"Sunset Viewpoint faces west and is perfect for photography. There's a small tea stall at the base of the hill."},
  {id:5,name:"Botanical Garden",tag:["nature","family"],desc:"Nice gardens with a small conservatory and picnic spots.",img:"https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=60",details:"Botanical Garden houses local and exotic plants. Guided tours are available on request."},
  {id:6,name:"Market Street",tag:["food","history"],desc:"Local market with crafts, snacks and friendly vendors.",img:"https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=800&q=60",details:"Market Street is busiest in the mornings. Don't miss the handmade souvenirs and the street pancakes."},
  {id:7,name:"Coastal Trail",tag:["nature","adventure"],desc:"A coastal trail suitable for hiking and jogging.",img:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=60",details:"The trail stretches for 8 km with viewpoints and rest benches along the way."},
  {id:8,name:"Fisherman's Wharf",tag:["food","family"],desc:"A lively area with boats, seafood stalls and boat trips.",img:"https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=800&q=60",details:"Fisherman's Wharf offers boat trips at sunrise. There are small play areas for children."}
];

// DOM helpers
function $q(sel){ return document.querySelector(sel); }
function $qa(sel){ return Array.from(document.querySelectorAll(sel)); }
function el(tag, attrs = {}, children = []){
  const e = document.createElement(tag);
  for (let k in attrs){
    if (k === 'class') e.className = attrs[k];
    else if (k === 'text') e.textContent = attrs[k];
    else if (k === 'html') e.innerHTML = attrs[k]; // use only when trusted
    else e.setAttribute(k, attrs[k]);
  }
  (children || []).forEach(c => e.appendChild(c));
  return e;
}

// Rendering
function renderAttractions(containerSelector = '#attractions-list', filter = 'all', query = ''){
  const container = $q(containerSelector);
  if(!container) return;
  container.innerHTML = '';
  let filtered = attractions.filter(a => {
    if(filter !== 'all' && !a.tag.includes(filter)) return false;
    if(query && !a.name.toLowerCase().includes(query.toLowerCase()) && !a.desc.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });
  if(filtered.length === 0){
    container.innerHTML = '<p class="muted">No attractions found for your search/filter.</p>';
    return;
  }
  filtered.forEach(a => {
    const card = el('div',{class:'card'});
    const img = el('img',{src:a.img,alt:a.name,loading:'lazy'});
    const h3 = el('h3',{text:a.name});
    const p = el('p',{text:a.desc});
    const meta = el('div',{class:'meta'});
    const saveBtn = el('button',{class:'btn',type:'button',text:'Save'});
    saveBtn.addEventListener('click', ()=> saveFavorite(a.id));
    const detailsBtn = el('button',{class:'btn',type:'button',text:'Details'});
    detailsBtn.style.background = '#444';
    detailsBtn.addEventListener('click', ()=> openModal(a));
    meta.appendChild(saveBtn);
    meta.appendChild(detailsBtn);
    card.appendChild(img);
    card.appendChild(h3);
    card.appendChild(p);
    card.appendChild(meta);
    container.appendChild(card);
  });
}

function renderHighlights(containerSelector = '#highlights'){
  const container = $q(containerSelector);
  if(!container) return;
  container.innerHTML = '';
  const top = attractions.slice(0,4);
  top.forEach(a => {
    const card = el('div',{class:'card'});
    const img = el('img',{src:a.img,alt:a.name,loading:'lazy'});
    const h3 = el('h3',{text:a.name});
    const btn = el('button',{class:'btn',text:'View'});
    btn.addEventListener('click', ()=> openModal(a));
    card.appendChild(img); card.appendChild(h3); card.appendChild(btn);
    container.appendChild(card);
  });
}

function renderGallery(containerSelector = '#gallery-grid'){
  const container = $q(containerSelector);
  if(!container) return;
  container.innerHTML = '';
  attractions.forEach(a => {
    const img = el('img',{src:a.img,alt:a.name,loading:'lazy'});
    img.addEventListener('click', ()=> openModal(a));
    img.setAttribute('tabindex','0');
    img.addEventListener('keydown', (e)=>{ if(e.key === 'Enter' || e.key === ' ') openModal(a); });
    container.appendChild(img);
  });
}

// Modal and favorites
const modal = { el: null, content: null, lastFocused: null };
function setupModal(){
  modal.el = $q('#modal');
  modal.content = $q('#modal-content');
  const closeBtn = $q('#close-modal');
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
  if(modal.el) modal.el.addEventListener('click', (e)=> { if(e.target === modal.el) closeModal(); });
  window.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeModal(); });
}
function openModal(a){
  if(!modal.el || !modal.content) return;
  modal.lastFocused = document.activeElement;
  modal.content.innerHTML = '';
  const title = el('h2',{text:a.name, id:'modal-title'});
  const img = el('img',{src:a.img,alt:a.name,loading:'lazy', style:'width:100%;height:240px;object-fit:cover;border-radius:6px;margin:8px 0'});
  const desc = el('p',{text:a.desc});
  const tags = el('p',{class:'muted',text:'Tags: ' + a.tag.join(', ')});
  const openBtn = el('button',{class:'btn',text:'Open detail'});
  openBtn.addEventListener('click', ()=> {
    alert('Open detail: This demo site shows details in the modal. For a multi-page site you could create attraction-detail.html?id='+a.id);
  });
  const saveBtn = el('button',{class:'btn',text:'Save'});
  saveBtn.style.marginLeft = '8px';
  saveBtn.addEventListener('click', ()=> saveFavorite(a.id));
  const row = el('div',{},[openBtn, saveBtn]);
  modal.content.appendChild(title);
  modal.content.appendChild(img);
  modal.content.appendChild(desc);
  modal.content.appendChild(tags);
  modal.content.appendChild(row);
  modal.el.classList.add('open');
  modal.el.setAttribute('aria-hidden','false');
  // focus management
  const focusable = modal.content.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if(focusable) focusable.focus();
}
function closeModal(){
  if(!modal.el) return;
  modal.el.classList.remove('open');
  modal.el.setAttribute('aria-hidden','true');
  if(modal.lastFocused) modal.lastFocused.focus();
}

// favorites
function saveFavorite(id){
  let fav = JSON.parse(localStorage.getItem('sny_fav') || '[]');
  if(fav.includes(id)) fav = fav.filter(x=>x!==id); else fav.push(id);
  localStorage.setItem('sny_fav', JSON.stringify(fav));
  updateFavUI();
}
function updateFavUI(){
  const favBox = $q('#favorites');
  if(!favBox) return;
  const fav = JSON.parse(localStorage.getItem('sny_fav') || '[]');
  favBox.innerHTML = '';
  if(fav.length === 0){ favBox.textContent = 'No favorites yet — click "Save" on an attraction to add.'; return; }
  fav.forEach(id => {
    const a = attractions.find(x=>x.id===id);
    if(!a) return;
    const item = el('div',{});
    const name = el('span',{text:a.name});
    const rem = el('button',{text:'Remove', type:'button'});
    rem.style.marginLeft = '8px';
    rem.addEventListener('click', ()=> saveFavorite(id));
    item.appendChild(name);
    item.appendChild(rem);
    favBox.appendChild(item);
  });
}

// contact form (works on contact.html)
function setupContactForm(){
  const form = $q('#contact-form');
  if(!form) return;
  form.addEventListener('submit', function(e){
    e.preventDefault();
    const name = $q('#cname').value.trim();
    const email = $q('#cemail').value.trim();
    const msg = $q('#cmessage').value.trim();
    const result = $q('#contact-result');
    if(!name || !email){ if(result) result.textContent = 'Please fill in name and email.'; return; }
    if(result) result.textContent = 'Sending...';
    setTimeout(()=>{ if(result) result.textContent = 'Thanks '+name+" — your message was received (simulated)."; form.reset(); }, 900);
  });
}

// simple debounce
function debounce(fn, wait=200){ let t; return (...args)=> { clearTimeout(t); t = setTimeout(()=>fn(...args), wait); }; }

// search & filters setup
function setupSearchAndFilters(){
  const search = $q('#search-home');
  if(search){
    const handler = debounce((e)=>{
      const val = e.target.value.trim();
      const active = document.querySelector('.filters button.active')?.dataset.filter || 'all';
      renderAttractions('#attractions-list', active, val);
    }, 180);
    search.addEventListener('input', handler);
  }
  $qa('.filters button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      $qa('.filters button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      const q = $q('#search-home') ? $q('#search-home').value.trim() : '';
      renderAttractions('#attractions-list', filter, q);
    });
  });
}

// init
function init(){
  renderAttractions();
  renderHighlights();
  renderGallery();
  updateFavUI();
  setupModal();
  setupContactForm();
  setupSearchAndFilters();
}
document.addEventListener('DOMContentLoaded', init);
