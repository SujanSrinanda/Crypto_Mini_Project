"""Cryptographic mathematical engine for KeyExchange Lab.

Pure Python standard library implementation:
- pow(base, exp, mod) for modular exponentiation
- secrets for cryptographically secure pseudo-random numbers
- hashlib for SHA-256 key derivation
- Miller-Rabin primality test for parameter validation
- No external crypto libraries used.
"""

import hashlib
import random
import secrets
from typing import Any, Dict, List, Optional, Tuple


# Standard Safe Primes (p = 2q + 1) with primitive root generator g = 5.
# Safe primes resist Pohlig-Hellman small subgroup attacks.
STANDARD_PARAMS: Dict[str, Dict[str, str]] = {
    "toy": {
        "bits": "toy",
        "p": "23",
        "g": "5",
        "description": "Small toy prime (p = 23, g = 5, q = 11). Perfect for mental math, classroom blackboard step-by-step calculation, and live brute-force cracking.",
    },
    "64": {
        "bits": "64",
        "p": "18446744073709350263",
        "g": "5",
        "description": "64-bit safe prime. Demonstrates large number scaling; vulnerable to modern GPU/distributed brute-force but impossible by hand.",
    },
    "128": {
        "bits": "128",
        "p": "340282366920938463463374607431767201783",
        "g": "5",
        "description": "128-bit safe prime. Strong educational standard; requires astronomical operations (~2^64 via Pollard's rho) to crack.",
    },
    "256": {
        "bits": "256",
        "p": "115792089237316195423570985008687907853269984665640564039457584007913127601503",
        "g": "5",
        "description": "256-bit safe prime. Computationally infeasible to solve the Discrete Logarithm Problem using current classical computing capabilities.",
    },
}


def parse_int(val: Any, name: str = "value") -> int:
    """Parse integer from int, float, or string representation."""
    if isinstance(val, int):
        return val
    if isinstance(val, str):
        val_clean = val.strip().replace("_", "").replace(",", "")
        if val_clean.startswith("0x") or val_clean.startswith("0X"):
            return int(val_clean, 16)
        if not val_clean.isdigit():
            raise ValueError(f"{name} must be a valid positive integer string")
        return int(val_clean)
    raise ValueError(f"{name} must be an integer or integer string")


def miller_rabin_test(n: int, rounds: int = 25) -> bool:
    """Probabilistic Miller-Rabin primality test.
    
    Returns True if n is probably prime, False if composite.
    Rounds = 25 yields error probability < 4^(-25) (~ 10^-15).
    """
    if n < 2:
        return False
    if n in (2, 3):
        return True
    if n % 2 == 0:
        return False

    # Write n - 1 as 2^r * d with d odd
    d = n - 1
    r = 0
    while d % 2 == 0:
        r += 1
        d //= 2

    # Deterministic small primes for initial fast filter
    small_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
    for sp in small_primes:
        if n == sp:
            return True
        if n % sp == 0:
            return False

    # Test random bases
    for _ in range(rounds):
        a = random.randint(2, n - 2)
        x = pow(a, d, n)
        if x == 1 or x == n - 1:
            continue
        for _ in range(r - 1):
            x = pow(x, 2, n)
            if x == n - 1:
                break
        else:
            return False
    return True


def validate_dh_parameters(p: int, g: int) -> None:
    """Validate Diffie-Hellman parameters p and g."""
    if p < 5:
        raise ValueError("Modulus p must be greater than or equal to 5.")
    if p.bit_length() > 4096:
        raise ValueError("Modulus p is too large (maximum allowed bit length is 4096).")
    if not miller_rabin_test(p):
        raise ValueError(f"Modulus p = {p} is composite (not prime). DH requires a prime modulus.")
    if g < 2 or g >= p:
        raise ValueError(f"Generator g must satisfy 2 <= g < p. Received g = {g}.")


def generate_private_key(p: int) -> int:
    """Generate a cryptographically secure random private key in [2, p - 2]."""
    if p <= 3:
        return 2
    return secrets.randbelow(p - 3) + 2


