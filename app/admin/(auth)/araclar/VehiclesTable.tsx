"use client";

// Araç tablosu — üstte "Yeni Araç" collapse formu, satırlarda ad/plaka
// düzenleme, kurye atama (select), cihaz linki (kopyala), son sinyal,
// aktif/pasif ve confirm'li silme. Kuryeler tablosuyla aynı dil.

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Bike, Check, Copy, Plus, X } from "lucide-react";
import {
  createVehicle,
  deleteVehicle,
  toggleVehicle,
  updateVehicle,
} from "@/lib/shop/admin-actions";
import type { Vehicle } from "@/lib/shop/types";
import styles from "../../admin.module.css";

interface VehicleRow extends Vehicle {
  ingestUrl: string;
}
interface CourierOpt {
  id: string;
  name: string;
}

function agoText(iso: string | null): string {
  if (!iso) return "sinyal yok";
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins <= 0) return "az önce";
  if (mins < 60) return `${mins} dk önce`;
  const h = Math.floor(mins / 60);
  return h < 24 ? `${h} sa önce` : `${Math.floor(h / 24)} gün önce`;
}

function VehicleRowView({
  vehicle,
  couriers,
}: {
  vehicle: VehicleRow;
  couriers: CourierOpt[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState(vehicle.name);
  const [plate, setPlate] = useState(vehicle.plate);
  const [courierId, setCourierId] = useState(vehicle.courier_id ?? "");
  const [copied, setCopied] = useState(false);
  const [, startTransition] = useTransition();

  const dirty =
    name.trim() !== vehicle.name ||
    plate.trim() !== vehicle.plate ||
    (courierId || null) !== (vehicle.courier_id ?? null);

  function save() {
    if (!name.trim()) {
      window.alert("Araç adı boş olamaz.");
      return;
    }
    setBusy(true);
    startTransition(async () => {
      try {
        const res = await updateVehicle(vehicle.id, {
          name: name.trim(),
          plate: plate.trim(),
          courier_id: courierId || null,
        });
        if (!res.ok) window.alert(res.error ?? "Araç güncellenemedi.");
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function toggle() {
    setBusy(true);
    startTransition(async () => {
      try {
        const res = await toggleVehicle(vehicle.id, !vehicle.is_active);
        if (!res.ok) window.alert(res.error ?? "Araç güncellenemedi.");
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function remove() {
    if (!window.confirm(`"${vehicle.name}" aracı kalıcı olarak silinsin mi?`)) return;
    setBusy(true);
    startTransition(async () => {
      try {
        const res = await deleteVehicle(vehicle.id);
        if (!res.ok) window.alert(res.error ?? "Araç silinemedi.");
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  function copy() {
    navigator.clipboard
      .writeText(vehicle.ingestUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
      })
      .catch(() => undefined);
  }

  const hasSignal = vehicle.last_at != null;

  return (
    <tr className={vehicle.is_active ? "" : styles.rowInactive}>
      <td data-label="Araç">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={60}
          disabled={busy}
          className={styles.inputSm}
          aria-label={`${vehicle.name} araç adı`}
        />
      </td>
      <td data-label="Plaka">
        <input
          value={plate}
          onChange={(e) => setPlate(e.target.value)}
          maxLength={20}
          placeholder="—"
          disabled={busy}
          className={styles.inputSm}
          style={{ width: 110 }}
          aria-label={`${vehicle.name} plakası`}
        />
      </td>
      <td data-label="Kurye">
        <select
          value={courierId}
          onChange={(e) => setCourierId(e.target.value)}
          disabled={busy}
          className={styles.select}
          aria-label={`${vehicle.name} kurye ataması`}
        >
          <option value="">Atanmadı</option>
          {couriers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </td>
      <td data-label="Son sinyal">
        <span
          className={`${styles.pill} ${hasSignal ? styles["pill--ok"] : ""}`}
        >
          {agoText(vehicle.last_at)}
        </span>
      </td>
      <td data-label="Cihaz linki">
        <div className={styles.vehicleUrlCell}>
          <input
            type="text"
            readOnly
            value={vehicle.ingestUrl}
            onFocus={(e) => e.currentTarget.select()}
            className={styles.vehicleUrl}
            aria-label={`${vehicle.name} cihaz linki`}
          />
          <button
            type="button"
            onClick={copy}
            className={styles.btnRow}
            aria-label={`${vehicle.name} cihaz linkini kopyala`}
          >
            {copied ? <Check size={13} aria-hidden /> : <Copy size={13} aria-hidden />}
            {copied ? "Kopyalandı" : "Kopyala"}
          </button>
        </div>
      </td>
      <td data-label="İşlem">
        <div className={styles.cellActions}>
          <button
            type="button"
            onClick={save}
            disabled={!dirty || busy}
            className={`${styles.btnRow} ${dirty ? styles["btnRow--primary"] : ""}`}
          >
            {busy ? "…" : dirty ? "Kaydet" : "Kayıtlı"}
          </button>
          <button
            type="button"
            onClick={toggle}
            disabled={busy}
            className={`${styles.btnRow} ${vehicle.is_active ? styles["btnRow--on"] : ""}`}
          >
            {vehicle.is_active ? "Aktif" : "Pasif"}
          </button>
          <button
            type="button"
            onClick={remove}
            disabled={busy}
            className={`${styles.btnRow} ${styles["btnRow--danger"]}`}
          >
            Sil
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function VehiclesTable({
  vehicles,
  couriers,
}: {
  vehicles: VehicleRow[];
  couriers: CourierOpt[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [busy, setBusy] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [, startTransition] = useTransition();

  function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const plate = String(fd.get("plate") ?? "").trim();
    if (name.length < 2) {
      setFormError("Araç adı en az 2 karakter olmalı.");
      return;
    }
    setFormError(null);
    setBusy(true);
    startTransition(async () => {
      try {
        const res = await createVehicle(name, plate);
        if (!res.ok) {
          setFormError(res.error ?? "Araç eklenemedi.");
          return;
        }
        form.reset();
        setShowForm(false);
        router.refresh();
      } finally {
        setBusy(false);
      }
    });
  }

  return (
    <>
      <div className={styles.toolbar}>
        <div />
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className={styles.btnLg}
          aria-expanded={showForm}
        >
          {showForm ? (
            <X size={15} strokeWidth={2.4} aria-hidden />
          ) : (
            <Plus size={15} strokeWidth={2.4} aria-hidden />
          )}
          {showForm ? "Formu Kapat" : "Yeni Araç"}
        </button>
      </div>

      {showForm && (
        <section className={styles.panel} style={{ marginBottom: 16 }}>
          <h2 className={styles.panelTitle}>Yeni Araç Ekle</h2>
          <form onSubmit={handleCreate} className={styles.couponForm}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="arac-name">
                Araç adı *
              </label>
              <input
                id="arac-name"
                name="name"
                required
                placeholder="Motor 1"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="arac-plate">
                Plaka
              </label>
              <input
                id="arac-plate"
                name="plate"
                placeholder="54 ABC 123"
                className={styles.input}
                autoComplete="off"
              />
            </div>
            <div className={styles.couponFormSubmit}>
              <button type="submit" disabled={busy} className={styles.accentBtn}>
                {busy ? "Ekleniyor…" : "Araç Ekle"}
              </button>
            </div>
          </form>
          {formError && <p className={styles.formError}>{formError}</p>}
        </section>
      )}

      {vehicles.length === 0 ? (
        <div className={styles.empty}>
          <Bike size={22} aria-hidden style={{ opacity: 0.4 }} />
          <br />
          Henüz araç yok. &quot;Yeni Araç&quot; ile motorlarınızı ekleyin; her
          araca özel GPS cihaz linki burada oluşur.
        </div>
      ) : (
        <div className={styles.tableCard}>
          <div className={styles.tableScroll}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Araç</th>
                  <th>Plaka</th>
                  <th>Kurye</th>
                  <th>Son Sinyal</th>
                  <th>Cihaz Linki</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((v) => (
                  <VehicleRowView key={v.id} vehicle={v} couriers={couriers} />
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}
