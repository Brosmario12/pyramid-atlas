export type RouteKind = "Troncal" | "Complementaria" | "Alimentadora";

export type BusRoute = {
  id: string;
  code: string;
  name: string;
  kind: RouteKind;
  origin: string;
  destination: string;
  color: string;
  path: [number, number][];
};

export type VehiclePosition = {
  id: string;
  routeId: string;
  latitude: number;
  longitude: number;
  bearing?: number;
  updatedAt: string;
};
