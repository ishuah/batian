# Batian v2

**Open-source, client-side geospatial data visualization.** Upload your data, pick a map type, map your columns, style it, export it. Your data never leaves the browser.

Inspired by [RAWGraphs](https://rawgraphs.io/) (data-first UX) and [Datawrapper Maps](https://www.datawrapper.de/maps) (intuitive, export-ready output).

→ Full specification: [SPEC.md](./SPEC.md)

---

## What it does

1. **Upload** — Drag & drop a CSV or GeoJSON file
2. **Pick map type** — Choropleth (fill regions) or Symbol (circles at coordinates)
3. **Map columns** — Tell Batian which column is the region/lat/lng/value
4. **Style** — Color scale, legend, labels, projection
5. **Export** — SVG, PNG, or embeddable iframe

Built-in geographies: world countries, African countries, Kenya counties.

---

## Run locally

```bash
git clone https://github.com/batian-v2/batian-v2.git
cd batian-v2
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Tech stack

| Layer | Library |
|---|---|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Mapping | D3.js v7 |
| CSV parsing | PapaParse |
| Styling | Tailwind CSS v4 |
| PNG export | html2canvas |
| E2E tests | Playwright |

100% client-side — no backend, no auth, no accounts.

---

## Project structure

```
src/
  components/
    layout/       # Header, Sidebar
    steps/        # DataUpload, MapTypePicker, ColumnMapper, StylePanel, ExportPanel
    map/          # MapCanvas, ChoroplethMap, SymbolMap
  hooks/          # useDataParser, useMapRenderer, useExport
  data/           # Bundled GeoJSON stubs (replace with real data)
  types/          # All TypeScript interfaces
  utils/          # columnDetector, colorScales, geoMatcher
e2e/              # Playwright tests
```

---

## Contributing

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Make changes and add tests in `e2e/`
4. Run the build: `npm run build`
5. Open a pull request

Please keep PRs focused. One feature or fix per PR.

---

## License

MIT
