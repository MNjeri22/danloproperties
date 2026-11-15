# Danlo enquiries

Visitors submit at /api/enquiries. Records are stored in the Site D1 database. /enquiries is restricted to the authenticated site owner account (operations@nmhwc.net) through dispatch-owned identity headers. Email notification handling is implemented but requires RESEND_API_KEY and ENQUIRY_EMAIL_FROM in Sites runtime settings; see EMAIL_SETUP.md.

Source pages are in public/. Root homepage content is mirrored in site-home.html for the root route; keep it in sync with public/index.html when editing. Inventory labels used by the API are in lib/land-inventory.json; keep these IDs and labels in sync with public/assets/land-data.js.

Use npm run db:generate after schema changes and preserve applied migrations. Run node --test tests/enquiries.test.mjs for server persistence, validation and authorization checks. Local preview data is separate from production.
