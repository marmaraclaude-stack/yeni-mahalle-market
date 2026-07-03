// iyzico REST API v2 istemcisi — Checkout Form (Ödeme Formu).
// Yeni npm paketi YOK: çıplak fetch + node:crypto ile IYZWSv2 HmacSHA256 imzası.
// Env: IYZICO_API_KEY, IYZICO_SECRET_KEY, IYZICO_BASE_URL (ops., default sandbox).
// Anahtarlar yoksa isIyzicoConfigured() false döner — fonksiyonlar ÇAĞRILMAMALI.

import "server-only";
import { createHmac } from "node:crypto";

const CHECKOUT_INITIALIZE_PATH = "/payment/iyzipos/checkoutform/initialize/auth/ecom";
const CHECKOUT_RETRIEVE_PATH = "/payment/iyzipos/checkoutform/auth/ecom/detail";

function getBaseUrl(): string {
  return process.env.IYZICO_BASE_URL || "https://sandbox-api.iyzipay.com";
}

/** iyzico API anahtarları tanımlı mı? Değilse online ödeme seçeneği gizlenir. */
export function isIyzicoConfigured(): boolean {
  return Boolean(process.env.IYZICO_API_KEY && process.env.IYZICO_SECRET_KEY);
}

/**
 * IYZWSv2 Authorization başlığı (iyzico HmacSHA256 v2 imza şeması):
 *   signature = hex( HMACSHA256( randomKey + uriPath + requestBody, secretKey ) )
 *   authorization = "IYZWSv2 " + base64( "apiKey:KEY&randomKey:RND&signature:SIG" )
 */
function buildAuthorization(
  uriPath: string,
  requestBody: string,
): { authorization: string; randomKey: string } {
  const apiKey = process.env.IYZICO_API_KEY!;
  const secretKey = process.env.IYZICO_SECRET_KEY!;
  const randomKey =
    Date.now().toString() + Math.random().toString(36).slice(2, 10);

  const signature = createHmac("sha256", secretKey)
    .update(randomKey + uriPath + requestBody, "utf8")
    .digest("hex");

  const authorizationParams = [
    `apiKey:${apiKey}`,
    `randomKey:${randomKey}`,
    `signature:${signature}`,
  ];

  return {
    authorization:
      "IYZWSv2 " + Buffer.from(authorizationParams.join("&")).toString("base64"),
    randomKey,
  };
}

interface IyzicoBaseResponse {
  status: string; // "success" | "failure"
  errorCode?: string;
  errorMessage?: string;
}

async function iyzicoPost<T extends IyzicoBaseResponse>(
  uriPath: string,
  payload: Record<string, unknown>,
): Promise<T> {
  if (!isIyzicoConfigured()) {
    throw new Error("iyzico yapılandırılmamış (IYZICO_API_KEY / IYZICO_SECRET_KEY eksik).");
  }

  const body = JSON.stringify(payload);
  const { authorization, randomKey } = buildAuthorization(uriPath, body);

  const res = await fetch(getBaseUrl() + uriPath, {
    method: "POST",
    headers: {
      Authorization: authorization,
      "x-iyzi-rnd": randomKey,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body,
    cache: "no-store",
  });

  const json = (await res.json()) as T;
  if (!res.ok && !json.status) {
    throw new Error(`iyzico HTTP ${res.status}`);
  }
  return json;
}

/** Fiyatı iyzico'nun beklediği ondalık string biçimine çevir ("12.50"). */
function toPrice(value: number): string {
  return value.toFixed(2);
}

/** Telefonu +90XXXXXXXXXX biçimine getir. */
function toGsm(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  return "+90" + digits.slice(-10);
}

// --- Sipariş girdileri (order-actions tarafından beslenir) ---

export interface IyzicoOrderInput {
  orderNo: string;
  customerName: string;
  phone: string;
  addressLine: string;
  email: string; // misafirde placeholder e-posta kullanılır
  subtotal: number; // basketItems toplamına EŞİT olmalı
  total: number; // teslimat dahil tahsil edilecek tutar
  buyerIp: string;
}

export interface IyzicoBasketItemInput {
  id: string;
  name: string;
  category: string;
  lineTotal: number;
}

export interface IyzicoCheckoutInit {
  token: string;
  paymentPageUrl: string;
}

interface CheckoutInitResponse extends IyzicoBaseResponse {
  token?: string;
  paymentPageUrl?: string;
}

/** Checkout Form başlat → müşteri paymentPageUrl'e yönlendirilir. */
export async function initializeCheckoutForm(
  order: IyzicoOrderInput,
  items: IyzicoBasketItemInput[],
  callbackUrl: string,
): Promise<IyzicoCheckoutInit> {
  const [firstName, ...rest] = order.customerName.trim().split(/\s+/);
  const surname = rest.join(" ") || firstName;

  const address = {
    contactName: order.customerName,
    city: "Sakarya",
    country: "Turkey",
    address: order.addressLine,
  };

  const payload = {
    locale: "tr",
    conversationId: order.orderNo,
    price: toPrice(order.subtotal),
    paidPrice: toPrice(order.total),
    currency: "TRY",
    basketId: order.orderNo,
    paymentGroup: "PRODUCT",
    callbackUrl,
    buyer: {
      id: order.orderNo,
      name: firstName,
      surname,
      gsmNumber: toGsm(order.phone),
      email: order.email,
      // Misafir alışverişi — TCKN toplanmıyor, iyzico'nun kabul ettiği placeholder.
      identityNumber: "11111111111",
      registrationAddress: order.addressLine,
      ip: order.buyerIp,
      city: "Sakarya",
      country: "Turkey",
    },
    shippingAddress: address,
    billingAddress: address,
    basketItems: items.map((item) => ({
      id: item.id,
      name: item.name,
      category1: item.category,
      itemType: "PHYSICAL",
      price: toPrice(item.lineTotal),
    })),
  };

  const res = await iyzicoPost<CheckoutInitResponse>(
    CHECKOUT_INITIALIZE_PATH,
    payload,
  );

  if (res.status !== "success" || !res.token || !res.paymentPageUrl) {
    throw new Error(res.errorMessage || "iyzico ödeme formu başlatılamadı.");
  }

  return { token: res.token, paymentPageUrl: res.paymentPageUrl };
}

export interface IyzicoCheckoutResult {
  /** API çağrı durumu: "success" | "failure" */
  status: string;
  /** Ödeme durumu: "SUCCESS" | "FAILURE" ... — ödendi saymak için ikisine de bak. */
  paymentStatus: string;
  paymentId: string | null;
  /** iyzico'nun bildirdiği tahsil edilen tutar — sipariş toplamıyla karşılaştırılır. */
  paidPrice: number | null;
  errorMessage: string | null;
}

interface CheckoutRetrieveResponse extends IyzicoBaseResponse {
  paymentStatus?: string;
  paymentId?: string;
  paidPrice?: number | string;
}

/** Callback'te dönen token ile ödeme sonucunu sorgula. */
export async function retrieveCheckoutResult(
  token: string,
): Promise<IyzicoCheckoutResult> {
  const res = await iyzicoPost<CheckoutRetrieveResponse>(
    CHECKOUT_RETRIEVE_PATH,
    { locale: "tr", token },
  );

  return {
    status: res.status,
    paymentStatus: res.paymentStatus ?? "",
    paymentId: res.paymentId ?? null,
    paidPrice:
      res.paidPrice !== undefined && res.paidPrice !== null
        ? Number(res.paidPrice)
        : null,
    errorMessage: res.errorMessage ?? null,
  };
}
