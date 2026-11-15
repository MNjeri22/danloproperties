# Enquiry email notifications

Recipient: danlopropertiesltd@gmail.com (fixed server-side).

Required Sites runtime values:
- RESEND_API_KEY — store as a secret; use a sending-only key scoped to the sender domain where available.
- ENQUIRY_EMAIL_FROM — sender address verified in the same Resend account (optionally `Danlo Properties <address>`).

No credentials are configured yet. After setting them, deploy the current source again to apply runtime values. Then send an authorized test enquiry and confirm both provider acceptance and receipt in the destination inbox. Do not report delivery verified from a build or mock test.

New enquiries attempt an email notification after the record is saved. The notification contains property/type/reference and a private inbox link; the visitor's contact details and free-text message stay in the inbox. Failures never discard the enquiry. The private inbox shows configuration and per-enquiry alert status, with an owner-only button to send up to 10 pending alerts. There is no periodic automatic retry worker. Resend idempotency keys and stored acceptance status reduce duplicate sends; provider idempotency expires after 24 hours.

Run `node --test tests/enquiries.test.mjs tests/notifications.test.mjs`. Existing migrations are immutable; append new schema migrations.
