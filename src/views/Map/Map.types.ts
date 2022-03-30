export interface Shape {
    id: number
    content_object: string
    object_id: number
    resource_url: string
    shape: any
}

export interface Data {
    [key: string]: any
}

export interface Site {
    id: number
    name: string
    data: Data
    resource_url: string
    shapes: Shape[]
}

export interface LayerObject {
    id: number
    name: string
    data_key: string
    resource_url: string
    sites: Site[]
}

export interface MapObject {
    id: number
    name: string
    description: string
    resource_uri: string
    layers: LayerObject[]
  }

export interface Point {
    coordinates: [number, number]
    type: 'Point'
}
