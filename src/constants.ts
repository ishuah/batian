const REGIONS: Regions = {
  Africa: `${process.env.PUBLIC_URL}/geojson/africa.geojson`,
  Asia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/asia.geojson',
  Australia: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/australia.geojson',
  Europe: 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/europe.geojson',
  'North America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/north-america.geojson',
  'South America': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/south-america.geojson',
  'South East Asia': 'https://raw.githubusercontent.com/codeforgermany/click_that_hood/main/public/data/southeast-asia.geojson',
};
const STEPS = ['Map details', 'Load your data', 'Refine', 'Visualize'];
const CHOROPLETH_COLORS: string[] = ['Reds', 'Blues', 'Greens', 'Cool', 'Warm', 'Spectral'];

export { STEPS, REGIONS, CHOROPLETH_COLORS };