def modular_exponentiation(base: int, exponent: int, modulus: int) -> int:
    """Calculate (base ^ exponent) % modulus using standard pow."""
    if modulus <= 0:
        raise ValueError("Modulus must be positive.")
    return pow(base, exponent, modulus)


def derive_symmetric_key(shared_secret: int) -> bytes:
    """Derive 256-bit symmetric encryption key using SHA-256 hash of shared secret."""
    secret_bytes = str(shared_secret).encode("utf-8")
    return hashlib.sha256(secret_bytes).digest()


def xor_stream_cipher(data: bytes, key: bytes) -> bytes:
    """XOR stream cipher for educational message encryption demonstration.
    
    Generates pseudo-random keystream by hashing (key + counter) with SHA-256.
    """
    keystream_blocks = []
    num_blocks = (len(data) + 31) // 32
    if num_blocks == 0:
        return b""
    for counter in range(num_blocks):
        counter_bytes = counter.to_bytes(4, byteorder="big")
        block = hashlib.sha256(key + counter_bytes).digest()
        keystream_blocks.append(block)
    keystream = b"".join(keystream_blocks)[:len(data)]
    return bytes(b ^ k for b, k in zip(data, keystream))


def encrypt_message(message: str, shared_secret: int) -> Tuple[str, str]:
    """Encrypt plaintext string using shared secret.
    
    Returns (derived_key_hex, ciphertext_hex).
    """
    key = derive_symmetric_key(shared_secret)
    data = message.encode("utf-8")
    ciphertext = xor_stream_cipher(data, key)
    return key.hex(), ciphertext.hex()


def decrypt_message(ciphertext_hex: str, shared_secret: int) -> Tuple[str, str]:
    """Decrypt hex ciphertext using shared secret.
    
    Returns (derived_key_hex, plaintext).
    """
    key = derive_symmetric_key(shared_secret)
    try:
        ciphertext = bytes.fromhex(ciphertext_hex)
    except ValueError as err:
        raise ValueError(f"Invalid hexadecimal string: {err}") from err
    plaintext_bytes = xor_stream_cipher(ciphertext, key)
    try:
        plaintext = plaintext_bytes.decode("utf-8")
    except UnicodeDecodeError:
        plaintext = plaintext_bytes.decode("latin1", errors="replace")
    return key.hex(), plaintext


def solve_discrete_log_brute_force(p: int, g: int, public_val: int, max_steps: int = 200000) -> Dict[str, Any]:
    """Brute force discrete log: find x such that g^x = public_val (mod p).
    
    Demonstrates why small primes are insecure and how time explodes.
    """
    current = 1
    for x in range(min(p, max_steps + 1)):
        if current == public_val:
            return {"found": True, "private_key": x, "steps": x + 1, "exhausted": False}
        current = (current * g) % p
    return {"found": False, "private_key": None, "steps": max_steps, "exhausted": True}


