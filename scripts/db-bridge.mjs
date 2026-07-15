// DB köprüsü — GitHub Actions runner'ında çalışır (sandbox Supabase'e
// erişemiyor). PostgREST + service (secret) anahtarı ile katalog denetler,
// sohbet gönderimini teşhis eder ve sonucu scripts/db-out.json'a yazar.
// Anahtar env'den gelir (SUPABASE_URL, SUPABASE_SECRET); ASLA loglanmaz.
//
// Kullanım: node scripts/db-bridge.mjs <mode>
//   mode=audit  → katalog + sohbet teşhisi (varsayılan)
//   mode=patch  → scripts/db-patch.json içindeki güncellemeleri uygular

import { readFile, writeFile } from "node:fs/promises";

const URL = process.env.SUPABASE_URL;
const SECRET = process.env.SUPABASE_SECRET;
const MODE = process.argv[2] || "audit";
if (!URL || !SECRET) {
  console.error("Missing SUPABASE_URL / SUPABASE_SECRET");
  process.exit(1);
}
const REST = `${URL.replace(/\/$/, "")}/rest/v1`;
const H = {
  apikey: SECRET,
  Authorization: `Bearer ${SECRET}`,
  "Content-Type": "application/json",
};

async function getAll(path, select) {
  const out = [];
  const PAGE = 1000;
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(`${REST}/${path}?select=${select}`, {
      headers: { ...H, Range: `${from}-${from + PAGE - 1}`, "Range-Unit": "items" },
    });
    if (!res.ok) throw new Error(`GET ${path} ${res.status} ${await res.text()}`);
    const batch = await res.json();
    out.push(...batch);
    if (batch.length < PAGE) break;
  }
  return out;
}

function emptySize(p) {
  const s = (p.size_text ?? "").toString().trim();
  return s === "" || s === "-";
}

