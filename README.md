# Prohibition Cakes

A self-contained Vercel migration of the supplied Cake Art WordPress site. It preserves the original rendered pages, theme CSS, imagery, fonts, Revolution Slider, product carousel, responsive navigation, FAQ content, product galleries and product quick views.

## Run locally

```sh
npm run build
npm run dev
```

No WordPress server, local Pi address, database, or third-party image host is needed. All assets and Google Fonts used by the original design are included locally.

## Source and editing

The original public frontend is losslessly packaged in `site/source-*.part`. `site/manifest.json` contains its SHA-256 digest; the build verifies and extracts it to `public/`, applies `site/page-overrides.tar.gz` with corrected legacy product markup, removes old local URLs, then creates `dist/`. Splitting the archive preserves every original asset path while allowing reliable upload through GitHub's API.

After running the build, edit `public/` and run `node scripts/pack.mjs` to persist your edits to the tracked source parts. Commit the updated `site/` files. The repository is linked to Vercel, so pushes to the production branch redeploy the website.

## Commerce and forms

The basket persists in the visitor's browser and supports quantities, removal, grouped products, subtotals and the original €5 flat delivery rate. Checkout is explicitly an email order enquiry; it does not process a payment or create a server-side order. The contact form prepares an email to `team@prohibitioncakes.co`. Payment processing, automatic email delivery, customer authentication and order administration require services to be connected before they can function as on WordPress.

Private WordPress settings, login credentials, customer accounts, historical orders and database backups are excluded.

The reference was restored from the supplied backups because the original `pi2.local` host was not reachable from the migration environment. Live-site pixel equivalence could therefore not be independently verified.
