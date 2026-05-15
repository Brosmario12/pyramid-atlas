"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import type { Pyramid } from "@/lib/types";

type PyramidMapProps = {
  pyramids: Pyramid[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

export default function PyramidMap({
  pyramids,
  selectedId,
  onSelect,
}: PyramidMapProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!elementRef.current || mapRef.current) {
      return;
    }

    const map = L.map(elementRef.current, {
      center: [18, 10],
      zoom: 2,
      minZoom: 2,
      scrollWheelZoom: true,
    });

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "Tiles &copy; Esri",
      },
    ).addTo(map);

    mapRef.current = map;
    layerRef.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!layerRef.current) {
      return;
    }

    layerRef.current.clearLayers();

    pyramids.forEach((pyramid) => {
      const selected = pyramid.id === selectedId;
      L.circleMarker([pyramid.latitude, pyramid.longitude], {
        radius: selected ? 10 : 7,
        color: selected ? "#ffb703" : "#f8f9fa",
        fillColor: selected ? "#ffb703" : "#1f7a8c",
        fillOpacity: 0.95,
        weight: 2,
      })
        .bindPopup(pyramid.name)
        .on("click", () => onSelect(pyramid.id))
        .addTo(layerRef.current!);
    });
  }, [onSelect, pyramids, selectedId]);

  return <div ref={elementRef} className="map" />;
}
