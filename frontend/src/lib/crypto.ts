/**
 * Pure client-side BigInt implementation of Diffie-Hellman Key Exchange
 * and Man-in-the-Middle Attack Simulation.
 *
 * Guarantees 100% offline functionality if backend server is unreachable.
 */

export interface ParamSet {
  bits: string;
  p: string;
  g: string;
  description: string;
}

export const CLIENT_STANDARD_PARAMS: Record<string, ParamSet> = {
  toy: {
    bits: "toy",
    p: "23",
    g: "5",
    description: "Small toy prime (p = 23, g = 5, q = 11). Ideal for manual verification and brute-force cracking.",
  },
  "64": {
    bits: "64",
    p: "18446744073709350263",
    g: "5",
    description: "64-bit safe prime. Demonstrates large number scaling; vulnerable to modern GPU cluster brute-force.",
  },
  "128": {
    bits: "128",
    p: "340282366920938463463374607431767201783",
    g: "5",
    description: "128-bit safe prime. Strong educational standard; requires ~2^64 operations to solve discrete logarithm.",
  },
  "256": {
    bits: "256",
    p: "115792089237316195423570985008687907853269984665640564039457584007913127601503",
    g: "5",
    description: "256-bit safe prime. Computationally infeasible to solve via classical computers.",
  },
};

export interface SimulationStep {
  step: number;
  actor: "Alice" | "Bob" | "Eve" | "Channel" | "System";
  action: string;
  description: string;
  formula?: string;
  values: Record<string, any>;
  packet?: {
    sender: string;
    receiver: string;
    payload: string;
  };
  alert_type: "info" | "success" | "warning" | "danger";
}

export interface SimulationResult {
  success: boolean;
  mitm: boolean;
  authenticated_dh: boolean;
  keys_match: boolean;
  auth_verified: boolean;
  summary: Record<string, any>;
  steps: SimulationStep[];
}

export function parseBigInt(val: string | number | bigint, name: string = "Value"): bigint {
  if (typeof val === "bigint") return val;
  if (typeof val === "number") return BigInt(Math.floor(val));
  if (typeof val === "string") {
    const clean = val.trim().replace(/[_,\s]/g, "");
    if (!clean) throw new Error(`${name} cannot be empty.`);
    try {
      if (clean.startsWith("0x") || clean.startsWith("0X")) {
        return BigInt(clean);
      }
      return BigInt(clean);
    } catch {
      throw new Error(`${name} is not a valid integer.`);
    }
  }
  throw new Error(`${name} must be an integer.`);
}

/**
 * Fast modular exponentiation: (base ^ exp) mod mod
 * Uses square-and-multiply algorithm.
 */
export function powMod(base: bigint, exp: bigint, mod: bigint): bigint {
  if (mod <= 0n) throw new Error("Modulus must be positive.");
  if (mod === 1n) return 0n;
  let result = 1n;
  let b = ((base % mod) + mod) % mod;
  let e = exp;

  while (e > 0n) {
    if (e & 1n) {
      result = (result * b) % mod;
    }
    b = (b * b) % mod;
    e >>= 1n;
  }
  return result;
}

/**
 * Probabilistic Miller-Rabin Primality Test for BigInt.
 */
export function millerRabin(n: bigint, rounds: number = 20): boolean {
  if (n < 2n) return false;
  if (n === 2n || n === 3n) return true;
  if (n % 2n === 0n) return false;

  let d = n - 1n;
  let r = 0n;
  while (d % 2n === 0n) {
    d /= 2n;
    r += 1n;
  }

  const smallPrimes = [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n];
  for (const sp of smallPrimes) {
    if (n === sp) return true;
    if (n % sp === 0n) return false;
  }

  // Random base sampling
  for (let i = 0; i < rounds; i++) {
    // Generate pseudo-random BigInt between 2 and n - 2
    const a = 2n + BigInt(Math.floor(Math.random() * 1000000000)) % (n - 3n);
    let x = powMod(a, d, n);
    if (x === 1n || x === n - 1n) continue;

    let composite = true;
    for (let j = 0n; j < r - 1n; j++) {
      x = (x * x) % n;
      if (x === n - 1n) {
        composite = false;
        break;
      }
    }
    if (composite) return false;
  }
  return true;
}

