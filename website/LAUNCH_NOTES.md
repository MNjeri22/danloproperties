# Launch notes

Current publication is owner-private. Public indexing and visitor access require the owner to choose a public audience. No access changes were made during SEO preparation.

Implemented: unique titles and descriptions on 15 pages; canonical URLs; Open Graph and summary-card metadata using the supplied logo; homepage Organization and WebSite structured data; catalogue ItemList and BreadcrumbList; property breadcrumbs; XML sitemap and robots.txt.

Before a custom-domain launch, update canonical, sitemap, social and structured-data origins together. Add verified property photos and precise map references when supplied. The enquiry form now saves submissions in D1, provides a reference number, and keeps a private owner inbox at /enquiries. Email notification code is ready but remains inactive until the email-service key and verified sender are configured.

Verified company information is from the supplied official document. Do not add unverified ratings, testimonials, registration IDs, opening hours, approvals, or geographic coordinates.

Saved land: hearts on featured cards, catalogue cards, and detail pages store valid listing IDs in browser localStorage. Saved-only catalogue filtering combines with search, location, and sorting. No account or server storage is used.

Saved property comparison: catalogue visitors can compare all saved listings by location, acreage, and asking price per acre, with property-specific visit links. Table scrolls horizontally on small screens and uses accessible headers.

Property sharing: all 13 detail pages have WhatsApp and email compose links, copy-link and copy-details controls, and native device sharing when available. Messages include canonical listing URLs and inventory prices. Visitors choose the recipient and send from their own app.

Responsive photos: landscape and hero images provide 480, 800, and 1200 pixel WebP variants; browsers select by screen size. Hero thumbnails use small dedicated files and switching preserves responsive sources. 800-pixel variants total 1,128,506 bytes versus 4,495,767 bytes for the 14 originals (75% smaller). Originals remain available.

Direct enquiries: server validates fields and property IDs, saves submissions with retry deduplication, and applies same-origin checks, a honeypot, and per-source rate limits. Owner-only inbox supports New/Contacted status and pagination. Access is restricted server-side to the authenticated site owner account operations@nmhwc.net. Public site access remains unchanged. Source HTML/assets now live under public/; build output is generated under dist/client and dist/server.

Email alerts: Resend integration sends property/reference notifications to danlopropertiesltd@gmail.com, preserves saved enquiries on provider failure, records acceptance status, and offers an owner-only pending-alert retry. Required runtime values RESEND_API_KEY (secret) and ENQUIRY_EMAIL_FROM are not configured. Mocked-provider tests passed; actual email delivery has not been tested.
