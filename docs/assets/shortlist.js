(()=>{
const key='danlo-saved-land-v1',known=new Set(landInventory.map(p=>p.id));
let saved=new Set(),persistent=true,timer;
try{const stored=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(stored))saved=new Set(stored.filter(id=>known.has(id)));}catch{persistent=false;}
window.DanloShortlist={has:id=>saved.has(id),ids:()=>[...saved]};
const status=document.createElement('div');status.className='saved-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');document.body.append(status);
function announce(message){clearTimeout(timer);status.textContent=message;timer=setTimeout(()=>status.textContent='',4500);}
function refresh(){document.querySelectorAll('[data-save-land]').forEach(button=>{const p=landInventory.find(p=>p.id===button.dataset.saveLand),active=saved.has(p.id);button.setAttribute('aria-pressed',String(active));button.setAttribute('aria-label',(active?'Remove from saved land: ':'Save land: ')+p.acres+' acres — '+p.title);button.textContent=active?'♥':'♡';});const count=document.getElementById('saved-count');if(count)count.textContent='('+saved.size+')';if(typeof filterLand==='function')filterLand();window.dispatchEvent(new Event('danlo-shortlist-change'));}
function addButton(container,p){if(!container||!p)return;const button=document.createElement('button');button.className='save-land';button.type='button';button.dataset.saveLand=p.id;container.append(button);button.addEventListener('click',()=>{const removing=saved.has(p.id);if(removing)saved.delete(p.id);else saved.add(p.id);try{localStorage.setItem(key,JSON.stringify([...saved]));persistent=true;}catch{persistent=false;}refresh();announce((removing?'Removed from saved land.':'Added to saved land.')+(persistent?'':' This shortlist is available only while this page stays open.'));if(removing&&document.getElementById('saved-filter')?.getAttribute('aria-pressed')==='true')document.getElementById('saved-filter').focus();});}
document.querySelectorAll('.land-card').forEach(card=>{const href=card.querySelector('.land-link')?.getAttribute('href'),p=landInventory.find(p=>p.id===card.dataset.land||p.url===href);addButton(card.querySelector('.land-card-cover'),p);});
addButton(document.querySelector('.property-visual'),landInventory.find(p=>new URL(p.url,location.href).pathname===location.pathname));
const filter=document.getElementById('saved-filter');if(filter){filter.setAttribute('aria-pressed',String(new URLSearchParams(location.search).get('saved')==='1'));filter.addEventListener('click',()=>{filter.setAttribute('aria-pressed',String(filter.getAttribute('aria-pressed')!=='true'));refresh();});}
window.addEventListener('storage',event=>{if(event.key!==key&&event.key!==null)return;try{const value=JSON.parse(localStorage.getItem(key)||'[]');saved=new Set(Array.isArray(value)?value.filter(id=>known.has(id)):[]);refresh();}catch{}});
refresh();
})();
