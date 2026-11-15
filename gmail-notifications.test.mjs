import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildGmailMessage, sendGmailNotification, DANLO_EMAIL } from './gmail-notifications.mjs';
const credentials = { clientId: 'test-client', clientSecret: 'test-only-secret', refreshToken: 'test-only-refresh' };
const enquiry = { id: 'test-enquiry-123', type: 'visit', propertyLabel: '85 acres — Mutungoni Road, Kinanie', visitDate: '2026-12-01', visitTime: 'Flexible' };

test('sends from and to Danlo after verifying the authorized Google account', async () => {
  const calls = [];
  const mock = async (url, init) => {
    calls.push(url);
    if (url.includes('/token')) return Response.json({ access_token: 'test-access' });
    if (url.includes('/userinfo')) return Response.json({ email: DANLO_EMAIL, email_verified: true });
    assert.equal(url, 'https://gmail.googleapis.com/gmail/v1/users/me/messages/send');
    const raw = JSON.parse(init.body).raw;
    const mime = Buffer.from(raw, 'base64url').toString('utf8');
    assert(mime.includes('From: Danlo Properties Ltd <' + DANLO_EMAIL + '>'));
    assert(mime.includes('To: ' + DANLO_EMAIL));
    const body = Buffer.from(mime.split('\r\n\r\n')[1], 'base64').toString('utf8');
    assert(body.includes(enquiry.propertyLabel));
    assert(body.includes('/enquiries'));
    return Response.json({ id: 'gmail-test-message' });
  };
  assert.deepEqual(await sendGmailNotification(credentials, enquiry, mock), { id: 'gmail-test-message', accepted: true });
  assert.equal(calls.length, 3);
});

test('does not send using a different Gmail account', async () => {
  let calls = 0;
  const mock = async url => {
    calls++;
    if (url.includes('/token')) return Response.json({ access_token: 'test-access' });
    if (url.includes('/userinfo')) return Response.json({ email: 'other@example.com', email_verified: true });
    throw new Error('Must not send');
  };
  await assert.rejects(sendGmailNotification(credentials, enquiry, mock), /Authorize danloproperties/);
  assert.equal(calls, 2);
});

test('missing credentials make no external request', async () => {
  await assert.rejects(sendGmailNotification({}, enquiry, () => { throw new Error('Must not request'); }), /not configured/);
});

test('rejects Google authorization failures and invalid references', async () => {
  await assert.rejects(sendGmailNotification(credentials, enquiry, async () => Response.json({ error: 'invalid_grant' }, { status: 400 })), /authorization failed/);
  assert.throws(() => buildGmailMessage({ id: 'bad\r\nreference' }), /valid enquiry reference/);
});
