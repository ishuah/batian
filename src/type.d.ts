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
  mismatchedRegions: number,
  choroplethColorScheme: string,
  symbolColorScheme: string,
  symbolShape: string
}
