"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { BusRoute, VehiclePosition } from "@/lib/types";

type TransitMapProps = {
  routes: BusRoute[];
  selectedRouteId: string | null;
  vehicles: VehiclePosition[];
  onSelectRoute: (id: string) => void;
};

export default function TransitMap({
  routes,
  selectedRouteId,
  vehicles,
  onSelectRoute,
}: TransitMapProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const routesRef = useRef<L.LayerGroup | null>(null);
  const vehiclesRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!elementRef.current || mapRef.current) return;

    const map = L.map(elementRef.current, {
      center: [17.061, -96.725],
      zoom: 12,
      minZoom: 10,
      scrollWheelZoom: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    mapRef.current = map;
    routesRef.current = L.layerGroup().addTo(map);
    vehiclesRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      routesRef.current = null;
      vehiclesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!routesRef.current || !mapRef.current) return;

    routesRef.current.clearLayers();

    routes.forEach((route) => {
      const selected = route.id === selectedRouteId;
      const polyline = L.polyline(route.path, {
        color: route.color,
        weight: selected ? 7 : 4,
        opacity: selected ? 1 : 0.55,
      }).addTo(routesRef.current!);

      polyline.on("click", () => onSelectRoute(route.id));
      polyline.bindTooltip(`${route.code} ${route.name}`, { sticky: true });
    });

    const selectedRoute = routes.find((route) => route.id === selectedRouteId);
    if (selectedRoute) {
      mapRef.current.fitBounds(selectedRoute.path, { padding: [32, 32] });
    }
  }, [routes, selectedRouteId, onSelectRoute]);

  useEffect(() => {
    if (!vehiclesRef.current) return;
    vehiclesRef.current.clearLayers();

    vehicles.forEach((vehicle) => {
      L.circleMarker([vehicle.latitude, vehicle.longitude], {
        radius: 7,
        color: "#0f172a",
        fillColor: "#facc15",
        fillOpacity: 1,
        weight: 2,
      })
        .bindTooltip(`Unidad ${vehicle.id}`)
        .addTo(vehiclesRef.current!);
    });
  }, [vehicles]);

  return <div className="map" ref={elementRef} />;
}
