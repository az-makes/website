# AZ Makes launch status

Completed: expanded service deliverables and process; a practical browser-based Zy FAQ; inquiry budget/timeline fields, validation and contact permission; email-draft and downloadable-message fallback; optional Formspree submission handling with loading, success and failure states; privacy information; canonical/social metadata, sitemap and robots file; focus outlines, mobile targets and reduced motion; optimized studio images.

## Owner actions

1. Direct inbox delivery: create your own Formspree form, accept the provider's account terms yourself, and verify the destination inbox. Share only its public endpoint, for example `https://formspree.io/f/xxxxxxxx`. Never share a password or API key. The owner must authorize this processor before it receives inquiries. Then set the form ID in `site-config.js` and perform a delivery test that the owner confirms in their inbox. Until then the published form prepares a draft or downloadable message; it does not claim to send directly.
2. Business terms: confirm prices, realistic turnaround, included revisions, payment terms and ongoing support. The published site leaves these for the scoped proposal rather than inventing commitments.
3. Real AI is optional: Zy already works as a clearly labeled FAQ. A generative AI version needs an owner-approved provider, backend, spend limit and secure secret storage. Never put a secret in static browser files.
4. Custom domain is optional: the owner registers and controls `azmakes.studio` before connecting `website.azmakes.studio`. No purchase has been made.
5. Approve the promotional film and adapted artwork as the brand owner. They are already labeled appropriately; no testimonials or commercial results have been invented.

## Contact configuration

`site-config.js` holds the public inbox and blank `formspreeId`. The form service is dormant until a valid ID is set. `launch-contact.js` handles delivery, validation, errors, and draft download. Its timeout leaves entries intact and avoids claiming a message was sent when delivery is uncertain.

## Verification scope

Local and live browser verification covers navigation, page loading, FAQ replies/links, inquiry validation and draft generation, mobile overflow and menu, artwork detail dialog, and theme. Source checks cover local asset targets and scripts. Direct Formspree delivery cannot be verified before the owner supplies and activates a form. No genuine inquiry has been sent during testing.

Formspree setup reference: https://formspree.io/html/
