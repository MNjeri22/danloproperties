/** Gmail enquiry alerts for Danlo. Store OAuth credentials in server-side secrets. */
export const DANLO_EMAIL = 'danlopropertiesltd@gmail.com';
const INBOX_URL = 'https://danlo-properties.nmhwc-7205.chatgpt.site/enquiries';
const labels = { visit: 'site visit request', property: 'property enquiry', contact: 'general enquiry', requirements: 'land requirements enquiry' };

export function buildGmailMessage(enquiry) {
  if (!enquiry || !/^[a-zA-Z0-9-]{1,80}$/.test(enquiry.id || '')) throw new Error('A valid enquiry reference is required.');
  const kind = labels[enquiry.type] || 'enquiry';
  const body = [
    'A new enquiry has been saved on the Danlo website.', '',
    'Type: ' + kind, 'Property: ' + (enquiry.propertyLabel || 'No specific property'),
    enquiry.visitDate ? 'Preferred visit: ' + enquiry.visitDate + ' · ' + (enquiry.visitTime || 'To be arranged') + ' (Kenya time)' : null,
    'Reference: ' + enquiry.id, '',
    'View the contact details and message in your private enquiries inbox:', INBOX_URL,
  ].filter(line => line !== null).join('\r\n');
  return [
    'From: Danlo Properties Ltd <' + DANLO_EMAIL + '>', 'To: ' + DANLO_EMAIL,
    'Subject: Danlo - New ' + kind,
    'MIME-Version: 1.0', 'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: base64', '',
    encodeBase64(body),
  ].join('\r\n');
}
function encodeBase64(value) {
  const bytes = new TextEncoder().encode(value);
  return btoa(Array.from(bytes, byte => String.fromCharCode(byte)).join(''));
}
async function parseResponse(response, message) {
  let result;
  try { result = await response.json(); } catch { throw new Error(message); }
  if (!response.ok) throw new Error(message);
  return result;
}
/** Returns Gmail's accepted message ID. Acceptance is not proof of inbox delivery. */
export async function sendGmailNotification(credentials, enquiry, fetchImpl = fetch) {
  if (!credentials?.clientId || !credentials?.clientSecret || !credentials?.refreshToken) {
    throw new Error('Gmail sending authorization is not configured.');
  }
  const mime = buildGmailMessage(enquiry);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const request = (url, options = {}) => fetchImpl(url, { ...options, signal: controller.signal });
  try {
    const token = await parseResponse(await request('https://oauth2.googleapis.com/token', {
      method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ client_id: credentials.clientId, client_secret: credentials.clientSecret, refresh_token: credentials.refreshToken, grant_type: 'refresh_token' }).toString(),
    }), 'Google sending authorization failed. Reconnect the Danlo account.');
    if (typeof token.access_token !== 'string' || !token.access_token) throw new Error('Google did not provide a sending token.');
    const headers = { Authorization: 'Bearer ' + token.access_token };
    const identity = await parseResponse(await request('https://openidconnect.googleapis.com/v1/userinfo', { headers }), 'Unable to verify the connected Google account.');
    if (identity.email?.toLowerCase() !== DANLO_EMAIL || identity.email_verified !== true) {
      throw new Error('Authorize danlopropertiesltd@gmail.com to send these alerts.');
    }
    const result = await parseResponse(await request('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ raw: encodeBase64(mime).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '') }),
    }), 'Gmail did not accept this alert. The saved enquiry should remain pending.');
    if (typeof result.id !== 'string' || !result.id) throw new Error('Gmail did not confirm acceptance.');
    return { id: result.id, accepted: true };
  } finally { clearTimeout(timeout); }
}
