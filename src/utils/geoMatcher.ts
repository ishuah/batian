import type { RegionMatch } from '../types'

type GeoFeature = GeoJSON.Feature<GeoJSON.Geometry, GeoJSON.GeoJsonProperties>

function normalize(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim()
}

function buildNameIndex(features: GeoFeature[]): Map<string, GeoFeature> {
  const index = new Map<string, GeoFeature>()
  for (const feature of features) {
    const props = feature.properties ?? {}
    const candidates = [
      props['name'],
      props['NAME'],
      props['ADMIN'],
      props['ISO_A2'],
      props['ISO_A3'],
      props['id'],
      feature.id,
    ]
    for (const candidate of candidates) {
      if (candidate != null) {
        index.set(normalize(String(candidate)), feature)
      }
    }
  }
  return index
}

export function matchRegions(
  dataValues: string[],
  features: GeoFeature[],
): RegionMatch[] {
  const index = buildNameIndex(features)

  return dataValues.map((value): RegionMatch => {
    const key = normalize(value)
    const feature = index.get(key)

    if (feature) {
      return {
        dataValue: value,
        featureId: feature.id != null ? String(feature.id) : null,
        featureName: feature.properties?.['name'] ?? feature.properties?.['NAME'] ?? null,
        confidence: 1,
      }
    }

    // Fuzzy: check for containment
    for (const [indexKey, feat] of index) {
      if (indexKey.includes(key) || key.includes(indexKey)) {
        return {
          dataValue: value,
          featureId: feat.id != null ? String(feat.id) : null,
          featureName: feat.properties?.['name'] ?? feat.properties?.['NAME'] ?? null,
          confidence: 0.7,
        }
      }
    }

    return { dataValue: value, featureId: null, featureName: null, confidence: 0 }
  })
}
