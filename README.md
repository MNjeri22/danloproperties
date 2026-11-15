# danloproperties

Danlo Properties Ltd — land opportunities in Kenya.

## Gmail enquiry notifications

This repository contains the server-side Gmail notification function for the Danlo website. It is configured to send alerts **from and to danlopropertiesltd@gmail.com** and verifies the authorized Google account before sending.

- `gmail-notifications.mjs` — portable server-side sending module.
- `gmail-notifications.test.mjs` — tests with simulated Google responses.
- `EMAIL_SETUP.md` — Google authorization, server secrets, and website integration instructions.

Run the tests with Node.js 22 or newer:

```sh
node --test gmail-notifications.test.mjs
```

The alert includes the property and enquiry reference, plus a link to the private enquiries inbox. Contact details and the visitor's message remain in that inbox.

**Status:** the Gmail function is ready for integration; alerts are not active until Danlo's Google sending authorization is configured and live delivery is tested. Adding this repository does not change the existing website's hosting or access settings.
