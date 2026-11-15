const recipient='danlopropertiesltd@gmail.com';
const inbox='https://danlo-properties.nmhwc-7205.chatgpt.site/enquiries';
export function emailConfigured(env:Cloudflare.Env){return !!(env.RESEND_API_KEY?.trim()&&env.ENQUIRY_EMAIL_FROM?.trim());}
export async function notifyEnquiry(env:Cloudflare.Env,id:string,send:typeof fetch=fetch){
 if(!env.DB||!emailConfigured(env))return 'not_configured';
 const db=env.DB,now=Date.now();
 try{
  const claim=await db.prepare("UPDATE enquiries SET email_status = 'sending', email_attempted_at = ?, email_attempts = email_attempts + 1 WHERE id = ? AND email_status != 'accepted' AND (email_attempted_at IS NULL OR email_attempted_at < ?)").bind(now,id,now-60000).run();
  if(!claim.meta.changes)return 'already_processed';
  const row=await db.prepare('SELECT id,type,property_label,visit_date,visit_time,created_at FROM enquiries WHERE id = ?').bind(id).first<{id:string,type:string,property_label:string,visit_date:string,visit_time:string,created_at:number}>();if(!row)return 'missing';
  const labels:Record<string,string>={visit:'Site visit request',property:'Property enquiry',contact:'General enquiry',requirements:'Land requirements'};
  const label=labels[row.type]||'Enquiry';
  const text=['A new enquiry has been saved on the Danlo website.','',label,'Property: '+row.property_label,row.visit_date?'Preferred visit: '+row.visit_date+' · '+row.visit_time+' (Kenya time)':null,'Reference: '+row.id,'Received: '+new Date(row.created_at).toISOString(),'','View the contact details and message in your private inbox:',inbox].filter(line=>line!==null).join('\n');
  const controller=new AbortController(),timeout=setTimeout(()=>controller.abort(),6000);
  try{
   const response=await send('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json','Idempotency-Key':'danlo-enquiry/'+id},body:JSON.stringify({from:env.ENQUIRY_EMAIL_FROM,to:[recipient],subject:'Danlo — New '+label.toLowerCase(),text}),signal:controller.signal});
   const result:any=await response.json();if(!response.ok||typeof result.id!=='string')throw new Error('Email provider did not accept the notification.');
   await db.prepare("UPDATE enquiries SET email_status = 'accepted', email_provider_id = ? WHERE id = ?").bind(result.id,id).run();return 'accepted';
  }finally{clearTimeout(timeout);}
 }catch{try{await db.prepare("UPDATE enquiries SET email_status = 'failed' WHERE id = ? AND email_status != 'accepted'").bind(id).run();}catch{}return 'failed';}
}
