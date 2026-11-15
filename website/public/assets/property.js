(()=>{
const button=document.getElementById('copy-property'),feedback=document.getElementById('share-feedback'),fallback=document.getElementById('share-fallback');
if(!button)return;
const p=landInventory.find(p=>new URL(p.url,location.href).pathname===location.pathname);if(!p)return;
const url=document.querySelector('link[rel="canonical"]')?.href||location.origin+location.pathname;
const title=p.acres+' acres — '+p.title;
const details=[title,'Location: '+p.area,'Asking price: KSh '+p.price+' million per acre'+(p.negotiable?' (negotiable)':''),p.description,'','Contact Danlo Properties Ltd: +254 726 892 581','Confirm current availability and property details with Danlo.'].join('\n');
const message=details+'\n\n'+url;
document.getElementById('share-whatsapp').href='https://wa.me/?text='+encodeURIComponent(message);
document.getElementById('share-email').href='mailto:?subject='+encodeURIComponent('Danlo Properties — '+title)+'&body='+encodeURIComponent(message);
async function copy(text,success){try{await navigator.clipboard.writeText(text);feedback.textContent=success;fallback.hidden=true;}catch{fallback.value=text;fallback.hidden=false;fallback.focus();fallback.select();feedback.textContent='Select and copy the text below.';}}
button.addEventListener('click',()=>copy(url,'Listing link copied.'));
document.getElementById('copy-property-details').addEventListener('click',()=>copy(message,'Property details and listing link copied.'));
const native=document.getElementById('native-property-share');if(typeof navigator.share==='function'){native.hidden=false;native.addEventListener('click',async()=>{try{await navigator.share({title:'Danlo Properties — '+title,text:details,url});}catch(error){if(error.name!=='AbortError')await copy(message,'Sharing is unavailable here. Property details and link copied instead.');}});}
})();
