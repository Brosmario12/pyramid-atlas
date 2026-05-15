import type { BusRoute, RouteKind } from "./types";

type AnchorKey =
  | "northwest"
  | "north"
  | "northeast"
  | "west"
  | "center"
  | "east"
  | "southwest"
  | "south"
  | "southeast"
  | "farWest"
  | "farNorth"
  | "farEast";

const anchors: Record<AnchorKey, [number, number]> = {
  farNorth: [17.156, -96.762],
  northwest: [17.108, -96.755],
  north: [17.099, -96.731],
  northeast: [17.098, -96.692],
  farWest: [17.075, -96.791],
  west: [17.071, -96.753],
  center: [17.061, -96.725],
  east: [17.06, -96.694],
  southwest: [17.026, -96.755],
  south: [17.019, -96.724],
  southeast: [17.023, -96.69],
  farEast: [17.075, -96.635],
};

const palette = [
  "#0f766e",
  "#c2410c",
  "#2563eb",
  "#be123c",
  "#7c3aed",
  "#15803d",
  "#b45309",
  "#0891b2",
];

const routeKind = (code: string): RouteKind => {
  if (code.startsWith("RT")) return "Troncal";
  if (code.startsWith("RC")) return "Complementaria";
  return "Alimentadora";
};

const buildPath = (from: AnchorKey, to: AnchorKey): [number, number][] => [
  anchors[from],
  [
    Number(((anchors[from][0] + anchors.center[0]) / 2).toFixed(4)),
    Number(((anchors[from][1] + anchors.center[1]) / 2).toFixed(4)),
  ],
  anchors.center,
  [
    Number(((anchors[to][0] + anchors.center[0]) / 2).toFixed(4)),
    Number(((anchors[to][1] + anchors.center[1]) / 2).toFixed(4)),
  ],
  anchors[to],
];

const officialRoutes = [
  ["RT-01", "Kayaal", "Yuroo Viguera", "Yuroo Xoxocotlan", "northwest", "south"],
  ["RA-03", "Ladxido", "Yuroo Parque del Amor", "Camino a Huayapam", "west", "east"],
  ["RC-05", "Xuujx", "Viguera / Los Angeles", "Jardin Madero", "northwest", "center"],
  ["RC-06", "Mondok", "San Jacinto Amilpas", "Camino a Huayapam", "west", "east"],
  ["RC-09", "Kitsian Jan", "Colonia Bugambilias", "Fracc. El Rosario", "north", "southeast"],
  ["RC-10", "Kaimo", "Manzana L", "Animas Trujano", "southwest", "southeast"],
  ["RC-11", "Ma", "La Raya / Aeropuerto", "Modulo Azul", "south", "west"],
  ["RC-12", "Nunda", "Tlalixtac de Cabrera", "Yuroo Parque del Amor", "farEast", "west"],
  ["RC-14", "Laba", "Yuroo Viguera", "San Sebastian Tutla", "northwest", "east"],
  ["RA-15", "Xra", "Colonia Monte Alban", "Santo Domingo Tomaltepec", "west", "farEast"],
  ["RC-15", "Yu Ngta", "Hospital de la Mujer", "Modulo Azul", "south", "west"],
  ["RA-17", "Bakku Nunni", "Monte Alban", "Simbolos Patrios", "farWest", "south"],
  ["RA-18", "Navee", "Yuroo Viguera", "Centro de Rehabilitacion DIF", "northwest", "southwest"],
  ["RA-11", "Tuchi", "Montoya", "Colonia Jardin", "west", "north"],
  ["RA-14", "Poj", "Montoya", "Fracc. El Rosario", "west", "southeast"],
  ["RA-01", "Jnon", "Esquipulas", "Central de Abastos", "southwest", "center"],
  ["RA-07", "Uxacha", "Guadalupe Victoria", "Colonia Moctezuma", "north", "northeast"],
  ["RA-16", "Rinin", "Colonia Guelaguetza", "Plaza del Valle", "northwest", "south"],
  ["RC-08", "Ruja", "Colonia Jardin", "Colonia Heladio Ramirez Lopez", "north", "northwest"],
  ["RA-02", "Mo", "Santa Maria Atzompa", "Guadalupe Victoria", "farWest", "north"],
  ["RA-13", "Waxin", "Parque del Amor", "San Luis Beltran", "west", "east"],
  ["RC-13", "Yuku Tay", "Hospital ISSSTE", "Base CRIT", "north", "southwest"],
  ["RA-06", "Wagul", "San Martin Mexicapam", "Primera Etapa", "west", "southeast"],
  ["RA-08", "Koo", "Agencia Donaji", "Colonia Satelite", "northeast", "farNorth"],
  ["RC-01", "Dugue", "Pueblo Nuevo La Joya", "Agencia Donaji", "northwest", "northeast"],
  ["RA-12", "Najme", "Colonia La Soledad", "Primera Etapa", "southwest", "southeast"],
  ["RA-04", "Naa", "Monumento a la Madre", "Santa Cruz Amilpas", "west", "east"],
  ["RC-04", "Atlantekomatl", "Fracc. Benito Juarez", "Plaza del Valle", "southwest", "south"],
  ["RC-02", "Fane Kantsini", "Viguera", "Primera Etapa", "northwest", "southeast"],
  ["RA-09", "Moog", "Fracc. Los Alamos", "Panteon Jardin", "northeast", "north"],
  ["RA-05", "Guie", "Colonia Jardin", "Anahuac", "north", "southwest"],
  ["RC-03", "Nisa", "San Felipe del Agua", "Plaza del Valle", "north", "south"],
  ["RA-10", "Tza Tok", "La Cuevita", "Fracc. El Rosario 5a Etapa", "southwest", "southeast"],
  ["RA-19", "Nanda", "Yuroo Viguera", "Huitzo", "northwest", "farNorth"],
  ["RC-07", "Vitu Vii", "Colonia Monte Bello", "Monumento a Juarez", "north", "south"],
] as const;

export const fallbackRoutes: BusRoute[] = officialRoutes.map(
  ([code, name, origin, destination, from, to], index) => ({
    id: code.toLowerCase(),
    code,
    name,
    kind: routeKind(code),
    origin,
    destination,
    color: palette[index % palette.length],
    path: buildPath(from, to),
  }),
);

export const routeKinds: RouteKind[] = [
  "Troncal",
  "Complementaria",
  "Alimentadora",
];
