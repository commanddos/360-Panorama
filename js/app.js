const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=s=>encodeURIComponent(s||'');
let A=[];
let YEARS=[];
let LANG=localStorage.getItem('panorama-lang')||'pl';

const T={
 pl:{
  'nav.home':'Strona główna','nav.archive':'Archiwum','nav.map':'Mapa','nav.about':'O archiwum','loading':'Ładowanie archiwum…',
  'hero.eyebrow':'Katalog sferycznych panoram 360°','hero.title':'Poznaj archiwum.','hero.text':'Przeglądaj panoramy według <b>roku → kraju → miasta/lokalizacji → panoram</b>. Oryginalne materiały 360° są przechowywane na Kuula lub 360Cities.',
  'stats.panoramas':'Panoramy','stats.years':'Lata','stats.countries':'Kraje','stats.locations':'Miasta / lokalizacje','browse.year':'Przeglądaj według roku','latest':'Panoramy z','latest.en':'Panoramas from',
  'open.archive':'Otwórz archiwum →','back':'← Wstecz','archive':'Archiwum','archive.subtitle':'Rok → Kraj → Panorama','panorama.map':'Mapa panoram','map.text':'Kliknij znacznik, aby otworzyć panoramę.','open.panorama':'Otwórz panoramę','information':'Informacje','year':'Rok','country':'Kraj','city':'Miasto','location':'Lokalizacja','date':'Data','provider':'Źródło','tags':'Tagi','open.source':'Otwórz w','not.found':'Nie znaleziono panoramy.','no.viewer':'Nie dodano jeszcze adresu widoku panoramy.','about.title':'O archiwum','about.text':'To statyczny katalog publikowany przez GitHub Pages. Przechowuje metadane, linki i współrzędne; materiały 360° pozostają na Kuula lub 360Cities.','hierarchy':'Struktura','adding':'Dodawanie panoramy','adding.text':'Dane są podzielone na osobne pliki JSON dla każdego roku w katalogu data. Lista plików znajduje się w data/years.json.','cannot':'Nie można załadować katalogu:','unknown':'Nieznane','panoramas':'panoram','city.locations':'Miasto / lokalizacja',
 },
 en:{
  'nav.home':'Home','nav.archive':'Archive','nav.map':'Map','nav.about':'About','loading':'Loading archive…',
  'hero.eyebrow':'360° spherical panorama catalogue','hero.title':'Explore the archive.','hero.text':'Browse panoramas by <b>year → country → panoramas</b>. Original 360° media remains hosted on Kuula or 360Cities.',
  'stats.panoramas':'Panoramas','stats.years':'Years','stats.countries':'Countries','stats.locations':'Cities / locations','browse.year':'Browse by year','latest':'Panoramas from',
  'open.archive':'Open archive →','back':'← Back','archive':'Archive','archive.subtitle':'Year → Country → Panorama','panorama.map':'Panorama map','map.text':'Click a marker to open a panorama.','open.panorama':'Open panorama','information':'Information','year':'Year','country':'Country','city':'City','location':'Location','date':'Date','provider':'Provider','tags':'Tags','open.source':'Open on','not.found':'Panorama not found.','no.viewer':'No panorama viewer URL added yet.','about.title':'About','about.text':'This is a static catalogue published with GitHub Pages. It stores metadata, links and coordinates; the 360° media remains hosted by Kuula or 360Cities.','hierarchy':'Hierarchy','adding':'Adding a panorama','adding.text':'Data is split into separate JSON files for each year in the data folder. The file list is maintained in data/years.json.','cannot':'Cannot load catalogue:','unknown':'Unknown','panoramas':'panoramas','city.locations':'City / location'
 }};
