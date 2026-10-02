# 360° Panorama Archive — GitHub Pages v2

Static catalogue for 360° spherical panoramas hosted externally on Kuula and 360Cities.

## Catalogue hierarchy

The website uses exactly this hierarchy:

**YEAR → COUNTRY → CITY / LOCATION → PANORAMA**

There is deliberately no separate Region or Area level.

Example:

```text
2026
├── Germany
│   ├── Sassnitz
│   │   ├── Sassnitz Harbour
│   │   └── Königsstuhl
│   └── Binz
│       └── Seafront
└── Poland
    └── Warsaw
        ├── Old Town
        └── Łazienki Park
```

## Add a panorama

Edit:

```text
data/panoramas.json
```

Use this structure:

```json
{
  "id": "2026-example-city-location-001",
  "year": 2026,
  "country": "Poland",
  "city": "Warsaw",
  "location": "Old Town",
  "title": "Warsaw Old Town",
  "date": "2026-08-01",
  "provider": "Kuula",
  "url": "https://kuula.co/...",
  "embedUrl": "https://kuula.co/...",
  "coordinates": {
    "lat": 52.2497,
    "lng": 21.0122
  },
  "tags": ["Warsaw", "Old Town"],
  "description": "Description of the panorama."
}
```

The site automatically creates the navigation hierarchy from these fields.

## GitHub Pages

This is a plain static HTML/CSS/JavaScript site. GitHub Pages can publish static files directly from a repository, and this package includes a GitHub Actions workflow in `.github/workflows/pages.yml`.

1. Create a **public** GitHub repository, for example `panorama-archive`.
2. Upload the contents of this ZIP to the repository root.
3. Make sure `index.html` is at the repository root.
4. Make sure `.github/workflows/pages.yml` is present.
5. Go to **Settings → Pages**.
6. Select **GitHub Actions** as the source if required.
7. Open **Actions** and wait for the deployment workflow to finish.
8. The project site will normally be available at:

```text
https://YOUR-USERNAME.github.io/panorama-archive/
```

Relative asset paths are used so the site works as a GitHub Pages project site.

## Local testing

From the project directory:

```powershell
python -m http.server 8000
```

Then open:

```text
http://localhost:8000/
```

Do not open `index.html` directly with `file://`; the JSON catalogue is loaded with `fetch()` and should be served through HTTP.

## Important

The GitHub repository stores catalogue data, links, coordinates and website code. Do **not** upload large original 360° panorama files unless you specifically intend to use GitHub for that storage. Keep the actual panoramas on Kuula/360Cities.
