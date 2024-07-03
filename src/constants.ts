const REGIONS: Regions = {
  World: `${process.env.PUBLIC_URL}/geojson/world.geo.json`,
  Africa: `${process.env.PUBLIC_URL}/geojson/africa.geo.json`,
  Asia: `${process.env.PUBLIC_URL}/geojson/asia.geo.json`,
  Europe: `${process.env.PUBLIC_URL}/geojson/europe.geo.json`,
  'North America': `${process.env.PUBLIC_URL}/geojson/north.america.geo.json`,
  'South America': `${process.env.PUBLIC_URL}/geojson/south.america.geo.json`,
  Ocenia: `${process.env.PUBLIC_URL}/geojson/oceania.geo.json`,
};
const STEPS = ['Map details', 'Load your data', 'Refine', 'Visualize', 'Download'];
const CHOROPLETH_COLORS: string[] = ['Reds', 'Blues', 'Greens', 'Cool', 'Warm', 'Spectral'];
const SYMBOL_PALETTE: Palette = {
  Whimsical: ['#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'],
  Audacious: ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00', '#cab2d6', '#6a3d9a', '#ffff99', '#b15928'],
  Reserved: ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#666666'],
  Nonchalant: ['#4e79a7', '#f28e2c', '#e15759', '#76b7b2', '#59a14f', '#edc949', '#af7aa1', '#ff9da7', '#9c755f', '#bab0ab'],
};
const SYMBOLS: string[] = ['Circle', 'Square', 'Triangle', 'Diamond'];
const INTERPOLATION_TYPE = ['Linear', 'Threshold', 'Quantize', 'Quantile'];

export {
  STEPS, REGIONS, CHOROPLETH_COLORS, SYMBOL_PALETTE, SYMBOLS, INTERPOLATION_TYPE,
};