def simulate_protocol(
    p_val: Any,
    g_val: Any,
    mitm: bool = False,
    message: str = "Secret rendezvous at noon.",
    alice_private: Optional[Any] = None,
    bob_private: Optional[Any] = None,
    eve_alice_private: Optional[Any] = None,
    eve_bob_private: Optional[Any] = None,
    tampered_message: Optional[str] = "Wire $1,000,000 to Eve immediately.",
    authenticated_dh: bool = False,
) -> Dict[str, Any]:
    """Simulate complete Diffie-Hellman protocol step-by-step for animation.
    
    Supports:
    - Standard honest exchange between Alice and Bob
    - Man-in-the-Middle attack by Eve (split-key attack and message alteration)
    - Authenticated DH mode where Eve's forged public key fails signature verification
    """
    p = parse_int(p_val, "p")
    g = parse_int(g_val, "g")
    validate_dh_parameters(p, g)

    # 1. Key generation
    a = parse_int(alice_private, "alice_private") if alice_private is not None else generate_private_key(p)
    b = parse_int(bob_private, "bob_private") if bob_private is not None else generate_private_key(p)
    a = a % (p - 1) if a >= p else a
    b = b % (p - 1) if b >= p else b
    if a < 2:
        a = 2
    if b < 2:
        b = 2

    # Compute genuine public keys
    A = modular_exponentiation(g, a, p)
    B = modular_exponentiation(g, b, p)

    steps: List[Dict[str, Any]] = []
    step_num = 1

    # Step 1: Public Parameter Agreement
    steps.append({
        "step": step_num,
        "actor": "Channel",
        "action": "Public Parameters Published",
        "description": f"Alice and Bob publicly agree on prime modulus p = {p} and generator g = {g}. These values are transmitted over the open, unencrypted channel.",
        "formula": f"p = {p}, \\quad g = {g}",
        "values": {"p": str(p), "g": str(g)},
        "packet": {"sender": "System", "receiver": "Public Channel", "payload": f"p={p}, g={g}"},
        "alert_type": "info",
    })
    step_num += 1

    # Step 2: Private Key Selection
    steps.append({
        "step": step_num,
        "actor": "Alice",
        "action": "Alice Generates Private Key",
        "description": f"Alice secretly chooses private integer a = {a}. This secret never leaves Alice's computer.",
        "formula": f"a \\in [2, p - 2] \\implies a = {a}",
        "values": {"alice_private": str(a)},
        "alert_type": "info",
    })
    step_num += 1

    steps.append({
        "step": step_num,
        "actor": "Bob",
        "action": "Bob Generates Private Key",
        "description": f"Bob secretly chooses private integer b = {b}. This secret never leaves Bob's computer.",
        "formula": f"b \\in [2, p - 2] \\implies b = {b}",
        "values": {"bob_private": str(b)},
        "alert_type": "info",
    })
    step_num += 1

    # Step 3: Public Key Computation
    steps.append({
        "step": step_num,
        "actor": "Alice",
        "action": "Alice Computes Public Value A",
        "description": f"Alice computes public value A = g^a mod p = {g}^{a} mod {p} = {A}.",
        "formula": f"A = g^a \\bmod p = {g}^{{{a}}} \\bmod {p} = {A}",
        "values": {"alice_public": str(A), "alice_private": str(a), "g": str(g), "p": str(p)},
        "alert_type": "info",
    })
    step_num += 1

    steps.append({
        "step": step_num,
        "actor": "Bob",
        "action": "Bob Computes Public Value B",
        "description": f"Bob computes public value B = g^b mod p = {g}^{b} mod {p} = {B}.",
        "formula": f"B = g^b \\bmod p = {g}^{{{b}}} \\bmod {p} = {B}",
        "values": {"bob_public": str(B), "bob_private": str(b), "g": str(g), "p": str(p)},
        "alert_type": "info",
    })
    step_num += 1

    if not mitm:
        # NORMAL HONEST PROTOCOL
        # Step 4: Transmission of Public Values
        steps.append({
            "step": step_num,
            "actor": "Channel",
            "action": "Public Values Exchange",
            "description": f"Alice sends A = {A} to Bob. Bob sends B = {B} to Alice across the insecure public channel. A passive observer sees only (p={p}, g={g}, A={A}, B={B}).",
            "formula": f"\\text{{Alice}} \\xrightarrow{{A = {A}}} \\text{{Bob}}, \\quad \\text{{Bob}} \\xrightarrow{{B = {B}}} \\text{{Alice}}",
            "values": {"transmitted_A": str(A), "transmitted_B": str(B)},
            "packet": {"sender": "Alice & Bob", "receiver": "Public Channel", "payload": f"A={A}, B={B}"},
            "alert_type": "info",
        })
        step_num += 1

        # Authenticated DH certificate check (Honest mode)
        if authenticated_dh:
            steps.append({
                "step": step_num,
                "actor": "System",
                "action": "Digital Signature & Certificate Validation",
                "description": "Alice and Bob verify each other's digital certificates and cryptographic signatures on public keys A and B. Signatures match trusted Certificate Authority root!",
                "formula": "\\text{Verify}(\\text{Cert}_A, A) = \\text{VALID}, \\quad \\text{Verify}(\\text{Cert}_B, B) = \\text{VALID}",
                "values": {"alice_cert_valid": True, "bob_cert_valid": True},
                "alert_type": "success",
            })
            step_num += 1

        # Step 5: Shared Secret Calculation
        alice_shared = modular_exponentiation(B, a, p)
        bob_shared = modular_exponentiation(A, b, p)

        steps.append({
            "step": step_num,
            "actor": "Alice",
            "action": "Alice Computes Shared Secret",
            "description": f"Alice raises Bob's public value B to her private exponent a: K = B^a mod p = {B}^{a} mod {p} = {alice_shared}.",
            "formula": f"K_A = B^a \\bmod p = (g^b)^a \\bmod p = g^{{ab}} \\bmod p = {alice_shared}",
            "values": {"alice_shared": str(alice_shared)},
            "alert_type": "success",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Bob",
            "action": "Bob Computes Shared Secret",
            "description": f"Bob raises Alice's public value A to his private exponent b: K = A^b mod p = {A}^{b} mod {p} = {bob_shared}.",
            "formula": f"K_B = A^b \\bmod p = (g^a)^b \\bmod p = g^{{ab}} \\bmod p = {bob_shared}",
            "values": {"bob_shared": str(bob_shared)},
            "alert_type": "success",
        })
        step_num += 1

        # Step 6: Equality verification & Key Derivation
        key_hex, ciphertext_hex = encrypt_message(message, alice_shared)
        _, decrypted_bob = decrypt_message(ciphertext_hex, bob_shared)

        steps.append({
            "step": step_num,
            "actor": "System",
            "action": "Secrets Match Verified",
            "description": f"Both parties calculated identical secret K = {alice_shared}! Notice g^(ab) mod p == g^(ba) mod p. The derived 256-bit AES/XOR key is 0x{key_hex[:16]}...",
            "formula": f"K_A = K_B = g^{{ab}} \\bmod p = {alice_shared}",
            "values": {
                "shared_secret": str(alice_shared),
                "derived_key_hex": key_hex,
                "keys_match": True,
            },
            "alert_type": "success",
        })
        step_num += 1

        # Step 7: Encrypted Communication
        steps.append({
            "step": step_num,
            "actor": "Alice",
            "action": "Alice Encrypts Message",
            "description": f"Alice encrypts plaintext \"{message}\" using derived symmetric key. Ciphertext hex: {ciphertext_hex}.",
            "formula": f"\\text{{Ciphertext}} = \\text{{Plaintext}} \\oplus \\text{{SHA256}}(K)",
            "values": {
                "plaintext": message,
                "ciphertext_hex": ciphertext_hex,
            },
            "packet": {"sender": "Alice", "receiver": "Bob", "payload": ciphertext_hex},
            "alert_type": "info",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Bob",
            "action": "Bob Decrypts Message",
            "description": f"Bob receives ciphertext and decrypts with K_Bob. Bob recovers exact plaintext: \"{decrypted_bob}\". Secure communication complete!",
            "formula": f"\\text{{Plaintext}} = \\text{{Ciphertext}} \\oplus \\text{{SHA256}}(K) = \\text{{\"{decrypted_bob}\"}}",
            "values": {
                "decrypted_message": decrypted_bob,
                "message_match": True,
            },
            "alert_type": "success",
        })

        return {
            "success": True,
            "mitm": False,
            "authenticated_dh": authenticated_dh,
            "keys_match": True,
            "auth_verified": True,
            "summary": {
                "p": str(p),
                "g": str(g),
                "alice_private": str(a),
                "bob_private": str(b),
                "alice_public": str(A),
                "bob_public": str(B),
                "alice_shared": str(alice_shared),
                "bob_shared": str(bob_shared),
                "derived_key_hex": key_hex,
                "original_message": message,
                "ciphertext_hex": ciphertext_hex,
                "bob_received_message": decrypted_bob,
            },
            "steps": steps,
        }

    else:
        # MITM ATTACK MODE
        # Eve generates two private keys: e_A (for Alice) and e_B (for Bob)
        e_a = parse_int(eve_alice_private, "eve_alice_private") if eve_alice_private is not None else generate_private_key(p)
        e_b = parse_int(eve_bob_private, "eve_bob_private") if eve_bob_private is not None else generate_private_key(p)
        e_a = e_a % (p - 1) if e_a >= p else e_a
        e_b = e_b % (p - 1) if e_b >= p else e_b
        if e_a < 2:
            e_a = 2
        if e_b < 2:
            e_b = 3

        # Eve computes her public keys: E_A to send to Alice, E_B to send to Bob
        E_a = modular_exponentiation(g, e_a, p)
        E_b = modular_exponentiation(g, e_b, p)

        # Authenticated DH Defense Check
        if authenticated_dh:
            # Eve attempts to intercept and substitute public keys, but lacks valid digital certificates!
            steps.append({
                "step": step_num,
                "actor": "Eve",
                "action": "Eve Attempts Interception & Impersonation",
                "description": f"Eve sits between Alice and Bob and intercepts Alice's public key A={A} and Bob's public key B={B}. Eve crafts forged public keys E_A={E_a} and E_B={E_b}.",
                "formula": f"\\text{{Eve generates: }} E_A = g^{{e_A}} = {E_a}, \\quad E_B = g^{{e_B}} = {E_b}",
                "values": {"eve_public_alice": str(E_a), "eve_public_bob": str(E_b)},
                "packet": {"sender": "Eve", "receiver": "Intercepting Channel", "payload": "Intercepted A and B"},
                "alert_type": "warning",
            })
            step_num += 1

            steps.append({
                "step": step_num,
                "actor": "System",
                "action": "Defense Activated: Digital Certificate Verification Failed",
                "description": f"AUTHENTICATION CHECK FAILED! Eve cannot forge Alice's or Bob's RSA/ECDSA digital signatures or present a valid X.509 certificate signed by a trusted CA. The connection is immediately rejected!",
                "formula": "\\text{Verify}(\\text{Cert}_{\\text{Alice}}, E_B) = \\mathbf{FAIL!}\\quad \\text{Handshake Terminated.}",
                "values": {"signature_valid": False, "attack_thwarted": True},
                "alert_type": "danger",
            })

            return {
                "success": True,
                "mitm": True,
                "authenticated_dh": True,
                "keys_match": False,
                "auth_verified": False,
                "summary": {
                    "p": str(p),
                    "g": str(g),
                    "alice_private": str(a),
                    "bob_private": str(b),
                    "eve_alice_private": str(e_a),
                    "eve_bob_private": str(e_b),
                    "alice_public": str(A),
                    "bob_public": str(B),
                    "eve_public_alice": str(E_a),
                    "eve_public_bob": str(E_b),
                    "attack_thwarted": True,
                    "reason": "Digital signature verification failed on forged public keys.",
                },
                "steps": steps,
            }

        # Unauthenticated MITM continues:
        steps.append({
            "step": step_num,
            "actor": "Eve",
            "action": "Eve Generates Dual Rogue Keypairs",
            "description": f"Eve intercepts the communication channel. She secretly generates private keys e_A = {e_a} (to impersonate Bob to Alice) and e_B = {e_b} (to impersonate Alice to Bob).",
            "formula": f"e_A = {e_a}, \\quad e_B = {e_b} \\implies E_A = g^{{e_A}} = {E_a}, \\quad E_B = g^{{e_B}} = {E_b}",
            "values": {
                "eve_alice_private": str(e_a),
                "eve_bob_private": str(e_b),
                "eve_public_alice": str(E_a),
                "eve_public_bob": str(E_b),
            },
            "alert_type": "danger",
        })
        step_num += 1

        # Packet Interception
        steps.append({
            "step": step_num,
            "actor": "Eve",
            "action": "Packets Intercepted Mid-Flight",
            "description": f"Alice transmits A = {A} destined for Bob, but Eve intercepts it! Bob transmits B = {B} destined for Alice, but Eve intercepts it as well! Neither legitimate packet reaches its destination.",
            "formula": f"\\text{{Alice}} \\xrightarrow{{A = {A}}} [\\mathbf{{INTERCEPTED\\,BY\\,EVE}}], \\quad \\text{{Bob}} \\xrightarrow{{B = {B}}} [\\mathbf{{INTERCEPTED\\,BY\\,EVE}}]",
            "values": {"intercepted_A": str(A), "intercepted_B": str(B)},
            "packet": {"sender": "Alice & Bob", "receiver": "Eve", "payload": f"A={A}, B={B} (Intercepted!)"},
            "alert_type": "danger",
        })
        step_num += 1

        # Forged Forwarding
        steps.append({
            "step": step_num,
            "actor": "Eve",
            "action": "Eve Substitutes Forged Public Keys",
            "description": f"Eve sends E_A = {E_a} to Alice (pretending to be Bob) and sends E_B = {E_b} to Bob (pretending to be Alice). Alice and Bob believe they received authentic keys.",
            "formula": f"\\text{{Eve}} \\xrightarrow{{E_A = {E_a}}} \\text{{Alice}}, \\quad \\text{{Eve}} \\xrightarrow{{E_B = {E_b}}} \\text{{Bob}}",
            "values": {"sent_to_alice": str(E_a), "sent_to_bob": str(E_b)},
            "packet": {"sender": "Eve", "receiver": "Alice & Bob", "payload": f"Forged E_A={E_a}, E_B={E_b}"},
            "alert_type": "danger",
        })
        step_num += 1

        # Shared Secrets Computed:
        # Alice computes with E_A
        alice_shared = modular_exponentiation(E_a, a, p)
        # Eve computes Alice's key with A
        eve_alice_shared = modular_exponentiation(A, e_a, p)

        # Bob computes with E_B
        bob_shared = modular_exponentiation(E_b, b, p)
        # Eve computes Bob's key with B
        eve_bob_shared = modular_exponentiation(B, e_b, p)

        steps.append({
            "step": step_num,
            "actor": "Alice",
            "action": "Alice Computes Poisoned Shared Secret",
            "description": f"Alice computes K_A = (E_A)^a mod p = {E_a}^{a} mod {p} = {alice_shared}. Alice believes this key is shared with Bob, but it is actually shared with Eve!",
            "formula": f"K_A = (E_A)^a \\bmod p = (g^{{e_A}})^a \\bmod p = {alice_shared}",
            "values": {"alice_shared": str(alice_shared)},
            "alert_type": "warning",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Bob",
            "action": "Bob Computes Poisoned Shared Secret",
            "description": f"Bob computes K_B = (E_B)^b mod p = {E_b}^{b} mod {p} = {bob_shared}. Bob believes this key is shared with Alice, but it is actually shared with Eve!",
            "formula": f"K_B = (E_B)^b \\bmod p = (g^{{e_B}})^b \\bmod p = {bob_shared}",
            "values": {"bob_shared": str(bob_shared)},
            "alert_type": "warning",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Eve",
            "action": "Eve Computes Both Symmetric Keys",
            "description": f"Eve calculates K_EA = A^(e_A) mod p = {eve_alice_shared} (matches Alice!) and K_EB = B^(e_B) mod p = {eve_bob_shared} (matches Bob!). Eve has established two separate encrypted sessions!",
            "formula": f"K_{{EA}} = A^{{e_A}} = {eve_alice_shared} = K_A, \\quad K_{{EB}} = B^{{e_B}} = {eve_bob_shared} = K_B",
            "values": {
                "eve_alice_shared": str(eve_alice_shared),
                "eve_bob_shared": str(eve_bob_shared),
                "alice_bob_keys_mismatch": True,
            },
            "alert_type": "danger",
        })
        step_num += 1

        # Key Mismatch Alert Step
        steps.append({
            "step": step_num,
            "actor": "System",
            "action": "Security Breach: Key Mismatch",
            "description": f"CRITICAL: Alice's key ({alice_shared}) and Bob's key ({bob_shared}) DO NOT MATCH! Direct end-to-end security is completely broken.",
            "formula": f"K_A ({alice_shared}) \\neq K_B ({bob_shared}) \\quad [\\mathbf{{MITM\\,SUCCESSFUL}}]",
            "values": {"keys_match": False, "alice_shared": str(alice_shared), "bob_shared": str(bob_shared)},
            "alert_type": "danger",
        })
        step_num += 1

        # Message Transmission & Interception & Tampering
        alice_key_hex, ciphertext_alice_hex = encrypt_message(message, alice_shared)
        _, eve_read_message = decrypt_message(ciphertext_alice_hex, eve_alice_shared)

        actual_tampered = tampered_message if tampered_message else "Wire $1,000,000 to Eve immediately."
        eve_key_hex, ciphertext_eve_hex = encrypt_message(actual_tampered, eve_bob_shared)
        _, bob_received_message = decrypt_message(ciphertext_eve_hex, bob_shared)

        steps.append({
            "step": step_num,
            "actor": "Alice",
            "action": "Alice Transmits Encrypted Message",
            "description": f"Alice encrypts plaintext \"{message}\" with K_A and sends it across the channel.",
            "formula": f"C_A = \\text{{Plaintext}} \\oplus \\text{{SHA256}}(K_A)",
            "values": {"original_message": message, "ciphertext_alice_hex": ciphertext_alice_hex},
            "packet": {"sender": "Alice", "receiver": "Public Channel", "payload": ciphertext_alice_hex},
            "alert_type": "info",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Eve",
            "action": "Eve Eavesdrops & Tampers with Message",
            "description": f"Eve intercepts C_A, decrypts with K_EA, and reads in plaintext: \"{eve_read_message}\"! Eve then tampers with the message to say: \"{actual_tampered}\", re-encrypts with K_EB, and forwards C_Eve to Bob.",
            "formula": f"\\text{{Eve reads: }} \"{eve_read_message}\" \\implies \\text{{Tampered: }} \"{actual_tampered}\"",
            "values": {
                "eve_read_message": eve_read_message,
                "tampered_message": actual_tampered,
                "ciphertext_eve_hex": ciphertext_eve_hex,
            },
            "packet": {"sender": "Eve", "receiver": "Bob", "payload": ciphertext_eve_hex},
            "alert_type": "danger",
        })
        step_num += 1

        steps.append({
            "step": step_num,
            "actor": "Bob",
            "action": "Bob Receives Tampered Message Unknowingly",
            "description": f"Bob decrypts C_Eve using K_B. Bob receives \"{bob_received_message}\" and believes Alice sent it! Bob has zero cryptographic way to detect the tampering without authentication.",
            "formula": f"\\text{{Bob decrypted: }} \"{bob_received_message}\"",
            "values": {
                "bob_received_message": bob_received_message,
                "message_tampered": True,
            },
            "alert_type": "danger",
        })

        return {
            "success": True,
            "mitm": True,
            "authenticated_dh": False,
            "keys_match": False,
            "auth_verified": True,
            "summary": {
                "p": str(p),
                "g": str(g),
                "alice_private": str(a),
                "bob_private": str(b),
                "eve_alice_private": str(e_a),
                "eve_bob_private": str(e_b),
                "alice_public": str(A),
                "bob_public": str(B),
                "eve_public_alice": str(E_a),
                "eve_public_bob": str(E_b),
                "alice_shared": str(alice_shared),
                "bob_shared": str(bob_shared),
                "eve_alice_shared": str(eve_alice_shared),
                "eve_bob_shared": str(eve_bob_shared),
                "original_message": message,
                "eve_read_message": eve_read_message,
                "tampered_message": actual_tampered,
                "bob_received_message": bob_received_message,
            },
            "steps": steps,
        }
