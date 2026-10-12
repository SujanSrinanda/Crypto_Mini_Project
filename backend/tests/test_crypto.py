"""Unit tests for cryptographic mathematical operations."""

import pytest
from app.crypto import (
    STANDARD_PARAMS,
    decrypt_message,
    encrypt_message,
    generate_private_key,
    miller_rabin_test,
    modular_exponentiation,
    simulate_protocol,
    solve_discrete_log_brute_force,
    validate_dh_parameters,
)


def test_modular_exponentiation():
    """Verify modular exponentiation math on known test vectors."""
    # 5^3 mod 23 = 125 mod 23 = 10
    assert modular_exponentiation(5, 3, 23) == 10
    # 5^6 mod 23 = 15625 mod 23 = 8
    assert modular_exponentiation(5, 6, 23) == 8
    # 2^10 mod 1000 = 1024 mod 1000 = 24
    assert modular_exponentiation(2, 10, 1000) == 24


def test_miller_rabin_primality():
    """Verify primality testing for small and standard primes and composites."""
    known_primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 101, 104729]
    for p in known_primes:
        assert miller_rabin_test(p) is True

    known_composites = [0, 1, 4, 6, 8, 9, 15, 21, 25, 27, 33, 100, 561]  # 561 is Carmichael number
    for c in known_composites:
        assert miller_rabin_test(c) is False

    # Check our standard safe primes
    assert miller_rabin_test(int(STANDARD_PARAMS["toy"]["p"])) is True
    assert miller_rabin_test(int(STANDARD_PARAMS["64"]["p"])) is True
    assert miller_rabin_test(int(STANDARD_PARAMS["128"]["p"])) is True


def test_shared_secret_equality():
    """Verify that Alice and Bob calculate identical shared secrets in honest DH."""
    p = 23
    g = 5
    alice_private = 6
    bob_private = 15

    # Public keys
    alice_public = modular_exponentiation(g, alice_private, p)  # 5^6 mod 23 = 8
    bob_public = modular_exponentiation(g, bob_private, p)      # 5^15 mod 23 = 19

    # Shared secrets
    alice_shared = modular_exponentiation(bob_public, alice_private, p)
    bob_shared = modular_exponentiation(alice_public, bob_private, p)

    assert alice_shared == bob_shared
    assert alice_shared == modular_exponentiation(g, alice_private * bob_private, p)


def test_mitm_key_mismatch():
    """Verify that MITM causes key mismatch between Alice and Bob while Eve controls both."""
    p = 23
    g = 5
    alice_private = 4
    bob_private = 7
    eve_alice_priv = 9
    eve_bob_priv = 11

    # Alice public A = 5^4 mod 23 = 4
    # Bob public B = 5^7 mod 23 = 17
    A = modular_exponentiation(g, alice_private, p)
    B = modular_exponentiation(g, bob_private, p)

    # Eve public keys
    E_a = modular_exponentiation(g, eve_alice_priv, p)
    E_b = modular_exponentiation(g, eve_bob_priv, p)

    # Alice computes with E_a; Bob computes with E_b
    k_alice = modular_exponentiation(E_a, alice_private, p)
    k_bob = modular_exponentiation(E_b, bob_private, p)

    # Eve computes both
    k_eve_alice = modular_exponentiation(A, eve_alice_priv, p)
    k_eve_bob = modular_exponentiation(B, eve_bob_priv, p)

    # Alice and Bob keys DO NOT MATCH
    assert k_alice != k_bob

    # Eve matches Alice and Bob respectively
    assert k_alice == k_eve_alice
    assert k_bob == k_eve_bob


def test_encryption_decryption_roundtrip():
    """Verify XOR stream cipher encrypt and decrypt round trip."""
    secret = 123456789012345
    message = "Exam presentation: Diffie-Hellman Key Exchange demo!"

    key_hex, ciphertext_hex = encrypt_message(message, secret)
    _, recovered = decrypt_message(ciphertext_hex, secret)

    assert recovered == message
    assert len(key_hex) == 64  # SHA-256 is 32 bytes = 64 hex chars


def test_simulation_honest_flow():
    """Verify honest protocol simulation steps and summary."""
    sim = simulate_protocol(
        p_val=23,
        g_val=5,
        mitm=False,
        message="Hello World",
        alice_private=6,
        bob_private=15,
    )
    assert sim["success"] is True
    assert sim["keys_match"] is True
    assert sim["summary"]["bob_received_message"] == "Hello World"
    assert len(sim["steps"]) >= 6


def test_simulation_mitm_flow():
    """Verify MITM protocol simulation tampering and key divergence."""
    sim = simulate_protocol(
        p_val=23,
        g_val=5,
        mitm=True,
        message="Legitimate payload",
        tampered_message="Eve altered payload",
        alice_private=6,
        bob_private=15,
        eve_alice_private=8,
        eve_bob_private=11,
    )
    assert sim["success"] is True
    assert sim["keys_match"] is False
    assert sim["summary"]["eve_read_message"] == "Legitimate payload"
    assert sim["summary"]["bob_received_message"] == "Eve altered payload"


def test_simulation_authenticated_dh():
    """Verify that authenticated DH detects and thwarts MITM."""
    sim = simulate_protocol(
        p_val=23,
        g_val=5,
        mitm=True,
        authenticated_dh=True,
    )
    assert sim["success"] is True
    assert sim["auth_verified"] is False
    assert sim["summary"]["attack_thwarted"] is True


def test_discrete_log_brute_force():
    """Verify discrete log solver on small numbers."""
    # 5^4 mod 23 = 4
    res = solve_discrete_log_brute_force(p=23, g=5, public_val=4)
    assert res["found"] is True
    assert res["private_key"] == 4
