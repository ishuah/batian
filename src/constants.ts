const REGIONS: Regions = {
  World: `${process.env.PUBLIC_URL}/geojson/world.geo.json`,
  Africa: `${process.env.PUBLIC_URL}/geojson/africa.geo.json`,
  Asia: `${process.env.PUBLIC_URL}/geojson/asia.geo.json`,
  Europe: `${process.env.PUBLIC_URL}/geojson/europe.geo.json`,
  'North America': `${process.env.PUBLIC_URL}/geojson/north.america.geo.json`,
  'South America': `${process.env.PUBLIC_URL}/geojson/south.america.geo.json`,
  Ocenia: `${process.env.PUBLIC_URL}/geojson/oceania.geo.json`,
};
const STEPS = ['Map details', 'Load your data', 'Refine', 'Visualize'];
const CHOROPLETH_COLORS: string[] = ['Reds', 'Blues', 'Greens', 'Cool', 'Warm', 'Spectral'];
const SYMBOL_COLORS: string[] = ['Red', 'Blue', 'Green', 'Orange'];
const SYMBOLS: string[] = ['Circle', 'Square', 'Triangle', 'Diamond'];

export {
  STEPS, REGIONS, CHOROPLETH_COLORS, SYMBOL_COLORS, SYMBOLS,
};
