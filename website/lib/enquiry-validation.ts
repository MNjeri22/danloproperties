import inventory from './land-inventory.json';
export const types=['requirements','property','visit','contact'];
export const times=['Morning (9 am–12 pm)','Afternoon (12 pm–4 pm)','Flexible'];
export function validateEnquiry(input: any, now=new Date()) {
 if(!input||typeof input!=='object'||Array.isArray(input))throw new Error('Please complete the enquiry form.');
 const field=(key:string,max:number,required=false)=>{const value=input[key];if(value!==undefined&&typeof value!=='string')throw new Error('Please check your form details.');const text=(value||'').trim();if(text.length>max||required&&!text)throw new Error('Please complete all required fields within the stated limits.');return text;};
 const id=field('id',36,true);if(!/^[a-f\d]{8}-[a-f\d]{4}-4[a-f\d]{3}-[89ab][a-f\d]{3}-[a-f\d]{12}$/i.test(id))throw new Error('Please refresh the page and try again.');
 if(field('website',200))throw new Error('Unable to submit this enquiry. Please call Danlo.');
 const name=field('name',100,true),email=field('email',180,true),phone=field('phone',40),type=field('type',20,true),propertyId=field('property',40),message=field('message',2500,true);
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('Please enter a valid email address.');
 if(!types.includes(type))throw new Error('Please select how Danlo can help.');
 const property=inventory.find(p=>p.id===propertyId);if(propertyId&&!property)throw new Error('Please select a property from the list.');
 let visitDate='',visitTime='';
 if(type==='visit'){
  visitDate=field('visitDate',10,true);visitTime=field('visitTime',40,true);
  const today=new Intl.DateTimeFormat('en-CA',{timeZone:'Africa/Nairobi',year:'numeric',month:'2-digit',day:'2-digit'}).format(now);
  const parsed=new Date(visitDate+'T12:00:00Z');
  if(!/^\d{4}-\d{2}-\d{2}$/.test(visitDate)||!Number.isFinite(parsed.getTime())||parsed.toISOString().slice(0,10)!==visitDate||visitDate<today)throw new Error('Choose today or a future visit date.');
  if(!times.includes(visitTime))throw new Error('Please select a preferred visit time.');
 }
 return {id,name,email,phone,type,propertyId,propertyLabel:property?property.acres+' acres — '+property.title+' ('+property.area+')':'No specific property',message,visitDate,visitTime};
}
