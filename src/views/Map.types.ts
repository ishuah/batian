export interface MapObject {
    id: number
    name: string
    description: string
    resource_uri: string
    layers: Layer[]
  }

export interface Layer {
    id: number
    name: string
    resource_url: string
}

export interface Site {
    id: number
    name: string
    data: string
    resource_url: string
    shapes: Shape[]
}

export interface Shape {
    id: number
    content_object: string
    object_id: number
    resource_url: string
    shape: Object 
}

export interface Point {
    coordinates: [number, number]
    type: "Point"
}