function t(k){return T[LANG][k]||T.en[k]||k}
function setLang(l){LANG=l;localStorage.setItem('panorama-lang',l);document.documentElement.lang=l;document.querySelectorAll('[data-i18n]').forEach(el=>el.innerHTML=t(el.dataset.i18n));document.querySelector('#lang-pl')?.classList.toggle('active',l==='pl');document.querySelector('#lang-en')?.classList.toggle('active',l==='en');route()}
async function load(){
 const manifest=await fetch('data/years.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()});
 YEARS=manifest.years||[];
 const files=YEARS.map(y=>fetch(`data/${encodeURIComponent(y)}.json`).then(r=>{if(!r.ok)throw new Error(`HTTP ${r.status}: ${y}.json`);return r.json()}));
 A=(await Promise.all(files)).flat();
 // Global date order: newest panoramas first.
 A.sort((a,b)=>dateValue(b)-dateValue(a));
 setLang(LANG);
}
function P(){return location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).map(decodeURIComponent)}
function dateValue(p){const d=p?.date||''; const n=Date.parse(d); return Number.isNaN(n)?0:n}
function label(p){return [p.country,p.city,p.location].filter(Boolean).join(' · ')}
function textField(p,key){if(key==='title'||key==='description'){return p[`${key}_${LANG}`]??p[key]??''}return p[key]??''}
function thumbnailPath(p){return `thumbnails/${encodeURIComponent(p.year)}/${encodeURIComponent(p.title)}.jpg`}
function card(p){
 const thumb=thumbnailPath(p);
 const img=thumb
  ? `<img src="${E(thumb)}" alt="${E(textField(p,'title'))}" loading="lazy" referrerpolicy="no-referrer" onerror="this.style.display='none';this.parentElement.classList.add('missing-thumb')">`
  : '';
 return `<a class="card" href="#/panorama/${K(p.id)}"><div class="thumb">${img}</div><div class="cardbody"><span class="badge">${E(p.provider||'')}</span><h3>${E(textField(p,'title'))}</h3><p>${E(label(p))}</p><p>${E(p.date||'')}</p></div></a>`;
}

