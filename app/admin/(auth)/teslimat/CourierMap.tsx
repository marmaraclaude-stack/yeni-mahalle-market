"use client";

// Canlı kurye haritası — Leaflet + OpenStreetMap (API anahtarı gerekmez).
// Market konumu + teslimat çevresi (daire) + her kurye farklı renk pin.
// Yalnız client'ta yüklenir (DeliveryTracker'da dynamic ssr:false).

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export interface MapCourier {
  id: string;
  name: string;
  lat: number;
  lng: number;
  color: string;
  lastLoc: string | null;
}

function esc(s: string): string {
  return s.replace(/[&<>"]/g, (c) =>
    c === "&" ? "&amp;" : c === "<" ? "&lt;" : c === ">" ? "&gt;" : "&quot;",
  );
}

function courierIcon(color: string, name: string): L.DivIcon {
  const initial = esc(name.trim().charAt(0).toUpperCase() || "?");
  return L.divIcon({
    className: "cmCourierIcon",
    html: `<div style="width:32px;height:32px;border-radius:50%;background:${color};border:3px solid #fff;box-shadow:0 3px 9px rgba(0,0,0,.4);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:13px;font-family:system-ui,sans-serif;">${initial}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

const marketIcon = L.divIcon({
  className: "cmMarketIcon",
  html: `<div style="width:38px;height:38px;border-radius:11px;background:#111;border:3px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;font-size:18px;">🏪</div>`,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
});

export interface MapOrder {
  no: string;
  customer: string;
  lat: number;
  lng: number;
}

const orderIcon = (no: string) =>
  L.divIcon({
    className: "",
    html: `<div style="display:flex;align-items:center;gap:5px;background:#fff;border:2px solid #ff5a1f;border-radius:10px;padding:3px 8px;box-shadow:0 3px 9px rgba(0,0,0,.25);font-family:system-ui,sans-serif;font-size:11px;font-weight:800;color:#c43e0c;white-space:nowrap;">\uD83D\uDCE6 ${no}</div>`,
    iconSize: [0, 0],
    iconAnchor: [40, 14],
  });

export default function CourierMap({
  market,
  couriers,
  orders = [],
}: {
  market: { lat: number; lng: number };
  couriers: MapCourier[];
  /** Kurye konumu bilinen yoldaki siparişler: haritada etiketle gösterilir. */
  orders?: MapOrder[];
}) {
  const boxRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  // Haritayı bir kez kur (market + tile + çevre dairesi).
  useEffect(() => {
    if (!boxRef.current || mapRef.current) return;
    const map = L.map(boxRef.current, {
      zoomControl: true,
      attributionControl: true,
    }).setView([market.lat, market.lng], 14);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "&copy; OpenStreetMap",
    }).addTo(map);
    L.marker([market.lat, market.lng], {
      icon: marketIcon,
      title: "Market",
      zIndexOffset: 1000,
    })
      .addTo(map)
      .bindPopup("<b>Yeni Mahalle Market</b>");
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;
    setTimeout(() => map.invalidateSize(), 200);
    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [market.lat, market.lng]);

  // Kurye pinlerini güncelle + görünümü sığdır.
  useEffect(() => {
    const map = mapRef.current;
    const layer = layerRef.current;
    if (!map || !layer) return;
    layer.clearLayers();
    const pts: L.LatLngExpression[] = [[market.lat, market.lng]];
    for (const c of couriers) {
      L.marker([c.lat, c.lng], { icon: courierIcon(c.color, c.name), title: c.name })
        .bindPopup(`<b>${esc(c.name)}</b>`)
        .addTo(layer);
      pts.push([c.lat, c.lng]);
    }
    for (const o of orders) {
      L.marker([o.lat, o.lng], { icon: orderIcon(o.no), title: o.no })
        .bindPopup(`<b>${esc(o.no)}</b><br/>${esc(o.customer)}`)
        .addTo(layer);
      pts.push([o.lat, o.lng]);
    }
    if (pts.length > 1) {
      map.fitBounds(L.latLngBounds(pts).pad(0.35), { maxZoom: 16 });
    } else {
      map.setView([market.lat, market.lng], 14);
    }
  }, [couriers, orders, market.lat, market.lng]);

  return <div ref={boxRef} style={{ width: "100%", height: "100%" }} />;
}
