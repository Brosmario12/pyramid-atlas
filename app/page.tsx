"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { BarChart3, Globe2, Mountain, Route } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { buildDistanceMatrix } from "@/lib/geo";
import type { Pyramid } from "@/lib/types";

const PyramidMap = dynamic(() => import("@/components/pyramid-map"), {
  ssr: false,
});

export default function Home() {
  const [pyramids, setPyramids] = useState<Pyramid[]>([]);
  const [selectedCountry, setSelectedCountry] = useState("Todos");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pyramids")
      .then((response) => response.json())
      .then((data: Pyramid[]) => {
        setPyramids(data);
        setSelectedId(data[0]?.id ?? null);
      });
  }, []);

  const countries = useMemo(
    () => ["Todos", ...Array.from(new Set(pyramids.map((item) => item.country)))],
    [pyramids],
  );

  const filteredPyramids = useMemo(
    () =>
      selectedCountry === "Todos"
        ? pyramids
        : pyramids.filter((item) => item.country === selectedCountry),
    [pyramids, selectedCountry],
  );

  const selectedPyramid =
    filteredPyramids.find((item) => item.id === selectedId) ??
    filteredPyramids[0] ??
    null;

  const distances = useMemo(
    () => buildDistanceMatrix(filteredPyramids),
    [filteredPyramids],
  );

  const countryChart = useMemo(() => {
    const countByCountry = new Map<string, number>();
    pyramids.forEach((item) => {
      countByCountry.set(item.country, (countByCountry.get(item.country) ?? 0) + 1);
    });

    return Array.from(countByCountry.entries()).map(([country, count]) => ({
      country,
      count,
    }));
  }, [pyramids]);

  return (
    <main className="atlas-shell">
      <header className="topbar">
        <div>
          <p>Atlas global</p>
          <h1>Pyramid Atlas</h1>
        </div>
        <div className="metric-row">
          <span>
            <Globe2 size={16} />
            {pyramids.length} sitios
          </span>
          <span>
            <Mountain size={16} />
            {countries.length - 1} paises
          </span>
        </div>
      </header>

      <section className="toolbar">
        <label>
          Pais
          <select
            value={selectedCountry}
            onChange={(event) => {
              setSelectedCountry(event.target.value);
              setSelectedId(null);
            }}
          >
            {countries.map((country) => (
              <option key={country}>{country}</option>
            ))}
          </select>
        </label>
      </section>

      <section className="main-grid">
        <div className="map-panel">
          <PyramidMap
            pyramids={filteredPyramids}
            selectedId={selectedPyramid?.id ?? null}
            onSelect={setSelectedId}
          />
        </div>

        <aside className="detail-panel">
          {selectedPyramid ? (
            <>
              <Image
                src={selectedPyramid.imageUrl}
                alt={selectedPyramid.name}
                width={900}
                height={600}
                className="detail-image"
              />
              <div className="detail-copy">
                <p>{selectedPyramid.country}</p>
                <h2>{selectedPyramid.name}</h2>
                <dl>
                  <div>
                    <dt>Civilizacion</dt>
                    <dd>{selectedPyramid.civilization}</dd>
                  </div>
                  <div>
                    <dt>Periodo</dt>
                    <dd>{selectedPyramid.period}</dd>
                  </div>
                  <div>
                    <dt>Altura</dt>
                    <dd>
                      {selectedPyramid.heightMeters
                        ? `${selectedPyramid.heightMeters} m`
                        : "Sin dato"}
                    </dd>
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
            <BarChart3 size={18} />
            <h2>Sitios por pais</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={countryChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#1f7a8c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="analytics-panel">
          <div className="panel-heading">
            <Route size={18} />
            <h2>Distancias mas cortas</h2>
          </div>
          <div className="distance-list">
            {distances.slice(0, 6).map((distance) => {
              const from = filteredPyramids.find(
                (item) => item.id === distance.fromId,
              );
              const to = filteredPyramids.find(
                (item) => item.id === distance.toId,
              );

              return (
                <div key={`${distance.fromId}-${distance.toId}`}>
                  <span>
                    {from?.name} a {to?.name}
                  </span>
                  <strong>{distance.kilometers} km</strong>
                </div>
              );
            })}
          </div>
        </article>
      </section>
    </main>
  );
}