export function validateParameters(p: bigint, g: bigint): void {
  if (p < 5n) throw new Error("Modulus p must be at least 5.");
  if (!millerRabin(p)) throw new Error(`Modulus p = ${p} is not prime.`);
  if (g < 2n || g >= p) throw new Error(`Generator g must satisfy 2 <= g < p. Received g = ${g}.`);
}

/**
 * Generate a random BigInt private key in range [2, p - 2].
 */
export function generatePrivateKeyLocal(p: bigint): bigint {
  if (p <= 4n) return 2n;
  const max = p - 2n;
  const min = 2n;
  // For small p, simple random is enough
  if (p < 1000000n) {
    const range = Number(max - min);
    return min + BigInt(Math.floor(Math.random() * range));
  }
  // For large p, use crypto.getRandomValues
  const bitLength = p.toString(2).length;
  const byteLength = Math.ceil(bitLength / 8);
  const bytes = new Uint8Array(byteLength);
  crypto.getRandomValues(bytes);
  let hex = "0x";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  const raw = BigInt(hex);
  return min + (raw % (max - min));
}

/**
 * SHA-256 key derivation via standard Web Crypto API.
 */
export async function deriveKeySHA256(sharedSecret: bigint): Promise<Uint8Array> {
  const encoder = new TextEncoder();
  const data = encoder.encode(sharedSecret.toString());
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  return new Uint8Array(hashBuffer);
}

export function bufferToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function hexToBuffer(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, "");
  const bytes = new Uint8Array(clean.length / 2);
  for (let i = 0; i < clean.length; i += 2) {
    bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
  }
  return bytes;
}

/**
 * Educational XOR Stream Cipher with repeated SHA-256 keystream blocks.
 */
export async function xorStreamCipherLocal(data: Uint8Array, keyBytes: Uint8Array): Promise<Uint8Array> {
  const result = new Uint8Array(data.length);
  const numBlocks = Math.ceil(data.length / 32);

  let offset = 0;
  for (let counter = 0; counter < numBlocks; counter++) {
    // combine key + 4-byte counter
    const counterBuf = new Uint8Array(keyBytes.length + 4);
    counterBuf.set(keyBytes, 0);
    const view = new DataView(counterBuf.buffer, counterBuf.byteOffset + keyBytes.length, 4);
    view.setUint32(0, counter, false);

    const blockBuf = await crypto.subtle.digest("SHA-256", counterBuf);
    const blockBytes = new Uint8Array(blockBuf);

    const take = Math.min(32, data.length - offset);
    for (let i = 0; i < take; i++) {
      result[offset + i] = data[offset + i] ^ blockBytes[i];
    }
    offset += take;
  }
  return result;
}

export async function encryptLocal(message: string, sharedSecret: bigint): Promise<{ keyHex: string; ciphertextHex: string }> {
  const keyBytes = await deriveKeySHA256(sharedSecret);
  const data = new TextEncoder().encode(message);
  const cipherBytes = await xorStreamCipherLocal(data, keyBytes);
  return {
    keyHex: bufferToHex(keyBytes),
    ciphertextHex: bufferToHex(cipherBytes),
  };
}

export async function decryptLocal(ciphertextHex: string, sharedSecret: bigint): Promise<{ keyHex: string; plaintext: string }> {
  const keyBytes = await deriveKeySHA256(sharedSecret);
  const cipherBytes = hexToBuffer(ciphertextHex);
  const plainBytes = await xorStreamCipherLocal(cipherBytes, keyBytes);
  const plaintext = new TextDecoder().decode(plainBytes);
  return {
    keyHex: bufferToHex(keyBytes),
    plaintext,
  };
}

