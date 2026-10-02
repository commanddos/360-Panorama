const E=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const K=s=>encodeURIComponent(s||'');
let A=[];

async function load(){A=await fetch('data/panoramas.json').then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.json()});route()}
function P(){return location.hash.replace(/^#\/?/,'').split('/').filter(Boolean).map(decodeURIComponent)}
function label(p){return [p.country,p.city,p.location].filter(Boolean).join(' · ')}
function card(p){return `<a class="card" href="#/panorama/${K(p.id)}"><div class="thumb">${p.thumbnail?`<img src="${E(p.thumbnail)}" alt="">`:''}</div><div class="cardbody"><span class="badge">${E(p.provider||'')}</span><h3>${E(p.title)}</h3><p>${E(label(p))}</p><p>${E(p.date||'')}</p></div></a>`}
function groups(a,f){const m={};a.forEach(x=>(m[x[f]??'Unknown']??=[]).push(x));return m}
function tree(title,entries,back='albums'){
 document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/${back}">← Back</a><h1>${E(title)}</h1><div class="tree">${entries.map(([n,z])=>`<a class="treeitem" href="${z.href}"><span class="title">${E(n)}</span><span class="count">${z.n}</span></a>`).join('')}</div></section>`;
}
function home(){
 const ys=[...new Set(A.map(x=>x.year))].sort((a,b)=>b-a),cs=new Set(A.map(x=>x.country)),ls=new Set(A.map(x=>`${x.city||''} · ${x.location||''}`));
 document.querySelector('#app').innerHTML=`<section class="hero"><div class="eyebrow">360° spherical panorama catalogue</div><h1>Explore the archive.</h1><p>Browse by <b>year → country → city/location → panoramas</b>. Original 360° media remains hosted on Kuula or 360Cities.</p><div class="stats"><div class="stat"><strong>${A.length}</strong><span class="muted">Panoramas</span></div><div class="stat"><strong>${ys.length}</strong><span class="muted">Years</span></div><div class="stat"><strong>${cs.size}</strong><span class="muted">Countries</span></div><div class="stat"><strong>${ls.size}</strong><span class="muted">City / locations</span></div></div></section><section class="section"><h2>Browse by year</h2><div class="grid">${ys.map(y=>`<a class="card" href="#/year/${K(y)}"><div class="cardbody"><span class="badge">${y}</span><h3>${A.filter(x=>x.year==y).length} panoramas</h3><p>Open archive →</p></div></a>`).join('')}</div></section><section class="section"><h2>Latest panoramas</h2><div class="grid">${[...A].sort((a,b)=>(b.date||'').localeCompare(a.date||'')).slice(0,6).map(card).join('')}</div></section>`;
}
function yearPage(y){
 const arr=A.filter(x=>String(x.year)===String(y));
 const g=groups(arr,'country');
 tree(String(y),Object.entries(g).map(([n,z])=>[n,{n:z.length,href:`#/year/${K(y)}/country/${K(n)}`}]),'albums');
}
function countryPage(y,c){
 const arr=A.filter(x=>String(x.year)===String(y)&&x.country===c);
 const g=groups(arr,'city');
 const entries=Object.entries(g).map(([city,z])=>{const display=city||'Unknown city';return[display,{n:z.length,href:`#/year/${K(y)}/country/${K(c)}/city/${K(city)}`} ]});
 tree(`${y} · ${c}`,entries,`year/${K(y)}`);
}
function cityPage(y,c,city){
 const arr=A.filter(x=>String(x.year)===String(y)&&x.country===c&&x.city===city);
 const g=groups(arr,'location');
 const entries=Object.entries(g).map(([loc,z])=>[loc,{n:z.length,href:z.length===1?`#/panorama/${K(z[0].id)}`:`#/year/${K(y)}/country/${K(c)}/city/${K(city)}/location/${K(loc)}`}]);
 tree(`${y} · ${c} · ${city}`,entries,`year/${K(y)}/country/${K(c)}`);
}
function locationPage(y,c,city,location){
 const arr=A.filter(x=>String(x.year)===String(y)&&x.country===c&&x.city===city&&x.location===location);
 document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/year/${K(y)}/country/${K(c)}/city/${K(city)}">← Back</a><h1>${E(location)}</h1><p class="muted">${E([y,c,city].join(' · '))}</p><div class="grid">${arr.map(card).join('')}</div></section>`;
}
function albums(){
 const ys=[...new Set(A.map(x=>x.year))].sort((a,b)=>b-a);
 document.querySelector('#app').innerHTML=`<section class="section"><h1>Archive</h1><p class="muted">Year → Country → City / Location → Panorama</p>${ys.map(y=>`<a class="treeitem" href="#/year/${K(y)}"><span class="title">${y}</span><span class="count">${A.filter(x=>x.year==y).length}</span></a>`).join('')}</section>`;
}
function pano(id){
 const p=A.find(x=>x.id==id);if(!p)return document.querySelector('#app').innerHTML='<div class="empty">Panorama not found.</div>';
 const src=p.embedUrl||p.url;
 document.querySelector('#app').innerHTML=`<section class="section"><a class="back" href="#/year/${K(p.year)}/country/${K(p.country)}/city/${K(p.city)}">← ${E(p.city||p.country||'Archive')}</a><div class="crumbs">${E(label(p))}</div><div class="detail"><div><div class="viewer">${src?`<iframe src="${E(src)}" allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen" allowfullscreen></iframe>`:'<div class="empty">No viewer URL added yet.</div>'}</div><h1>${E(p.title)}</h1><p class="muted">${E(p.description||'')}</p>${p.url?`<a class="btn" target="_blank" rel="noopener" href="${E(p.url)}">Open on ${E(p.provider||'source')}</a>`:''}</div><aside class="panel"><h3>Information</h3><div class="meta">${[['Year',p.year],['Country',p.country],['City',p.city],['Location',p.location],['Date',p.date],['Provider',p.provider],['Tags',(p.tags||[]).join(', ')]].map(x=>`<div><b>${E(x[0])}</b><br>${E(x[1]||'—')}</div>`).join('')}</div></aside></div></section>`;
}
function mapPage(){
 document.querySelector('#app').innerHTML='<section class="section"><h1>Panorama map</h1><p class="muted">Click a marker to open a panorama.</p><div id="map" class="map"></div></section>';
 const m=L.map('map').setView([52.2,13],5);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors'}).addTo(m);const pts=[];
 A.filter(x=>x.coordinates).forEach(p=>{L.marker([p.coordinates.lat,p.coordinates.lng]).addTo(m).bindPopup(`<b>${E(p.title)}</b><br>${E(label(p))}<br><a href="#/panorama/${K(p.id)}">Open panorama</a>`);pts.push([p.coordinates.lat,p.coordinates.lng])});if(pts.length)m.fitBounds(pts,{padding:[30,30]});
}
function about(){document.querySelector('#app').innerHTML=`<section class="section"><h1>About</h1><div class="panel"><p>This is a static GitHub Pages catalogue. It stores metadata, links and coordinates; the 360° media remains hosted by Kuula or 360Cities.</p><h2>Hierarchy</h2><p><b>Year → Country → City / Location → Panorama</b></p><h2>Adding a panorama</h2><p>Edit <code>data/panoramas.json</code>, add one object and commit it to GitHub.</p></div></section>`}
function route(){
 const p=P();
 if(!p[0])return home();
 if(p[0]==='albums')return albums();
 if(p[0]==='map')return mapPage();
 if(p[0]==='about')return about();
 if(p[0]==='panorama')return pano(p[1]);
 if(p[0]==='year'){
   const y=p[1];
   if(p.length===2)return yearPage(y);
   const c=p[3];
   if(p[2]==='country'&&p.length===4)return countryPage(y,c);
   const city=p[5];
   if(p[4]==='city'&&p.length===6)return cityPage(y,c,city);
   const location=p[7];
   if(p[6]==='location'&&p.length===8)return locationPage(y,c,city,location);
 }
 home();
}
addEventListener('hashchange',route);load().catch(e=>document.querySelector('#app').innerHTML=`<div class="empty">Cannot load catalogue: ${E(e.message)}</div>`);
