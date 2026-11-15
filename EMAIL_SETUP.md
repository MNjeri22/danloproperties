# Gmail enquiry alert activation

Sender and recipient: **danlopropertiesltd@gmail.com**.

The module in this repository runs on a server (Node.js 22+ or a compatible Worker). It does not run in the visitor's browser or on GitHub Pages.

## Google authorization required

1. Use a Google Cloud project with the Gmail API enabled and an OAuth client for the server application.
2. Configure the OAuth consent screen and authorize **danlopropertiesltd@gmail.com** with these scopes:
   - `https://www.googleapis.com/auth/gmail.send`
   - `openid`
   - `email`
3. Complete Google's authorization flow with offline access so the server can receive a refresh token. Follow Google's requirements for the app's consent-screen publishing status; do not assume a testing authorization is permanent.
4. Put these values in the website host's secret settings:
   - `GMAIL_CLIENT_ID`
   - `GMAIL_CLIENT_SECRET`
   - `GMAIL_REFRESH_TOKEN`

Never commit actual credentials, access tokens, refresh tokens, Gmail passwords, or customer enquiry records. A Gmail connection in ChatGPT does not automatically give this website a refresh token.

## Integrating the function

Call `sendGmailNotification` after saving an enquiry in the website database:

```js
import { sendGmailNotification } from './gmail-notifications.mjs';

const result = await sendGmailNotification({
  clientId: env.GMAIL_CLIENT_ID,
  clientSecret: env.GMAIL_CLIENT_SECRET,
  refreshToken: env.GMAIL_REFRESH_TOKEN,
}, {
  id: savedEnquiry.id,
  type: savedEnquiry.type,
  propertyLabel: savedEnquiry.property_label,
  visitDate: savedEnquiry.visit_date,
  visitTime: savedEnquiry.visit_time,
});
// Store result.id and mark this record's alert as accepted.
```

Keep the enquiry saved if the email request fails. Use a persistent per-enquiry lock/status to prevent repeated sends. Gmail's send endpoint does not provide the Resend idempotency behavior; do not blindly replay an ambiguous timeout. An owner should check Sent mail before retrying an uncertain send.

## Activation check

After configuring credentials and deploying the website integration, submit an authorized test enquiry. Verify the saved enquiry, Gmail's returned message ID, and the actual email in the destination inbox. Unit tests use simulated responses and are not proof of live delivery.

Current status: module prepared; Google authorization and live email delivery are not yet configured or verified.

Official references:
- https://developers.google.com/workspace/gmail/api/guides/sending
- https://developers.google.com/identity/protocols/oauth2/web-server
- https://developers.google.com/identity/openid-connect/openid-connect
