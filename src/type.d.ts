type Regions = {
  [key: string]: string
}

type IDataKeys = {
  name?: string
  values?: string
  latitude?: string
  longitude?: string
  sizeValues?: string
  colorValues?: string
}

interface IMap {
  title: string
  type: string
  region: string
}

interface IUserData {
  data: never[]
  ready: boolean
  errors: string[]
}

interface AppState {
  map: IMap
  userData: IUserData,
  currentStep: number,
  dataKeys: IDataKeys,
  mismatchedRegions: string[],
  regionSuggestions: string[],
  choroplethColorScheme: string,
  interpolationType: string,
  symbolColorScheme: string,
  symbolShape: string
}

interface Palette {
  [key: string]: string[]
}

interface IColorScale {
  interpolation(): d3.ScaleLinear<string, string, never>
    | d3.ScaleThreshold<number, string, never>
    | d3.ScaleQuantize<string, never>
    | d3.ScaleQuantile<string, never>
  legend(svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>): void
}