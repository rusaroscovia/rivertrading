# River Trading Ltd website

Welcome! This is the website for River Trading Ltd, a Rwandan supplier of hardware, household and industrial products. It brings the company's products, services, brands, branches, events and team together in one place.

## See the website on your computer

You don't need to install project dependencies or build anything. You just need [Node.js](https://nodejs.org/) installed.

On Windows, double-click `run-website.cmd`. Or, from this project folder, run:

```bash
node serve-site.js
```

Then open [http://localhost:8000](http://localhost:8000) in your browser. Leave the terminal window open while you browse; it is running the local website. To stop it, press `Ctrl+C` in that window.

The server uses port `8000` by default. If that port is already in use, choose another one:

```bash
PORT=8080 node serve-site.js
```

In Windows PowerShell, use:

```powershell
$env:PORT=8080
node serve-site.js
```

Then visit `http://localhost:8080`.

## Finding your way around

- `index.html` is the home page.
- `pages/` contains the rest of the website, including the product, brand, service, branch, event and company pages.
- `css/` contains the shared and brand-specific styles.
- `js/` contains the page interactions and the data used to display products, events, and landing-page photos.
- `images/` and `videos/` hold the site's visual media.

## Updating content

Many parts of the site are driven by data files, so you can update content without rebuilding the website:

- Event details, award descriptions and event photos are managed in `js/event-media-data.js`. Event images belong in `images/events/`; see `images/events/README.md` for the expected format.
- Landing-page photos are listed in `js/landing-photos.js`.
- Product information is kept in the product data files in `js/`.
- Page layouts and text are in `index.html` and the matching file in `pages/`.
- Shared visual styles are in `css/style.css`.

When adding an image or video, put it in the appropriate folder and make sure the path in the page or data file matches its location. After saving your changes, refresh the browser to see them.

## A note for contributors

This is a straightforward static website with a small built-in Node.js server—there is no package manager, framework, or build step. Keep content in the existing pages and data files where possible, and check your changes in a browser using the local server before sharing them.
