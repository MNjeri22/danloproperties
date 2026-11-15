# Danlo Properties Ltd

Official website source for Danlo Properties Ltd — land opportunities in Kenya.

**Hosting:** GitHub Pages, from `main` → `/docs`.
**Domain:** https://www.danlopropertiesltd.com

## Website files

- `docs/` — the published static website, including all 15 pages and images.
- `website/` — the complete original application source: frontend, images, backend, database migrations, tests, and build configuration. The historical backend is preserved as source and is not used by GitHub Pages.
- `website-source.zip` — complete source backup containing 222 tracked files.
- `SOURCE_MANIFEST.json` — SHA-256 checksums and source provenance.
- `github-pages-build.py` — creates the static Pages version from the full source.

## Enquiries

The GitHub-only website prepares an email for visitors to review and send through their own email app to danlopropertiesltd@gmail.com. It does not save enquiry records or run a private inbox. Automatic Gmail notification code is retained for possible future server integration, but is not active on GitHub Pages.

## Rebuilding

Run the **Import complete website source** workflow once to expand and verify the backup. It also runs `python3 github-pages-build.py` and commits the resulting website files. Later edits can be made directly in `docs/`; running the build script regenerates that folder from `website/public/`.

No credentials or private customer records belong in this public repository.
