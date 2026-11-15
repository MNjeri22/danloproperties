import { env } from 'cloudflare:workers';
import { isEnquiryOwner,sameOrigin,json } from '../../../../lib/enquiry-access';
import { emailConfigured,notifyEnquiry } from '../../../../lib/enquiry-notifications';
export const dynamic='force-dynamic';
export async function GET(request:Request){
 if(!isEnquiryOwner(request))return json({error:'Owner access required.'},403);
 if(!env.DB)return json({error:'Inbox unavailable.'},503);
 const pending=await env.DB.prepare("SELECT COUNT(*) AS total FROM enquiries WHERE email_status != 'accepted' AND status = 'new'").first<{total:number}>();
 return json({configured:emailConfigured(env),recipient:'danlopropertiesltd@gmail.com',pending:pending?.total||0});
}
export async function POST(request:Request){
 if(!isEnquiryOwner(request)||!sameOrigin(request))return json({error:'Owner access required.'},403);
 if(!env.DB)return json({error:'Inbox unavailable.'},503);
 if(!emailConfigured(env))return json({error:'Email alerts are not connected. Configure the email API key and verified sender first.'},503);
 const pending=await env.DB.prepare("SELECT id FROM enquiries WHERE email_status != 'accepted' AND status = 'new' AND (email_attempted_at IS NULL OR email_attempted_at < ?) ORDER BY created_at ASC LIMIT 10").bind(Date.now()-60000).all<{id:string}>();
 let accepted=0,failed=0;for(const item of pending.results||[]){const result=await notifyEnquiry(env,item.id);if(result==='accepted')accepted++;else if(result==='failed')failed++;}
 return json({accepted,failed});
}