/**
 * Solve discrete log brute force on the client (for interactive "Why is it hard?" section).
 */
export function solveDiscreteLogClient(
  p: bigint,
  g: bigint,
  publicVal: bigint,
  maxSteps: number = 200000
): { found: boolean; privateKey: bigint | null; steps: number; timeMs: number } {
  const start = performance.now();
  let current = 1n;
  const limit = p < BigInt(maxSteps) ? Number(p) : maxSteps;

  for (let x = 0; x <= limit; x++) {
    if (current === publicVal) {
      const timeMs = performance.now() - start;
      return { found: true, privateKey: BigInt(x), steps: x + 1, timeMs };
    }
    current = (current * g) % p;
  }
  const timeMs = performance.now() - start;
  return { found: false, privateKey: null, steps: limit, timeMs };
}

/**
 * Run complete simulation in-browser. Produces identical step output to backend.
 */
export async function simulateProtocolLocal(options: {
  p: string | number | bigint;
  g: string | number | bigint;
  mitm: boolean;
  message?: string;
  tamperedMessage?: string;
  alicePrivate?: string | number | bigint;
  bobPrivate?: string | number | bigint;
  eveAlicePrivate?: string | number | bigint;
  eveBobPrivate?: string | number | bigint;
  authenticatedDh?: boolean;
}): Promise<SimulationResult> {
  const p = parseBigInt(options.p, "p");
  const g = parseBigInt(options.g, "g");
  validateParameters(p, g);

  const message = options.message || "Secret rendezvous at noon.";
  const tamperedMessage = options.tamperedMessage || "Wire $1,000,000 to Eve immediately.";
  const mitm = !!options.mitm;
  const authenticatedDh = !!options.authenticatedDh;

  let a = options.alicePrivate ? parseBigInt(options.alicePrivate, "Alice Private") : generatePrivateKeyLocal(p);
  let b = options.bobPrivate ? parseBigInt(options.bobPrivate, "Bob Private") : generatePrivateKeyLocal(p);
  a = a % (p - 1n);
  b = b % (p - 1n);
  if (a < 2n) a = 2n;
  if (b < 2n) b = 2n;

  const A = powMod(g, a, p);
  const B = powMod(g, b, p);

  const steps: SimulationStep[] = [];
  let stepNum = 1;

  // Step 1: Public parameters
  steps.push({
    step: stepNum++,
    actor: "Channel",
    action: "Public Parameters Published",
    description: `Alice and Bob publicly agree on prime modulus p = ${p} and generator g = ${g}. Both values travel over the open channel.`,
    formula: `p = ${p}, \\quad g = ${g}`,
    values: { p: p.toString(), g: g.toString() },
    packet: { sender: "System", receiver: "Public Channel", payload: `p=${p}, g=${g}` },
    alert_type: "info",
  });

  // Step 2: Private keys
  steps.push({
    step: stepNum++,
    actor: "Alice",
    action: "Alice Generates Private Key",
    description: `Alice secretly chooses private integer a = ${a}. Stays safely inside Alice's vault.`,
    formula: `a \\in [2, p - 2] \\implies a = ${a}`,
    values: { alice_private: a.toString() },
    alert_type: "info",
  });

  steps.push({
    step: stepNum++,
    actor: "Bob",
    action: "Bob Generates Private Key",
    description: `Bob secretly chooses private integer b = ${b}. Stays safely inside Bob's vault.`,
    formula: `b \\in [2, p - 2] \\implies b = ${b}`,
    values: { bob_private: b.toString() },
    alert_type: "info",
  });

  // Step 3: Public keys computation
  steps.push({
    step: stepNum++,
    actor: "Alice",
    action: "Alice Computes Public Value A",
    description: `Alice computes A = g^a mod p = ${g}^${a} mod ${p} = ${A}.`,
    formula: `A = g^a \\bmod p = ${g}^{${a}} \\bmod ${p} = ${A}`,
    values: { alice_public: A.toString(), alice_private: a.toString(), g: g.toString(), p: p.toString() },
    alert_type: "info",
  });

  steps.push({
    step: stepNum++,
    actor: "Bob",
    action: "Bob Computes Public Value B",
    description: `Bob computes B = g^b mod p = ${g}^${b} mod ${p} = ${B}.`,
    formula: `B = g^b \\bmod p = ${g}^{${b}} \\bmod ${p} = ${B}`,
    values: { bob_public: B.toString(), bob_private: b.toString(), g: g.toString(), p: p.toString() },
    alert_type: "info",
  });

  if (!mitm) {
    // Normal Honest exchange
    steps.push({
      step: stepNum++,
      actor: "Channel",
      action: "Public Values Exchange",
      description: `Alice transmits A = ${A} to Bob. Bob transmits B = ${B} to Alice across the channel. Eavesdropper observes only (p=${p}, g=${g}, A=${A}, B=${B}).`,
      formula: `\\text{Alice} \\xrightarrow{A = ${A}} \\text{Bob}, \\quad \\text{Bob} \\xrightarrow{B = ${B}} \\text{Alice}`,
      values: { transmitted_A: A.toString(), transmitted_B: B.toString() },
      packet: { sender: "Alice & Bob", receiver: "Public Channel", payload: `A=${A}, B=${B}` },
      alert_type: "info",
    });

    if (authenticatedDh) {
      steps.push({
        step: stepNum++,
        actor: "System",
        action: "Digital Signature & Certificate Validation",
        description: "Alice and Bob verify digital signatures on public values using trusted Certificate Authority (CA) certificates. Signatures VALID!",
        formula: "\\text{Verify}(\\text{Cert}_A, A) = \\text{VALID}, \\quad \\text{Verify}(\\text{Cert}_B, B) = \\text{VALID}",
        values: { alice_cert_valid: true, bob_cert_valid: true },
        alert_type: "success",
      });
    }

    const aliceShared = powMod(B, a, p);
    const bobShared = powMod(A, b, p);

    steps.push({
      step: stepNum++,
      actor: "Alice",
      action: "Alice Computes Shared Secret",
      description: `Alice raises Bob's public value B to her private exponent a: K = B^a mod p = ${B}^${a} mod ${p} = ${aliceShared}.`,
      formula: `K_A = B^a \\bmod p = (g^b)^a \\bmod p = g^{ab} \\bmod p = ${aliceShared}`,
      values: { alice_shared: aliceShared.toString() },
      alert_type: "success",
    });

    steps.push({
      step: stepNum++,
      actor: "Bob",
      action: "Bob Computes Shared Secret",
      description: `Bob raises Alice's public value A to his private exponent b: K = A^b mod p = ${A}^${b} mod ${p} = ${bobShared}.`,
      formula: `K_B = A^b \\bmod p = (g^a)^b \\bmod p = g^{ab} \\bmod p = ${bobShared}`,
      values: { bob_shared: bobShared.toString() },
      alert_type: "success",
    });

    const { keyHex, ciphertextHex } = await encryptLocal(message, aliceShared);
    const { plaintext: decryptedBob } = await decryptLocal(ciphertextHex, bobShared);

    steps.push({
      step: stepNum++,
      actor: "System",
      action: "Secrets Match Verified",
      description: `Both parties calculated identical secret K = ${aliceShared}! Mathematical symmetry g^(ab) == g^(ba) verified. Derived key: 0x${keyHex.slice(0, 16)}...`,
      formula: `K_A = K_B = g^{ab} \\bmod p = ${aliceShared}`,
      values: { shared_secret: aliceShared.toString(), derived_key_hex: keyHex, keys_match: true },
      alert_type: "success",
    });

    steps.push({
      step: stepNum++,
      actor: "Alice",
      action: "Alice Encrypts Message",
      description: `Alice encrypts plaintext "${message}" using derived symmetric key. Ciphertext: 0x${ciphertextHex.slice(0, 20)}...`,
      formula: "\\text{Ciphertext} = \\text{Plaintext} \\oplus \\text{SHA256}(K)",
      values: { plaintext: message, ciphertext_hex: ciphertextHex },
      packet: { sender: "Alice", receiver: "Bob", payload: ciphertextHex },
      alert_type: "info",
    });

    steps.push({
      step: stepNum++,
      actor: "Bob",
      action: "Bob Decrypts Message",
      description: `Bob receives ciphertext and decrypts with K_Bob. Bob recovers: "${decryptedBob}". Confidential channel established!`,
      formula: `\\text{Plaintext} = \\text{Ciphertext} \\oplus \\text{SHA256}(K) = \\text{"${decryptedBob}"}`,
      values: { decrypted_message: decryptedBob, message_match: true },
      alert_type: "success",
    });

    return {
      success: true,
      mitm: false,
      authenticated_dh: authenticatedDh,
      keys_match: true,
      auth_verified: true,
      summary: {
        p: p.toString(),
        g: g.toString(),
        alice_private: a.toString(),
        bob_private: b.toString(),
        alice_public: A.toString(),
        bob_public: B.toString(),
        alice_shared: aliceShared.toString(),
        bob_shared: bobShared.toString(),
        derived_key_hex: keyHex,
        original_message: message,
        ciphertext_hex: ciphertextHex,
        bob_received_message: decryptedBob,
      },
      steps,
    };
  } else {
    // MITM Attack Mode
    let e_a = options.eveAlicePrivate ? parseBigInt(options.eveAlicePrivate, "Eve Alice Private") : generatePrivateKeyLocal(p);
    let e_b = options.eveBobPrivate ? parseBigInt(options.eveBobPrivate, "Eve Bob Private") : generatePrivateKeyLocal(p);
    e_a = e_a % (p - 1n);
    e_b = e_b % (p - 1n);
    if (e_a < 2n) e_a = 2n;
    if (e_b < 2n) e_b = 3n;

    const E_a = powMod(g, e_a, p);
    const E_b = powMod(g, e_b, p);

    if (authenticatedDh) {
      steps.push({
        step: stepNum++,
        actor: "Eve",
        action: "Eve Attempts Interception & Impersonation",
        description: `Eve intercepts legitimate public keys A=${A} and B=${B}, crafting forged keys E_A=${E_a} and E_B=${E_b}.`,
        formula: `\\text{Eve: } E_A = g^{e_A} = ${E_a}, \\quad E_B = g^{e_B} = ${E_b}`,
        values: { eve_public_alice: E_a.toString(), eve_public_bob: E_b.toString() },
        packet: { sender: "Eve", receiver: "Channel", payload: "Intercepted A and B" },
        alert_type: "warning",
      });

      steps.push({
        step: stepNum++,
        actor: "System",
        action: "Defense Activated: Digital Certificate Verification Failed",
        description: "SECURITY ALERT: Eve cannot forge legitimate digital certificates or private key signatures for Alice or Bob! The cryptographic handshake is aborted.",
        formula: "\\text{Verify}(\\text{Cert}_{\\text{Alice}}, E_B) = \\mathbf{FAIL!}\\quad \\text{Session Aborted.}",
        values: { signature_valid: false, attack_thwarted: true },
        alert_type: "danger",
      });

      return {
        success: true,
        mitm: true,
        authenticated_dh: true,
        keys_match: false,
        auth_verified: false,
        summary: {
          p: p.toString(),
          g: g.toString(),
          alice_private: a.toString(),
          bob_private: b.toString(),
          eve_alice_private: e_a.toString(),
          eve_bob_private: e_b.toString(),
          alice_public: A.toString(),
          bob_public: B.toString(),
          eve_public_alice: E_a.toString(),
          eve_public_bob: E_b.toString(),
          attack_thwarted: true,
        },
        steps,
      };
    }

    steps.push({
      step: stepNum++,
      actor: "Eve",
      action: "Eve Generates Dual Rogue Keypairs",
      description: `Eve secretly generates two distinct private keys: e_A = ${e_a} (to impersonate Bob to Alice) and e_B = ${e_b} (to impersonate Alice to Bob).`,
      formula: `e_A = ${e_a}, \\quad e_B = ${e_b} \\implies E_A = g^{e_A} = ${E_a}, \\quad E_B = g^{e_B} = ${E_b}`,
      values: {
        eve_alice_private: e_a.toString(),
        eve_bob_private: e_b.toString(),
        eve_public_alice: E_a.toString(),
        eve_public_bob: E_b.toString(),
      },
      alert_type: "danger",
    });

    steps.push({
      step: stepNum++,
      actor: "Eve",
      action: "Packets Intercepted Mid-Flight",
      description: `Alice sends A = ${A} and Bob sends B = ${B}. Eve intercepts both packets in flight! Neither arrives at the intended destination.`,
      formula: `\\text{Alice} \\xrightarrow{A} [\\mathbf{INTERCEPTED}], \\quad \\text{Bob} \\xrightarrow{B} [\\mathbf{INTERCEPTED}]`,
      values: { intercepted_A: A.toString(), intercepted_B: B.toString() },
      packet: { sender: "Alice & Bob", receiver: "Eve", payload: `A=${A}, B=${B} (Intercepted)` },
      alert_type: "danger",
    });

    steps.push({
      step: stepNum++,
      actor: "Eve",
      action: "Eve Substitutes Forged Public Keys",
      description: `Eve delivers forged E_A = ${E_a} to Alice (impersonating Bob) and E_B = ${E_b} to Bob (impersonating Alice).`,
      formula: `\\text{Eve} \\xrightarrow{E_A = ${E_a}} \\text{Alice}, \\quad \\text{Eve} \\xrightarrow{E_B = ${E_b}} \\text{Bob}`,
      values: { sent_to_alice: E_a.toString(), sent_to_bob: E_b.toString() },
      packet: { sender: "Eve", receiver: "Alice & Bob", payload: `E_A=${E_a}, E_B=${E_b}` },
      alert_type: "danger",
    });

    const aliceShared = powMod(E_a, a, p);
    const eveAliceShared = powMod(A, e_a, p);
    const bobShared = powMod(E_b, b, p);
    const eveBobShared = powMod(B, e_b, p);

    steps.push({
      step: stepNum++,
      actor: "Alice",
      action: "Alice Computes Poisoned Shared Secret",
      description: `Alice computes K_A = (E_A)^a mod p = ${E_a}^${a} mod ${p} = ${aliceShared}. Alice mistakenly believes she shares this key with Bob.`,
      formula: `K_A = (E_A)^a \\bmod p = ${aliceShared}`,
      values: { alice_shared: aliceShared.toString() },
      alert_type: "warning",
    });

    steps.push({
      step: stepNum++,
      actor: "Bob",
      action: "Bob Computes Poisoned Shared Secret",
      description: `Bob computes K_B = (E_B)^b mod p = ${E_b}^${b} mod ${p} = ${bobShared}. Bob mistakenly believes he shares this key with Alice.`,
      formula: `K_B = (E_B)^b \\bmod p = ${bobShared}`,
      values: { bob_shared: bobShared.toString() },
      alert_type: "warning",
    });

    steps.push({
      step: stepNum++,
      actor: "Eve",
      action: "Eve Computes Both Symmetric Keys",
      description: `Eve computes K_EA = A^(e_A) = ${eveAliceShared} (equals K_A!) and K_EB = B^(e_B) = ${eveBobShared} (equals K_B!). Eve holds keys to both conversations.`,
      formula: `K_{EA} = ${eveAliceShared} = K_A, \\quad K_{EB} = ${eveBobShared} = K_B`,
      values: {
        eve_alice_shared: eveAliceShared.toString(),
        eve_bob_shared: eveBobShared.toString(),
      },
      alert_type: "danger",
    });

    steps.push({
      step: stepNum++,
      actor: "System",
      action: "Security Breach: Key Mismatch",
      description: `CRITICAL ALERT: K_A (${aliceShared}) != K_B (${bobShared})! Alice and Bob do NOT share a common secret key. Eve controls the entire exchange.`,
      formula: `K_A (${aliceShared}) \\neq K_B (${bobShared}) \\quad [\\mathbf{MITM\\,ACTIVE}]`,
      values: { keys_match: false, alice_shared: aliceShared.toString(), bob_shared: bobShared.toString() },
      alert_type: "danger",
    });

    const { ciphertextHex: cipherAlice } = await encryptLocal(message, aliceShared);
    const { plaintext: eveRead } = await decryptLocal(cipherAlice, eveAliceShared);
    const { ciphertextHex: cipherEve } = await encryptLocal(tamperedMessage, eveBobShared);
    const { plaintext: bobReceived } = await decryptLocal(cipherEve, bobShared);

    steps.push({
      step: stepNum++,
      actor: "Alice",
      action: "Alice Transmits Encrypted Message",
      description: `Alice encrypts "${message}" using K_A and sends ciphertext across channel.`,
      formula: "\\text{Ciphertext} = \\text{Plaintext} \\oplus \\text{SHA256}(K_A)",
      values: { original_message: message, ciphertext_alice_hex: cipherAlice },
      packet: { sender: "Alice", receiver: "Channel", payload: cipherAlice },
      alert_type: "info",
    });

    steps.push({
      step: stepNum++,
      actor: "Eve",
      action: "Eve Eavesdrops & Tampers with Message",
      description: `Eve intercepts ciphertext, decrypts with K_EA, reads: "${eveRead}"! She modifies the text to "${tamperedMessage}", re-encrypts with K_EB, and forwards to Bob.`,
      formula: `\\text{Eve reads: } "${eveRead}" \\implies \\text{Tampered: } "${tamperedMessage}"`,
      values: { eve_read_message: eveRead, tampered_message: tamperedMessage, ciphertext_eve_hex: cipherEve },
      packet: { sender: "Eve", receiver: "Bob", payload: cipherEve },
      alert_type: "danger",
    });

    steps.push({
      step: stepNum++,
      actor: "Bob",
      action: "Bob Receives Tampered Message Unknowingly",
      description: `Bob decrypts with K_B and reads: "${bobReceived}". Bob believes Alice sent it! Without public key authentication, Bob is completely unaware.`,
      formula: `\\text{Bob decrypted: } "${bobReceived}"`,
      values: { bob_received_message: bobReceived, message_tampered: true },
      alert_type: "danger",
    });

    return {
      success: true,
      mitm: true,
      authenticated_dh: false,
      keys_match: false,
      auth_verified: true,
      summary: {
        p: p.toString(),
        g: g.toString(),
        alice_private: a.toString(),
        bob_private: b.toString(),
        eve_alice_private: e_a.toString(),
        eve_bob_private: e_b.toString(),
        alice_public: A.toString(),
        bob_public: B.toString(),
        eve_public_alice: E_a.toString(),
        eve_public_bob: E_b.toString(),
        alice_shared: aliceShared.toString(),
        bob_shared: bobShared.toString(),
        eve_alice_shared: eveAliceShared.toString(),
        eve_bob_shared: eveBobShared.toString(),
        original_message: message,
        eve_read_message: eveRead,
        tampered_message: tamperedMessage,
        bob_received_message: bobReceived,
      },
      steps,
    };
  }
}
