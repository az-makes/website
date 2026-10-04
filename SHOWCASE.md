# AZ Makes showcase collection

The Projects page now contains 14 curated showcases: four portfolio styles, three automation case studies, six artwork collections and a fictional Zy Atelier portfolio. The six artwork sheets represent 30 supplied Canva artworks. Six supplied light/dark screenshots are preserved in the portfolio previews.

## Editing

- `projects.html`: project cards and collection filters.
- `showcase-data.json`: descriptions, tools, artwork references, walkthrough steps and demo links.
- `showcase.js` and `showcase.css`: accessible detail dialogs and preview layout.
- `assets/showcase/`: optimized public artwork and diagrams.
- `demos/`: five independent fictional portfolio demonstrations.

Serve the website through a static web server; the collection data loads over HTTP. GitHub Pages serves the published site.

## Privacy and presentation

Original personal portfolio data, résumé, portrait, contact details, Canva edit links and workflow JSON exports are excluded from this addition. Portfolio demos use fictional Jamie Rivera or Zy identities. Artwork is explicitly labeled as adapted sample work. No client results, commissions, sales or live workflow execution are claimed.

Artwork sheets were anonymized with the built-in image editing tool, using the supplied artworks as edit targets. Prompt constraints: preserve every design and its composition, replace personal identities and contacts with fictional sample information, and replace private photos with illustrated placeholders. The resulting sheets are adaptations, not pixel-identical originals. Full-quality PNG versions remain in the sibling `anonymized-artwork` output folder; public WebP copies are optimized for loading.

The automation case studies describe the provided workflow structure only. The n8n export has 12 nodes. The Calendar Make scenario has three modules. The content-routing Make blueprint uses webhook intake and two routed file/AI/Discord branches. Configuration, deployment and credentials are still needed to run those workflows.
