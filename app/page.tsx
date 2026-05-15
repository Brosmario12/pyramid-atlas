"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useState } from "react";
import { BusFront, MapPinned, Radio, Route } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { routeKinds } from "@/lib/binnibus";
import type { BusRoute, RouteKind, VehiclePosition } from "@/lib/types";

const TransitMap = dynamic(() => import("@/components/transit-map"), {
  ssr: false,
});

export default function Home() {
  const [routes, setRoutes] = useState<BusRoute[]>([]);
  const [vehicles, setVehicles] = useState<VehiclePosition[]>([]);
  const [selectedKind, setSelectedKind] = useState<RouteKind | "Todas">("Todas");
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/routes")
      .then((response) => response.json())
      .then((data: BusRoute[]) => {
        setRoutes(data);
        setSelectedRouteId(data[0]?.id ?? null);
      });
  }, []);

  useEffect(() => {
    const loadVehicles = () =>
      fetch("/api/vehicles")
        .then((response) => response.json())
        .then((data: VehiclePosition[]) => setVehicles(data))
        .catch(() => setVehicles([]));

    loadVehicles();
    const interval = window.setInterval(loadVehicles, 15000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredRoutes = useMemo(
    () =>
      selectedKind === "Todas"
        ? routes
        : routes.filter((route) => route.kind === selectedKind),
    [routes, selectedKind],
  );

  const selectedRoute =
    filteredRoutes.find((route) => route.id === selectedRouteId) ??
    filteredRoutes[0] ??
    null;

  const routeChart = useMemo(() => {
    const countByKind = new Map<RouteKind, number>();
    routes.forEach((route) => {
      countByKind.set(route.kind, (countByKind.get(route.kind) ?? 0) + 1);
    });

    return routeKinds.map((kind) => ({
      kind,
      count: countByKind.get(kind) ?? 0,
    }));
  }, [routes]);

  const visibleVehicles = useMemo(
    () =>
      selectedRoute
        ? vehicles.filter((vehicle) => vehicle.routeId === selectedRoute.id)
        : vehicles,
    [selectedRoute, vehicles],
  );

  const corridorList = useMemo(
    () =>
      filteredRoutes.map((route) => ({
        id: route.id,
        label: `${route.code} ${route.name}`,
        path: `${route.origin} - ${route.destination}`,
      })),
    [filteredRoutes],
  );

  return (
    <main className="transit-shell">
      <header className="topbar">
        <div>
          <p>Movilidad metropolitana</p>
          <h1>BinniBus Oaxaca</h1>
        </div>
        <div className="metric-row">
          <span>
            <Route size={16} />
            {routes.length} rutas
          </span>
          <span>
            <BusFront size={16} />
            {vehicles.length} unidades visibles
          </span>
        </div>
      </header>

      <section className="toolbar">
        <label>
          Tipo de ruta
          <select
            value={selectedKind}
            onChange={(event) => {
              setSelectedKind(event.target.value as RouteKind | "Todas");
              setSelectedRouteId(null);
            }}
          >
            <option>Todas</option>
            {routeKinds.map((kind) => (
              <option key={kind}>{kind}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="main-grid">
        <div className="map-panel">
          <TransitMap
            routes={filteredRoutes}
            selectedRouteId={selectedRoute?.id ?? null}
            vehicles={visibleVehicles}
            onSelectRoute={setSelectedRouteId}
          />
        </div>

        <aside className="detail-panel">
          {selectedRoute ? (
            <>
              <div className="route-chip" style={{ background: selectedRoute.color }} />
              <div className="detail-copy">
                <p>{selectedRoute.kind}</p>
                <h2>
                  {selectedRoute.code} {selectedRoute.name}
                </h2>
                <dl>
                  <div>
                    <dt>Origen</dt>
                    <dd>{selectedRoute.origin}</dd>
                  </div>
                  <div>
                    <dt>Destino</dt>
                    <dd>{selectedRoute.destination}</dd>
                  </div>
                  <div>
                    <dt>Unidades visibles</dt>
                    <dd>{visibleVehicles.length}</dd>
                  </div>
                </dl>
              </div>
            </>
          ) : null}
        </aside>
      </section>

      <section className="analytics-grid">
        <article className="analytics-panel">
          <div className="panel-heading">
            <MapPinned size={18} />
            <h2>Rutas por tipo</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={routeChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="kind" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#0f766e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="analytics-panel">
          <div className="panel-heading">
            <Radio size={18} />
            <h2>Corredores activos</h2>
          </div>
          <div className="route-list">
            {corridorList.map((route) => (
              <button
                key={route.id}
                className={route.id === selectedRoute?.id ? "active" : ""}
                onClick={() => setSelectedRouteId(route.id)}
              >
                <strong>{route.label}</strong>
                <span>{route.path}</span>
              </button>
            ))}
          </div>
        </article>
      </section>
    </main>
  );
}
