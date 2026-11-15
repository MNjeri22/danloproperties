import { notifyEnquiry } from '../../../lib/enquiry-notifications';
import { env } from 'cloudflare:workers';
import { validateEnquiry } from '../../../lib/enquiry-validation';
import { isEnquiryOwner,sameOrigin,json } from '../../../lib/enquiry-access';
export const dynamic='force-dynamic';
export async function POST(request:Request){
 if(!sameOrigin(request))return json({error:'Please submit the form from the Danlo website.'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'Invalid submission format.'},415);
 if(!env.DB)return json({error:'Enquiries are temporarily unavailable. Please call Danlo.'},503);
 let input;
 try{const reader=request.body?.getReader();if(!reader)throw new Error();let size=0;const chunks=[];while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();return json({error:'Your enquiry is too long.'},413);}chunks.push(value);}const bytes=new Uint8Array(size);let offset=0;for(const chunk of chunks){bytes.set(chunk,offset);offset+=chunk.length;}input=JSON.parse(new TextDecoder().decode(bytes));}catch{return json({error:'Please check your enquiry and try again.'},400);}
 let data;try{data=validateEnquiry(input);}catch(error){return json({error:(error as Error).message},400);}
 try{
  const previous=await env.DB.prepare('SELECT id FROM enquiries WHERE id = ?').bind(data.id).first();if(previous)return json({id:data.id,received:true});
  const ip=request.headers.get('CF-Connecting-IP')||request.headers.get('oai-authenticated-user-id')||'unknown';
  const hash=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(new Date().toISOString().slice(0,10)+':danlo:'+ip));const sourceHash=Array.from(new Uint8Array(hash)).map(b=>b.toString(16).padStart(2,'0')).join('');
  const count=await env.DB.prepare('SELECT COUNT(*) AS total FROM enquiries WHERE source_hash = ? AND created_at > ?').bind(sourceHash,Date.now()-3600000).first<{total:number}>();
  if(count&&count.total>=5)return json({error:'You have sent several enquiries recently. Please call Danlo or try again later.'},429);
  await env.DB.prepare('INSERT OR IGNORE INTO enquiries (id,created_at,status,name,email,phone,type,property_id,property_label,message,visit_date,visit_time,source_hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)').bind(data.id,Date.now(),'new',data.name,data.email,data.phone,data.type,data.propertyId,data.propertyLabel,data.message,data.visitDate,data.visitTime,sourceHash).run();
  await notifyEnquiry(env,data.id);
  return json({id:data.id,received:true},201);
 }catch{return json({error:'Your enquiry could not be saved. Your details are still in the form; please try again or call Danlo.'},503);}
}
export async function GET(request:Request){
 if(!isEnquiryOwner(request))return json({error:'Sign in with the site owner account to view enquiries.'},403);
 if(!env.DB)return json({error:'Enquiries are temporarily unavailable.'},503);
 try{const url=new URL(request.url);const status=url.searchParams.get('status');const cursor=Number(url.searchParams.get('before')||Date.now()+1);if(!Number.isFinite(cursor))return json({error:'Invalid page.'},400);let query='SELECT id,created_at,status,name,email,phone,type,property_id,property_label,message,visit_date,visit_time,contacted_at,email_status FROM enquiries WHERE created_at < ?';const args:any[]=[cursor];if(status==='new'||status==='contacted'){query+=' AND status = ?';args.push(status);}query+=' ORDER BY created_at DESC LIMIT 51';const result=await env.DB.prepare(query).bind(...args).all();const rows=result.results||[];return json({enquiries:rows.slice(0,50),next:rows.length>50?(rows[49] as any).created_at:null});}catch{return json({error:'Unable to load enquiries. Please try again.'},503);}
}
export async function PATCH(request:Request){
 if(!isEnquiryOwner(request))return json({error:'Owner access required.'},403);if(!sameOrigin(request))return json({error:'Invalid request origin.'},403);
 try{const data:any=await request.json();if(typeof data.id!=='string'||data.id.length!==36||!['new','contacted'].includes(data.status))return json({error:'Invalid enquiry update.'},400);if(!env.DB)return json({error:'Inbox unavailable.'},503);const result=await env.DB.prepare('UPDATE enquiries SET status = ?, contacted_at = ? WHERE id = ?').bind(data.status,data.status==='contacted'?Date.now():null,data.id).run();if(!result.meta.changes)return json({error:'Enquiry not found.'},404);return json({updated:true});}catch{return json({error:'Unable to update this enquiry.'},503);}
}
