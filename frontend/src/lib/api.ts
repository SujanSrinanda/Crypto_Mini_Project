/**
 * API client for KeyExchange Lab backend with automatic fallback to local BigInt engine.
 */

import {
  CLIENT_STANDARD_PARAMS,
  encryptLocal,
  decryptLocal,
  simulateProtocolLocal,
  generatePrivateKeyLocal,
  powMod,
  parseBigInt,
} from "./crypto";
import type { ParamSet, SimulationResult } from "./crypto";

const DEFAULT_API_URL = "http://localhost:8000";

export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_URL || DEFAULT_API_URL;
};

export type EngineMode = "api" | "local";

// Callback to trigger fallback toast
let onFallbackCallback: ((msg: string) => void) | null = null;

export function registerFallbackListener(callback: (msg: string) => void) {
  onFallbackCallback = callback;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs: number = 4000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function checkBackendHealth(): Promise<{ ok: boolean; engine: string; error?: string }> {
  try {
    const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/health`, { method: "GET" }, 2500);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return { ok: true, engine: data.engine || "FastAPI DH Engine" };
  } catch (err: any) {
    return { ok: false, engine: "In-Browser BigInt Engine", error: err.message };
  }
}

export async function fetchParams(
  bits: string = "toy",
  preferredEngine: EngineMode = "api"
): Promise<{ data: ParamSet; engineUsed: EngineMode }> {
  if (preferredEngine === "api") {
    try {
      const res = await fetchWithTimeout(`${getApiBaseUrl()}/api/params?bits=${bits}`, {}, 3000);
      if (res.ok) {
        const json = await res.json();
        return { data: json.selected, engineUsed: "api" };
      }
    } catch {
      onFallbackCallback?.("Backend unreachable, running locally");
    }
  }
  const key = bits in CLIENT_STANDARD_PARAMS ? bits : "toy";
  return { data: CLIENT_STANDARD_PARAMS[key], engineUsed: "local" };
}

export async function generateKeyPairApi(
  p: string,
  g: string,
  privateKey?: string,
  preferredEngine: EngineMode = "api"
): Promise<{ privateKey: string; publicKey: string; engineUsed: EngineMode }> {
  if (preferredEngine === "api") {
    try {
      const res = await fetchWithTimeout(
        `${getApiBaseUrl()}/api/keypair`,
        {
          method: "POST",
          body: JSON.stringify({ p, g, private: privateKey || null }),
        },
        3000
      );
      if (res.ok) {
        const json = await res.json();
        return { privateKey: json.private, publicKey: json.public, engineUsed: "api" };
      }
    } catch {
      onFallbackCallback?.("Backend unreachable, running locally");
    }
  }

  // Local fallback
  const pBig = parseBigInt(p);
  const gBig = parseBigInt(g);
  const privBig = privateKey ? parseBigInt(privateKey) : generatePrivateKeyLocal(pBig);
  const pubBig = powMod(gBig, privBig, pBig);

  return {
    privateKey: privBig.toString(),
    publicKey: pubBig.toString(),
    engineUsed: "local",
  };
}

export async function runSimulation(
  payload: {
    p: string;
    g: string;
    mitm: boolean;
    authenticatedDh?: boolean;
    message?: string;
    tamperedMessage?: string;
    alicePrivate?: string;
    bobPrivate?: string;
    eveAlicePrivate?: string;
    eveBobPrivate?: string;
  },
  preferredEngine: EngineMode = "api"
): Promise<{ result: SimulationResult; engineUsed: EngineMode }> {
  if (preferredEngine === "api") {
    try {
      const res = await fetchWithTimeout(
        `${getApiBaseUrl()}/api/simulate`,
        {
          method: "POST",
          body: JSON.stringify({
            p: payload.p,
            g: payload.g,
            mitm: payload.mitm,
            authenticated_dh: payload.authenticatedDh,
            message: payload.message,
            tampered_message: payload.tamperedMessage,
            alice_private: payload.alicePrivate || null,
            bob_private: payload.bobPrivate || null,
            eve_alice_private: payload.eveAlicePrivate || null,
            eve_bob_private: payload.eveBobPrivate || null,
          }),
        },
        5000
      );
      if (res.ok) {
        const json = await res.json();
        return { result: json, engineUsed: "api" };
      }
    } catch {
      onFallbackCallback?.("Backend unreachable, running locally");
    }
  }

  // Local fallback
  const localResult = await simulateProtocolLocal({
    p: payload.p,
    g: payload.g,
    mitm: payload.mitm,
    authenticatedDh: payload.authenticatedDh,
    message: payload.message,
    tamperedMessage: payload.tamperedMessage,
    alicePrivate: payload.alicePrivate,
    bobPrivate: payload.bobPrivate,
    eveAlicePrivate: payload.eveAlicePrivate,
    eveBobPrivate: payload.eveBobPrivate,
  });

  return { result: localResult, engineUsed: "local" };
}

export async function encryptApi(
  sharedSecret: string,
  message: string,
  preferredEngine: EngineMode = "api"
): Promise<{ keyHex: string; ciphertextHex: string; engineUsed: EngineMode }> {
  if (preferredEngine === "api") {
    try {
      const res = await fetchWithTimeout(
        `${getApiBaseUrl()}/api/encrypt`,
        {
          method: "POST",
          body: JSON.stringify({ shared_secret: sharedSecret, message }),
        },
        3000
      );
      if (res.ok) {
        const json = await res.json();
        return {
          keyHex: json.derived_key_hex,
          ciphertextHex: json.ciphertext_hex,
          engineUsed: "api",
        };
      }
    } catch {
      onFallbackCallback?.("Backend unreachable, running locally");
    }
  }

  const localEnc = await encryptLocal(message, parseBigInt(sharedSecret));
  return { ...localEnc, engineUsed: "local" };
}

export async function decryptApi(
  sharedSecret: string,
  ciphertextHex: string,
  preferredEngine: EngineMode = "api"
): Promise<{ keyHex: string; plaintext: string; engineUsed: EngineMode }> {
  if (preferredEngine === "api") {
    try {
      const res = await fetchWithTimeout(
        `${getApiBaseUrl()}/api/decrypt`,
        {
          method: "POST",
          body: JSON.stringify({ shared_secret: sharedSecret, ciphertext_hex: ciphertextHex }),
        },
        3000
      );
      if (res.ok) {
        const json = await res.json();
        return {
          keyHex: json.derived_key_hex,
          plaintext: json.plaintext,
          engineUsed: "api",
        };
      }
    } catch {
      onFallbackCallback?.("Backend unreachable, running locally");
    }
  }

  const localDec = await decryptLocal(ciphertextHex, parseBigInt(sharedSecret));
  return { ...localDec, engineUsed: "local" };
}
