# Danlo Properties Ltd

Website and Gmail enquiry notification source for Danlo Properties Ltd.

## Complete website backup

`website-source.zip` contains the complete website source, all 15 pages, images, frontend scripts, server-side enquiry handling, private inbox, database schema/migrations, tests, and build configuration. `SOURCE_MANIFEST.json` records the original commit and SHA-256 checksums for every source file. This backup does not include runtime credentials or private database contents.

The **Import complete website source** Actions workflow expands the backup into `website/` so every file can also be browsed and edited normally in GitHub.

## Website hosting migration

The website is being moved to GitHub Pages. Pages serves the frontend; durable enquiry storage, the private inbox, and automatic Gmail sending require a separate server. The backend source is included in this repository, but is not executed by GitHub Pages.

## Gmail email function

The root `gmail-notifications.mjs` module sends from and to **danlopropertiesltd@gmail.com** after verifying the connected Google account. See `EMAIL_SETUP.md` for authorization requirements. Alerts are not active until the server integration and credentials are configured.

Run the standalone module tests:

```sh
node --test gmail-notifications.test.mjs
```

Existing public repository: MNjeri22/danloproperties.
