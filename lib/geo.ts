import type { Pyramid, PyramidDistance } from "./types";

const EARTH_RADIUS_KM = 6371.0088;

const toRadians = (value: number) => (value * Math.PI) / 180;

export function haversineDistanceKm(
  from: Pick<Pyramid, "latitude" | "longitude">,
  to: Pick<Pyramid, "latitude" | "longitude">,
) {
  const dLat = toRadians(to.latitude - from.latitude);
  const dLon = toRadians(to.longitude - from.longitude);
  const lat1 = toRadians(from.latitude);
  const lat2 = toRadians(to.latitude);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;

  return EARTH_RADIUS_KM * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function buildDistanceMatrix(pyramids: Pyramid[]): PyramidDistance[] {
  const result: PyramidDistance[] = [];

  for (let index = 0; index < pyramids.length; index += 1) {
    for (let next = index + 1; next < pyramids.length; next += 1) {
      result.push({
        fromId: pyramids[index].id,
        toId: pyramids[next].id,
        kilometers: Number(
          haversineDistanceKm(pyramids[index], pyramids[next]).toFixed(1),
        ),
      });
    }
  }

  return result.sort((a, b) => a.kilometers - b.kilometers);
}
