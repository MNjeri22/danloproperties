import inbox from '../../lib/enquiries-inbox.html?raw';
import { isEnquiryOwner } from '../../lib/enquiry-access';
export const dynamic='force-dynamic';
export function GET(request:Request){
 const headers={'Content-Type':'text/html; charset=utf-8','Cache-Control':'no-store','X-Robots-Tag':'noindex, nofollow','X-Content-Type-Options':'nosniff'};
 if(!request.headers.get('oai-authenticated-user-id'))return new Response('<!doctype html><html><meta name="viewport" content="width=device-width,initial-scale=1"><title>Danlo enquiries</title><body style="font:18px Arial;padding:40px"><h1>Private enquiries inbox</h1><p>Sign in with the site owner account to continue.</p><a href="/signin-with-chatgpt?return_to=%2Fenquiries" target="_top">Sign in with ChatGPT</a></body></html>',{headers});
 if(!isEnquiryOwner(request))return new Response('This inbox is available only to the site owner.',{status:403,headers});
 return new Response(inbox,{headers});
}