function groups(a,f){const m={};a.forEach(x=>(m[x[f]??t('unknown')]??=[]).push(x));return m}
function tree(title,entries,back='albums'){
 document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/${back}">${t('back')}</a><h1>${E(title)}</h1><div class="tree">${entries.map(([n,z])=>`<a class="treeitem" href="${z.href}"><span class="title">${E(n)}</span><span class="count">${z.n}</span></a>`).join('')}</div></section>`;
}
function home(){
 const ys=[...new Set(A.map(x=>x.year))].sort((a,b)=>b-a),cs=new Set(A.map(x=>x.country)),ls=new Set(A.map(x=>`${x.city||''} · ${x.location||''}`));
 const latestYear=ys[0];
 const latest=A.filter(x=>x.year===latestYear).sort((a,b)=>dateValue(b)-dateValue(a));
 document.querySelector('#app').innerHTML=`<section class="hero"><div class="eyebrow">${t('hero.eyebrow')}</div><h1>${t('hero.title')}</h1><p>${t('hero.text')}</p><div class="stats"><div class="stat"><strong>${A.length}</strong><span class="muted">${t('stats.panoramas')}</span></div><div class="stat"><strong>${ys.length}</strong><span class="muted">${t('stats.years')}</span></div><div class="stat"><strong>${cs.size}</strong><span class="muted">${t('stats.countries')}</span></div><div class="stat"><strong>${ls.size}</strong><span class="muted">${t('stats.locations')}</span></div></div></section><section class="section"><h2>${t('browse.year')}</h2><div class="grid">${ys.map(y=>`<a class="card" href="#/year/${K(y)}"><div class="cardbody"><span class="badge">${y}</span><h3>${A.filter(x=>x.year==y).length} ${t('panoramas')}</h3><p>${t('open.archive')}</p></div></a>`).join('')}</div></section><section class="section"><h2>${t('latest')} ${latestYear}</h2><div class="grid panorama-grid">${latest.map(card).join('')}</div></section>`;
}
function yearPage(y){const arr=A.filter(x=>String(x.year)===String(y));const g=groups(arr,'country');tree(String(y),Object.entries(g).map(([n,z])=>[n,{n:z.length,href:`#/year/${K(y)}/country/${K(n)}`}]),'albums')}
function countryPage(y,c){const arr=A.filter(x=>String(x.year)===String(y)&&x.country===c);document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/year/${K(y)}">${t('back')}</a><h1>${E(y)} · ${E(c)}</h1><p class="muted">${arr.length} ${t('panoramas')}</p><div class="grid panorama-grid">${[...arr].sort((a,b)=>dateValue(b)-dateValue(a)).map(card).join('')}</div></section>`}
function albums(){const ys=[...new Set(A.map(x=>x.year))].sort((a,b)=>b-a);document.querySelector('#app').innerHTML=`<section class="section"><h1>${t('archive')}</h1><p class="muted">${t('archive.subtitle')}</p>${ys.map(y=>`<a class="treeitem" href="#/year/${K(y)}"><span class="title">${y}</span><span class="count">${A.filter(x=>x.year==y).length}</span></a>`).join('')}</section>`}
function pano(id){const p=A.find(x=>x.id==id);if(!p)return document.querySelector('#app').innerHTML=`<div class="empty">${t('not.found')}</div>`;const src=p.embedUrl||p.url;document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/year/${K(p.year)}/country/${K(p.country)}">${t('back')} ${E(p.country||t('archive'))}</a><div class="crumbs">${E(label(p))}</div><div class="detail"><div><div class="viewer">${src?`<iframe src="${E(src)}" allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen" allowfullscreen></iframe>`:`<div class="empty">${t('no.viewer')}</div>`}</div><h1>${E(textField(p,'title'))}</h1><p class="muted">${E(textField(p,'description'))}</p>${p.url?`<a class="btn" target="_blank" rel="noopener" href="${E(p.url)}">${t('open.source')} ${E(p.provider||'source')}</a>`:''}</div><aside class="panel"><h3>${t('information')}</h3><div class="meta">${[[t('year'),p.year],[t('country'),p.country],[t('city'),p.city],[t('location'),p.location],[t('date'),p.date],[t('provider'),p.provider],[t('tags'),(p.tags||[]).join(', ')]].map(x=>`<div><b>${E(x[0])}</b><br>${E(x[1]||'—')}</div>`).join('')}</div></aside></div></section>`}
function mapPage(){document.querySelector('#app').innerHTML=`<section class="section"><h1>${t('panorama.map')}</h1><p class="muted">${t('map.text')}</p><div id="map" class="map"></div></section>`;const m=L.map('map').setView([52.2,13],5);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(m);const pts=[];A.filter(x=>x.coordinates).forEach(p=>{L.marker([p.coordinates.lat,p.coordinates.lng]).addTo(m).bindPopup(`<b>${E(textField(p,'title'))}</b><br>${E(label(p))}<br><a href="#/panorama/${K(p.id)}">${t('open.panorama')}</a>`);pts.push([p.coordinates.lat,p.coordinates.lng])});if(pts.length)m.fitBounds(pts,{padding:[30,30]})}
function about(){document.querySelector('#app').innerHTML=`<section class="section"><h1>${t('about.title')}</h1><div class="panel"><p>${t('about.text')}</p><h2>${t('hierarchy')}</h2><p><b>${LANG==='pl'?'Rok → Kraj → Panorama':'Year → Country → Panorama'}</b></p><h2>${t('adding')}</h2><p>${t('adding.text')}</p><p><code>data/2026.json</code>, <code>data/2025.json</code>, …</p></div></section>`}
function route(){const p=P();if(!p[0])return home();if(p[0]==='albums')return albums();if(p[0]==='map')return mapPage();if(p[0]==='about')return about();if(p[0]==='panorama')return pano(p[1]);if(p[0]==='year'){const y=p[1];if(p.length===2)return yearPage(y);const c=p[3];if(p[2]==='country'&&p.length===4)return countryPage(y,c)}home()}
addEventListener('hashchange',route);document.addEventListener('DOMContentLoaded',()=>{document.querySelector('#lang-pl').onclick=()=>setLang('pl');document.querySelector('#lang-en').onclick=()=>setLang('en');setLang(LANG)});load().catch(e=>document.querySelector('#app').innerHTML=`<div class="empty">${t('cannot')} ${E(e.message)}</div>`);