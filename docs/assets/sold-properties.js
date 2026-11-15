(()=>{
 const propertiesHost=document.getElementById('sold-property-grid'),reviewsHost=document.getElementById('sold-reviews');
 if(!propertiesHost||!reviewsHost)return;
 const text=(tag,value,className)=>{const el=document.createElement(tag);el.textContent=String(value);if(className)el.className=className;return el;};
 fetch('assets/sold-properties.json').then(response=>{if(!response.ok)throw new Error('Unavailable');return response.json();}).then(data=>{
  const properties=Array.isArray(data.properties)?data.properties.filter(p=>p&&p.id&&p.title&&p.location):[];
  if(properties.length){
   propertiesHost.replaceChildren();
   properties.forEach(p=>{
    const card=document.createElement('article');card.className='sold-property-card';card.id='sold-'+String(p.id).replace(/[^a-z0-9-]/gi,'');
    if(p.image&&/^assets\/[a-z0-9_./-]+\.(webp|jpg|jpeg|png)$/i.test(p.image)){
     const visual=document.createElement('div');visual.className='sold-property-photo';const image=document.createElement('img');image.src=p.image;image.alt=p.imageAlt||p.title;image.loading='lazy';image.decoding='async';visual.append(image,text('span','SOLD','sold-property-badge'));card.append(visual);
    }
    const copy=document.createElement('div');copy.className='sold-property-copy';copy.append(text('small',p.location),text('h4',p.title));
    if(Number.isFinite(Number(p.acres))&&Number(p.acres)>0)copy.append(text('p',p.acres+' acres · Sold'));
    else copy.append(text('p','Sold'));
    card.append(copy);propertiesHost.append(card);
   });
  }
  const reviews=Array.isArray(data.reviews)?data.reviews.filter(r=>r&&r.name&&r.quote&&(!r.propertyId||properties.some(p=>p.id===r.propertyId))):[];
  if(reviews.length){reviewsHost.replaceChildren();reviews.forEach(r=>{
   const figure=document.createElement('figure');figure.className='sold-client-review';figure.append(text('blockquote','“'+r.quote+'”'));
   const caption=document.createElement('figcaption');caption.append(text('strong',r.name));const property=properties.find(p=>p.id===r.propertyId);if(property)caption.append(text('span',property.title));figure.append(caption);reviewsHost.append(figure);
  });}
 }).catch(()=>{});
})();
