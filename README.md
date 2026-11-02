# River Trading Ltd Website

**Quality and Good Service**

The River Trading Ltd website presents the company, its product catalogue, brands, services, locations, and news. It is designed to help customers across Rwanda and the wider East African region learn about the company and find the products and support they need.

**Live website:** [rivertradingltd.com](https://www.rivertradingltd.com/)

## About River Trading Ltd

River Trading Ltd is a Kigali-based import, export, distribution, and manufacturing company. The company serves individual customers, businesses, contractors, and hardware retailers with construction, electrical, plumbing, industrial, household, and hygiene products.

Alongside its distribution and trading operations, River Trading produces selected cleaning, hygiene, and car-care products under the RIVER® and MIRAH® brands.

## Website sections

| Section | What visitors can find |
| --- | --- |
| Home | Company introduction, featured products, and key links |
| About | Company background, mission, vision, and team |
| Products | Product catalogue, category pages, search, and filtering |
| Services | Wholesale and retail distribution, import and export, local manufacturing, shopping and delivery, and project supply |
| Brands | RIVER®, MIRAH®, Diamond Mix, and MAGPOW |
| Branches | Branch information and locations |
| Events | Company events, achievements, award images, and event media |
| Blogs | Company stories and updates |
| Contact | Contact information and customer enquiry form |

## Technology

The website uses browser-native technologies and does not depend on a front-end framework.

| Technology | Role |
| --- | --- |
| HTML5 | Page structure and content |
| CSS3 | Layout, responsive styling, and visual design |
| JavaScript (ES6+) | Navigation, product search, galleries, sliders, forms, and data-driven content |
| Node.js built-in modules | Lightweight local web server for previewing the site |

There is no package installation or asset compilation step for local development. The website's content and interactions run in the browser; Node.js is used to serve the files locally.

## Project structure

```text
river-trading-website/
├── index.html                 # Home page
├── pages/                     # About, products, services, brands, events, and other pages
├── css/
│   ├── style.css              # Shared site styles
│   └── brand-refresh.css      # Brand presentation styles
├── js/
│   ├── *-products-data.js     # Product category data
│   ├── event-media-data.js    # Event and award content
│   ├── event-gallery.js       # Event gallery and image viewer
│   ├── landing-photos.js      # Home-page photography data
│   ├── item-list-data.js      # Product catalogue data
│   ├── main.js                # Shared site interactions
│   └── product-search.js      # Product search and filtering
├── images/                    # Logos, product photos, event images, and other artwork
├── videos/                    # Video assets
├── serve-site.js              # Local preview server
├── run-website.cmd            # Windows launcher
├── robots.txt                 # Search engine crawling rules
└── sitemap.xml                # Public page sitemap
```

## Run the website locally

### Requirements

- Node.js with ES module support. The local server has been verified with Node.js 22.

### Start

On Windows, double-click `run-website.cmd`. Or open a terminal in the project folder and run:

```sh
node serve-site.js
```

Open [http://localhost:8000](http://localhost:8000) in your browser. Keep the terminal open while previewing the site; press `Ctrl+C` to stop the server.

To run on another port, set the `PORT` environment variable.

**PowerShell**

```powershell
$env:PORT = 8080
node serve-site.js
```

**macOS, Linux, or a Unix-compatible shell**

```sh
PORT=8080 node serve-site.js
```

Then visit [http://localhost:8080](http://localhost:8080).

## Maintaining website content

Most updates can be made directly in the existing HTML or JavaScript files:

- **Pages and copy:** Edit `index.html` or the relevant page in `pages/`.
- **Shared design:** Edit `css/style.css`. Brand-specific presentation is in `css/brand-refresh.css`.
- **Products:** Update the relevant product data file in `js/`.
- **Events and awards:** Update `js/event-media-data.js` and add media to `images/events/`. See [`images/events/README.md`](images/events/README.md) for the media format.
- **Home-page photos:** Update `js/landing-photos.js` and add the referenced image files.

Keep media paths consistent with the location of each file, then preview the affected page locally before publishing.

## Deployment

The public site is available at [rivertradingltd.com](https://www.rivertradingltd.com/). `serve-site.js` is for local preview; production hosting and deployment are managed separately.