async function audit() {
  const products = await getAll(
    "products",
    "id,name,brand,category_slug,subcategory_slug,size_text,unit,sold_by_weight,weight_min_grams,is_active,price,image_url,details",
  );
  const active = products.filter((p) => p.is_active);
  const byCat = {};
  for (const p of active) {
    const c = (byCat[p.category_slug] ??= { total: 0, noSize: 0, noImg: 0 });
    c.total++;
    if (emptySize(p) && !p.sold_by_weight) c.noSize++;
    if (!p.image_url) c.noImg++;
  }
  // Gramajı boş (ve gram bazlı olmayan) aktif ürünler — doldurulacaklar.
  const missingSize = active
    .filter((p) => emptySize(p) && !p.sold_by_weight)
    .map((p) => ({
      id: p.id,
      name: p.name,
      brand: p.brand,
      category_slug: p.category_slug,
      unit: p.unit,
    }));
  // Şarküteri-et marka dağılımı (placeholder tespiti için).
  const sarkBrands = {};
  for (const p of active.filter((p) => p.category_slug === "sarkuteri-et")) {
    const b = (p.brand ?? "").trim() || "(boş)";
    sarkBrands[b] = (sarkBrands[b] ?? 0) + 1;
  }
  // Placeholder adayları: markası boş VEYA fiyatı 0/null olan aktif ürünler.
  const placeholders = active
    .filter((p) => !(p.brand ?? "").trim() || !p.price || p.price <= 0)
    .map((p) => ({ id: p.id, name: p.name, brand: p.brand, category_slug: p.category_slug, price: p.price }));

  // --- Sohbet teşhisi ---
  const chat = { sessions: 0, messages: 0, testInsert: null };
  try {
    const sess = await fetch(`${REST}/chat_sessions?select=id&order=created_at.desc&limit=1`, { headers: H });
    const sessRows = sess.ok ? await sess.json() : [];
    const cr = sess.headers.get("content-range");
    chat.sessions = cr ? cr.split("/").pop() : sessRows.length;
    let sid = sessRows[0]?.id;
    let createdSession = false;
    if (!sid) {
      const mk = await fetch(`${REST}/chat_sessions`, {
        method: "POST",
        headers: { ...H, Prefer: "return=representation" },
        body: JSON.stringify({ visitor_name: "__bridge__" }),
      });
      if (mk.ok) { sid = (await mk.json())[0].id; createdSession = true; }
      else chat.testInsert = `session create failed: ${mk.status} ${await mk.text()}`;
    }
    if (sid && chat.testInsert === null) {
      const ins = await fetch(`${REST}/chat_messages`, {
        method: "POST",
        headers: { ...H, Prefer: "return=representation" },
        body: JSON.stringify({ session_id: sid, sender: "visitor", content: "__bridge_test__" }),
      });
      if (ins.ok) {
        chat.testInsert = "OK";
        const row = (await ins.json())[0];
        await fetch(`${REST}/chat_messages?id=eq.${row.id}`, { method: "DELETE", headers: H });
      } else {
        chat.testInsert = `message insert FAILED: ${ins.status} ${await ins.text()}`;
      }
    }
    if (createdSession && sid) {
      await fetch(`${REST}/chat_sessions?id=eq.${sid}`, { method: "DELETE", headers: H });
    }
  } catch (e) {
    chat.testInsert = `exception: ${e.message}`;
  }

  // Şarküteri-et tam örnek satırlar (gramaj/details teşhisi).
  const detailKeys = ["icindekiler", "besin_degerleri", "uretici", "net_miktar", "gramaj", "saklama", "mensei"];
  const sarkSample = active
    .filter((p) => p.category_slug === "sarkuteri-et")
    .map((p) => {
      const det = p.details || {};
      const filled = {};
      for (const k of Object.keys(det)) {
        const v = det[k];
        filled[k] = v == null || (typeof v === "string" && !v.trim()) ? "EMPTY" : "ok";
      }
      return {
        name: p.name, brand: p.brand, size_text: p.size_text,
        sold_by_weight: p.sold_by_weight, weight_min_grams: p.weight_min_grams,
        detailKeys: Object.keys(det), detailFilled: filled,
      };
    });
  // details tamamlanma sayacı (şarküteri).
  const detStats = {};
  for (const p of active.filter((p) => p.category_slug === "sarkuteri-et")) {
    const det = p.details || {};
    for (const k of new Set([...detailKeys, ...Object.keys(det)])) {
      const v = det[k];
      const ok = v != null && !(typeof v === "string" && !v.trim());
      const s = (detStats[k] ??= { ok: 0, empty: 0, absent: 0 });
      if (!(k in det)) s.absent++;
      else if (ok) s.ok++;
      else s.empty++;
    }
  }
  // size_text değer histogramı (en sık 30).
  const sizeHist = {};
  for (const p of active) sizeHist[p.size_text ?? "(null)"] = (sizeHist[p.size_text ?? "(null)"] ?? 0) + 1;
  const topSizes = Object.entries(sizeHist).sort((a, b) => b[1] - a[1]).slice(0, 30);

  const summary = {
    productsTotal: products.length,
    activeTotal: active.length,
    byCategory: byCat,
    missingSizeCount: missingSize.length,
    placeholderCount: placeholders.length,
    sarkBrands,
    sarkDetailStats: detStats,
    topSizes,
    chat,
  };
  // TÜM aktif şarküteri ürünleri — gramaj/detay doldurma için tam liste.
  const sarkAll = active
    .filter((p) => p.category_slug === "sarkuteri-et")
    .map((p) => {
      const det = p.details || {};
      const val = (k) => {
        const v = det[k];
        return v == null || (typeof v === "string" && !v.trim()) ? null : v;
      };
      return {
        id: p.id, name: p.name, brand: p.brand, size_text: p.size_text,
        sold_by_weight: p.sold_by_weight,
        net_miktar: val("net_miktar"),
        besin100: val("besin100") ? "ok" : null,
        icindekiler: val("icindekiler") ? "ok" : null,
        uretici: val("uretici") ? "ok" : null,
        hasDetails: Object.keys(det).length > 0,
      };
    });
  await writeFile(
    "scripts/db-out.json",
    JSON.stringify({ summary, sarkAll }, null, 2),
  );
  console.log("=== AUDIT SUMMARY ===");
  console.log(JSON.stringify(summary, null, 2));
}

async function patch() {
  const ops = JSON.parse(await readFile("scripts/db-patch.json", "utf8"));
  let ok = 0, fail = 0;
  const errors = [];
  for (const op of ops) {
    let body = op.patch;
    // mergeDetails: mevcut details JSON'ını çek, verilen anahtarları ekle/üzerine
    // yaz (diğer alanlar korunur), tam objeyi geri yaz.
    if (op.mergeDetails) {
      const cur = await fetch(`${REST}/products?id=eq.${op.id}&select=details`, { headers: H });
      const row = cur.ok ? (await cur.json())[0] : null;
      const merged = { ...(row?.details || {}) };
      for (const [k, v] of Object.entries(op.mergeDetails)) {
        if (v !== null && v !== undefined && !(typeof v === "string" && !v.trim())) merged[k] = v;
      }
      body = { details: merged };
    }
    const res = await fetch(`${REST}/products?id=eq.${op.id}`, {
      method: "PATCH",
      headers: { ...H, Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });
    if (res.ok) ok++;
    else { fail++; if (errors.length < 20) errors.push(`${op.id}: ${res.status} ${await res.text()}`); }
  }
  const report = { applied: ok, failed: fail, errors };
  await writeFile("scripts/db-out.json", JSON.stringify(report, null, 2));
  console.log("=== PATCH REPORT ===");
  console.log(JSON.stringify(report, null, 2));
}

if (MODE === "patch") await patch();
else await audit();
