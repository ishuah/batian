# Batian v2 — Specification

## Vision
An open-source, client-side web tool for creating geospatial visualizations from data. Zero friction: upload your data, pick a map type, map your columns, style it, export it. Your data never leaves the browser.

Inspired by RAWGraphs (data-first UX) and Datawrapper Maps (intuitive, export-ready output).

---

## User Flow

```
1. Upload data  →  2. Pick map type  →  3. Map columns  →  4. Style  →  5. Export
```

**Step 1 — Data**
- Drag & drop or paste: CSV, GeoJSON
- App auto-detects columns (lat/lng, region names, numeric values)
- Preview table shown immediately

**Step 2 — Map Type**
- Choropleth: fill regions by value (countries, states, provinces)
- Symbol: circles at coordinates, sized and/or coloured by value
- App suggests the right type based on detected data shape

**Step 3 — Map Columns**
- Drag-and-drop column mapping: which column → location, which → value, which → label
- For choropleth: match region names to built-in geographies (auto-matched, with manual override)
- For symbol: lat/lng columns + value column

**Step 4 — Style**
- Color scale (sequential, diverging, categorical)
- Legend (on/off, position)
- Labels (on/off, font size)
- Map projection (for choropleth)
- Circle size range (for symbol)

**Step 5 — Export**
- SVG (vector, scalable)
- PNG (raster, fixed size)
- Embeddable iframe (self-contained HTML snippet)

---

## Built-in Geographies (v1)
- World countries
- African countries
- Kenya counties

These ship as bundled TopoJSON. Users can also upload their own GeoJSON boundary file.

---

## Tech Stack
- **Framework:** React + TypeScript
- **Build:** Vite
- **Mapping/Rendering:** D3.js
- **File parsing:** PapaParse (CSV), native JSON (GeoJSON)
- **Export:** SVG direct DOM export, html2canvas for PNG, generated HTML string for iframe
- **Styling:** Tailwind CSS
- **Tests:** Playwright

100% client-side. No backend. No auth. No accounts.

---

## Non-features (v1)
- No flow/connection maps
- No 3D maps
- No real-time data feeds
- No mobile layout (desktop-first)
- No user accounts or saved maps
- No server-side processing

---

## Repo
- New repo: `batian-v2`
- MIT license
- CI: GitHub Actions
- Deploy: GitHub Pages
