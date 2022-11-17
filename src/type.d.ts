type Regions = {
  [key: string]: string
}

type ChoroplethDataKeys = {
  name: string
  values: string
}

type SymbolDataKeys = {
  latitude: string
  longitude: string
  sizeValues: string
  colorValues: string
}

interface IMap {
  title: string
  type: string
  region: string
}

interface IUserData {
  data: never[]
  ready: boolean
}

interface AppState {
  map: IMap
  userData: IUserData
}
